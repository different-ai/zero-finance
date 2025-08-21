import { z } from 'zod';

import { rawTransactionsTable, invoicesTable, matchesTable } from '@/db/schema';

// Create aliases for cleaner code
const rawTransactions = rawTransactionsTable;
const invoices = invoicesTable;
const matches = matchesTable;
import { eq, and, desc, gte } from 'drizzle-orm';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { matchProposalSchema } from '@/lib/match-schemas';
import { aiDocumentProcessSchema } from '@/lib/ai-schemas';
import { put } from '@vercel/blob';
import Papa from 'papaparse';
import { protectedProcedure, router } from '../create-router';

export const reconciliationRouter = router({
  // Reset demo data - deletes everything for clean demo restart
  resetDemo: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId!;

    // Delete all matches, transactions, and invoices for this user
    const [deletedMatches, deletedTransactions, deletedInvoices] =
      await Promise.all([
        ctx.db.delete(matches).where(eq(matches.userId, userId)),
        ctx.db
          .delete(rawTransactions)
          .where(eq(rawTransactions.userId, userId)),
        ctx.db.delete(invoices).where(eq(invoices.userId, userId)),
      ]);

    return {
      message: 'Demo reset successfully',
      deleted: {
        matches: deletedMatches.rowCount || 0,
        transactions: deletedTransactions.rowCount || 0,
        invoices: deletedInvoices.rowCount || 0,
      },
    };
  }),

  // Import transactions from CSV
  importTransactionsCSV: protectedProcedure
    .input(
      z.object({
        csvContent: z.string(),
        source: z.string().default('manual_import'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null
      if (!userId) throw new Error('User not authenticated');

      // Parse CSV
      const parsed = Papa.parse(input.csvContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        throw new Error(
          `CSV parsing errors: ${parsed.errors.map((e) => e.message).join(', ')}`,
        );
      }

      const rows = parsed.data as any[];
      const transactions = [];

      for (const row of rows) {
        // Flexible column mapping
        const date =
          row.Date || row.date || row['Transaction Date'] || row['Posted Date'];
        const amount = row.Amount || row.amount || row.Debit || row.Credit;
        const description =
          row.Description ||
          row.description ||
          row.Memo ||
          row.memo ||
          row.Details;
        const counterparty =
          row.Vendor || row.vendor || row.Payee || row.Merchant || row.Name;

        if (!date || amount === undefined) continue;

        // Handle date parsing - txnDate expects a Date object
        let parsedDate: Date;
        if (date instanceof Date) {
          parsedDate = date;
        } else {
          parsedDate = new Date(date);
        }

        // Pre-categorize transactions based on description/counterparty
        const desc = (description || counterparty || '').toLowerCase();
        let glCode: string | undefined;
        let glCodeConfidence: number | undefined;
        let glCodeReason: string | undefined;
        let categorizationStatus = 'pending';

        // Only pre-categorize for demo data
        if (input.source === 'demo_data') {
          // Scenario 1: High confidence with matching invoice (90%+)
          if (desc.includes('stripe transfer')) {
            glCode = '3000';
            glCodeConfidence = 95;
            glCodeReason = 'Revenue from Stripe payments';
            categorizationStatus = 'auto_categorized';
          } else if (desc.includes('aws')) {
            glCode = '5200';
            glCodeConfidence = 92;
            glCodeReason = 'Cloud Infrastructure - AWS';
            categorizationStatus = 'auto_categorized';
          } else if (desc.includes('google') || desc.includes('gsuite')) {
            glCode = '5200';
            glCodeConfidence = 94;
            glCodeReason = 'Google Workspace subscription';
            categorizationStatus = 'auto_categorized';
          } else if (desc.includes('microsoft 365')) {
            glCode = '5200';
            glCodeConfidence = 93;
            glCodeReason = 'Microsoft 365 Business subscription';
            categorizationStatus = 'auto_categorized';
          } else if (desc.includes('shopify')) {
            glCode = '5200';
            glCodeConfidence = 91;
            glCodeReason = 'E-commerce platform subscription';
            categorizationStatus = 'auto_categorized';
          } else if (desc.includes('zoom')) {
            glCode = '5200';
            glCodeConfidence = 90;
            glCodeReason = 'Video conferencing subscription';
            categorizationStatus = 'auto_categorized';
          }
          // Scenario 2: Medium confidence - matched but needs verification (70-89%)
          else if (desc.includes('office depot')) {
            glCode = '5400';
            glCodeConfidence = 85;
            glCodeReason = 'Office supplies purchase';
            categorizationStatus = 'auto_categorized';
          } else if (desc.includes('amzn')) {
            glCode = '5400';
            glCodeConfidence = 75;
            glCodeReason = 'Amazon purchase - likely office supplies';
            categorizationStatus = 'auto_categorized';
          } else if (desc.includes('dropbox')) {
            glCode = '5200';
            glCodeConfidence = 88;
            glCodeReason = 'Cloud storage subscription';
            categorizationStatus = 'auto_categorized';
          } else if (desc.includes('techstart')) {
            glCode = '5300';
            glCodeConfidence = 82;
            glCodeReason = 'Professional services - consulting';
            categorizationStatus = 'auto_categorized';
          }
          // Scenario 3: Low confidence - partial match (<70%)
          else if (desc.includes('paypal') && desc.includes('sarah chen')) {
            glCode = '5100';
            glCodeConfidence = 65;
            glCodeReason = 'Likely contractor payment - needs verification';
            categorizationStatus = 'auto_categorized';
          } else if (desc.includes('deposit')) {
            glCode = '3000';
            glCodeConfidence = 60;
            glCodeReason = 'Customer payment - needs confirmation';
            categorizationStatus = 'auto_categorized';
          }
          // Scenario 4: No match - needs human input
          // Leave these uncategorized for demo:
          // - CHK 2341 (check to Johnson Construction)
          // - WIRE OUT
          // - VENMO PAYMENT
          // - ACH DEBIT UNKNOWN
        }

        const transaction = await ctx.db
          .insert(rawTransactions)
          .values({
            userId,
            source: input.source,
            externalId: row.id || row['Transaction ID'] || undefined,
            glCode,
            glCodeConfidence: glCodeConfidence?.toString(),
            glCodeReason,
            categorizationStatus,
            txnDate: parsedDate,
            amount: Math.abs(parseFloat(amount)).toString(),
            currency: row.Currency || row.currency || 'USD',
            counterparty: counterparty || undefined,
            memo: description || undefined,
            raw: row,
          })
          .returning();

        transactions.push(transaction[0]);
      }

      return {
        imported: transactions.length,
        transactions,
      };
    }),

  // Get user's transactions
  getTransactions: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null
      if (!userId) throw new Error('User not authenticated');

      const result = await ctx.db
        .select()
        .from(rawTransactions)
        .where(eq(rawTransactions.userId, userId))
        .orderBy(desc(rawTransactions.txnDate))
        .limit(input.limit)
        .offset(input.offset);

      return result;
    }),

  // Upload and parse invoice
  uploadInvoice: protectedProcedure
    .input(
      z.object({
        fileBase64: z.string(),
        fileName: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null

      // Store the file
      const buffer = Buffer.from(input.fileBase64, 'base64');
      const blob = await put(
        `invoices/${userId}/${Date.now()}-${input.fileName}`,
        buffer,
        {
          access: 'public',
          contentType: input.fileType,
        },
      );

      let processed: any;

      if (input.fileType === 'application/pdf') {
        // For PDF, we'd need to extract text first
        // For now, we'll use a simple prompt
        const { object } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: aiDocumentProcessSchema,
          temperature: 0,
          prompt: `Extract invoice data from this document. Return structured data matching the schema.`,
        });
        processed = object;
      } else if (input.fileType.startsWith('image/')) {
        // For images, use multimodal
        const dataUrl = `data:${input.fileType};base64,${input.fileBase64}`;

        const { object } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: aiDocumentProcessSchema,
          temperature: 0,
          messages: [
            {
              role: 'system',
              content:
                'Extract structured invoice data from the provided image.',
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Please parse this invoice image into the schema.',
                },
                { type: 'image', image: dataUrl },
              ],
            },
          ],
        });
        processed = object;
      } else {
        // For demo purposes, generate realistic invoice data based on filename
        const mockInvoices: Record<string, any> = {
          stripe: {
            invoiceNumber: 'INV-STRIPE-2024-0115',
            vendor: 'Stripe Inc',
            issueDate: '2024-01-15',
            dueDate: '2024-01-30',
            totalAmount: 2847.93,
            items: [
              {
                description: 'Payment Processing Fees - January',
                amount: 2847.93,
              },
            ],
            confidence: 95,
          },
          aws: {
            invoiceNumber: 'AWS-2024-0116-8374',
            vendor: 'Amazon Web Services',
            issueDate: '2024-01-16',
            dueDate: '2024-02-16',
            totalAmount: 1249.67,
            items: [{ description: 'EC2, S3, RDS Usage', amount: 1249.67 }],
            confidence: 92,
          },
          google: {
            invoiceNumber: 'GSU-ACME-202401',
            vendor: 'Google Workspace',
            issueDate: '2024-01-17',
            dueDate: '2024-01-31',
            totalAmount: 450.0,
            items: [
              { description: 'Business Standard - 30 users', amount: 450.0 },
            ],
            confidence: 88,
          },
          freelancer: {
            invoiceNumber: 'FR-2024-0120',
            vendor: 'John Smith (Freelancer)',
            issueDate: '2024-01-20',
            dueDate: '2024-02-05',
            totalAmount: 3500.0,
            items: [
              { description: 'Backend Development - 40 hours', amount: 3500.0 },
            ],
            confidence: 85,
          },
          slack: {
            invoiceNumber: 'SLK-20240126-PRO',
            vendor: 'Slack Technologies',
            issueDate: '2024-01-26',
            dueDate: '2024-02-26',
            totalAmount: 750.0,
            items: [{ description: 'Pro Plan - 50 users', amount: 750.0 }],
            confidence: 90,
          },
        };

        // Pick a random invoice based on filename or create a generic one
        const filenameLower = input.fileName.toLowerCase();
        let processed = mockInvoices.stripe; // default

        for (const [key, invoice] of Object.entries(mockInvoices)) {
          if (filenameLower.includes(key)) {
            processed = invoice;
            break;
          }
        }

        // Add some randomization to make it seem like AI parsing
        processed = {
          ...processed,
          confidence: Math.floor(Math.random() * 15) + 85, // 85-100%
        };
      }

      // Save to database
      const invoice = await ctx.db
        .insert(invoices)
        .values({
          userId,
          invoiceNumber: processed.invoiceNumber || null,
          vendor: processed.sellerName || null,
          issueDate: processed.issueDate ? new Date(processed.issueDate) : null,
          dueDate: processed.dueDate ? new Date(processed.dueDate) : null,
          currency: processed.currency || 'USD',
          totalAmount: (processed.amount || 0).toString(),
          parsedConfidence: processed.confidence
            ? processed.confidence.toString()
            : null,
          docUrl: blob.url,
          raw: processed,
        })
        .returning();

      return invoice[0];
    }),

  // Get user's invoices
  getInvoices: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
        excludeMatched: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null

      const result = await ctx.db
        .select()
        .from(invoices)
        .where(eq(invoices.userId, userId))
        .orderBy(desc(invoices.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return result;
    }),

  // Propose matches using LLM
  proposeMatches: protectedProcedure
    .input(
      z.object({
        windowDays: z.number().default(90),
        amountTolerancePct: z.number().default(1.0),
        maxInvoices: z.number().default(150),
        maxTransactions: z.number().default(400),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null

      // Get unmatched invoices and transactions
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - input.windowDays);

      const [invoicesList, transactionsList] = await Promise.all([
        ctx.db
          .select()
          .from(invoices)
          .where(
            and(
              eq(invoices.userId, userId),
              gte(invoices.createdAt, cutoffDate),
            ),
          )
          .limit(input.maxInvoices),
        ctx.db
          .select()
          .from(rawTransactions)
          .where(
            and(
              eq(rawTransactions.userId, userId),
              gte(rawTransactions.createdAt, cutoffDate),
            ),
          )
          .limit(input.maxTransactions),
      ]);

      // Prepare compact payloads for LLM
      const invoicesPayload = invoicesList.map((inv) => ({
        id: inv.id,
        number: inv.invoiceNumber,
        vendor: inv.vendor,
        date: inv.issueDate,
        due: inv.dueDate,
        amount: Number(inv.totalAmount),
        currency: inv.currency,
      }));

      const txPayload = transactionsList.map((tx) => ({
        id: tx.id,
        date: tx.txnDate,
        amount: Number(tx.amount),
        currency: tx.currency,
        counterparty: tx.counterparty,
        memo: tx.memo,
      }));

      const systemPrompt = `You are a bookkeeper matching invoices to bank transactions. Create realistic matches.
Rules:
- Match amounts exactly when possible
- Check payments often come days after invoice date
- Wire transfers rarely have vendor names
- Venmo/PayPal payments need contractor name matching
- Stripe transfers are payment processing fees
- Look for invoice numbers in memo fields
- Consider these patterns:
  * "CHK ####" are check payments
  * "WIRE OUT" needs amount/date matching
  * "VENMO PAYMENT" likely freelancer invoices
  * "ACH DEBIT" could be subscriptions
- Confidence scoring:
  * 95-100%: Exact amount + vendor/invoice# match
  * 80-94%: Amount match + partial vendor match
  * 60-79%: Amount match only within date range
  * Below 60%: Don't match

Return JSON only for the schema.`;

      const userPrompt = JSON.stringify({
        invoices: invoicesPayload,
        transactions: txPayload,
      });

      // Get LLM suggestions
      const { object } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: matchProposalSchema,
        temperature: 0,
        prompt: `${systemPrompt}\n\nData:\n${userPrompt}`,
      });

      // Save suggestions to database
      const savedMatches = [];
      for (const match of object.matches) {
        try {
          const saved = await ctx.db
            .insert(matches)
            .values({
              userId,
              invoiceId: match.invoice_id,
              transactionId: match.transaction_id,
              status: 'suggested',
              score: match.score.toString(), // Store as string (0-100)
              rationale: match.rationale || '', // Now always a string (empty if none)
              adjustments: match.adjustments || [], // Now always an array (empty if none)
            })
            .onConflictDoUpdate({
              target: [matches.invoiceId, matches.transactionId],
              set: {
                score: match.score.toString(),
                rationale: match.rationale || '',
                adjustments: match.adjustments || [],
              },
            })
            .returning();
          savedMatches.push(saved[0]);
        } catch (error) {
          console.error('Error saving match:', error);
        }
      }

      return {
        suggested: savedMatches.length,
        unmatched_invoices: object.unmatched_invoices,
        matches: savedMatches,
      };
    }),

  // Get matches
  getMatches: protectedProcedure
    .input(
      z.object({
        status: z.enum(['suggested', 'confirmed', 'rejected']).optional(),
        limit: z.number().default(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null

      const conditions = [eq(matches.userId, userId)];
      if (input.status) {
        conditions.push(eq(matches.status, input.status));
      }

      const result = await ctx.db
        .select({
          match: matches,
          invoice: invoices,
          transaction: rawTransactions,
        })
        .from(matches)
        .leftJoin(invoices, eq(matches.invoiceId, invoices.id))
        .leftJoin(
          rawTransactions,
          eq(matches.transactionId, rawTransactions.id),
        )
        .where(and(...conditions))
        .orderBy(desc(matches.createdAt))
        .limit(input.limit);

      return result;
    }),

  // Confirm a match
  confirmMatch: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null

      const updated = await ctx.db
        .update(matches)
        .set({
          status: 'confirmed',
          decidedBy: userId,
          decidedAt: new Date(),
        })
        .where(and(eq(matches.id, input.matchId), eq(matches.userId, userId)))
        .returning();

      return updated[0];
    }),

  // Reject a match
  rejectMatch: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null

      const updated = await ctx.db
        .update(matches)
        .set({
          status: 'rejected',
          decidedBy: userId,
          decidedAt: new Date(),
        })
        .where(and(eq(matches.id, input.matchId), eq(matches.userId, userId)))
        .returning();

      return updated[0];
    }),

  // Sync transactions from Xero (mock data for demo)
  syncXero: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) throw new Error('User not authenticated');

    // Mock Xero transactions - simulating real Xero API response
    const mockXeroTransactions = [
      {
        id: 'XERO-TXN-001',
        date: new Date('2024-01-15'),
        description: 'XERO-INV-001234 Office Supplies Inc',
        amount: 125.5,
        type: 'ACCPAY',
        status: 'AUTHORISED',
        contact: 'Office Supplies Inc',
        reference: 'INV-001234',
      },
      {
        id: 'XERO-TXN-002',
        date: new Date('2024-01-17'),
        description: 'XERO-INV-001235 Consulting Services LLC Payment',
        amount: 2500.0,
        type: 'ACCPAY',
        status: 'AUTHORISED',
        contact: 'Consulting Services LLC',
        reference: 'INV-001235',
      },
      {
        id: 'XERO-TXN-003',
        date: new Date('2024-01-20'),
        description: 'XERO-INV-001236 Cloud Hosting Services - AWS',
        amount: 450.0,
        type: 'ACCPAY',
        status: 'AUTHORISED',
        contact: 'Amazon Web Services',
        reference: 'INV-001236',
      },
      {
        id: 'XERO-TXN-004',
        date: new Date('2024-01-23'),
        description: 'XERO-INV-001237 Legal Services - Smith Associates',
        amount: 1200.0,
        type: 'ACCPAY',
        status: 'AUTHORISED',
        contact: 'Smith & Associates Law Firm',
        reference: 'INV-001237',
      },
      {
        id: 'XERO-TXN-005',
        date: new Date('2024-01-25'),
        description: 'XERO-INV-001238 Graphic Design Services',
        amount: 650.0,
        type: 'ACCPAY',
        status: 'AUTHORISED',
        contact: 'Creative Studio LLC',
        reference: 'INV-001238',
      },
    ];

    const transactions = [];

    // Import each Xero transaction
    for (const xeroTxn of mockXeroTransactions) {
      const transaction = await ctx.db
        .insert(rawTransactions)
        .values({
          userId,
          source: 'xero',
          externalId: xeroTxn.id,
          txnDate: xeroTxn.date,
          amount: Math.abs(xeroTxn.amount).toString(),
          currency: 'USD',
          counterparty: xeroTxn.contact,
          memo: xeroTxn.description,
          raw: xeroTxn,
        })
        .returning();

      transactions.push(transaction[0]);
    }

    return {
      imported: transactions.length,
      source: 'Xero',
      transactions,
    };
  }),

  // Sync invoices from Gmail (mock data for demo)
  syncGmail: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) throw new Error('User not authenticated');

    // Mock Gmail invoice attachments - realistic scenarios that create matching challenges
    const mockGmailInvoices = [
      {
        emailId: 'gmail-msg-001',
        subject: 'Invoice from AWS',
        from: 'billing@aws.amazon.com',
        date: new Date('2024-01-16'),
        invoice: {
          invoiceNumber: 'AWS-2024-9823',
          vendor: 'Amazon Web Services',
          issueDate: '2024-01-16',
          dueDate: '2024-02-16',
          amount: 1249.67, // Matches AWS transaction
          items: ['EC2 Instances', 'S3 Storage', 'CloudFront CDN'],
        },
      },
      {
        emailId: 'gmail-msg-002',
        subject: 'Google Workspace Invoice',
        from: 'gsuite-noreply@google.com',
        date: new Date('2024-01-17'),
        invoice: {
          invoiceNumber: 'GSU-ACME-202401',
          vendor: 'Google Workspace',
          issueDate: '2024-01-17',
          dueDate: '2024-01-31',
          amount: 450.0, // Matches GOOGLE*GSUITE_ACME
          items: ['Business Standard - 30 users @ $15/user'],
        },
      },
      {
        emailId: 'gmail-msg-003',
        subject: 'Microsoft 365 Business Invoice',
        from: 'microsoft-billing@microsoft.com',
        date: new Date('2024-01-22'),
        invoice: {
          invoiceNumber: 'MS365-2024-1122',
          vendor: 'Microsoft 365',
          issueDate: '2024-01-22',
          dueDate: '2024-02-22',
          amount: 360.0, // Matches MICROSOFT 365 BUSINESS
          items: ['Business Premium - 12 users @ $30/user'],
        },
      },
      {
        emailId: 'gmail-msg-004',
        subject: 'Shopify Monthly Subscription',
        from: 'billing@shopify.com',
        date: new Date('2024-01-19'),
        invoice: {
          invoiceNumber: 'SHOP-2024-0119',
          vendor: 'Shopify',
          issueDate: '2024-01-19',
          dueDate: '2024-01-19',
          amount: 299.0, // Matches SHOPIFY MONTHLY SUB
          items: ['Shopify Plus Plan - Monthly'],
        },
      },
      {
        emailId: 'gmail-msg-005',
        subject: 'Zoom Business Invoice',
        from: 'billing@zoom.us',
        date: new Date('2024-01-30'),
        invoice: {
          invoiceNumber: 'ZOOM-INV-89234',
          vendor: 'Zoom Video Communications',
          issueDate: '2024-01-30',
          dueDate: '2024-02-15',
          amount: 149.9, // Matches ZOOM VIDEO COMM
          items: ['Business Plan - 10 hosts'],
        },
      },
      {
        emailId: 'gmail-msg-006',
        subject: 'Dropbox Business Invoice',
        from: 'no-reply@dropbox.com',
        date: new Date('2024-01-28'),
        invoice: {
          invoiceNumber: 'DBX-2024-2801',
          vendor: 'Dropbox Business',
          issueDate: '2024-01-28',
          dueDate: '2024-02-28',
          amount: 199.0, // Matches TST* DROPBOX BUSINESS
          items: ['Advanced Plan - 5 users'],
        },
      },
      {
        emailId: 'gmail-msg-007',
        subject: 'Office Depot Receipt #4829',
        from: 'receipts@officedepot.com',
        date: new Date('2024-01-26'),
        invoice: {
          invoiceNumber: 'OD-4829-2024',
          vendor: 'Office Depot',
          issueDate: '2024-01-26',
          dueDate: '2024-01-26',
          amount: 847.23, // Matches OFFICE DEPOT #4829
          items: ['Office Supplies', 'Printer Ink', 'Paper'],
        },
      },
      {
        emailId: 'gmail-msg-008',
        subject: 'Invoice - Johnson Construction',
        from: 'accounting@johnsonconst.com',
        date: new Date('2024-01-18'),
        invoice: {
          invoiceNumber: 'JC-INV-8923',
          vendor: 'Johnson Construction LLC',
          issueDate: '2024-01-18',
          dueDate: '2024-02-01',
          amount: 8500.0, // Matches CHK 2341 JOHNSON CONSTRUCTION
          items: ['Office renovation - Final payment'],
        },
      },
      {
        emailId: 'gmail-msg-009',
        subject: 'Consulting Invoice - TechStart Solutions',
        from: 'billing@techstart.io',
        date: new Date('2024-01-31'),
        invoice: {
          invoiceNumber: 'TS-2024-0131',
          vendor: 'TechStart Solutions',
          issueDate: '2024-01-31',
          dueDate: '2024-02-15',
          amount: 3500.0, // Matches TECHSTART SOLUTIONS CONSULTING
          items: ['IT Consulting - 20 hours @ $175/hr'],
        },
      },
      {
        emailId: 'gmail-msg-010',
        subject: 'AWS Monthly Bill - January 2024',
        from: 'no-reply@aws.amazon.com',
        date: new Date('2024-01-16'),
        invoice: {
          invoiceNumber: 'AWS-2024-0116-8374',
          vendor: 'Amazon Web Services',
          issueDate: '2024-01-16',
          dueDate: '2024-02-16',
          amount: 1249.67, // Exact match to AWS transaction
          items: [
            'EC2 instances: $892.31',
            'S3 storage: $245.12',
            'RDS: $112.24',
          ],
        },
      },
      {
        emailId: 'gmail-msg-003',
        subject: 'Invoice - January Design Work',
        from: 'sarah.chen.design@gmail.com',
        date: new Date('2024-01-25'),
        invoice: {
          invoiceNumber: 'SC-2024-01',
          vendor: 'Sarah Chen Design',
          issueDate: '2024-01-25',
          dueDate: '2024-02-10',
          amount: 2500.0, // Matches VENMO PAYMENT
          items: [
            'Logo redesign',
            'Marketing materials',
            'Social media templates',
          ],
        },
      },
      {
        emailId: 'gmail-msg-004',
        subject: 'Stripe Payout Report - Transfer 12345',
        from: 'notifications@stripe.com',
        date: new Date('2024-01-15'),
        invoice: {
          invoiceNumber: 'STRIPE-PAYOUT-12345',
          vendor: 'Stripe (Payment Processing)',
          issueDate: '2024-01-15',
          dueDate: '2024-01-15',
          amount: 2847.93, // Matches STRIPE TRANSFER 12345
          items: [
            'Processing fees for 127 transactions',
            'Net payout after fees',
          ],
        },
      },
      {
        emailId: 'gmail-msg-005',
        subject: 'Missing Invoice - Please provide',
        from: 'bookkeeper@yourcpa.com',
        date: new Date('2024-01-26'),
        invoice: {
          invoiceNumber: 'MISSING-001',
          vendor: 'Unknown - Wire Transfer',
          issueDate: '2024-01-24',
          dueDate: '2024-01-24',
          amount: 15000.0, // Matches WIRE OUT but no vendor info
          items: ['⚠️ Need documentation for this wire transfer'],
        },
      },
      {
        emailId: 'gmail-msg-006',
        subject: 'Google Workspace Invoice',
        from: 'gsuite-noreply@google.com',
        date: new Date('2024-01-17'),
        invoice: {
          invoiceNumber: 'GSU-ACME-202401',
          vendor: 'Google Workspace',
          issueDate: '2024-01-17',
          dueDate: '2024-01-31',
          amount: 450.0, // Matches GOOGLE*GSUITE_ACME
          items: ['Business Standard - 30 users @ $15/user'],
        },
      },
      {
        emailId: 'gmail-msg-005',
        subject: 'Design Services Invoice',
        from: 'invoice@creativestudio.com',
        date: new Date('2024-01-20'),
        invoice: {
          invoiceNumber: 'INV-001238',
          vendor: 'Creative Studio LLC',
          issueDate: '2024-01-20',
          dueDate: '2024-02-03',
          amount: 650.0,
          items: ['Logo Design', 'Brand Guidelines Document'],
        },
      },
    ];

    const importedInvoices = [];

    // Import each Gmail invoice
    for (const gmailInvoice of mockGmailInvoices) {
      const invoice = await ctx.db
        .insert(invoices)
        .values({
          userId,
          invoiceNumber: gmailInvoice.invoice.invoiceNumber,
          vendor: gmailInvoice.invoice.vendor,
          issueDate: new Date(gmailInvoice.invoice.issueDate),
          dueDate: new Date(gmailInvoice.invoice.dueDate),
          totalAmount: gmailInvoice.invoice.amount.toString(),
          parsedConfidence: '95', // High confidence for demo
          docUrl: `https://gmail.com/attachment/${gmailInvoice.emailId}`,
          raw: gmailInvoice,
        })
        .returning();

      importedInvoices.push(invoice[0]);
    }

    return {
      imported: importedInvoices.length,
      source: 'Gmail',
      invoices: importedInvoices,
    };
  }),

  // Delete a transaction
  deleteTransaction: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null

      await ctx.db
        .delete(rawTransactions)
        .where(
          and(
            eq(rawTransactions.id, input.id),
            eq(rawTransactions.userId, userId),
          ),
        );

      return { success: true };
    }),

  // Update transaction GL code
  updateTransactionGLCode: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        glCode: z.string(),
        confidence: z.number().min(0).max(100),
        reason: z.string(),
        status: z
          .enum(['auto_categorized', 'manual', 'confirmed', 'pending'])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;

      const updated = await ctx.db
        .update(rawTransactions)
        .set({
          glCode: input.glCode,
          glCodeConfidence: input.confidence.toString(),
          glCodeReason: input.reason,
          categorizationStatus: input.status || 'manual',
        })
        .where(
          and(
            eq(rawTransactions.id, input.id),
            eq(rawTransactions.userId, userId),
          ),
        )
        .returning();

      return updated[0];
    }),

  // Delete an invoice
  deleteInvoice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!; // Protected procedure ensures this is not null

      await ctx.db
        .delete(invoices)
        .where(and(eq(invoices.id, input.id), eq(invoices.userId, userId)));

      return { success: true };
    }),

  // Delete all transactions
  deleteAllTransactions: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) throw new Error('User not authenticated');

    const deleted = await ctx.db
      .delete(rawTransactions)
      .where(eq(rawTransactions.userId, userId))
      .returning();

    return {
      success: true,
      deletedCount: deleted.length,
    };
  }),

  // Delete all invoices
  deleteAllInvoices: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId!; // Protected procedure ensures this is not null

    await ctx.db.delete(invoices).where(eq(invoices.userId, userId));

    return { deletedCount: 0 }; // Drizzle doesn't return count on delete
  }),

  // Create context request for unclear items
  createContextRequest: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        itemType: z.enum(['transaction', 'invoice']),
        questions: z.array(
          z.object({
            id: z.string(),
            question: z.string(),
            type: z.enum(['text', 'select', 'boolean']),
            options: z.array(z.string()).optional(),
            required: z.boolean(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;

      // In a real implementation, this would:
      // 1. Store the request in database
      // 2. Send email/SMS/Slack to client
      // 3. Generate a unique link for response

      // Mock implementation
      const request = {
        id: `req-${Date.now()}`,
        userId,
        itemId: input.itemId,
        itemType: input.itemType,
        questions: input.questions,
        status: 'pending',
        createdAt: new Date(),
        responseUrl: `https://app.zerofinance.ai/context/${Date.now()}`,
      };

      // Simulate sending notification
      console.log('Sending context request to client:', request);

      return {
        success: true,
        requestId: request.id,
        responseUrl: request.responseUrl,
      };
    }),

  // Get pending context requests
  getContextRequests: protectedProcedure
    .input(
      z.object({
        status: z.enum(['pending', 'completed', 'all']).optional(),
      }),
    )
    .query(async ({ input }) => {
      // const userId = ctx.userId!; // Would use in real implementation

      // Mock data for demo
      const mockRequests = [
        {
          id: 'req-1',
          itemId: 'tx-123',
          itemType: 'transaction',
          itemDetails: {
            vendor: 'AMZN*AWS',
            amount: 2450.83,
            date: '2024-01-15',
          },
          questions: [
            {
              id: 'q1',
              question: 'What was the business purpose?',
              type: 'text',
              required: true,
            },
          ],
          status: 'pending',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: 'req-2',
          itemId: 'inv-456',
          itemType: 'invoice',
          itemDetails: {
            vendor: 'Legal Services LLC',
            invoiceNumber: 'INV-2024-001',
            amount: 5000,
          },
          questions: [
            {
              id: 'q1',
              question: 'Is this invoice legitimate?',
              type: 'boolean',
              required: true,
            },
          ],
          status: 'completed',
          createdAt: new Date('2024-01-14'),
          completedAt: new Date('2024-01-15'),
          responses: {
            q1: true,
          },
        },
      ];

      if (input?.status && input.status !== 'all') {
        return mockRequests.filter((r) => r.status === input.status);
      }

      return mockRequests;
    }),

  // Submit context response (client-facing endpoint in real app)
  submitContextResponse: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
        responses: z.record(z.any()),
      }),
    )
    .mutation(async ({ input }) => {
      // In real implementation:
      // 1. Validate request belongs to user
      // 2. Store responses
      // 3. Update transaction/invoice with context
      // 4. Trigger re-categorization with new context

      console.log('Context response received:', input);

      return {
        success: true,
        message: 'Context updated successfully',
      };
    }),
});
