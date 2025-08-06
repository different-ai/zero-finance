import { config } from 'dotenv';
import { db } from '../src/db';
import { userRequestsTable } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';

config({ path: '.env.local' });

async function fixInvoiceRoles() {
  console.log('=== FIXING INVOICE ROLES ===\n');

  // Get invoices where Different AI sent to Benjamin Shafii
  const differentAiId = 'a53f69b0-d64f-4511-8105-294a8ae19d05';
  const benjaminShafiiId = 'd73ecd69-d81a-4177-b68a-839ae011f0b6';
  
  const invoicesToFix = await db
    .select()
    .from(userRequestsTable)
    .where(and(
      eq(userRequestsTable.senderCompanyId, differentAiId),
      eq(userRequestsTable.recipientCompanyId, benjaminShafiiId),
      eq(userRequestsTable.role, 'buyer') // Currently wrong
    ));

  console.log(`Found ${invoicesToFix.length} invoices to fix\n`);

  for (const invoice of invoicesToFix) {
    console.log(`Fixing invoice ${invoice.id}:`);
    console.log(`  Description: ${invoice.description}`);
    console.log(`  Current role: ${invoice.role} -> New role: seller`);
    
    // Update role to seller since Different AI is sending the invoice
    await db
      .update(userRequestsTable)
      .set({ role: 'seller' })
      .where(eq(userRequestsTable.id, invoice.id));
  }

  console.log(`\n✅ Fixed ${invoicesToFix.length} invoice roles`);
  
  // Verify the fix
  console.log('\n=== VERIFICATION ===');
  const verifyInvoices = await db
    .select({
      id: userRequestsTable.id,
      description: userRequestsTable.description,
      role: userRequestsTable.role,
    })
    .from(userRequestsTable)
    .where(and(
      eq(userRequestsTable.senderCompanyId, differentAiId),
      eq(userRequestsTable.recipientCompanyId, benjaminShafiiId)
    ));

  verifyInvoices.forEach(inv => {
    console.log(`  - ${inv.description}: role = ${inv.role}`);
  });

  process.exit(0);
}

fixInvoiceRoles().catch(console.error);