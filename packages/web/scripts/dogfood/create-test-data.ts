#!/usr/bin/env ts-node

// @ts-nocheck

import { db } from '../src/db';
import { users, userProfilesTable, ledgerEvents } from '../src/db/schema';
import crypto from 'crypto';

async function main() {
  const privyDid = `did:privy:test-${crypto.randomUUID()}`;
  await db.insert(users).values({ privyDid });
  await db.insert(userProfilesTable).values({ privyDid, email: 'test@example.com', countryCode: 'US' });
  await db.insert(ledgerEvents).values([
    {
      userDid: privyDid,
      eventType: 'income',
      amount: '1000',
      currency: 'USDC',
      source: 'seed',
    },
    {
      userDid: privyDid,
      eventType: 'tax_hold',
      amount: '250',
      currency: 'USDC',
      source: 'seed',
    },
  ]);
  console.log('Seeded test user with income and tax_hold events:', privyDid);
}

main().then(() => process.exit(0));