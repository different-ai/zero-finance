#!/usr/bin/env tsx
/**
 * Check both safes and user_safes tables
 */

import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set.');
  process.exit(1);
}

async function checkBothTables(workspaceId: string) {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 Checking BOTH Safe tables for workspace:', workspaceId);
    console.log('═'.repeat(70) + '\n');

    // Check safes table
    console.log('1️⃣  SAFES TABLE:');
    const safesResult = await pool.query(
      'SELECT * FROM safes WHERE workspace_id = $1',
      [workspaceId],
    );
    console.log(`   Found ${safesResult.rows.length} rows`);
    if (safesResult.rows.length > 0) {
      safesResult.rows.forEach((row: any) => {
        console.log(`   - ${row.address} (chain ${row.chain_id})`);
      });
    }
    console.log('');

    // Check user_safes table
    console.log('2️⃣  USER_SAFES TABLE:');

    // First, get all columns in user_safes
    const columnsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_safes' 
      ORDER BY ordinal_position
    `);

    console.log(
      '   Columns:',
      columnsResult.rows.map((r: any) => r.column_name).join(', '),
    );
    console.log('');

    // Query user_safes (let's see what columns it has)
    const userSafesResult = await pool.query(
      'SELECT * FROM user_safes LIMIT 5',
    );
    console.log(
      `   Found ${userSafesResult.rows.length} rows (showing first 5)`,
    );

    if (userSafesResult.rows.length > 0) {
      userSafesResult.rows.forEach((row: any, i: number) => {
        console.log(`   Row ${i + 1}:`, JSON.stringify(row, null, 2));
      });
    }
  } catch (err: any) {
    console.error('Error:', err.message);
    console.error('Full error:', err);
  } finally {
    await pool.end();
  }
}

const workspaceId = process.argv[2];

if (!workspaceId) {
  console.error(
    'Usage: npx tsx scripts/check-both-safe-tables.ts <workspace-id>',
  );
  process.exit(1);
}

checkBothTables(workspaceId);
