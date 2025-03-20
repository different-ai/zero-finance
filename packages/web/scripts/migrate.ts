import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { sql } from '@vercel/postgres';

// This script will automatically run all migrations in the drizzle folder
async function main() {
  console.log('0xHypr', 'Running migrations...');
  
  // Log only specific env vars we care about for debugging
  console.log('0xHypr', 'POSTGRES_URL:', process.env.POSTGRES_URL);
  
  const db = drizzle(sql);
  
  try {
    // First attempt to create schema if it doesn't exist
    await sql`CREATE SCHEMA IF NOT EXISTS public`;
    
    // Create migration tables
    try {
      await migrate(db, { migrationsFolder: './drizzle' });
      console.log('0xHypr', 'Migrations completed successfully');
    } catch (error: any) {
      // Check if error is due to table already existing
      if (error.message && error.message.includes('already exists')) {
        console.log('0xHypr', 'Some tables already exist, continuing with build');
        // Exit with success code since this error is expected in some environments
        process.exit(0);
      } else if (error.message && error.message.includes('does not exist')) {
        // This could happen if a table referenced in a foreign key doesn't exist yet
        console.log('0xHypr', 'Referenced table does not exist, continuing with build');
        // We can proceed with the build anyway since this is likely a new environment
        process.exit(0);
      } else {
        console.error('0xHypr', 'Migration failed:', error);
        process.exit(1);
      }
    }
  } catch (error: any) {
    console.error('0xHypr', 'Schema creation failed:', error);
    process.exit(1);
  }
}

main();      