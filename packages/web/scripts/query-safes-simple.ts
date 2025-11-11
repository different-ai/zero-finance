#!/usr/bin/env tsx
/**
 * Simple Safe Query - Direct SQL
 */

import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set.');
  process.exit(1);
}

async function querySafes(workspaceId: string) {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 Querying Safes for workspace:', workspaceId);
    console.log('');

    const result = await pool.query(
      'SELECT address, chain_id, is_primary, deployed_at, salt FROM safes WHERE workspace_id = $1 ORDER BY chain_id',
      [workspaceId],
    );

    if (result.rows.length === 0) {
      console.log('❌ No Safes found');
      return;
    }

    console.log(`Found ${result.rows.length} Safe(s):\n`);

    const chainNames: Record<number, string> = {
      8453: 'Base',
      42161: 'Arbitrum',
    };

    result.rows.forEach((safe: any, i: number) => {
      const chainName = chainNames[safe.chain_id] || `Chain ${safe.chain_id}`;
      console.log(`${i + 1}. ${chainName} (${safe.chain_id})`);
      console.log(`   Address: ${safe.address}`);
      console.log(`   Primary: ${safe.is_primary ? 'Yes ⭐' : 'No'}`);
      console.log(`   Salt: ${safe.salt}`);
      console.log('');
    });

    // Check if same address
    const addresses = result.rows.map((r: any) => r.address);
    const unique = new Set(addresses);

    if (unique.size === 1) {
      console.log('✅ All chains use the same address (CREATE2 working)');
    } else {
      console.log('⚠️  WARNING: Different addresses per chain!');
      result.rows.forEach((safe: any) => {
        console.log(`   ${chainNames[safe.chain_id]}: ${safe.address}`);
      });
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

const workspaceId = process.argv[2];

if (!workspaceId) {
  console.error('Usage: npx tsx scripts/query-safes-simple.ts <workspace-id>');
  process.exit(1);
}

querySafes(workspaceId);
