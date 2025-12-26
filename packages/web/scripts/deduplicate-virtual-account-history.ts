/**
 * Script to deduplicate virtual_account_history rows
 *
 * Problem: NULL timestamps bypass PostgreSQL unique index (NULL != NULL),
 * causing duplicate events to be inserted on every sync.
 *
 * Solution: Keep only the oldest row for each unique combination of:
 * - align_virtual_account_id
 * - event_type
 * - source_amount
 *
 * Usage:
 *   npx tsx scripts/deduplicate-virtual-account-history.ts --dry-run
 *   npx tsx scripts/deduplicate-virtual-account-history.ts
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';

// Load production env
config({ path: '.env.production.local' });

const DATABASE_URL = process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('ERROR: POSTGRES_URL not found in .env.production.local');
  process.exit(1);
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('Connecting to database...\n');
  const sqlClient = neon(DATABASE_URL!);
  const db = drizzle(sqlClient);

  console.log('=== DEDUPLICATING VIRTUAL ACCOUNT HISTORY ===');
  console.log(
    `Mode: ${isDryRun ? 'DRY RUN (no changes)' : 'LIVE (will delete duplicates)'}\n`,
  );

  // Find duplicate groups
  const duplicateGroups = await db.execute(sql`
    SELECT 
      align_virtual_account_id,
      event_type,
      source_amount,
      COUNT(*) as count,
      MIN(created_at) as first_created_at,
      array_agg(id ORDER BY created_at) as ids
    FROM virtual_account_history
    GROUP BY align_virtual_account_id, event_type, source_amount
    HAVING COUNT(*) > 1
    ORDER BY count DESC
  `);

  console.log(`Found ${duplicateGroups.rows.length} duplicate groups\n`);

  if (duplicateGroups.rows.length === 0) {
    console.log('No duplicates found. Database is clean!');
    return;
  }

  let totalToDelete = 0;
  const idsToDelete: string[] = [];

  for (const group of duplicateGroups.rows) {
    const ids = group.ids as string[];
    const keepId = ids[0]; // Keep the first (oldest) one
    const deleteIds = ids.slice(1); // Delete the rest

    totalToDelete += deleteIds.length;
    idsToDelete.push(...deleteIds);

    console.log(
      `Group: VA=${group.align_virtual_account_id}, type=${group.event_type}, amount=${group.source_amount}`,
    );
    console.log(`  - Total rows: ${group.count}`);
    console.log(`  - Keeping: ${keepId}`);
    console.log(`  - Deleting: ${deleteIds.length} rows`);
    console.log('');
  }

  console.log(`\nTotal rows to delete: ${totalToDelete}`);

  if (isDryRun) {
    console.log('\n=== DRY RUN - No changes made ===');
    console.log('Run without --dry-run to actually delete duplicates');
    return;
  }

  // Delete duplicates one by one (Neon serverless doesn't support array casting well)
  let deleted = 0;

  for (const id of idsToDelete) {
    await db.execute(sql`
      DELETE FROM virtual_account_history
      WHERE id = ${id}::uuid
    `);

    deleted++;
    if (deleted % 50 === 0 || deleted === totalToDelete) {
      console.log(`Deleted ${deleted}/${totalToDelete} rows...`);
    }
  }

  console.log('\n=== DEDUPLICATION COMPLETE ===');
  console.log(`Deleted ${deleted} duplicate rows`);

  // Verify
  const remaining = await db.execute(sql`
    SELECT COUNT(*) as count FROM virtual_account_history
  `);
  console.log(`Remaining rows: ${remaining.rows[0].count}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
