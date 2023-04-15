import dotenv from 'dotenv';

interface Config {
  version: string;
  description: string;
}

let config: Config | undefined = undefined;

const loadConfig = () => {
  if (config) {
    return config;
  }

  // Load environment variables from .env file
  dotenv.config();

  config = {
    version: '0.0.1',
    description:
      'Using this CLI tool you can sort the tags on your notion database entries',
  };

  return config;
};

export default loadConfig;
