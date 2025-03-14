import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

async function generateMigration() {
  console.log('Generating migration for user_profiles onboarding field...');
  
  try {
    // Generate migration
    const { stdout, stderr } = await execPromise('npx drizzle-kit generate');
    
    if (stderr) {
      console.error('Error generating migration:', stderr);
      process.exit(1);
    }
    
    console.log('Migration generated successfully!', stdout);
    
    // Find the latest migration
    const migrationsDir = path.join(process.cwd(), 'drizzle');
    const metaJournalPath = path.join(migrationsDir, 'meta', '_journal.json');
    
    const journal = JSON.parse(fs.readFileSync(metaJournalPath, 'utf8'));
    const latestMigration = journal.entries[journal.entries.length - 1];
    
    // Read the migration SQL
    if (latestMigration) {
      console.log('Latest migration:', latestMigration.tag);
      const migrationFile = path.join(migrationsDir, `${latestMigration.tag}.sql`);
      if (fs.existsSync(migrationFile)) {
        const sql = fs.readFileSync(migrationFile, 'utf8');
        console.log('Migration SQL:');
        console.log(sql);
      } else {
        console.error('Migration file not found:', migrationFile);
      }
    }
    
    console.log('Migration ready. Run `npm run db:migrate:local` to apply it to your database.');
  } catch (error) {
    console.error('Failed to generate migration:', error);
    process.exit(1);
  }
}

generateMigration();