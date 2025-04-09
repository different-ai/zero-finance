import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../..//.env.local') });

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    console.error('Attempted to load env from:', path.resolve(__dirname, '../../.env.local'));
    throw new Error('POSTGRES_URL environment variable is not set. Check .env.local and script path.');
  }

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: true, // Match the setting in db/index.ts
    max: 1 // Use a single connection for migrations
  });

  const db = drizzle(pool);

  console.log('⏳ Running migrations...');

  const start = Date.now();

  await migrate(db, { migrationsFolder: 'src/db/migrations' });

  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  await pool.end(); // Ensure the pool connections are closed

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
}); 