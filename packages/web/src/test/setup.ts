import { beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from '@/db';
// Removed: import { ephemeralKeysTable } from '@/db/schema';
import { userRequestsTable, users, userSafes, allocationStates, userFundingSources } from '@/db/schema';
// dotenv get .env.test
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });


// Ensure we're using test database
process.env.POSTGRES_URL = process.env.TEST_POSTGRES_URL;

// Clean up database before all tests
beforeAll(async () => {
  // Clean up any existing data
  await db.delete(userRequestsTable);
  await db.delete(allocationStates); // Depends on userSafes
  await db.delete(userFundingSources); // Depends on users
  await db.delete(userSafes); // Depends on users
  await db.delete(users); // Clear users last
  // Removed: await db.delete(ephemeralKeysTable);
});

// Clean up after all tests
afterAll(async () => {
  // Optional: Clean up after all tests are done
  // Removed: await db.delete(ephemeralKeysTable);
  // Add other cleanup if necessary
});

beforeEach(async () => {
  // Clear relevant tables before each test
  // Add tables here as needed
  await db.delete(userRequestsTable);
  await db.delete(allocationStates); // Depends on userSafes
  await db.delete(userFundingSources); // Depends on users
  await db.delete(userSafes); // Depends on users
  await db.delete(users); // Clear users last
  // Removed: await db.delete(ephemeralKeysTable);
}); 