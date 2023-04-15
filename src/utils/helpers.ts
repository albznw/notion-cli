import readline from 'readline';

/**
 * @description Prompts the user for input and returns the answer
 * @param query - The prompt to display to the user
 * @returns The answer
 */
export const input = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
};

/**
 * Takes a Notion URL and returns the Notion ID
 * @param url The Notion URL to parse
 * @returns The Notion ID of the page/database
 */
export const parseNotionIDFromURL = (url: string) => {
  if (!url.includes('https')) {
    throw new Error('URL is not valid');
  }

  let id = url.split('/').pop();
  id = id?.split('-').pop();
  id = id?.split('?')[0];
  return id;
};

/**
 * Parses a Notion ID or a Notion URL and returns the Notion ID
 * @param input Takes either a Notion ID or a Notion URL and returns the Notion ID
 * @returns Notion ID
 */
export const parseToNotionID = (input: string) => {
  if (input.includes('https')) {
    return parseNotionIDFromURL(input);
  }

  return input;
};

/**
 * Get page title from a Notion page
 * @param page The Notion page
 * @returns The title of the page
 */
export const getPageTitle = (page: any) => {
  if (page.properties.Name.type == 'title') {
    return page.properties.Name.title[0].plain_text;
  }
};
