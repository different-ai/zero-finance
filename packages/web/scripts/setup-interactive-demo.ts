import { db } from '../src/db';
import { 
  users, 
  gmailOAuthTokens,
  gmailProcessingPrefs,
  inboxCards,
  actionLedger,
  userClassificationSettings,
  cardActions,
  userFundingSources,
  userSafes
} from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as readline from 'readline';

// Helper function to ask for confirmation
function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question + ' (y/N): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function setupInteractiveDemo() {
  console.log('🎬 Setting up interactive demo environment...');

  const DEMO_USER_ID = process.env.DEMO_USER_PRIVY_DID || process.env.USER_PRIVY_DID;
  
  if (!DEMO_USER_ID) {
    console.error('❌ Please set DEMO_USER_PRIVY_DID or USER_PRIVY_DID environment variable');
    process.exit(1);
  }

  console.log(`👤 Demo user: ${DEMO_USER_ID}`);
  console.log('\n⚠️  WARNING: This will RESET all data for this user!');
  console.log('   - All inbox cards will be deleted');
  console.log('   - All action history will be cleared');
  console.log('   - All AI rules will be reset');
  console.log('   - Gmail connection will be reset\n');
  
  // Create timestamp for consistent demo data
  const now = new Date();
  
  const confirmed = await askConfirmation('Do you want to continue?');
  if (!confirmed) {
    console.log('❌ Demo setup cancelled');
    process.exit(0);
  }
  
  console.log('\n✅ Proceeding with demo setup...');

  try {
    // 1. Ensure user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.privyDid, DEMO_USER_ID),
    });

    if (!existingUser) {
      console.log('Creating user...');
      await db.insert(users).values({
        privyDid: DEMO_USER_ID,
        createdAt: new Date(),
      });
    }

    // 2. Create mock Gmail OAuth connection
    console.log('Setting up mock Gmail connection...');
    
    // Always delete and recreate to ensure clean state
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
    console.log('✓ Created mock Gmail OAuth connection');

    // 3. Enable Gmail processing
    console.log('Enabling Gmail processing...');
    
    // Delete and recreate to ensure clean state
    await db.delete(gmailProcessingPrefs).where(eq(gmailProcessingPrefs.userId, DEMO_USER_ID));
    await db.insert(gmailProcessingPrefs).values({
      userId: DEMO_USER_ID,
      isEnabled: true,
      activatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      keywords: ['invoice', 'receipt', 'payment', 'bill', 'order', 'statement'],
      lastSyncedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✓ Enabled Gmail processing with keywords');

    // 4. Clear ALL existing data for this user to ensure clean state
    console.log('Clearing ALL existing data for clean demo state...');
    
    // Delete all inbox cards
    await db.delete(inboxCards).where(eq(inboxCards.userId, DEMO_USER_ID));
    console.log('✓ Cleared inbox cards');
    
    // Delete all action ledger entries
    await db.delete(actionLedger).where(eq(actionLedger.approvedBy, DEMO_USER_ID));
    console.log('✓ Cleared action ledger');
    
    // Delete all card actions
    await db.delete(cardActions).where(eq(cardActions.userId, DEMO_USER_ID));
    console.log('✓ Cleared card actions');
    
    // Delete all classification settings
    await db.delete(userClassificationSettings).where(eq(userClassificationSettings.userId, DEMO_USER_ID));
    console.log('✓ Cleared classification settings');
    
    // Delete all funding sources
    await db.delete(userFundingSources).where(eq(userFundingSources.userPrivyDid, DEMO_USER_ID));
    console.log('✓ Cleared funding sources');
    
    // Delete all user safes
    await db.delete(userSafes).where(eq(userSafes.userDid, DEMO_USER_ID));
    console.log('✓ Cleared user safes');

    // 5. Create AI classification rules
    console.log('Creating AI classification rules...');
    const rules = [
      {
        id: uuidv4(),
        userId: DEMO_USER_ID,
        name: 'Sightglass Weekend Personal',
        prompt: 'If this is a receipt from Sightglass Coffee on a Saturday orSunday afternoon, mark it as a personal expense. Auto-ignore it.(not business).',
        enabled: true,
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: DEMO_USER_ID,
        name: 'Auto-Schedule Vendor Payments',
        prompt: 'If this is an invoice from Acme Corp or similar vendors, automatically schedule payment for 2 business days from now.',
        enabled: true,
        priority: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: DEMO_USER_ID,
        name: 'Filter Marketing Emails',
        prompt: 'If this appears to be a marketing newsletter or promotional email, automatically dismiss it.',
        enabled: true,
        priority: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.insert(userClassificationSettings).values(rules);

    // 6. Create demo user with complete onboarding data
    console.log('Setting up complete onboarding data...');
    
    // Create or update user with KYC approved and Align data
    await db.insert(users).values({
      privyDid: DEMO_USER_ID,
      alignCustomerId: 'demo-align-customer-' + Date.now(),
      kycProvider: 'align',
      kycStatus: 'approved',
      kycFlowLink: 'https://demo.align.co/kyc-completed',
      alignVirtualAccountId: 'demo-virtual-account-' + Date.now(),
      kycMarkedDone: true,
      kycSubStatus: 'kyc_form_submission_accepted',
      loopsContactSynced: true,
      createdAt: now,
    }).onConflictDoUpdate({
      target: users.privyDid,
      set: {
        alignCustomerId: 'demo-align-customer-' + Date.now(),
        kycProvider: 'align',
        kycStatus: 'approved',
        kycFlowLink: 'https://demo.align.co/kyc-completed',
        alignVirtualAccountId: 'demo-virtual-account-' + Date.now(),
        kycMarkedDone: true,
        kycSubStatus: 'kyc_form_submission_accepted',
        loopsContactSynced: true,
      },
    });
    console.log('✓ Updated user with KYC approved status');

    // Create primary safe for the user
    await db.insert(userSafes).values({
      id: uuidv4(),
      userDid: DEMO_USER_ID,
      safeAddress: '0xe51744895fA2c178044EAe9E7aFeC02D80ff1AB3', // Demo safe address
      safeType: 'primary',
      isEarnModuleEnabled: true,
      createdAt: now,
    });
    console.log('✓ Created primary safe');

    // 7. Create demo funding sources for payment testing
    console.log('Creating demo funding sources...');
    
    const fundingSources = [
      // US ACH Account
      {
        id: uuidv4(),
        userPrivyDid: DEMO_USER_ID,
        sourceProvider: 'align' as const,
        alignVirtualAccountIdRef: 'demo-align-usd-account',
        sourceAccountType: 'us_ach' as const,
        sourceCurrency: 'USD',
        sourceBankName: 'JPMorgan Chase Bank',
        sourceBankAddress: '270 Park Avenue, New York, NY 10017',
        sourceBankBeneficiaryName: 'Demo Business Account',
        sourceBankBeneficiaryAddress: '123 Business St, San Francisco, CA 94105',
        sourceAccountNumber: '****1234',
        sourceRoutingNumber: '021000021',
        sourcePaymentRail: 'ach_push',
        sourcePaymentRails: ['ach_push', 'wire'],
        destinationCurrency: 'USDC',
        destinationPaymentRail: 'base',
        destinationAddress: '0xe51744895fA2c178044EAe9E7aFeC02D80ff1AB3', // Demo safe address
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      // IBAN Account (EUR)
      {
        id: uuidv4(),
        userPrivyDid: DEMO_USER_ID,
        sourceProvider: 'align' as const,
        alignVirtualAccountIdRef: 'demo-align-eur-account',
        sourceAccountType: 'iban' as const,
        sourceCurrency: 'EUR',
        sourceBankName: 'Deutsche Bank AG',
        sourceBankAddress: 'Taunusanlage 12, 60325 Frankfurt am Main, Germany',
        sourceBankBeneficiaryName: 'Demo Business Account',
        sourceBankBeneficiaryAddress: '123 Business St, San Francisco, CA 94105',
        sourceIban: 'DE89370400440532013000',
        sourceBicSwift: 'DEUTDEFF',
        sourcePaymentRail: 'sepa_credit',
        sourcePaymentRails: ['sepa_credit', 'wire'],
        destinationCurrency: 'USDC',
        destinationPaymentRail: 'base',
        destinationAddress: '0xe51744895fA2c178044EAe9E7aFeC02D80ff1AB3', // Demo safe address
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      // UK Account (GBP)
      {
        id: uuidv4(),
        userPrivyDid: DEMO_USER_ID,
        sourceProvider: 'manual' as const,
        sourceAccountType: 'uk_details' as const,
        sourceCurrency: 'GBP',
        sourceBankName: 'Barclays Bank UK PLC',
        sourceBankAddress: '1 Churchill Place, London E14 5HP, United Kingdom',
        sourceBankBeneficiaryName: 'Demo Business Account',
        sourceBankBeneficiaryAddress: '123 Business St, San Francisco, CA 94105',
        sourceAccountNumber: '****5678',
        sourceSortCode: '20-00-00',
        sourcePaymentRail: 'faster_payments',
        sourcePaymentRails: ['faster_payments', 'chaps'],
        destinationCurrency: 'USDC',
        destinationPaymentRail: 'base',
        destinationAddress: '0xe51744895fA2c178044EAe9E7aFeC02D80ff1AB3', // Demo safe address
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const source of fundingSources) {
      await db.insert(userFundingSources).values(source);
    }
    console.log('✓ Created 3 demo funding sources (USD ACH, EUR IBAN, GBP UK)');

    // 8. Create demo inbox cards with realistic timing
    console.log('Creating demo inbox cards...');
    
    const cards = [
      // Pending cards (for demo flow)
      //
      {
        id: uuidv4(),
        cardId: `demo-card-${Date.now()}-2`,
        userId: DEMO_USER_ID,
        logId: `email-${Date.now()}-2`,
        sourceType: 'email',
        sourceDetails: {
          emailId: `demo-email-2`,
          subject: 'Invoice #2024-001 from Acme Corp',
          fromAddress: 'billing@acmecorp.com',
          receivedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        },
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        title: 'Acme Corp Invoice #2024-001',
        subtitle: 'Professional Services - Due in 30 days',
        icon: 'invoice',
        status: 'pending' as const,
        confidence: 98,
        requiresAction: true,
        suggestedActionLabel: 'Schedule Payment',
        parsedInvoiceData: {
          documentType: 'invoice',
          amount: 2500.00,
          currency: 'USD',
          sellerName: 'Acme Corp',
          invoiceNumber: '2024-001',
          dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cardTitle: 'Acme Corp Invoice #2024-001',
          confidence: 98,
        },
        rationale: 'Invoice from known vendor',
        chainOfThought: ['Identified as invoice', 'Amount: $2,500', 'Due in 30 days'],
        impact: {},
        amount: '2500.00',
        currency: 'USD',
        fromEntity: 'Acme Corp',
        paymentStatus: 'unpaid' as const,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        hasAttachments: true,
        attachmentUrls: ['https://demo.blob.core.windows.net/demo-invoice.pdf'],
        codeHash: 'demo-v1',
        subjectHash: null,
        appliedClassifications: [],
        classificationTriggered: false,
        autoApproved: false,
        categories: [],
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      },
      {
        id: uuidv4(),
        cardId: `demo-card-${Date.now()}-3`,
        userId: DEMO_USER_ID,
        logId: `email-${Date.now()}-3`,
        sourceType: 'email',
        sourceDetails: {
          emailId: `demo-email-3`,
          subject: '🎉 Special offer just for you!',
          fromAddress: 'marketing@techproducts.com',
          receivedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        },
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
        title: 'TechProducts Marketing Newsletter',
        subtitle: 'Special holiday offers inside',
        icon: 'email',
        status: 'pending' as const,
        confidence: 85,
        requiresAction: true,
        suggestedActionLabel: 'Dismiss',
        parsedInvoiceData: {
          documentType: 'other_document',
          confidence: 85,
        },
        rationale: 'Marketing email detected',
        chainOfThought: ['Identified as marketing content', 'No financial data found'],
        impact: {},
        fromEntity: 'TechProducts',
        paymentStatus: 'not_applicable' as const,
        hasAttachments: false,
        attachmentUrls: [],
        codeHash: 'demo-v1',
        subjectHash: null,
        appliedClassifications: [],
        classificationTriggered: false,
        autoApproved: false,
        categories: [],
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      },
      // History cards (already processed)
      {
        id: uuidv4(),
        cardId: `demo-card-${Date.now()}-4`,
        userId: DEMO_USER_ID,
        logId: `email-${Date.now()}-4`,
        sourceType: 'email',
        sourceDetails: {
          emailId: `demo-email-4`,
          subject: 'AWS Monthly Bill',
          fromAddress: 'billing@aws.amazon.com',
          receivedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        },
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        title: 'AWS Monthly Bill - $543.21',
        subtitle: 'Cloud services for December 2024',
        icon: 'invoice',
        status: 'executed' as const,
        confidence: 99,
        requiresAction: false,
        parsedInvoiceData: {
          documentType: 'invoice',
          amount: 543.21,
          currency: 'USD',
          sellerName: 'Amazon Web Services',
          confidence: 99,
        },
        rationale: 'Monthly cloud services bill',
        chainOfThought: ['Identified as AWS bill', 'Auto-paid via saved card'],
        impact: {},
        amount: '543.21',
        currency: 'USD',
        fromEntity: 'Amazon Web Services',
        paymentStatus: 'paid' as const,
        paidAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        hasAttachments: true,
        attachmentUrls: ['https://demo.blob.core.windows.net/aws-bill.pdf'],
        codeHash: 'demo-v1',
        subjectHash: null,
        appliedClassifications: [],
        classificationTriggered: false,
        autoApproved: false,
        categories: ['cloud-services', 'infrastructure'],
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: uuidv4(),
        cardId: `demo-card-${Date.now()}-5`,
        userId: DEMO_USER_ID,
        logId: `email-${Date.now()}-5`,
        sourceType: 'email',
        sourceDetails: {
          emailId: `demo-email-5`,
          subject: 'Your Uber receipt',
          fromAddress: 'receipts@uber.com',
          receivedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        },
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        title: 'Uber Receipt - $18.50',
        subtitle: 'Trip from Downtown to Airport',
        icon: 'receipt',
        status: 'seen' as const,
        confidence: 97,
        requiresAction: false,
        parsedInvoiceData: {
          documentType: 'receipt',
          amount: 18.50,
          currency: 'USD',
          sellerName: 'Uber',
          confidence: 97,
        },
        rationale: 'Transportation receipt',
        chainOfThought: ['Identified as Uber receipt', 'Categorized as travel expense'],
        impact: {},
        amount: '18.50',
        currency: 'USD',
        fromEntity: 'Uber',
        paymentStatus: 'paid' as const,
        hasAttachments: false,
        attachmentUrls: [],
        codeHash: 'demo-v1',
        subjectHash: null,
        appliedClassifications: [],
        classificationTriggered: false,
        autoApproved: false,
        categories: ['travel', 'transportation'],
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const card of cards) {
      await db.insert(inboxCards).values(card);
    }

    // 7. Create action history for processed cards (for Card Actions tab)
    console.log('Creating action history...');
    
    // Actions for AWS bill (index 2)
    await db.insert(cardActions).values({
      id: uuidv4(),
      cardId: cards[2].cardId,
      userId: DEMO_USER_ID,
      actionType: 'ai_classified',
      actor: 'ai',
      actorDetails: {
        aiModel: 'gpt-4',
        confidence: 99,
        ruleName: 'Auto-pay cloud services',
      },
      newValue: {
        categories: ['cloud-services', 'infrastructure'],
        autoApprove: true,
      },
      details: {
        reason: 'Recognized as recurring AWS bill',
      },
      status: 'success',
      performedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    });

    await db.insert(cardActions).values({
      id: uuidv4(),
      cardId: cards[2].cardId,
      userId: DEMO_USER_ID,
      actionType: 'executed',
      actor: 'system',
      previousValue: { status: 'pending' },
      newValue: { status: 'executed' },
      details: {
        paymentMethod: 'saved_card',
        transactionId: 'demo-tx-123',
      },
      status: 'success',
      performedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    });

    // Actions for Uber receipt (index 3)
    await db.insert(cardActions).values({
      id: uuidv4(),
      cardId: cards[3].cardId,
      userId: DEMO_USER_ID,
      actionType: 'marked_seen',
      actor: 'human',
      previousValue: { status: 'pending' },
      newValue: { status: 'seen' },
      status: 'success',
      performedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 60000), // 1 minute after creation
    });

    await db.insert(cardActions).values({
      id: uuidv4(),
      cardId: cards[3].cardId,
      userId: DEMO_USER_ID,
      actionType: 'category_added',
      actor: 'human',
      newValue: { categories: ['travel', 'transportation'] },
      status: 'success',
      performedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 120000), // 2 minutes after creation
    });

    // 8. Create action ledger entries (for enhanced view)
    console.log('Creating action ledger entries...');
    
    // Action ledger for AWS bill (index 2)
    await db.insert(actionLedger).values({
      approvedBy: DEMO_USER_ID,
      inboxCardId: cards[2].cardId,
      actionTitle: 'Auto-paid: AWS Monthly Bill',
      actionSubtitle: 'Cloud services for December 2024',
      actionType: 'payment',
      sourceType: 'email',
      sourceDetails: cards[2].sourceDetails,
      amount: '543.21',
      currency: 'USD',
      confidence: 99,
      rationale: 'Recurring cloud services bill auto-approved',
      chainOfThought: cards[2].chainOfThought,
      originalCardData: cards[2] as any,
      parsedInvoiceData: cards[2].parsedInvoiceData,
      status: 'executed',
      executionDetails: {
        paymentMethod: 'saved_card',
        transactionId: 'demo-tx-123',
        processedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      executedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    });

    console.log('\n✅ Interactive demo setup complete!');
    console.log('\n📊 Demo Data Summary:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ ONBOARDING STATUS ✅ COMPLETED                          │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ ✅ Smart Account Created                                │');
    console.log('│ ✅ Identity Verified (KYC Approved)                    │');
    console.log('│ ✅ Virtual Bank Accounts Set Up                        │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
    console.log('\n┌─────────────────────────────────────────────────────────┐');
    console.log('│ PENDING ITEMS (2)                                       │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 1. Acme Corp Invoice #2024-001 - $2,500                │');
    console.log('│    → Will schedule payment for 2 business days         │');
    console.log('│    → 💳 Try the Pay action!                            │');
    console.log('│                                                         │');
    console.log('│ 2. TechProducts Marketing Newsletter                    │');
    console.log('│    → Will auto-dismiss as spam                         │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
    console.log('\n┌─────────────────────────────────────────────────────────┐');
    console.log('│ HISTORY ITEMS (2)                                       │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ • AWS Monthly Bill - $543.21 (Auto-paid)               │');
    console.log('│ • Uber Receipt - $18.50 (Categorized)                  │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
    console.log('\n┌─────────────────────────────────────────────────────────┐');
    console.log('│ AI CLASSIFICATION RULES (3)                             │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ • Sightglass Weekend Personal                          │');
    console.log('│ • Auto-Schedule Vendor Payments                        │');
    console.log('│ • Filter Marketing Emails                              │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
    console.log('\n┌─────────────────────────────────────────────────────────┐');
    console.log('│ FUNDING SOURCES (3)                                     │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ • JPMorgan Chase (USD ACH) - ****1234                  │');
    console.log('│ • Deutsche Bank (EUR IBAN) - DE89...3000               │');
    console.log('│ • Barclays Bank (GBP UK) - ****5678                    │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
    console.log('\n🚀 Start your demo at: http://localhost:3050/dashboard/inbox');
    console.log('\n💳 Test the Pay action on the Acme Corp invoice!');
    console.log('\n📖 See DEMO-GUIDE.md for the complete demo script');

  } catch (error) {
    console.error('❌ Error setting up demo:', error);
    process.exit(1);
  }
}

// Run the setup
setupInteractiveDemo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 