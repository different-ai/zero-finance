import { config } from 'dotenv';
import { db } from '../src/db';
import { companies, userRequestsTable } from '../src/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

config({ path: '.env.local' });

async function testStatusUpdate() {
  console.log('=== TESTING INVOICE STATUS UPDATE PERMISSIONS ===\n');

  // Get Benjamin Shafii company (owned by benjamin.shafii@gmail.com)
  const benjaminCompany = await db
    .select()
    .from(companies)
    .where(and(
      eq(companies.name, 'Benjamin Shafii'),
      isNull(companies.deletedAt)
    ))
    .limit(1);

  if (!benjaminCompany[0]) {
    console.log('Benjamin Shafii company not found');
    return;
  }

  console.log(`Benjamin Shafii company:`);
  console.log(`  ID: ${benjaminCompany[0].id}`);
  console.log(`  Owner: ${benjaminCompany[0].ownerPrivyDid}\n`);

  // Get invoices directed to Benjamin Shafii company
  const invoicesToCompany = await db
    .select({
      id: userRequestsTable.id,
      description: userRequestsTable.description,
      status: userRequestsTable.status,
      userId: userRequestsTable.userId,
      recipientCompanyId: userRequestsTable.recipientCompanyId,
    })
    .from(userRequestsTable)
    .where(eq(userRequestsTable.recipientCompanyId, benjaminCompany[0].id))
    .limit(5);

  console.log('Invoices directed to Benjamin Shafii company:');
  if (invoicesToCompany.length === 0) {
    console.log('  (none)');
  } else {
    invoicesToCompany.forEach(inv => {
      const canUpdate = inv.userId !== benjaminCompany[0].ownerPrivyDid;
      console.log(`\n  Invoice: ${inv.description}`);
      console.log(`    ID: ${inv.id}`);
      console.log(`    Status: ${inv.status}`);
      console.log(`    Created by: ${inv.userId === benjaminCompany[0].ownerPrivyDid ? 'OWNER (me)' : 'SOMEONE ELSE'}`);
      console.log(`    Can owner update status? ${canUpdate ? 'YES ✓' : 'NO (owner created it)'}`);
    });
  }

  // Simulate what the updateStatus endpoint checks
  console.log('\n=== SIMULATING STATUS UPDATE CHECK ===');
  
  if (invoicesToCompany.length > 0) {
    const testInvoice = invoicesToCompany[0];
    const userId = benjaminCompany[0].ownerPrivyDid; // Simulating logged-in user
    
    console.log(`\nTesting invoice: ${testInvoice.description}`);
    console.log(`User trying to update: ${userId}`);
    
    // Check 1: Invoice has recipient company
    if (!testInvoice.recipientCompanyId) {
      console.log('❌ FAIL: Invoice not directed to a company');
      return;
    }
    console.log('✓ Invoice is directed to a company');
    
    // Check 2: User owns the recipient company
    const [ownedCompany] = await db
      .select()
      .from(companies)
      .where(and(
        eq(companies.id, testInvoice.recipientCompanyId),
        eq(companies.ownerPrivyDid, userId)
      ))
      .limit(1);
    
    if (!ownedCompany) {
      console.log('❌ FAIL: User does not own the recipient company');
      return;
    }
    console.log('✓ User owns the recipient company');
    console.log('✅ User CAN update this invoice status!');
  }

  process.exit(0);
}

testStatusUpdate().catch(console.error);