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

const privyDid = 'did:privy:cmfzy4jse000pjx0clx16p972';

async function checkAdmin() {
  const databaseUrl = process.env.POSTGRES_URL;

  if (!databaseUrl) {
    console.error('❌ Error: POSTGRES_URL not found in environment');
    process.exit(1);
  }

  console.log(`Using DB URL: ${databaseUrl.split('@')[1]}`); // Log masked URL

  const pool = new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 10000,
  });
  const db = drizzle(pool);

  try {
    console.log(`Checking for admin: ${privyDid}`);
    const existing = await db
      .select()
      .from(admins)
      .where(eq(admins.privyDid, privyDid));

    if (existing.length > 0) {
      console.log('✅ User FOUND in admins table:');
      console.log(JSON.stringify(existing[0], null, 2));
    } else {
      console.log('❌ User NOT FOUND in admins table.');
    }

    // List all admins to be sure
    const allAdmins = await db.select().from(admins);
    console.log(`Total admins: ${allAdmins.length}`);
    allAdmins.forEach((a) => console.log(`- ${a.privyDid}`));
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await pool.end();
  }
}

checkAdmin();
