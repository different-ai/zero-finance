import { db } from '@/db';
import { userClassificationSettings, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function seedDemoClassificationRule() {
  // This should be run with Ben's actual user ID
  const DEMO_USER_ID = process.env.DEMO_USER_PRIVY_DID || 'demo-user-id';

  // Ensure user exists
  const user = await db.query.users.findFirst({
    where: eq(users.privyDid, DEMO_USER_ID),
  });

  if (!user) {
    console.log('Creating demo user...');
    await db.insert(users).values({
      privyDid: DEMO_USER_ID,
    });
  }

  // Create the Sightglass Sunday rule from the demo
  const sightglassRule = {
    userId: DEMO_USER_ID,
    name: 'Sightglass Weekend Personal',
    prompt: `If this is a receipt from Sightglass Coffee on a weekend (Saturday or Sunday) between 12:00-18:00, then:
- Mark as category: "personal_expense" 
- Set status to: "auto_approved"
- Add note: "Personal expense - used company card by mistake"
- Reason: "Weekend coffee purchases are typically personal"

This handles the common case where I accidentally use my company card for personal weekend coffee purchases.`,
    enabled: true,
    priority: 1, // High priority for this specific use case
  };

  // Insert the rule
  await db.insert(userClassificationSettings).values(sightglassRule);

  console.log('✅ Demo classification rule created:', sightglassRule.name);

  // Also create a vendor payment rule for the invoice demo
  const vendorPaymentRule = {
    userId: DEMO_USER_ID,
    name: 'Auto-Schedule Vendor Payments',
    prompt: `If this is an invoice from a known vendor (like "acme cloud hosting") with amount > $100:
- Mark as category: "vendor_payment"
- Set status to: "auto_approved" 
- Schedule payment for: 2 business days from now
- Add note: "Auto-scheduled vendor payment - 2 day review period"
- Reason: "Regular vendor invoices can be auto-scheduled with review period"

This allows automatic payment scheduling while maintaining oversight.`,
    enabled: true,
    priority: 2,
  };

  await db.insert(userClassificationSettings).values(vendorPaymentRule);

  console.log('✅ Vendor payment rule created:', vendorPaymentRule.name);
}

if (require.main === module) {
  seedDemoClassificationRule()
    .then(() => {
      console.log('Demo rules seeded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error seeding demo rules:', error);
      process.exit(1);
    });
}

export { seedDemoClassificationRule }; 