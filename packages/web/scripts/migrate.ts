import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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

  // Create the Drizzle instance without explicit schema
  const db = drizzle(sql);

  try {
    console.log('0xHypr', 'Applying migrations from:', migrationsFolder);
    
    // Run the standard Drizzle migrator with memory-optimized settings
    await migrate(db, { 
      migrationsFolder,
      // Reduce memory usage by processing migrations sequentially
    });
    
    console.log('0xHypr', 'Migrations completed successfully.');
    
    // Explicit cleanup
    if (typeof sql.end === 'function') {
      await sql.end();
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('0xHypr', 'Migration failed:', error);

    // Log the specific error message if available
    if (error.message) {
        console.error('0xHypr', 'Error details:', error.message);
    }
    
    // Cleanup on error
    try {
      if (typeof sql.end === 'function') {
        await sql.end();
      }
    } catch (cleanupError) {
      console.error('0xHypr', 'Cleanup error:', cleanupError);
    }
    
    process.exit(1);
  }
}

// Add timeout to prevent hanging builds
const MIGRATION_TIMEOUT = 120000; // 2 minutes

const timeoutId = setTimeout(() => {
  console.error('0xHypr', 'Migration timed out after 2 minutes');
  process.exit(1);
}, MIGRATION_TIMEOUT);

main().finally(() => {
  clearTimeout(timeoutId);
});         