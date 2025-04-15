import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import * as schema from '../src/db/schema';

// Load environment variables from .env.local if present
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// This script will run all migrations in the drizzle folder
async function main() {
  console.log('0xHypr', 'Running database migrations...');

  // Verify migration folder exists
  const migrationsFolder = path.resolve(__dirname, '../drizzle');
  if (!fs.existsSync(migrationsFolder)) {
    console.error('0xHypr', 'Error: Drizzle migrations folder not found:', migrationsFolder);
    process.exit(1);
  }

  // Verify POSTGRES_URL is set
  const postgresUrl = process.env.POSTGRES_URL;
  if (!postgresUrl) {
    console.error('0xHypr', 'Error: POSTGRES_URL environment variable is not set.');
    process.exit(1);
  }
  console.log('0xHypr', 'Using POSTGRES_URL:', postgresUrl);

  // Create the Drizzle instance, passing the schema
  const db = drizzle(sql, { schema });

  try {
    console.log('0xHypr', 'Applying migrations from:', migrationsFolder);
    
    // Run the standard Drizzle migrator
    await migrate(db, { migrationsFolder });
    
    console.log('0xHypr', 'Migrations completed successfully.');
    process.exit(0);
  } catch (error: any) {
    console.error('0xHypr', 'Migration failed:', error);
    // Log the specific error message if available
    if (error.message) {
        console.error('0xHypr', 'Error details:', error.message);
    }
    process.exit(1);
  }
}

main();         