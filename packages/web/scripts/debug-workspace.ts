#!/usr/bin/env tsx
/**
 * Debug Workspace - Check if workspace exists and find related data
 */

import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set.');
  process.exit(1);
}

async function debugWorkspace(workspaceId: string) {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 Debugging Workspace:', workspaceId);
    console.log('═'.repeat(70) + '\n');

    // Check if workspace exists
    const workspaceResult = await pool.query(
      'SELECT id, name, created_at FROM workspaces WHERE id = $1',
      [workspaceId],
    );

    if (workspaceResult.rows.length === 0) {
      console.log('❌ Workspace NOT FOUND in database!');
      console.log('   This workspace ID does not exist.\n');

      // Show recent workspaces
      const recentWorkspaces = await pool.query(
        'SELECT id, name, created_at FROM workspaces ORDER BY created_at DESC LIMIT 5',
      );

      console.log('Recent workspaces:');
      recentWorkspaces.rows.forEach((w: any) => {
        console.log(`  ${w.id} - ${w.name || '(unnamed)'} - ${w.created_at}`);
      });

      await pool.end();
      return;
    }

    const workspace = workspaceResult.rows[0];
    console.log('✅ Workspace exists:');
    console.log(`   ID: ${workspace.id}`);
    console.log(`   Name: ${workspace.name || '(unnamed)'}`);
    console.log(`   Created: ${workspace.created_at}\n`);

    // Check for users
    const usersResult = await pool.query(
      'SELECT privy_did, created_at FROM users WHERE primary_workspace_id = $1',
      [workspaceId],
    );

    console.log(`👥 Users (${usersResult.rows.length}):`);
    if (usersResult.rows.length === 0) {
      console.log('   No users found for this workspace\n');
    } else {
      usersResult.rows.forEach((u: any) => {
        console.log(`   ${u.privy_did}`);
      });
      console.log('');
    }

    // Check for Safes
    const safesResult = await pool.query(
      'SELECT address, chain_id, is_primary, deployed_at, salt FROM safes WHERE workspace_id = $1 ORDER BY chain_id',
      [workspaceId],
    );

    console.log(`📍 Safes (${safesResult.rows.length}):`);
    if (safesResult.rows.length === 0) {
      console.log('   No Safes found for this workspace');
      console.log('   User may need to complete onboarding\n');
    } else {
      const chainNames: Record<number, string> = {
        8453: 'Base',
        42161: 'Arbitrum',
      };

      safesResult.rows.forEach((safe: any, i: number) => {
        const chainName = chainNames[safe.chain_id] || `Chain ${safe.chain_id}`;
        console.log(`   ${i + 1}. ${chainName} (${safe.chain_id})`);
        console.log(`      Address: ${safe.address}`);
        console.log(`      Primary: ${safe.is_primary ? 'Yes ⭐' : 'No'}`);
        console.log(`      Deployed: ${safe.deployed_at || 'Not yet'}`);
      });
      console.log('');
    }

    // Check all Safes in database (to see if there are ANY)
    const allSafesCount = await pool.query('SELECT COUNT(*) FROM safes');
    console.log(`\n📊 Total Safes in database: ${allSafesCount.rows[0].count}`);
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

const workspaceId = process.argv[2];

if (!workspaceId) {
  console.error('Usage: npx tsx scripts/debug-workspace.ts <workspace-id>');
  process.exit(1);
}

debugWorkspace(workspaceId);
