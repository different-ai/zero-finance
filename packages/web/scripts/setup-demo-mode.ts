import { db } from '../src/db';
import { 
  users, 
  gmailOAuthTokens,
  gmailProcessingPrefs,
  inboxCards,
  actionLedger,
  userClassificationSettings
} from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

async function setupDemoMode() {
  console.log('🎬 Setting up complete demo mode with mock data...');

  const DEMO_USER_ID = process.env.DEMO_USER_PRIVY_DID || process.env.USER_PRIVY_DID;
  
  if (!DEMO_USER_ID) {
    console.error('❌ Please set DEMO_USER_PRIVY_DID or USER_PRIVY_DID environment variable');
    process.exit(1);
  }

  console.log(`👤 Setting up demo for user: ${DEMO_USER_ID}`);

  try {
    // 1. Ensure user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.privyDid, DEMO_USER_ID),
    });

    if (!existingUser) {
      await db.insert(users).values({
        privyDid: DEMO_USER_ID,
        createdAt: new Date(),
      });
      console.log('✅ Created demo user account');
    }

    // 2. Create mock Gmail OAuth tokens
    await db.delete(gmailOAuthTokens).where(eq(gmailOAuthTokens.userPrivyDid, DEMO_USER_ID));
    await db.insert(gmailOAuthTokens).values({
      userPrivyDid: DEMO_USER_ID,
      accessToken: 'demo_access_token_for_presentation',
      refreshToken: 'demo_refresh_token_for_presentation', 
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('📧 Created mock Gmail OAuth connection');

    // 3. Set up Gmail processing preferences
    await db.delete(gmailProcessingPrefs).where(eq(gmailProcessingPrefs.userId, DEMO_USER_ID));
    await db.insert(gmailProcessingPrefs).values({
      userId: DEMO_USER_ID,
      isEnabled: true,
      activatedAt: new Date(),
      keywords: ['invoice', 'receipt', 'bill', 'payment', 'order', 'statement'],
      lastSyncedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('⚙️ Configured Gmail processing preferences');

    // 4. Clean up existing data
    await db.delete(userClassificationSettings).where(eq(userClassificationSettings.userId, DEMO_USER_ID));
    await db.delete(inboxCards).where(eq(inboxCards.userId, DEMO_USER_ID));
    await db.delete(actionLedger).where(eq(actionLedger.approvedBy, DEMO_USER_ID));

    // 5. Create demo classification rules
    const classificationRules = [
      {
        id: uuidv4(),
        userId: DEMO_USER_ID,
        name: 'Sightglass Weekend Personal',
        prompt: 'If this is a receipt from Sightglass Coffee on a weekend afternoon, mark it as a personal expense and auto-approve it. Personal expenses should be categorized separately from business expenses.',
        enabled: true,
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: DEMO_USER_ID,
        name: 'Auto-Schedule Vendor Payments',
        prompt: 'For invoices from vendors (like Acme Corp, suppliers, or service providers), automatically schedule payment for 2 business days from now. This gives time for review while ensuring timely payment.',
        enabled: true,
        priority: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: DEMO_USER_ID,
        name: 'Filter Marketing Emails',
        prompt: 'Automatically dismiss promotional emails, newsletters, and marketing content that don\'t contain actionable financial information.',
        enabled: true,
        priority: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.insert(userClassificationSettings).values(classificationRules);
    console.log('🤖 Created demo AI classification rules');

    // 6. Create demo inbox cards
    const now = new Date();
    const demoCards = [
      {
        id: uuidv4(),
        userId: DEMO_USER_ID,
        cardId: uuidv4(),
        icon: 'receipt' as const,
        title: 'Sightglass Coffee - $12.45',
        subtitle: 'Weekend coffee expense - Auto-categorized as personal',
        confidence: 95,
        status: 'executed' as const,
        blocked: false,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        requiresAction: false,
        suggestedActionLabel: 'Review',
        amount: '12.45',
        currency: 'USD',
        fromEntity: 'Sightglass Coffee',
        toEntity: DEMO_USER_ID,
        paymentStatus: 'not_applicable' as const,
        expenseCategory: 'personal',
        addedToExpenses: true,
        expenseAddedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        appliedClassifications: [
          {
            id: classificationRules[0].id,
            name: 'Sightglass Weekend Personal',
            matched: true,
            confidence: 95,
            actions: ['add_to_expenses', 'set_category_personal']
          }
        ],
        classificationTriggered: true,
        autoApproved: true,
        categories: ['personal', 'food'],
        logId: 'demo_sightglass_receipt',
        subjectHash: null,
        rationale: 'Receipt from Sightglass Coffee on weekend afternoon, automatically categorized as personal expense per user rules.',
        codeHash: 'demo-processor-v1',
        chainOfThought: ['Detected receipt from Sightglass Coffee', 'Matched weekend personal expense rule', 'Auto-approved and categorized'],
        impact: { currentBalance: 0, postActionBalance: 0 },
        parsedInvoiceData: {
          documentType: 'receipt' as const,
          extractedTitle: 'Sightglass Coffee Receipt',
          extractedSummary: 'Coffee purchase on weekend',
          amount: 12.45,
          currency: 'USD',
          confidence: 95,
          requiresAction: false,
          aiRationale: 'Personal coffee expense detected and auto-categorized'
        },
        sourceType: 'email' as const,
        sourceDetails: {
          name: 'Gmail',
          provider: 'gmail',
          emailId: 'demo_sightglass_email',
          fromAddress: 'receipts@sightglasscoffee.com',
          subject: 'Your Sightglass Coffee Receipt - $12.45',
          receivedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          snippet: 'Thank you for your purchase at Sightglass Coffee...'
        },
        hasAttachments: false,
        attachmentUrls: [],
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        id: uuidv4(),
        userId: DEMO_USER_ID,
        cardId: uuidv4(),
        icon: 'invoice' as const,
        title: 'Acme Corp Invoice #INV-2024-001 - $2,500.00',
        subtitle: 'Payment scheduled for 2 business days - Auto-approved',
        confidence: 92,
        status: 'executed' as const,
        blocked: false,
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        requiresAction: false,
        suggestedActionLabel: 'Review Payment',
        amount: '2500.00',
        currency: 'USD',
        fromEntity: 'Acme Corp',
        toEntity: DEMO_USER_ID,
        paymentStatus: 'scheduled' as const,
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        appliedClassifications: [
          {
            id: classificationRules[1].id,
            name: 'Auto-Schedule Vendor Payments',
            matched: true,
            confidence: 92,
            actions: ['schedule_payment', 'approve']
          }
        ],
        classificationTriggered: true,
        autoApproved: true,
        categories: ['vendor', 'business'],
        logId: 'demo_acme_invoice',
        subjectHash: null,
        rationale: 'Invoice from Acme Corp automatically scheduled for payment in 2 business days per vendor payment rules.',
        codeHash: 'demo-processor-v1',
        chainOfThought: ['Detected invoice from vendor', 'Matched auto-payment scheduling rule', 'Scheduled payment for 2 business days'],
        impact: { currentBalance: 0, postActionBalance: -2500 },
        parsedInvoiceData: {
          documentType: 'invoice' as const,
          extractedTitle: 'Acme Corp Invoice #INV-2024-001',
          extractedSummary: 'Professional services invoice',
          amount: 2500.00,
          currency: 'USD',
          confidence: 92,
          requiresAction: false,
          aiRationale: 'Vendor invoice auto-scheduled for payment',
          invoiceNumber: 'INV-2024-001',
          sellerName: 'Acme Corp',
          buyerName: 'Demo User',
          dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        sourceType: 'email' as const,
        sourceDetails: {
          name: 'Gmail',
          provider: 'gmail',
          emailId: 'demo_acme_invoice',
          fromAddress: 'billing@acmecorp.com',
          subject: 'Invoice INV-2024-001 from Acme Corp - $2,500.00',
          receivedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          snippet: 'Please find attached your invoice for professional services...'
        },
        hasAttachments: true,
        attachmentUrls: ['https://demo.example.com/acme-invoice.pdf'],
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
      {
        id: uuidv4(),
        userId: DEMO_USER_ID,
        cardId: uuidv4(),
        icon: 'email' as const,
        title: 'Weekly Newsletter - Dismissed',
        subtitle: 'Marketing email auto-filtered - No action needed',
        confidence: 88,
        status: 'dismissed' as const,
        blocked: false,
        timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
        requiresAction: false,
        suggestedActionLabel: null,
        amount: null,
        currency: null,
        fromEntity: 'TechCorp Newsletter',
        toEntity: DEMO_USER_ID,
        paymentStatus: 'not_applicable' as const,
        appliedClassifications: [
          {
            id: classificationRules[2].id,
            name: 'Filter Marketing Emails',
            matched: true,
            confidence: 88,
            actions: ['dismiss', 'ignore']
          }
        ],
        classificationTriggered: true,
        autoApproved: true,
        categories: ['marketing', 'dismissed'],
        logId: 'demo_newsletter',
        subjectHash: null,
        rationale: 'Marketing newsletter automatically dismissed as it contains no actionable financial information.',
        codeHash: 'demo-processor-v1',
        chainOfThought: ['Detected marketing newsletter', 'Matched spam filter rule', 'Auto-dismissed'],
        impact: { currentBalance: 0, postActionBalance: 0 },
        parsedInvoiceData: null,
        sourceType: 'email' as const,
        sourceDetails: {
          name: 'Gmail',
          provider: 'gmail',
          emailId: 'demo_newsletter',
          fromAddress: 'newsletter@techcorp.com',
          subject: 'Weekly Tech Updates - Don\'t Miss Out!',
          receivedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          snippet: 'This week in tech: AI breakthroughs, new product launches...'
        },
        hasAttachments: false,
        attachmentUrls: [],
        createdAt: new Date(now.getTime() - 30 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
      }
    ];

    await db.insert(inboxCards).values(demoCards);
    console.log('📥 Created demo inbox cards');

    // 7. Create corresponding action log entries
    const actionEntries = [
      {
        id: uuidv4(),
        approvedBy: DEMO_USER_ID,
        inboxCardId: demoCards[0].cardId,
        actionTitle: 'Auto-categorized: Sightglass Coffee Receipt',
        actionSubtitle: 'Matched personal expense rule - Added to expenses',
        actionType: 'classification_auto_approved',
        sourceType: 'email' as const,
        sourceDetails: demoCards[0].sourceDetails,
        amount: '12.45',
        currency: 'USD',
        confidence: 95,
        rationale: 'Personal weekend coffee expense detected and auto-categorized',
        originalCardData: demoCards[0],
        status: 'executed' as const,
        executionDetails: {
          classificationResults: {
            matched: [{ name: 'Sightglass Weekend Personal', confidence: 95 }],
            autoApproved: true,
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          }
        },
        executedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        metadata: {
          aiProcessing: {
            documentType: 'receipt',
            aiConfidence: 95,
            ruleMatched: 'Sightglass Weekend Personal'
          }
        }
      },
      {
        id: uuidv4(),
        approvedBy: DEMO_USER_ID,
        inboxCardId: demoCards[1].cardId,
        actionTitle: 'Payment Scheduled: Acme Corp Invoice',
        actionSubtitle: 'Auto-scheduled for 2 business days - $2,500.00',
        actionType: 'payment_scheduled',
        sourceType: 'email' as const,
        sourceDetails: demoCards[1].sourceDetails,
        amount: '2500.00',
        currency: 'USD',
        confidence: 92,
        rationale: 'Vendor invoice auto-scheduled for payment per business rules',
        originalCardData: demoCards[1],
        status: 'executed' as const,
        executionDetails: {
          paymentDetails: {
            scheduledFor: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            paymentMethod: 'ach',
            canCancel: true,
            businessDaysDelay: 2
          }
        },
        executedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        metadata: {
          aiProcessing: {
            documentType: 'invoice',
            aiConfidence: 92,
            ruleMatched: 'Auto-Schedule Vendor Payments'
          }
        }
      },
      {
        id: uuidv4(),
        approvedBy: DEMO_USER_ID,
        inboxCardId: demoCards[2].cardId,
        actionTitle: 'Email Filtered: Marketing Newsletter',
        actionSubtitle: 'Auto-dismissed spam/marketing content',
        actionType: 'classification_auto_approved',
        sourceType: 'email' as const,
        sourceDetails: demoCards[2].sourceDetails,
        amount: null,
        currency: null,
        confidence: 88,
        rationale: 'Marketing content automatically filtered out',
        originalCardData: demoCards[2],
        status: 'executed' as const,
        executionDetails: {
          classificationResults: {
            matched: [{ name: 'Filter Marketing Emails', confidence: 88 }],
            autoApproved: true,
            timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          }
        },
        executedAt: new Date(now.getTime() - 30 * 60 * 1000),
        createdAt: new Date(now.getTime() - 30 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
        metadata: {
          aiProcessing: {
            documentType: 'other_document',
            aiConfidence: 88,
            ruleMatched: 'Filter Marketing Emails'
          }
        }
      }
    ];

    await db.insert(actionLedger).values(actionEntries);
    console.log('📋 Created demo action log entries');

    console.log('\n🎉 Demo mode setup complete!');
    console.log('\n📊 Demo Summary:');
    console.log(`   • Mock Gmail connection established`);
    console.log(`   • ${classificationRules.length} AI classification rules active`);
    console.log(`   • ${demoCards.length} demo inbox cards created`);
    console.log(`   • ${actionEntries.length} action log entries for decision trail`);
    
    console.log('\n🎬 Demo Flow Ready:');
    console.log('   1. Sightglass receipt → Auto-categorized as personal expense');
    console.log('   2. Acme invoice → Auto-scheduled payment for 2 business days');
    console.log('   3. Marketing email → Auto-filtered and dismissed');
    console.log('   4. Full decision trail visible in action log');

    console.log('\n🚀 Next Steps:');
    console.log('   • Navigate to: http://localhost:3050/dashboard/inbox');
    console.log('   • Switch between Pending/History/Card Actions tabs');
    console.log('   • Show the AI decision transparency');
    console.log('   • Demo the document upload flow');

  } catch (error) {
    console.error('❌ Error setting up demo mode:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  setupDemoMode()
    .then(() => {
      console.log('✅ Demo mode setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Demo mode setup failed:', error);
      process.exit(1);
    });
}

export { setupDemoMode }; 