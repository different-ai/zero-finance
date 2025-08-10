import Conf from 'conf';
import crypto from 'crypto';
import os from 'os';

// Create a config store for the CLI
const config = new Conf({
  projectName: 'zero-finance-cli',
  encryptionKey: crypto.createHash('sha256').update(os.hostname()).digest('hex').substring(0, 32),
  defaults: {
    auth: {
      token: null,
      expiresAt: null,
    },
    api: {
      url: process.env.ZERO_API_URL || 'https://zerofinance.ai/api/trpc',
    },
  },
});

export default config;