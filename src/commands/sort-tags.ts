import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  SelectPropertyResponse,
} from '@notionhq/client/build/src/api-endpoints';
import loadConfig from '../utils/config';
import { getPageTitle, input } from '../utils/helpers';

// Ensure that the environment variables are loaded
loadConfig();

export enum SortMode {
  Default = 'default',
  Alphabetical = 'alpha',
}

// Initialize a new Notion client instance
const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

export const sortMultiSelectDefault = async (
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
      [columnName]: {
        type: 'multi_select',
        multi_select: tags.multi_select,
      },
    },
  });
};

export const sortMultiSelectAlpha = async (
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
      [columnName]: {
        type: 'multi_select',
        multi_select: tags.multi_select,
      },
    },
  });
};

export const sortMultiSelectOnDatabase = async (
  databaseId: string,
  columnName: string
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

  const tags = db.properties[columnName];
  if (!tags || tags.type !== 'multi_select' || !tags.multi_select) {
    console.error('Tags property not found or not a multi-select property.');
    return;
  }

  tags.multi_select.options.sort((a, b) => a.name.localeCompare(b.name));

  return await notion.databases.update({
    database_id: db.id,
    properties: {
      [columnName]: {
        type: 'multi_select',
        multi_select: {
          options: tags.multi_select.options,
        },
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

  console.log('Fetching all entries from the database...');
  let query = await notion.databases.query({ database_id: databaseId });
  const entries = [...query.results];

  while (query.has_more && query.next_cursor) {
    query = await notion.databases.query({
      database_id: databaseId,
      start_cursor: query.next_cursor,
    });
    entries.push(...query.results);
  }
  console.log(`Found ${entries.length} entries in the database.`);

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
      for (const entry of entries) {
        const pageName = getPageTitle(entry);
        console.log(`Updating page: ${pageName}`);

        const promise = sortMultiSelectDefault(entry, columnName, options)
          .then(() => {
            console.log(`Updated page: ${pageName}`);
          })
          .catch((err) => {
            console.error('Failed to update page:');
            console.error(JSON.stringify(entry, null, 2));
            console.error(err);
          });

        promises.push(promise);
      }
      break;

    case SortMode.Alphabetical:
      // Sort the tags alphabetically

      for (const entry of entries) {
        const pageName = getPageTitle(entry);
        console.log(`Updating page: ${pageName}`);

        const promise = sortMultiSelectAlpha(entry, columnName)
          .then(() => {
            console.log(`Updated page: ${pageName}`);
          })
          .catch((err) => {
            console.error('Failed to update page:');
            console.error(JSON.stringify(entry, null, 2));
            console.error(err);
          });

        promises.push(promise);
      }
      break;
  }

  await Promise.all(promises);
};
