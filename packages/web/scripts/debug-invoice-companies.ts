import { config } from 'dotenv';
import { db } from '../src/db';
import { companies, companyMembers, userRequestsTable } from '../src/db/schema';
import { eq, and, or, isNull, desc } from 'drizzle-orm';

config({ path: '.env.local' });

async function debugInvoiceCompanies() {
  console.log('=== DEBUGGING INVOICE COMPANY RELATIONSHIPS ===\n');

  // 1. Get all non-deleted companies
  console.log('1. ALL NON-DELETED COMPANIES:');
  const allCompanies = await db
    .select({
      id: companies.id,
      name: companies.name,
      ownerPrivyDid: companies.ownerPrivyDid,
      email: companies.email,
    })
    .from(companies)
    .where(isNull(companies.deletedAt))
    .orderBy(desc(companies.createdAt));

  allCompanies.forEach(c => {
    console.log(`  - ${c.name} (ID: ${c.id})`);
    console.log(`    Owner: ${c.ownerPrivyDid}`);
    console.log(`    Email: ${c.email}`);
  });

  // 2. Get all company memberships
  console.log('\n2. COMPANY MEMBERSHIPS:');
  const memberships = await db
    .select({
      companyId: companyMembers.companyId,
      companyName: companies.name,
      userPrivyDid: companyMembers.userPrivyDid,
      role: companyMembers.role,
    })
    .from(companyMembers)
    .innerJoin(companies, eq(companyMembers.companyId, companies.id))
    .where(isNull(companies.deletedAt));

  memberships.forEach(m => {
    console.log(`  - Company: ${m.companyName} (${m.companyId})`);
    console.log(`    User: ${m.userPrivyDid} - Role: ${m.role}`);
  });

  // 3. Get recent invoices with company relationships
  console.log('\n3. RECENT INVOICES WITH COMPANY RELATIONSHIPS:');
  const invoices = await db
    .select({
      id: userRequestsTable.id,
      userId: userRequestsTable.userId,
      companyId: userRequestsTable.companyId,
      senderCompanyId: userRequestsTable.senderCompanyId,
      recipientCompanyId: userRequestsTable.recipientCompanyId,
      description: userRequestsTable.description,
      amount: userRequestsTable.amount,
      status: userRequestsTable.status,
      role: userRequestsTable.role,
      createdAt: userRequestsTable.createdAt,
    })
    .from(userRequestsTable)
    .orderBy(desc(userRequestsTable.createdAt))
    .limit(10);

  if (invoices.length === 0) {
    console.log('  No invoices found in the database');
  }

  for (const invoice of invoices) {
    console.log(`\n  Invoice ID: ${invoice.id}`);
    console.log(`    Description: ${invoice.description}`);
    console.log(`    Amount: ${invoice.amount}`);
    console.log(`    Status: ${invoice.status}`);
    console.log(`    Role: ${invoice.role}`);
    console.log(`    User ID: ${invoice.userId}`);
    console.log(`    Company ID: ${invoice.companyId || 'NULL'}`);
    console.log(`    Sender Company ID: ${invoice.senderCompanyId || 'NULL'}`);
    console.log(`    Recipient Company ID: ${invoice.recipientCompanyId || 'NULL'}`);
    
    // Get company names if they exist
    if (invoice.senderCompanyId) {
      const [sender] = await db
        .select({ name: companies.name })
        .from(companies)
        .where(eq(companies.id, invoice.senderCompanyId))
        .limit(1);
      if (sender) console.log(`    Sender Company Name: ${sender.name}`);
    }
    
    if (invoice.recipientCompanyId) {
      const [recipient] = await db
        .select({ name: companies.name })
        .from(companies)
        .where(eq(companies.id, invoice.recipientCompanyId))
        .limit(1);
      if (recipient) console.log(`    Recipient Company Name: ${recipient.name}`);
    }
  }

  // 4. Check for invoices that should be "incoming" for company members
  console.log('\n4. CHECKING FOR INCOMING INVOICES:');
  
  // For each company, find invoices where they are the recipient
  for (const company of allCompanies.slice(0, 3)) { // Check first 3 companies
    console.log(`\n  Company: ${company.name} (${company.id})`);
    
    // Get members of this company
    const members = await db
      .select({ userPrivyDid: companyMembers.userPrivyDid })
      .from(companyMembers)
      .where(eq(companyMembers.companyId, company.id));
    
    console.log(`    Members: ${members.map(m => m.userPrivyDid).join(', ')}`);
    
    // Find invoices where this company is the recipient
    const incomingInvoices = await db
      .select({
        id: userRequestsTable.id,
        description: userRequestsTable.description,
        senderCompanyId: userRequestsTable.senderCompanyId,
      })
      .from(userRequestsTable)
      .where(eq(userRequestsTable.recipientCompanyId, company.id))
      .limit(5);
    
    if (incomingInvoices.length > 0) {
      console.log(`    Incoming invoices (as recipient):`);
      incomingInvoices.forEach(inv => {
        console.log(`      - ${inv.id}: ${inv.description}`);
      });
    } else {
      console.log(`    No incoming invoices found`);
    }
  }

  process.exit(0);
}

debugInvoiceCompanies().catch(console.error);