import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as schema from './schema';

// Ensure POSTGRES_URL is set
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Use globalThis to create a singleton and prevent multiple connection logs
// This is necessary because Next.js can re-evaluate modules multiple times
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
  dbInitialized: boolean | undefined;
};

// Only log once per process
if (!globalForDb.dbInitialized) {
  const dbHost =
    process.env.POSTGRES_URL?.match(/@([^/]+)\//)?.[1] || 'unknown';
  console.log(`[DB] Connecting to database host: ${dbHost}`);
  globalForDb.dbInitialized = true;
}

// Create a connection pool (singleton)
const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.POSTGRES_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

// Store in global for reuse in development (hot reload)
if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

// Export the pool (optional, if direct pool access is needed elsewhere)
/* export */ const pgPool = pool;

// Create the Drizzle instance with the full schema
export const db = drizzle(pool, { schema });
