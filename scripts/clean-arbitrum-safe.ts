import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from packages/web/.env.local
dotenv.config({ path: path.resolve(process.cwd(), 'packages/web/.env.local') });

async function main() {
  const userDid = process.argv[2];
  const chainId = parseInt(process.argv[3] || '42161', 10); // Default to Arbitrum

  if (!userDid) {
    console.error('Usage: npx ts-node scripts/clean-arbitrum-safe.ts <user-did> [chain-id]');
    console.error('Example: npx ts-node scripts/clean-arbitrum-safe.ts did:privy:abc123 42161');
    process.exit(1);
  }

  if (!userDid.startsWith('did:privy:')) {
    console.error('Error: user-did must start with "did:privy:"');
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error('Error: DATABASE_URL or POSTGRES_URL not found in environment');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log(`Connected to database. Cleaning up Arbitrum Safe for user ${userDid}...`);

    const res = await client.query(
      'DELETE FROM user_safes WHERE user_did = $1 AND chain_id = $2 RETURNING *',
      [userDid, chainId]
    );

    if (res.rowCount && res.rowCount > 0) {
      console.log(`Successfully deleted ${res.rowCount} Safe record(s).`);
      console.log('Deleted record:', res.rows[0]);
    } else {
      console.log('No matching Safe record found to delete.');
    }

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await client.end();
  }
}

main().catch(console.error);