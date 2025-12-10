import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as schema from './schema';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Ensure POSTGRES_URL is set
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Debug: Log which database we're connecting to (redact password)
const dbHost = process.env.POSTGRES_URL?.match(/@([^/]+)\//)?.[1] || 'unknown';
console.log(`[DB] Connecting to database host: ${dbHost}`);

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Export the pool (optional, if direct pool access is needed elsewhere)
/* export */ const pgPool = pool;

// Create the Drizzle instance with the full schema
export const db = drizzle(pool, { schema });
