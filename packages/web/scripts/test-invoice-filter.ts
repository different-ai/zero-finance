import { config } from 'dotenv';
import { db } from '../src/db';
import { companies, companyMembers, userRequestsTable } from '../src/db/schema';
import { eq, and, or, inArray } from 'drizzle-orm';

config({ path: '.env.local' });

async function testInvoiceFilter() {
  const userId = 'did:privy:cmdy0j5ov011kl50bn5cq9ubm'; // benjamin.shafii@gmail.com
  
  console.log('=== TESTING INVOICE FILTERS ===\n');
  console.log(`User ID: ${userId}\n`);

  // Get user's companies
  const userCompanies = await db
    .select({ companyId: companyMembers.companyId, companyName: companies.name })
    .from(companyMembers)
    .innerJoin(companies, eq(companyMembers.companyId, companies.id))
    .where(eq(companyMembers.userPrivyDid, userId));
  
  const userCompanyIds = userCompanies.map(c => c.companyId);
  
  console.log('User is member of companies:');
  userCompanies.forEach(c => {
    console.log(`  - ${c.companyName} (${c.companyId})`);
  });

  // Test SENT filter (new logic)
  console.log('\n1. SENT FILTER (invoices I sent as seller OR my companies sent):');
  const sentConditions = [
    and(
      eq(userRequestsTable.userId, userId),
      eq(userRequestsTable.role, 'seller')
    )
  ];
  if (userCompanyIds.length > 0) {
    sentConditions.push(inArray(userRequestsTable.senderCompanyId, userCompanyIds));
  }
  const sentQuery = sentConditions.length > 1 ? or(...sentConditions) : sentConditions[0];
  
  const sentInvoices = await db
    .select({
      id: userRequestsTable.id,
      description: userRequestsTable.description,
      role: userRequestsTable.role,
      userId: userRequestsTable.userId,
      senderCompanyId: userRequestsTable.senderCompanyId,
      recipientCompanyId: userRequestsTable.recipientCompanyId,
    })
    .from(userRequestsTable)
    .where(sentQuery)
    .limit(10);

  sentInvoices.forEach(inv => {
    console.log(`  - ${inv.description} (role: ${inv.role}, created by: ${inv.userId === userId ? 'ME' : 'other'})`);
  });

  // Test RECEIVED filter (new logic)
  console.log('\n2. RECEIVED FILTER (invoices I received as buyer OR my companies received):');
  const receivedConditions = [
    and(
      eq(userRequestsTable.userId, userId),
      eq(userRequestsTable.role, 'buyer')
    )
  ];
  if (userCompanyIds.length > 0) {
    receivedConditions.push(inArray(userRequestsTable.recipientCompanyId, userCompanyIds));
  }
  const receivedQuery = receivedConditions.length > 1 ? or(...receivedConditions) : receivedConditions[0];
  
  const receivedInvoices = await db
    .select({
      id: userRequestsTable.id,
      description: userRequestsTable.description,
      role: userRequestsTable.role,
      userId: userRequestsTable.userId,
      senderCompanyId: userRequestsTable.senderCompanyId,
      recipientCompanyId: userRequestsTable.recipientCompanyId,
    })
    .from(userRequestsTable)
    .where(receivedQuery)
    .limit(10);

  receivedInvoices.forEach(inv => {
    console.log(`  - ${inv.description} (role: ${inv.role}, created by: ${inv.userId === userId ? 'ME' : 'other'})`);
  });

  // Show which invoices Different AI sent to Benjamin Shafii company
  console.log('\n3. INVOICES FROM Different AI TO Benjamin Shafii:');
  const differentAiId = 'a53f69b0-d64f-4511-8105-294a8ae19d05';
  const benjaminShafiiId = 'd73ecd69-d81a-4177-b68a-839ae011f0b6';
  
  const crossCompanyInvoices = await db
    .select({
      id: userRequestsTable.id,
      description: userRequestsTable.description,
      role: userRequestsTable.role,
      userId: userRequestsTable.userId,
    })
    .from(userRequestsTable)
    .where(and(
      eq(userRequestsTable.senderCompanyId, differentAiId),
      eq(userRequestsTable.recipientCompanyId, benjaminShafiiId)
    ));

  crossCompanyInvoices.forEach(inv => {
    console.log(`  - ${inv.description} (role: ${inv.role}, created by: ${inv.userId === userId ? 'ME' : 'other'})`);
    console.log(`    Should appear in: ${inv.role === 'buyer' ? 'RECEIVED' : 'SENT'} (based on role)`);
  });

  process.exit(0);
}

testInvoiceFilter().catch(console.error);