#!/usr/bin/env tsx
/**
 * List all tables in database
 */

import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set.');
  process.exit(1);
}

async function listTables() {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('📋 All tables in database:\n');

    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    result.rows.forEach((row: any) => {
      console.log(`  - ${row.table_name}`);
    });

    console.log(`\nTotal: ${result.rows.length} tables\n`);

    // Check for Safe-related tables specifically
    console.log('Checking Safe-related tables:\n');

    const safeCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%safe%'
    `);

    if (safeCheck.rows.length > 0) {
      safeCheck.rows.forEach((row: any) => {
        console.log(`  ✅ ${row.table_name}`);
      });
    } else {
      console.log('  ❌ No Safe-related tables found!');
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

listTables();
