#!/usr/bin/env tsx
/**
 * Find All Safe Addresses for a Workspace
 *
 * Queries the database to find all Safe addresses across all chains
 * for a given workspace. This is critical because the current implementation
 * uses random salt values (Date.now()) which creates DIFFERENT Safe addresses
 * per chain, despite the schema documentation claiming CREATE2 deterministic deployment.
 *
 * Usage:
 *   pnpm --filter @zero-finance/web tsx scripts/find-workspace-safes.ts <workspace-id>
 *
 * Example:
 *   pnpm --filter @zero-finance/web tsx scripts/find-workspace-safes.ts 123e4567-e89b-12d3-a456-426614174000
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  boolean,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

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

// Define the safes table schema inline (to avoid import issues)
const safes = pgTable(
  'safes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id').notNull(),
    address: varchar('address', { length: 42 }).notNull(),
    chainId: integer('chain_id').notNull(),
    owners: jsonb('owners').$type<string[]>().notNull(),
    threshold: integer('threshold').notNull(),
    salt: varchar('salt', { length: 66 }).notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
    deploymentTx: varchar('deployment_tx', { length: 66 }),
    deployedAt: timestamp('deployed_at', { withTimezone: true }),
    deployedBy: varchar('deployed_by', { length: 42 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    workspaceChainIdx: uniqueIndex('safes_workspace_chain_idx').on(
      table.workspaceId,
      table.chainId,
    ),
    addressIdx: index('safes_address_idx').on(table.address),
    workspaceIdIdx: index('safes_workspace_id_idx').on(table.workspaceId),
    chainIdIdx: index('safes_chain_id_idx').on(table.chainId),
    isPrimaryIdx: index('safes_is_primary_idx').on(table.isPrimary),
  }),
);

type Safe = typeof safes.$inferSelect;

async function findWorkspaceSafes(workspaceId: string) {
  console.log('🔍 Finding All Safe Addresses for Workspace\n');
  console.log('Workspace ID:', workspaceId);
  console.log('═'.repeat(70) + '\n');

  const allSafes = await db
    .select()
    .from(safes)
    .where(eq(safes.workspaceId, workspaceId));

  if (allSafes.length === 0) {
    console.log('❌ No Safes found for this workspace!');
    console.log('\n   Possible reasons:');
    console.log('   1. Wrong workspace ID');
    console.log('   2. Safes not yet deployed');
    console.log('   3. Database connection issue\n');
    await pool.end();
    return;
  }

  // Sort by chainId
  allSafes.sort((a, b) => a.chainId - b.chainId);

  console.log(`Found ${allSafes.length} Safe(s):\n`);

  const chainNames: Record<number, string> = {
    8453: 'Base',
    42161: 'Arbitrum',
    10: 'Optimism',
    1: 'Ethereum',
  };

  allSafes.forEach((safe: Safe, index: number) => {
    const chainName = chainNames[safe.chainId] || `Chain ${safe.chainId}`;
    console.log(`${index + 1}. ${chainName} (${safe.chainId})`);
    console.log('   Address:', safe.address);
    console.log('   Salt:', safe.salt);
    console.log('   Primary:', safe.isPrimary ? 'Yes ⭐' : 'No');
    console.log(
      '   Deployed:',
      safe.deployedAt ? safe.deployedAt.toISOString() : 'Not yet',
    );
    console.log('   Owners:', (safe.owners as string[]).length);
    console.log('   Threshold:', safe.threshold);
    console.log('');
  });

  // Check if addresses are the same (they SHOULD be if CREATE2 was used correctly)
  const uniqueAddresses = new Set(allSafes.map((s) => s.address));

  if (uniqueAddresses.size === 1) {
    console.log(
      '✅ All Safes share the same address (CREATE2 working correctly)',
    );
    console.log(`   Address: ${[...uniqueAddresses][0]}\n`);
  } else {
    console.log('⚠️  WARNING: Safes have DIFFERENT addresses across chains!');
    console.log(
      '   This indicates CREATE2 deterministic deployment is NOT being used.',
    );
    console.log('   Each chain has a unique address:\n');

    allSafes.forEach((safe: Safe) => {
      const chainName = chainNames[safe.chainId] || `Chain ${safe.chainId}`;
      console.log(`   ${chainName.padEnd(15)} ${safe.address}`);
    });
    console.log('');
  }

  // Summary
  console.log('═'.repeat(70));
  console.log('📊 NEXT STEPS\n');
  console.log('To check balances on each Safe, run:\n');

  allSafes.forEach((safe: Safe) => {
    const chainName = chainNames[safe.chainId] || `Chain ${safe.chainId}`;
    console.log(`# ${chainName}`);
    console.log(
      `pnpm --filter @zero-finance/web tsx scripts/check-deposit-status.ts ${safe.address}\n`,
    );
  });

  await pool.end();
  return allSafes;
}

const workspaceId = process.argv[2];

if (!workspaceId) {
  console.error(
    '❌ Usage: pnpm --filter @zero-finance/web tsx scripts/find-workspace-safes.ts <workspace-id>',
  );
  console.error('\nTo find your workspace ID:');
  console.error('  1. Log into the app');
  console.error('  2. Check the database "workspaces" table');
  console.error('  3. Or check the URL in the dashboard\n');
  process.exit(1);
}

findWorkspaceSafes(workspaceId).catch((err) => {
  console.error('\n❌ Error:', err.message);
  console.error('\nFull error:', err);
  pool.end();
  process.exit(1);
});
