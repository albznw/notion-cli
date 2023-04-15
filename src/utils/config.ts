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

  console.log('Loading config...');

  // Load environment variables from .env file
  dotenv.config();

  config = {
    version: '0.0.1',
    description: 'test',
  };

  return config;
};

export default loadConfig;
