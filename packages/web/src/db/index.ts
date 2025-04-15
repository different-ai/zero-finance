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

// Create the connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: true, // Assuming we're using NeonDB or similar that requires SSL
});

// Create the Drizzle instance with the full schema
export const db = drizzle(pool, { schema });

// Export the pool for direct access if needed
export const pgPool = pool;

console.log('Database connection initialized with unified schema.'); 