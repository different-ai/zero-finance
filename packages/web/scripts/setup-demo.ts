import { db } from '../src/db';
import { 
  users, 
  userClassificationSettings, 
  actionLedger, 
  inboxCards,
  gmailProcessingPrefs 
} from '../src/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

async function setupDemo() {
  console.log('🚀 Setting up 0 Finance demo...');

  const DEMO_USER_ID = process.env.DEMO_USER_PRIVY_DID || process.env.USER_PRIVY_DID || 'demo-user-id';
  
  if (!DEMO_USER_ID || DEMO_USER_ID === 'demo-user-id') {
    console.error('❌ Please set DEMO_USER_PRIVY_DID or USER_PRIVY_DID environment variable');
    process.exit(1);
  }

  console.log(`👤 Using user ID: ${DEMO_USER_ID}`);

  // 1. Ensure user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.privyDid, DEMO_USER_ID),
  });

  if (!existingUser) {
    console.log('👤 Creating demo user...');
    await db.insert(users).values({
      privyDid: DEMO_USER_ID,
      kycStatus: 'approved', // For demo purposes
    });
  }

  // 2. Enable Gmail processing
  console.log('📧 Setting up Gmail processing preferences...');
  const existingPrefs = await db.query.gmailProcessingPrefs.findFirst({
    where: eq(gmailProcessingPrefs.userId, DEMO_USER_ID),
  });

  if (!existingPrefs) {
    await db.insert(gmailProcessingPrefs).values({
      userId: DEMO_USER_ID,
      isEnabled: true,
      activatedAt: new Date(),
      keywords: ['invoice', 'bill', 'payment', 'receipt', 'order', 'statement'],
      lastSyncedAt: new Date(),
    });
  } else {
    await db.update(gmailProcessingPrefs)
      .set({
        isEnabled: true,
        activatedAt: existingPrefs.activatedAt || new Date(),
      })
      .where(eq(gmailProcessingPrefs.userId, DEMO_USER_ID));
  }

  // 3. Clear existing classification rules for clean demo
  console.log('🧹 Cleaning up existing classification rules...');
  await db.delete(userClassificationSettings)
    .where(eq(userClassificationSettings.userId, DEMO_USER_ID));

  // 4. Create demo classification rules
  console.log('🤖 Creating demo AI classification rules...');
  
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
    priority: 1,
  };

  const vendorPaymentRule = {
    userId: DEMO_USER_ID,
    name: 'Auto-Schedule Vendor Payments',
    prompt: `If this is an invoice from a known vendor (like "acme cloud hosting", "AWS", "Digital Ocean", "Stripe") with amount > $100:
- Mark as category: "vendor_payment"
- Set status to: "auto_approved" 
- Schedule payment for: 2 business days from now
- Add note: "Auto-scheduled vendor payment - 2 day review period"
- Reason: "Regular vendor invoices can be auto-scheduled with review period"

This allows automatic payment scheduling while maintaining oversight.`,
    enabled: true,
    priority: 2,
  };

  const marketingSpamRule = {
    userId: DEMO_USER_ID,
    name: 'Filter Marketing Emails',
    prompt: `If this is promotional content, marketing email, or sales pitch (not a real invoice/receipt):
- Set status to: "dismissed"
- Add category: "spam_filtered"
- Reason: "Marketing content filtered out automatically"

This keeps the inbox focused on actual financial documents.`,
    enabled: true,
    priority: 0, // Highest priority to filter spam first
  };

  await db.insert(userClassificationSettings).values([
    marketingSpamRule,
    sightglassRule,
    vendorPaymentRule,
  ]);

  // 5. Create some demo action log entries to make the interface look active
  console.log('📋 Creating demo action log entries...');
  
  const demoActions = [
    {
      approvedBy: DEMO_USER_ID,
      inboxCardId: `demo-card-1`,
      actionType: 'classification_auto_approved',
      actionTitle: 'Auto-approved: Sightglass Coffee Receipt',
      actionSubtitle: 'Personal expense - weekend coffee purchase',
      sourceType: 'email',
      amount: '9.81',
      currency: 'USD',
      status: 'executed' as const,
      confidence: 95,
      originalCardData: {},
      executionDetails: {
        classificationResults: {
          evaluated: [{ name: 'Sightglass Weekend Personal', id: 'rule-1' }],
          matched: [{ 
            name: 'Sightglass Weekend Personal', 
            confidence: 95,
            actions: [{ type: 'approve' }, { type: 'add_category', value: 'personal_expense' }]
          }],
          autoApproved: true,
          timestamp: new Date().toISOString(),
        }
      },
      metadata: {
        aiModel: 'o3-2025-04-16',
        demoData: true,
      },
      note: 'Personal expense categorized automatically based on AI rule',
    },
    {
      approvedBy: DEMO_USER_ID,
      inboxCardId: `demo-card-2`,
      actionType: 'payment_scheduled',
      actionTitle: 'Payment Scheduled: Acme Cloud Hosting',
      actionSubtitle: 'USD 450.00 - scheduled for 2 business days',
      sourceType: 'email',
      amount: '450.00',
      currency: 'USD',
      status: 'approved' as const,
      confidence: 98,
      originalCardData: {},
      executionDetails: {
        paymentId: 'payment_demo_123',
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'ach',
        delayBusinessDays: 2,
        canCancel: true,
        autoExecute: true,
      },
      metadata: {
        demoData: true,
        paymentData: {
          id: 'payment_demo_123',
          recipientName: 'Acme Cloud Hosting',
          status: 'scheduled',
        }
      },
      note: 'Auto-scheduled via AI classification rule. Payment can be cancelled until execution date.',
    },
    {
      approvedBy: DEMO_USER_ID,
      inboxCardId: `demo-card-3`,
      actionType: 'classification_evaluated',
      actionTitle: 'AI Rules Evaluated: AWS Monthly Bill',
      actionSubtitle: 'Matched vendor payment rule',
      sourceType: 'email',
      amount: '234.56',
      currency: 'USD',
      status: 'executed' as const,
      confidence: 92,
      originalCardData: {},
      executionDetails: {
        classificationResults: {
          evaluated: [
            { name: 'Auto-Schedule Vendor Payments', id: 'rule-2' },
            { name: 'Filter Marketing Emails', id: 'rule-3' }
          ],
          matched: [{ 
            name: 'Auto-Schedule Vendor Payments', 
            confidence: 92,
            actions: [{ type: 'schedule_payment' }, { type: 'add_category', value: 'vendor_payment' }]
          }],
          autoApproved: false,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        }
      },
      metadata: {
        aiModel: 'o3-2025-04-16',
        demoData: true,
      },
      note: 'Vendor payment identified and processed automatically',
    },
    {
      approvedBy: DEMO_USER_ID,
      inboxCardId: `demo-card-4`,
      actionType: 'document_uploaded',
      actionTitle: 'Uploaded: invoice-demo.pdf',
      actionSubtitle: 'Document processed successfully',
      sourceType: 'manual_upload',
      status: 'executed' as const,
      confidence: 100,
      originalCardData: {},
      metadata: {
        fileName: 'invoice-demo.pdf',
        fileType: 'application/pdf',
        processedSuccessfully: true,
        demoData: true,
      },
      note: 'Manual document upload processed through AI pipeline',
    }
  ];

  // Add timestamps spread over the last few hours
  const now = Date.now();
  const actionsWithTimestamps = demoActions.map((action, index) => {
    const minutesAgo = (index + 1) * 15; // Space actions 15 minutes apart
    const timestamp = new Date(now - minutesAgo * 60 * 1000);
    
    return {
      ...action,
      createdAt: timestamp,
      updatedAt: timestamp,
      approvedAt: timestamp,
      executedAt: action.status === 'executed' ? new Date(timestamp.getTime() + 30000) : null,
    };
  });

  await db.insert(actionLedger).values(actionsWithTimestamps as any);

  console.log('✅ Demo setup complete!');
  console.log('');
  console.log('🎯 Demo is ready! Here\'s what was set up:');
  console.log('   • User account and Gmail processing enabled');
  console.log('   • 3 AI classification rules:');
  console.log('     - Filter marketing emails (auto-dismiss spam)');
  console.log('     - Sightglass weekend personal (categorize personal expenses)');
  console.log('     - Auto-schedule vendor payments (2-day delay)');
  console.log('   • 4 demo action log entries to show activity');
  console.log('');
  console.log('🧪 To test the demo:');
  console.log('   1. Go to /dashboard/inbox');
  console.log('   2. Upload the attached Sightglass receipt (should be auto-categorized as personal)');
  console.log('   3. Upload the attached Acme invoice (should schedule payment for 2 days)');
  console.log('   4. Check the action log to see AI decision trail');
  console.log('');
  console.log('💡 Next steps:');
  console.log('   • Run: pnpm --filter web dev');
  console.log('   • Navigate to: http://localhost:3050/dashboard/inbox');
  console.log('   • Start your demo presentation!');
}

if (require.main === module) {
  setupDemo()
    .then(() => {
      console.log('✅ Demo setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error setting up demo:', error);
      process.exit(1);
    });
}

export { setupDemo }; 