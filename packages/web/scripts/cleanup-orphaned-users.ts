import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set.');
  process.exit(1);
}

console.log('🔍 Connecting to database...');
const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
const db = drizzle(pool);

async function cleanupOrphanedUsers() {
  try {
    console.log('🔍 Finding orphaned users...');

    const orphanedUsers = await db.execute(sql`
      SELECT u.privy_did, u.primary_workspace_id 
      FROM users u 
      LEFT JOIN workspaces w ON u.primary_workspace_id = w.id 
      WHERE u.primary_workspace_id IS NOT NULL AND w.id IS NULL
    `);

    if (orphanedUsers.rows.length === 0) {
      console.log('✅ No orphaned users found!');
      return;
    }

    console.log(`⚠️  Found ${orphanedUsers.rows.length} orphaned user(s):`);
    orphanedUsers.rows.forEach((row: any) => {
      console.log(
        `  - DID: ${row.privy_did}, Missing Workspace ID: ${row.primary_workspace_id}`,
      );
    });

    console.log('\n🗑️  Deleting orphaned users...');

    const result = await db.execute(sql`
      DELETE FROM users 
      WHERE primary_workspace_id IN (
        SELECT u.primary_workspace_id 
        FROM users u 
        LEFT JOIN workspaces w ON u.primary_workspace_id = w.id 
        WHERE u.primary_workspace_id IS NOT NULL AND w.id IS NULL
      )
    `);

    console.log(`✅ Deleted ${orphanedUsers.rows.length} orphaned user(s)`);
  } catch (error) {
    console.error('❌ Error cleaning up orphaned users:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

cleanupOrphanedUsers()
  .then(() => {
    console.log('✅ Cleanup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  });
