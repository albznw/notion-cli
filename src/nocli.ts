#!/usr/bin/env node

import { Command } from 'commander';
import loadConfig from './utils/config';
import {
  sortMultiSelectOnDatabaseEntries,
  sortMultiSelectOnDatabase,
} from './commands/sort-tags';
import { parseToNotionID } from './utils/helpers';
import { SortMode } from './commands/sort-tags';

const config = loadConfig();

// Create a new command instance
const program = new Command();

// Configure the CLI tool
program.version(config.version).description(config.description);

/**
 * Define the tag sort command for the database entries
 * @param database The database ID
 * @param options The options for the command
 */
program
  .command('sort-entry-tags <database>')
  .description('Sorts the tags on your notion database entries')
  .option(
    '-s, --sortmode <sortmode>',
    'Use mode "default" to sort them as they appear in the database field entry. Use mode "alpha" to sort the tags alphabethically',
    'default'
  )
  .option(
    '-f, --field <fieldname>',
    'The name of the field that you want sorted. Defaults to "Tags"',
    'Tags'
  )
  .action(async (database: string, options: any) => {
    const dbID = parseToNotionID(database);
    if (!dbID) {
      console.error('Database ID is not valid');
      return;
    }

    let sortMode: SortMode;
    switch (options['sortmode']) {
      case 'default':
        sortMode = SortMode.Default;
        break;
      case 'alpha':
        sortMode = SortMode.Alphabetical;
        break;
      default:
        console.error('Sort mode is not valid');
        return;
    }

    const fieldname = options['column'];
    if (!fieldname) {
      console.error('Column name is not valid');
      return;
    }

    await sortMultiSelectOnDatabaseEntries(dbID, fieldname, sortMode);
  });

/**
 * Define the tag sort command
 * @param database The database ID
 */
program
  .command('sort-tags <database>')
  .description(
    'Sorts the multiselect tags on your notion database in alphabetical order'
  )
  .option(
    '-f, --field <fieldname>',
    'The name of the column that you want sorted. Defaults to "Tags"',
    'Tags'
  )
  .action(async (database: string, options: any) => {
    const dbID = parseToNotionID(database);
    if (!dbID) {
      console.error('Database ID is not valid');
      return;
    }

    const fieldname = options['column'];
    if (!fieldname) {
      console.error('Column name is not valid');
      return;
    }

    await sortMultiSelectOnDatabase(dbID, fieldname);
  });

// Parse command line arguments and execute the action
program.parseAsync(process.argv);
