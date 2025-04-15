import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function nukeDatabase() {
  console.log('🧨 Nuking database...');
  
  try {
    // Check database connection
    console.log('📊 Database URL:', process.env.POSTGRES_URL);
    
    // Get all tables in the public schema
    const tables = await sql`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `;
    
    console.log('📋 Found tables:', tables.rows.map(r => r.tablename).join(', '));
    
    // First, try to drop all tables using a dynamic query
    console.log('🗑️ Dropping all tables...');
    
    // Build a query to drop all tables
    const dropQuery = `
      DO $$ 
      DECLARE
          tables text;
      BEGIN
          SELECT string_agg('"' || tablename || '"', ',') INTO tables FROM pg_tables WHERE schemaname = 'public';
          
          IF tables IS NOT NULL THEN
              EXECUTE 'DROP TABLE IF EXISTS ' || tables || ' CASCADE';
          END IF;
      END $$;
    `;
    
    try {
      await sql.query(dropQuery);
      console.log('✅ All tables dropped successfully');
    } catch (err: any) {
      console.warn('⚠️ Failed with dynamic query, trying individual drops:', err.message);
      
      // Drop each table individually with raw queries
      for (const row of tables.rows) {
        const tableName = row.tablename;
        console.log(`  - Dropping table: ${tableName}`);
        try {
          await sql.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
          console.log(`    ✓ Dropped ${tableName}`);
        } catch (err: any) {
          console.warn(`    ⚠️ Error dropping ${tableName}:`, err.message);
        }
      }
    }
    
    console.log('✅ Database nuking finished');
    
    // Run migrations
    console.log('🔄 Running migrations...');
    const { stdout, stderr } = await execAsync('pnpm db:migrate');
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('✅ Database reset and migrations complete');
  } catch (error: any) {
    console.error('❌ Error nuking database:', error.message);
    process.exit(1);
  }
}

nukeDatabase()
  .catch(console.error)
  .finally(() => process.exit()); 