import { beforeAll, afterAll } from 'vitest';
import { db } from '@/db';
import { ephemeralKeysTable } from '@/db/schema';
// dotenv get .env.test
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });


// Ensure we're using test database
process.env.POSTGRES_URL = process.env.TEST_POSTGRES_URL;

// Clean up database before all tests
beforeAll(async () => {
  // Clean up any existing data
  await db.delete(ephemeralKeysTable);
});

// Clean up after all tests
afterAll(async () => {
  await db.delete(ephemeralKeysTable);
}); 