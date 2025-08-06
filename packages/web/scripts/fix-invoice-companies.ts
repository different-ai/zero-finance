import { config } from 'dotenv';
import { db } from '../src/db';
import { companies, userRequestsTable } from '../src/db/schema';
import { eq, isNull, or } from 'drizzle-orm';

config({ path: '.env.local' });

async function fixInvoiceCompanies() {
  console.log('=== FIXING INVOICE COMPANY RELATIONSHIPS ===\n');

  // 1. Get all companies
  const allCompanies = await db
    .select({
      id: companies.id,
      name: companies.name,
      email: companies.email,
    })
    .from(companies)
    .where(isNull(companies.deletedAt));

  console.log('Found companies:');
  allCompanies.forEach(c => {
    console.log(`  - ${c.name} (${c.email})`);
  });

  // 2. Get all invoices without company relationships
  const invoicesWithoutCompanies = await db
    .select()
    .from(userRequestsTable)
    .where(or(
      isNull(userRequestsTable.senderCompanyId),
      isNull(userRequestsTable.recipientCompanyId)
    ));

  console.log(`\nFound ${invoicesWithoutCompanies.length} invoices without company relationships`);

  // 3. Fix each invoice
  let fixedCount = 0;
  for (const invoice of invoicesWithoutCompanies) {
    const invoiceData = invoice.invoiceData as any;
    if (!invoiceData) continue;

    const sellerEmail = invoiceData.sellerInfo?.email;
    const buyerEmail = invoiceData.buyerInfo?.email;

    // Find matching companies
    const sellerCompany = allCompanies.find(c => c.email === sellerEmail);
    const buyerCompany = allCompanies.find(c => c.email === buyerEmail);

    if (sellerCompany || buyerCompany) {
      console.log(`\nFixing invoice ${invoice.id}:`);
      console.log(`  Description: ${invoice.description}`);
      
      const updates: any = {};
      
      // Determine sender and recipient based on role
      if (invoice.role === 'seller') {
        // User is the seller
        if (sellerCompany) {
          updates.senderCompanyId = sellerCompany.id;
          console.log(`  Setting sender to: ${sellerCompany.name}`);
        }
        if (buyerCompany) {
          updates.recipientCompanyId = buyerCompany.id;
          console.log(`  Setting recipient to: ${buyerCompany.name}`);
        }
      } else {
        // User is the buyer
        if (sellerCompany) {
          updates.recipientCompanyId = sellerCompany.id;
          console.log(`  Setting recipient to: ${sellerCompany.name}`);
        }
        if (buyerCompany) {
          updates.senderCompanyId = buyerCompany.id;
          console.log(`  Setting sender to: ${buyerCompany.name}`);
        }
      }

      if (Object.keys(updates).length > 0) {
        await db
          .update(userRequestsTable)
          .set(updates)
          .where(eq(userRequestsTable.id, invoice.id));
        fixedCount++;
      }
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} invoices`);
  process.exit(0);
}

fixInvoiceCompanies().catch(console.error);