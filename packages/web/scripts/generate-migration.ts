import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

async function generateMigration() {
  console.log('Generating migration for the new user_requests table...');
  
  try {
    // Generate migration
    const { stdout, stderr } = await execPromise('npx drizzle-kit generate');
    
    if (stderr) {
      console.error('Error generating migration:', stderr);
      process.exit(1);
    }
    
    console.log('Migration generated successfully:', stdout);
    
    // Read and print the latest migration file
    const migrationsDir = path.join(process.cwd(), 'drizzle');
    const metaJournalPath = path.join(migrationsDir, 'meta', '_journal.json');
    
    const journal = JSON.parse(fs.readFileSync(metaJournalPath, 'utf8'));
    const latestMigration = journal.entries[journal.entries.length - 1];
    
    console.log('Latest migration:', latestMigration);
    
    // Read the migration SQL
    if (latestMigration) {
      const migrationFile = path.join(migrationsDir, `${latestMigration.when}_${latestMigration.tag}.sql`);
      const sql = fs.readFileSync(migrationFile, 'utf8');
      
      console.log('Migration SQL:');
      console.log(sql);
    }
    
    console.log('Migration ready. Run `npm run db:migrate` to apply it to your database.');
  } catch (error) {
    console.error('Failed to generate migration:', error);
    process.exit(1);
  }
}

generateMigration();