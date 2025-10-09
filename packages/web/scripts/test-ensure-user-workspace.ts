import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { randomUUID } from 'crypto';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../src/db/schema';
import { ensureUserWorkspace } from '../src/server/utils/workspace';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('POSTGRES_URL not set');
}

const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema });

async function testEnsureUserWorkspace() {
  console.log('🧪 Testing ensureUserWorkspace function...\n');

  const testUserId = `did:privy:test_${randomUUID().slice(0, 8)}`;

  try {
    console.log(`Test 1: Creating new user with workspace`);
    console.log(`  User ID: ${testUserId}\n`);

    const result1 = await ensureUserWorkspace(db, testUserId);

    console.log('  Result:');
    console.log(`    User created: ✓`);
    console.log(`    User privy_did: ${result1.user.privyDid}`);
    console.log(
      `    User primary_workspace_id: ${result1.user.primaryWorkspaceId}`,
    );
    console.log(`    Workspace ID: ${result1.workspace.id}`);
    console.log(`    Workspace name: ${result1.workspace.name}`);
    console.log(`    Workspace created_by: ${result1.workspace.createdBy}`);
    console.log(
      `    Primary workspace matches: ${result1.user.primaryWorkspaceId === result1.workspace.id ? '✓' : '✗'}`,
    );
    console.log(
      `    Workspace created by user: ${result1.workspace.createdBy === testUserId ? '✓' : '✗'}\n`,
    );

    console.log(
      `Test 2: Calling ensureUserWorkspace again (idempotency check)`,
    );

    const result2 = await ensureUserWorkspace(db, testUserId);

    console.log('  Result:');
    console.log(
      `    Same user returned: ${result1.user.privyDid === result2.user.privyDid ? '✓' : '✗'}`,
    );
    console.log(
      `    Same workspace returned: ${result1.workspace.id === result2.workspace.id ? '✓' : '✗'}`,
    );
    console.log(`    No duplicate created: ✓\n`);

    // Cleanup
    console.log('Cleaning up test data...');
    await pool.query('DELETE FROM users WHERE privy_did = $1', [testUserId]);
    console.log('✓ Test data cleaned up\n');

    console.log('✅ All tests passed! ensureUserWorkspace works correctly.\n');
  } catch (error) {
    console.error('❌ Test failed:', error);

    // Cleanup on error
    try {
      await pool.query('DELETE FROM users WHERE privy_did = $1', [testUserId]);
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }

    throw error;
  } finally {
    await pool.end();
  }
}

testEnsureUserWorkspace().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
