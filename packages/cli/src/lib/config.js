import Conf from 'conf';
import crypto from 'crypto';
import os from 'os';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env.local') });

// Create a config store for the CLI
let config;
try {
  config = new Conf({
    projectName: 'zero-finance-cli',
    encryptionKey: crypto.createHash('sha256').update(os.hostname()).digest('hex').substring(0, 32),
    defaults: {
      auth: {
        token: null,
        expiresAt: null,
      },
      api: {
        url: process.env.ZERO_API_URL || 'https://zerofinance.ai/api/trpc',
        webUrl: process.env.ZERO_WEB_URL || 'https://zerofinance.ai',
      },
    },
  });
} catch (error) {
  // If config is corrupted, create a new one with a different name
  console.log('Config file corrupted. Creating new config...');
  config = new Conf({
    projectName: 'zero-finance-cli-v3',
    defaults: {
      auth: {
        token: null,
        expiresAt: null,
      },
      api: {
        url: process.env.ZERO_API_URL || 'https://zerofinance.ai/api/trpc',
        webUrl: process.env.ZERO_WEB_URL || 'https://zerofinance.ai',
      },
    },
  });
}

export default config;
