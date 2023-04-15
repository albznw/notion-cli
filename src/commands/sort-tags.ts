import { Client } from '@notionhq/client';
import { input } from '../utils/helpers';
import loadConfig from '../utils/config';
import {
  PageObjectResponse,
  SelectPropertyResponse,
} from '@notionhq/client/build/src/api-endpoints';

// Ensure that the environment variables are loaded
loadConfig();

export enum SortMode {
  Default = 'default',
  Alphabetical = 'alpha',
}

// Initialize a new Notion client instance
const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

const sortMultiSelectDefault = async (
  page: PageObjectResponse,
  columnName: string,
  sortedOptions: SelectPropertyResponse[]
) => {
  const tags = page.properties[columnName];

  if (!tags || tags.type !== 'multi_select' || !tags.multi_select) {
    console.error('Tags property not found or not a multi-select property.');
    return;
  }

  tags.multi_select.sort((a, b) => {
    const aIndex = sortedOptions.findIndex((option) => option.name === a.name);
    const bIndex = sortedOptions.findIndex((option) => option.name === b.name);
    return aIndex - bIndex;
  });

  return notion.pages.update({
    page_id: page.id,
    properties: {
      Tags: {
        type: 'multi_select',
        multi_select: tags.multi_select,
      },
    },
  });
};

const sortMultiSelectAlpha = async (
  page: PageObjectResponse,
  columnName: string
) => {
  const tags = page.properties[columnName];
  if (!tags || tags.type !== 'multi_select' || !tags.multi_select) {
    console.error('Tags property not found or not a multi-select property.');
    return;
  }

  tags.multi_select.sort((a, b) => a.name.localeCompare(b.name));

  return notion.pages.update({
    page_id: page.id,
    properties: {
      Tags: {
        type: 'multi_select',
        multi_select: tags.multi_select,
      },
    },
  });
};

export const sortMultiSelectOnDatabaseEntries = async (
  databaseId: string,
  columnName: string,
  sortMode: SortMode = SortMode.Default
) => {
  const db = await notion.databases.retrieve({ database_id: databaseId });

  while (true) {
    const response = await input(
      `Is this the correct database: "${db.title[0].plain_text}" y/n? > `
    );
    if (response.toLowerCase() == 'y') {
      break;
    } else if (response.toLowerCase() == 'n') {
      process.exit(0);
    }
  }

  const query = await notion.databases.query({ database_id: databaseId });
  const entries = [...query.results];

  while (query.has_more && query.next_cursor) {
    const moreEntries = await notion.databases.query({
      database_id: databaseId,
      start_cursor: query.next_cursor,
    });
    entries.push(...moreEntries.results);
  }

  const promises = [];
  switch (sortMode) {
    case SortMode.Default:
      // Fetch all possible tag options from the database properties
      const column = db.properties[columnName];
      if (column.type != 'multi_select') {
        throw new Error('Column is not a multi-select property');
      }
      const options = column.multi_select.options;

      // Sort the tags according to the order of the options
      promises.push(
        entries.map((entry) =>
          sortMultiSelectDefault(entry, columnName, options)
        )
      );
      break;

    case SortMode.Alphabetical:
      // Sort the tags alphabetically
      promises.push(
        entries.map((entry) => sortMultiSelectAlpha(entry, columnName))
      );
      break;
  }

  await Promise.all(promises);
};
