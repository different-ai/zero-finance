import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as schema from './schema'; // Import the schema

dotenv.config({ path: '.env.local' });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Create the connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: true, // Assuming NeonDB requires SSL, adjust if needed
});

// Create the Drizzle instance, passing the schema
export const db = drizzle(pool, { schema });

console.log('Database connection initialized with schema.'); 