import { config } from 'dotenv';
import { db } from '../src/db';
import { companies, userRequestsTable } from '../src/db/schema';
import { eq, and, or, inArray, isNull, ne } from 'drizzle-orm';

config({ path: '.env.local' });

async function testOwnerFilter() {
  // Test with benjamin.shafii@gmail.com
  const userId = 'did:privy:cmdy0j5ov011kl50bn5cq9ubm';
  
  console.log('=== TESTING OWNER-ONLY INVOICE FILTERS ===\n');
  console.log(`User ID: ${userId}\n`);

  // Get ONLY companies the user OWNS
  const ownedCompanies = await db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .where(and(
      eq(companies.ownerPrivyDid, userId),
      isNull(companies.deletedAt)
    ));
  
  const ownedCompanyIds = ownedCompanies.map(c => c.id);
  
  console.log('Companies I OWN:');
  if (ownedCompanies.length === 0) {
    console.log('  (none)');
  } else {
    ownedCompanies.forEach(c => {
      console.log(`  - ${c.name} (${c.id})`);
    });
  }

  if (ownedCompanyIds.length === 0) {
    console.log('\n❌ No owned companies = No invoices should be visible\n');
    return;
  }

  // Test the new filter logic
  const baseCondition = or(
    inArray(userRequestsTable.senderCompanyId, ownedCompanyIds),
    inArray(userRequestsTable.recipientCompanyId, ownedCompanyIds)
  );

  // ALL invoices involving my companies
  console.log('\n1. ALL INVOICES (involving my owned companies):');
  const allInvoices = await db
    .select({
      id: userRequestsTable.id,
      description: userRequestsTable.description,
      userId: userRequestsTable.userId,
      senderCompanyId: userRequestsTable.senderCompanyId,
      recipientCompanyId: userRequestsTable.recipientCompanyId,
    })
    .from(userRequestsTable)
    .where(baseCondition)
    .limit(10);

  allInvoices.forEach(inv => {
    const createdByMe = inv.userId === userId;
    console.log(`  - ${inv.description} (created by: ${createdByMe ? 'ME' : 'OTHER'})`);
  });

  // SENT (Outgoing - I created)
  console.log('\n2. SENT/OUTGOING (invoices I created from my companies):');
  const sentInvoices = await db
    .select({
      id: userRequestsTable.id,
      description: userRequestsTable.description,
    })
    .from(userRequestsTable)
    .where(and(
      baseCondition,
      eq(userRequestsTable.userId, userId)
    ))
    .limit(10);

  sentInvoices.forEach(inv => {
    console.log(`  - ${inv.description}`);
  });

  // RECEIVED (Incoming - others created)
  console.log('\n3. RECEIVED/INCOMING (invoices others created involving my companies):');
  const receivedInvoices = await db
    .select({
      id: userRequestsTable.id,
      description: userRequestsTable.description,
      userId: userRequestsTable.userId,
    })
    .from(userRequestsTable)
    .where(and(
      baseCondition,
      ne(userRequestsTable.userId, userId)
    ))
    .limit(10);

  if (receivedInvoices.length === 0) {
    console.log('  (none)');
  } else {
    receivedInvoices.forEach(inv => {
      console.log(`  - ${inv.description} (created by: ${inv.userId})`);
    });
  }

  // Test with a different user who owns Different AI
  console.log('\n\n=== TESTING WITH Different AI OWNER ===');
  const differentUserId = 'did:privy:cmavz4ftr00lyl70mk6wh67et';
  
  const differentOwnedCompanies = await db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .where(and(
      eq(companies.ownerPrivyDid, differentUserId),
      isNull(companies.deletedAt)
    ));

  console.log('Companies owned by Different AI user:');
  differentOwnedCompanies.forEach(c => {
    console.log(`  - ${c.name}`);
  });

  process.exit(0);
}

testOwnerFilter().catch(console.error);