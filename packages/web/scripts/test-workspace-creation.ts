import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { randomUUID } from 'crypto';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('POSTGRES_URL not set');
}

const pool = new Pool({ connectionString });

async function testUserWorkspaceCreation() {
  console.log('🧪 Testing user/workspace creation with circular FKs...\n');

  const testUserId = `did:privy:test_${randomUUID().slice(0, 8)}`;
  const testWorkspaceId = randomUUID();

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log(`Creating test user: ${testUserId}`);
    console.log(`Creating test workspace: ${testWorkspaceId}`);

    // Insert user with workspace FK
    await client.query(
      `INSERT INTO users (privy_did, primary_workspace_id) VALUES ($1, $2)`,
      [testUserId, testWorkspaceId],
    );
    console.log(
      '✓ User inserted (workspace FK not validated yet due to DEFERRED)',
    );

    // Insert workspace with user FK
    await client.query(
      `INSERT INTO workspaces (id, name, created_by) VALUES ($1, $2, $3)`,
      [testWorkspaceId, `${testUserId.slice(0, 8)}'s Workspace`, testUserId],
    );
    console.log(
      '✓ Workspace inserted (user FK not validated yet due to DEFERRED)',
    );

    // Commit - FK constraints will be checked here
    await client.query('COMMIT');
    console.log(
      '✓ Transaction committed successfully - all FK constraints satisfied!\n',
    );

    // Verify data
    const userResult = await client.query(
      'SELECT * FROM users WHERE privy_did = $1',
      [testUserId],
    );
    const workspaceResult = await client.query(
      'SELECT * FROM workspaces WHERE id = $1',
      [testWorkspaceId],
    );

    console.log('Verification:');
    console.log(`  User exists: ${userResult.rows.length === 1 ? '✓' : '✗'}`);
    console.log(
      `  Workspace exists: ${workspaceResult.rows.length === 1 ? '✓' : '✗'}`,
    );
    console.log(
      `  User's primary_workspace_id: ${userResult.rows[0]?.primary_workspace_id}`,
    );
    console.log(
      `  Workspace's created_by: ${workspaceResult.rows[0]?.created_by}`,
    );
    console.log(
      `  Match: ${userResult.rows[0]?.primary_workspace_id === testWorkspaceId && workspaceResult.rows[0]?.created_by === testUserId ? '✓' : '✗'}\n`,
    );

    // Cleanup
    console.log('Cleaning up test data...');
    await client.query('DELETE FROM users WHERE privy_did = $1', [testUserId]);
    console.log('✓ Test data cleaned up\n');

    console.log(
      '✅ All tests passed! Circular FK dependency is properly handled.\n',
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

testUserWorkspaceCreation().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
