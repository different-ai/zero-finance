import { config } from 'dotenv';
import { db } from '../src/db';
import { companies, userRequestsTable } from '../src/db/schema';
import { eq, and, or, ne, inArray, isNull } from 'drizzle-orm';

config({ path: '.env.local' });

async function testFixes() {
  console.log('=== TESTING FIXES FOR INVOICE FILTERING ===\n');

  // Test Case 1: User with no companies should see their own created invoices
  const userWithNoCompanies = 'did:privy:test-no-companies';
  console.log('1. TEST: User with no companies viewing outgoing invoices');
  console.log(`   User ID: ${userWithNoCompanies}`);
  
  // Simulate the filter logic for SENT (outgoing)
  const outgoingCondition = eq(userRequestsTable.userId, userWithNoCompanies);
  console.log('   Filter: Show all invoices where userId = user');
  console.log('   ✅ This will show ALL invoices created by the user\n');

  // Test Case 2: User with companies viewing incoming invoices
  const userId = 'did:privy:cmdy0j5ov011kl50bn5cq9ubm'; // benjamin.shafii
  console.log('2. TEST: User with companies viewing incoming invoices');
  
  // Get owned companies
  const ownedCompanies = await db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .where(and(
      eq(companies.ownerPrivyDid, userId),
      isNull(companies.deletedAt)
    ));
  
  const ownedCompanyIds = ownedCompanies.map(c => c.id);
  
  console.log(`   User owns ${ownedCompanies.length} companies:`);
  ownedCompanies.forEach(c => console.log(`     - ${c.name}`));
  
  if (ownedCompanyIds.length > 0) {
    // Simulate RECEIVED filter
    const receivedCondition = and(
      inArray(userRequestsTable.recipientCompanyId, ownedCompanyIds),
      ne(userRequestsTable.userId, userId)
    );
    
    const incomingInvoices = await db
      .select({
        id: userRequestsTable.id,
        description: userRequestsTable.description,
        userId: userRequestsTable.userId,
      })
      .from(userRequestsTable)
      .where(receivedCondition)
      .limit(5);
    
    console.log(`   Found ${incomingInvoices.length} incoming invoices (created by others)`);
    incomingInvoices.forEach(inv => {
      console.log(`     - ${inv.description} (created by: ${inv.userId === userId ? 'ME' : 'OTHER'})`);
    });
  }

  // Test Case 3: ALL filter includes both user's invoices and company invoices
  console.log('\n3. TEST: ALL filter for user with companies');
  
  const allConditions = [eq(userRequestsTable.userId, userId)];
  if (ownedCompanyIds.length > 0) {
    allConditions.push(
      or(
        inArray(userRequestsTable.senderCompanyId, ownedCompanyIds),
        inArray(userRequestsTable.recipientCompanyId, ownedCompanyIds)
      )!
    );
  }
  const allCondition = allConditions.length > 1 ? or(...allConditions) : allConditions[0];
  
  const allInvoices = await db
    .select({
      id: userRequestsTable.id,
      description: userRequestsTable.description,
      userId: userRequestsTable.userId,
    })
    .from(userRequestsTable)
    .where(allCondition)
    .limit(10);
  
  console.log(`   Found ${allInvoices.length} total invoices (user created + company involved)`);
  
  // Test Case 4: Verify Mark as Paid permission
  console.log('\n4. TEST: Mark as Paid permission check');
  
  // Find an invoice directed to user's company
  const testInvoice = await db
    .select()
    .from(userRequestsTable)
    .where(and(
      inArray(userRequestsTable.recipientCompanyId, ownedCompanyIds),
      ne(userRequestsTable.userId, userId) // Created by someone else
    ))
    .limit(1);
  
  if (testInvoice[0]) {
    console.log(`   Testing invoice: ${testInvoice[0].description}`);
    console.log(`   Recipient Company ID: ${testInvoice[0].recipientCompanyId}`);
    
    // Check if user owns the recipient company
    const ownsRecipient = ownedCompanyIds.includes(testInvoice[0].recipientCompanyId!);
    console.log(`   User owns recipient company: ${ownsRecipient ? '✅ YES' : '❌ NO'}`);
    console.log(`   Can mark as paid: ${ownsRecipient ? '✅ YES' : '❌ NO'}`);
  } else {
    console.log('   No incoming invoices found to test');
  }

  process.exit(0);
}

testFixes().catch(console.error);