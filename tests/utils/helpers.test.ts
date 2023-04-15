import { parseNotionIDFromURL, parseToNotionID } from '../../src/utils/helpers';

describe('parseNotionIDFromURL', () => {
  test('should return Notion ID from a valid URL', () => {
    const url = 'https://www.notion.so/MyDatabase-abcdefgh12345678ijklmnop';
    const expectedID = 'abcdefgh12345678ijklmnop';
    const actualID = parseNotionIDFromURL(url);
    expect(actualID).toBe(expectedID);
  });

  test('should return Notion ID when URL contains query parameters', () => {
    const url =
      'https://www.notion.so/MyDatabase-abcdefgh12345678ijklmnop?param1=value1&param2=value2';
    const expectedID = 'abcdefgh12345678ijklmnop';
    const actualID = parseNotionIDFromURL(url);
    expect(actualID).toBe(expectedID);
  });

  test('should throw an error for an invalid URL', () => {
    const url = 'http://www.example.com/not-a-notion-url';
    expect(() => parseNotionIDFromURL(url)).toThrow('URL is not valid');
  });

  test('should throw an error for a URL without https', () => {
    const url = 'http://www.notion.so/MyDatabase-abcdefgh12345678ijklmnop';
    expect(() => parseNotionIDFromURL(url)).toThrow('URL is not valid');
  });
});

describe('parseToNotionID', () => {
  test('should return Notion ID when input is a valid Notion URL', () => {
    const input = 'https://www.notion.so/MyDatabase-abcdefgh12345678ijklmnop';
    const expectedID = 'abcdefgh12345678ijklmnop';
    const actualID = parseToNotionID(input);
    expect(actualID).toBe(expectedID);
  });

  test('should return input as Notion ID when input is a Notion ID', () => {
    const input = 'abcdefgh12345678ijklmnop';
    const expectedID = 'abcdefgh12345678ijklmnop';
    const actualID = parseToNotionID(input);
    expect(actualID).toBe(expectedID);
  });
});
