#!/usr/bin/env tsx
/**
 * Script to add a user as admin
 * Usage: pnpm tsx scripts/add-admin-user.ts <privy-did>
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { admins } from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Load environment variables based on NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production.local'
    : '.env.local';
config({ path: resolve(process.cwd(), envFile) });

const privyDid = process.argv[2];

if (!privyDid) {
  console.error('❌ Error: Please provide a Privy DID');
  console.error('Usage: pnpm tsx scripts/add-admin-user.ts <privy-did>');
  console.error(
    'Example: pnpm tsx scripts/add-admin-user.ts did:privy:cmexesoyx0010ju0bznhrnklw',
  );
  process.exit(1);
}

if (!privyDid.startsWith('did:privy:')) {
  console.error('❌ Error: Invalid Privy DID format');
  console.error('Privy DIDs should start with "did:privy:"');
  process.exit(1);
}

async function addAdmin() {
  const databaseUrl = process.env.POSTGRES_URL;

  if (!databaseUrl) {
    console.error('❌ Error: POSTGRES_URL not found in environment');
    console.error(`Looking for environment file: ${envFile}`);
    process.exit(1);
  }

  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📂 Using env file: ${envFile}`);
  console.log(
    `🔗 Database: ${databaseUrl.split('@')[1]?.split('?')[0] || 'unknown'}`,
  );
  console.log(`👤 Adding admin: ${privyDid}\n`);

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 1,
    connectionTimeoutMillis: 10000,
  });
  const db = drizzle(pool);

  try {
    // Check if user is already an admin
    const existing = await db
      .select()
      .from(admins)
      .where(eq(admins.privyDid, privyDid))
      .limit(1);

    if (existing.length > 0) {
      console.log('ℹ️  User is already an admin');
      console.log(`   Added at: ${existing[0].createdAt}`);
      console.log(`   Added by: ${existing[0].addedBy || 'unknown'}`);
      await pool.end();
      return;
    }

    // Insert new admin
    const result = await db
      .insert(admins)
      .values({
        privyDid,
        addedBy: 'script',
        notes: 'Added via add-admin-user.ts script',
      })
      .returning();

    console.log('✅ Successfully added admin user');
    console.log(`   Privy DID: ${result[0].privyDid}`);
    console.log(`   Created at: ${result[0].createdAt}`);
    console.log(`\n🎉 User can now access /admin panel`);

    await pool.end();
  } catch (error) {
    console.error('❌ Failed to add admin user:', error);
    await pool.end();
    process.exit(1);
  }
}

addAdmin();
