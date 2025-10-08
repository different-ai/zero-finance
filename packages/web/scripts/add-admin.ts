/**
 * Script to add a new admin to the admins table
 *
 * Usage:
 *   pnpm add-admin <privyDid> [notes]
 *
 * Example:
 *   pnpm add-admin did:privy:cm123456789 "John Doe - Engineering Lead"
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { db } from '../src/db';
import { admins, users } from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Determine which env file to use
const envFile =
  process.env.ENV === 'prod'
    ? '.env.prod.local'
    : process.env.ENV === 'lite'
      ? '.env.lite'
      : '.env.local';

config({ path: resolve(__dirname, '..', envFile) });

async function addAdmin(privyDid: string, notes?: string) {
  console.log('\n🔐 Adding Admin User');
  console.log('═'.repeat(60));
  console.log(`Environment: ${envFile}`);
  console.log(`Database: ${process.env.POSTGRES_DATABASE || 'unknown'}`);
  console.log('═'.repeat(60));
  console.log(`\nPrivy DID: ${privyDid}`);
  if (notes) {
    console.log(`Notes: ${notes}`);
  }

  try {
    // Check if admin already exists
    const existingAdmin = await db.query.admins.findFirst({
      where: eq(admins.privyDid, privyDid),
    });

    if (existingAdmin) {
      console.log('\n⚠️  Admin already exists!');
      console.log(`   Added on: ${existingAdmin.createdAt.toISOString()}`);
      console.log(`   Added by: ${existingAdmin.addedBy || 'System'}`);
      console.log(`   Notes: ${existingAdmin.notes || 'None'}`);

      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      return new Promise((resolve) => {
        rl.question('\nUpdate notes? (y/N): ', async (answer) => {
          rl.close();
          if (answer.toLowerCase() === 'y') {
            await db
              .update(admins)
              .set({ notes: notes || existingAdmin.notes })
              .where(eq(admins.privyDid, privyDid));
            console.log('\n✅ Admin notes updated successfully!');
          } else {
            console.log('\n❌ No changes made.');
          }
          resolve(null);
        });
      });
    }

    // Check if user exists in users table (optional info)
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, privyDid),
    });

    if (user) {
      console.log('\n📋 Found user in database:');
      console.log(
        `   Name: ${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          'N/A',
      );
      console.log(`   Company: ${user.companyName || 'N/A'}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
    } else {
      console.log('\n⚠️  User not found in database');
      console.log('   This user will become an admin when they sign up');
    }

    // Insert new admin
    const [newAdmin] = await db
      .insert(admins)
      .values({
        privyDid,
        addedBy: null, // Could be enhanced to track who ran the script
        notes: notes || null,
      })
      .returning();

    console.log('\n✅ Admin added successfully!');
    console.log('─'.repeat(60));
    console.log(`   Privy DID: ${newAdmin.privyDid}`);
    console.log(`   Added at: ${newAdmin.createdAt.toISOString()}`);
    console.log(`   Notes: ${newAdmin.notes || 'None'}`);
    console.log('─'.repeat(60));
    console.log('\n🎉 User can now access admin panel at /admin\n');
  } catch (error) {
    console.error('\n❌ Error adding admin:', error);
    process.exit(1);
  }
}

async function listAdmins() {
  console.log('\n👥 Current Admins');
  console.log('═'.repeat(60));
  console.log(`Environment: ${envFile}`);
  console.log(`Database: ${process.env.POSTGRES_DATABASE || 'unknown'}`);
  console.log('═'.repeat(60));

  try {
    const allAdmins = await db.query.admins.findMany({
      orderBy: (admins, { asc }) => [asc(admins.createdAt)],
    });

    if (allAdmins.length === 0) {
      console.log('\n⚠️  No admins found in database\n');
      return;
    }

    console.log(`\nTotal Admins: ${allAdmins.length}\n`);

    for (const admin of allAdmins) {
      // Try to get user info
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, admin.privyDid),
      });

      console.log('─'.repeat(60));
      console.log(`Privy DID: ${admin.privyDid}`);
      if (user) {
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        if (name) console.log(`Name:      ${name}`);
        if (user.companyName) console.log(`Company:   ${user.companyName}`);
      }
      console.log(`Added:     ${admin.createdAt.toISOString()}`);
      if (admin.addedBy) console.log(`Added by:  ${admin.addedBy}`);
      if (admin.notes) console.log(`Notes:     ${admin.notes}`);
    }
    console.log('═'.repeat(60));
    console.log('');
  } catch (error) {
    console.error('\n❌ Error listing admins:', error);
    process.exit(1);
  }
}

async function removeAdmin(privyDid: string) {
  console.log('\n🗑️  Removing Admin User');
  console.log('═'.repeat(60));
  console.log(`Environment: ${envFile}`);
  console.log(`Database: ${process.env.POSTGRES_DATABASE || 'unknown'}`);
  console.log('═'.repeat(60));
  console.log(`\nPrivy DID: ${privyDid}`);

  try {
    const admin = await db.query.admins.findFirst({
      where: eq(admins.privyDid, privyDid),
    });

    if (!admin) {
      console.log('\n❌ Admin not found in database\n');
      process.exit(1);
    }

    console.log(`\nFound admin added on: ${admin.createdAt.toISOString()}`);
    if (admin.notes) console.log(`Notes: ${admin.notes}`);

    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(
        '\n⚠️  Are you sure you want to remove this admin? (yes/NO): ',
        async (answer) => {
          rl.close();
          if (answer.toLowerCase() === 'yes') {
            await db.delete(admins).where(eq(admins.privyDid, privyDid));
            console.log('\n✅ Admin removed successfully!\n');
          } else {
            console.log('\n❌ Removal cancelled.\n');
          }
          resolve(null);
        },
      );
    });
  } catch (error) {
    console.error('\n❌ Error removing admin:', error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(`
📋 Admin Management Script

Usage:
  pnpm add-admin <command> [options]

Commands:
  add <privyDid> [notes]     Add a new admin user
  list                       List all current admins
  remove <privyDid>          Remove an admin user
  
Environment:
  Set ENV variable to choose environment (default: local)
  ENV=prod pnpm add-admin list     # Use production database
  ENV=lite pnpm add-admin list     # Use lite database
  pnpm add-admin list              # Use local database

Examples:
  pnpm add-admin add did:privy:cm123 "Jane Doe - CTO"
  pnpm add-admin list
  pnpm add-admin remove did:privy:cm123
  ENV=prod pnpm add-admin list
`);
    process.exit(0);
  }

  switch (command) {
    case 'add': {
      const privyDid = args[1];
      const notes = args.slice(2).join(' ');

      if (!privyDid) {
        console.error('\n❌ Error: Privy DID is required');
        console.log('\nUsage: pnpm add-admin add <privyDid> [notes]\n');
        process.exit(1);
      }

      if (!privyDid.startsWith('did:privy:')) {
        console.error('\n❌ Error: Invalid Privy DID format');
        console.log('   Privy DIDs should start with "did:privy:"\n');
        process.exit(1);
      }

      await addAdmin(privyDid, notes);
      break;
    }

    case 'list':
      await listAdmins();
      break;

    case 'remove': {
      const privyDid = args[1];

      if (!privyDid) {
        console.error('\n❌ Error: Privy DID is required');
        console.log('\nUsage: pnpm add-admin remove <privyDid>\n');
        process.exit(1);
      }

      await removeAdmin(privyDid);
      break;
    }

    default:
      console.error(`\n❌ Unknown command: ${command}`);
      console.log('\nRun "pnpm add-admin --help" for usage information\n');
      process.exit(1);
  }

  process.exit(0);
}

main();
