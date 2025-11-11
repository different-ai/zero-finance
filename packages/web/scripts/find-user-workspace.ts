#!/usr/bin/env tsx
/**
 * Find User's Workspace ID
 *
 * Looks up a user's workspace ID by their email or Privy DID.
 *
 * Usage:
 *   pnpm --filter @zero-finance/web tsx scripts/find-user-workspace.ts <email-or-privy-did>
 *
 * Example:
 *   pnpm --filter @zero-finance/web tsx scripts/find-user-workspace.ts user@example.com
 *   pnpm --filter @zero-finance/web tsx scripts/find-user-workspace.ts did:privy:...
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, or, ilike, sql } from 'drizzle-orm';
import { pgTable, varchar, uuid, timestamp, text } from 'drizzle-orm/pg-core';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
const db = drizzle(pool);

// Define minimal schemas
const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  privyDid: varchar('privy_did', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  primaryWorkspaceId: uuid('primary_workspace_id'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

async function findUserWorkspace(searchTerm: string) {
  console.log('🔍 Finding User Workspace\n');
  console.log('Search term:', searchTerm);
  console.log('═'.repeat(70) + '\n');

  // Try to find user by email or Privy DID
  const result = await db.execute(sql`
    SELECT 
      u.id as user_id,
      u.privy_did,
      u.email,
      u.primary_workspace_id,
      w.name as workspace_name,
      w.created_at as workspace_created_at
    FROM users u
    LEFT JOIN workspaces w ON u.primary_workspace_id = w.id
    WHERE 
      u.email ILIKE ${searchTerm}
      OR u.privy_did = ${searchTerm}
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    console.log('❌ No user found!');
    console.log('\n   Try searching by:');
    console.log('   - Email address');
    console.log('   - Privy DID (did:privy:...)\n');
    await pool.end();
    return;
  }

  const user = result.rows[0];

  console.log('✅ User Found:\n');
  console.log('User ID:', user.user_id);
  console.log('Privy DID:', user.privy_did);
  console.log('Email:', user.email || '(not set)');
  console.log('');

  if (!user.primary_workspace_id) {
    console.log('⚠️  WARNING: User has no workspace!');
    console.log('   This user needs to complete onboarding.\n');
    await pool.end();
    return;
  }

  console.log('🏢 Workspace:\n');
  console.log('Workspace ID:', user.primary_workspace_id);
  console.log('Workspace Name:', user.workspace_name || '(unnamed)');
  console.log('Created:', user.workspace_created_at);
  console.log('');

  // Check for Safes
  const safes = await db.execute(sql`
    SELECT address, chain_id, is_primary, deployed_at
    FROM safes
    WHERE workspace_id = ${user.primary_workspace_id}
    ORDER BY chain_id
  `);

  if (safes.rows.length === 0) {
    console.log('⚠️  No Safes found for this workspace.');
    console.log('   User may need to create a Safe first.\n');
  } else {
    console.log(`📍 Found ${safes.rows.length} Safe(s):\n`);

    const chainNames: Record<number, string> = {
      8453: 'Base',
      42161: 'Arbitrum',
      10: 'Optimism',
      1: 'Ethereum',
    };

    safes.rows.forEach((safe: any, index: number) => {
      const chainName = chainNames[safe.chain_id] || `Chain ${safe.chain_id}`;
      console.log(`${index + 1}. ${chainName} (${safe.chain_id})`);
      console.log(`   Address: ${safe.address}`);
      console.log(`   Primary: ${safe.is_primary ? 'Yes ⭐' : 'No'}`);
      console.log(
        `   Deployed: ${safe.deployed_at ? new Date(safe.deployed_at).toISOString() : 'Not yet'}`,
      );
      console.log('');
    });
  }

  console.log('═'.repeat(70));
  console.log('📊 NEXT STEPS\n');
  console.log('To find all Safes for this workspace:');
  console.log(
    `pnpm --filter @zero-finance/web tsx scripts/find-workspace-safes.ts ${user.primary_workspace_id}\n`,
  );

  await pool.end();
}

const searchTerm = process.argv[2];

if (!searchTerm) {
  console.error(
    '❌ Usage: pnpm --filter @zero-finance/web tsx scripts/find-user-workspace.ts <email-or-privy-did>',
  );
  console.error('\nExample:');
  console.error(
    '  pnpm --filter @zero-finance/web tsx scripts/find-user-workspace.ts user@example.com\n',
  );
  process.exit(1);
}

findUserWorkspace(searchTerm).catch((err) => {
  console.error('\n❌ Error:', err.message);
  console.error('\nFull error:', err);
  pool.end();
  process.exit(1);
});
