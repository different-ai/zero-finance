import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyDatabase() {
  console.log('🔍 Verifying database...');
  
  try {
    // Check database connection
    console.log('📊 Database URL:', process.env.POSTGRES_URL);
    
    // Get all tables in the public schema
    const tables = await sql`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `;
    
    console.log('📋 Tables in database:');
    tables.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.tablename}`);
    });
    
    // For each table, get column information
    for (const row of tables.rows) {
      const tableName = row.tablename;
      const columns = await sql`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
      `;
      
      console.log(`\n📑 Table: ${tableName} (${columns.rows.length} columns)`);
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(required)'}`);
      });
    }
    
    console.log('\n✅ Database verification complete');
  } catch (error: any) {
    console.error('❌ Error verifying database:', error.message);
    process.exit(1);
  }
}

verifyDatabase()
  .catch(console.error)
  .finally(() => process.exit()); 