import { z } from 'zod';
import { router, protectedProcedure } from '../create-router'; // Corrected import
import { fetchEmails, SimplifiedEmail } from '../services/gmail-service';
import { processEmailsToInboxCards } from '../services/email-processor';
import { GmailTokenService } from '../services/gmail-token-service';
import type { InboxCard } from '@/types/inbox';
import { processDocumentFromEmailText, generateInvoiceFromText, AiProcessedDocument, aiDocumentProcessSchema } from '../services/ai-service';

// Imports for Request Network
import { createInvoiceRequest, type InvoiceRequestData } from '@/lib/request-network'; 
import { getCurrencyConfig, type CryptoCurrencyConfig } from '@/lib/currencies';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { TRPCError } from '@trpc/server';
import { ethers } from 'ethers'; // For amount conversion
import { waitUntil } from '@vercel/functions';
import { db } from '@/db';
import { gmailSyncJobs, inboxCards } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Schema for the input of createRequestNetworkInvoice mutation
export const createInvoiceInputSchema = aiDocumentProcessSchema.pick({
    invoiceNumber: true,
    buyerName: true,
    sellerName: true, // We might get this from user profile later
    amount: true,
    currency: true,
    dueDate: true,
    issueDate: true,
    items: true,
    extractedSummary: true, // for the 'note' field
}).extend({
    payeeAddress: z.string().refine((val) => ethers.utils.isAddress(val), { message: "Invalid payee Ethereum address" }),
    // Explicitly define network for currency, defaulting to 'base' as per current app focus
    network: z.string().default('base'), 
});

export const inboxRouter = router({ // Use 'router' from create-router
  getLatestSyncJob: protectedProcedure
    .output(z.object({
      job: z.any().nullable(),
    }).nullable())
    .query(async ({ ctx }) => {
      const { userId } = ctx;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }
      const job = await db.query.gmailSyncJobs.findFirst({
        where: eq(gmailSyncJobs.userId, userId),
        orderBy: [desc(gmailSyncJobs.createdAt)],
      });
      return { job };
    }),
  
  getSyncJobStatus: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .output(z.object({
      job: z.any().nullable(),
    }).nullable())
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { jobId } = input;
       if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }
      const job = await db.query.gmailSyncJobs.findFirst({
        where: and(
          eq(gmailSyncJobs.id, jobId),
          eq(gmailSyncJobs.userId, userId)
        ),
      });
      return { job };
    }),

  /**
   * Check if Gmail is connected for the current user
   */
  checkGmailConnection: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/inbox/gmail-connection-status' } })
    .output(z.object({ 
      isConnected: z.boolean(),
      message: z.string() 
    }))
    .query(async ({ ctx }) => {
      const userPrivyDid = ctx.userId;
      if (!userPrivyDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      const hasTokens = await GmailTokenService.hasGmailTokens(userPrivyDid);
      return {
        isConnected: hasTokens,
        message: hasTokens ? 'Gmail is connected' : 'Gmail is not connected'
      };
    }),

  /**
   * Disconnect Gmail for the current user
   */
  disconnectGmail: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/disconnect-gmail' } })
    .output(z.object({ success: z.boolean(), message: z.string() }))
    .mutation(async ({ ctx }) => {
      try {
        const userPrivyDid = ctx.userId;
        if (!userPrivyDid) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
        }

        await GmailTokenService.removeGmailTokens(userPrivyDid);
        return {
          success: true,
          message: 'Gmail disconnected successfully'
        };
      } catch (error) {
        console.error('Error disconnecting Gmail:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to disconnect Gmail'
        });
      }
    }),

  /**
   * Fetches emails from Gmail, processes them into InboxCard format.
   * This is a mutation because it triggers an external data fetch and processing.
   */
  syncGmail: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/sync-gmail' } })
    .input(z.object({ 
      count: z.number().optional().default(50), 
      dateQuery: z.string().optional() 
    }))
    .output(z.object({ jobId: z.string() })) // Define output as an array of InboxCard
    .mutation(async ({ ctx, input }) => {
      const userPrivyDid = ctx.userId;
      if (!userPrivyDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      const existingJob = await db.query.gmailSyncJobs.findFirst({
        where: and(
          eq(gmailSyncJobs.userId, userPrivyDid),
          eq(gmailSyncJobs.status, 'RUNNING')
        ),
      });

      if (existingJob) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A Gmail sync is already in progress.',
        });
      }

      const [job] = await db.insert(gmailSyncJobs).values({
        userId: userPrivyDid,
        status: 'PENDING',
      }).returning();

      const jobId = job.id;

      waitUntil((async () => {
        try {
          await db.update(gmailSyncJobs).set({ status: 'RUNNING', startedAt: new Date() }).where(eq(gmailSyncJobs.id, jobId));
          
          console.log(`Background Gmail Sync Job started: ${jobId} for user ${userPrivyDid}, fetching up to ${input.count} emails, dateQuery: ${input.dateQuery || 'all time'}...`);
          
          const accessToken = await GmailTokenService.getValidAccessToken(userPrivyDid);
          if (!accessToken) {
            throw new Error('Gmail not connected or token invalid.');
          }

          const emails: any[] = await fetchEmails(input.count, undefined, input.dateQuery, accessToken);
          if (!emails || emails.length === 0) {
            console.log(`[Job ${jobId}] No new emails to process from Gmail.`);
            await db.update(gmailSyncJobs).set({ status: 'COMPLETED', finishedAt: new Date(), cardsAdded: 0 }).where(eq(gmailSyncJobs.id, jobId));
            return;
          }

          const processedCards: InboxCard[] = await processEmailsToInboxCards(emails, userPrivyDid);
          console.log(`[Job ${jobId}] Processed ${processedCards.length} emails into InboxCards.`);

          if (processedCards.length > 0) {
            const newDbCards = processedCards.map(card => ({
              ...card,
              id: uuidv4(), // Generate new UUID for db primary key
              cardId: card.id, // Keep original UI id
              userId: userPrivyDid,
              subjectHash: card.subjectHash, // Add subject hash for duplicate prevention
              impact: card.impact || {},
              chainOfThought: card.chainOfThought || [],
              comments: card.comments || [],
              timestamp: new Date(card.timestamp),
            }));
            await db.insert(inboxCards).values(newDbCards).onConflictDoNothing({ target: inboxCards.cardId });
          }

          await db.update(gmailSyncJobs).set({ status: 'COMPLETED', finishedAt: new Date(), cardsAdded: processedCards.length }).where(eq(gmailSyncJobs.id, jobId));
          console.log(`[Job ${jobId}] Gmail Sync Job COMPLETED.`);
        } catch (error: any) {
          console.error(`[Job ${jobId}] Error during background Gmail sync:`, error);
          const errorMessage = error.message || 'Failed to sync Gmail and process emails.';
          await db.update(gmailSyncJobs).set({ status: 'FAILED', finishedAt: new Date(), error: errorMessage }).where(eq(gmailSyncJobs.id, jobId));
        }
      })());

      return { jobId };
    }),

  /**
   * Placeholder: In the future, this might fetch cards from a persistent store (DB).
   * For Day 1, it might not be used if cards are purely client-side after sync.
   */
  getInboxCards: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/inbox/cards' } })
    .input(z.object({ status: z.string().optional() })) // Example filter
    .output(z.array(z.custom<InboxCard>()))
    .query(async ({ input }) => {
      // TODO: Implement fetching from a persistent store if/when needed.
      console.log('getInboxCards called with filter:', input.status);
      console.warn('getInboxCards is a placeholder and does not fetch from DB yet.');
      return []; // Returning empty for now
    }),

  processDocumentFromCardData: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/process-document-from-card' } })
    .input(z.object({ 
      emailSubject: z.string().nullable().optional(),
      emailBodyText: z.string().nullable().optional(),
    }))
    .output(aiDocumentProcessSchema.nullable())
    .mutation(async ({ input }) => {
      if (!input.emailBodyText && !input.emailSubject) {
        throw new Error('Email subject or body text is required for processing.');
      }
      const contentToProcess = `${input.emailSubject || ''}\n\n${input.emailBodyText || ''}`.trim();
      if (!contentToProcess) {
        console.warn('[API.processDocument] No content to process.');
        return null;
      }
      const subjectForAI = input.emailSubject === null ? undefined : input.emailSubject;
      return processDocumentFromEmailText(contentToProcess, subjectForAI);
    }),

  generateInvoiceFromText: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/generate-from-text' } })
    .input(z.object({ text: z.string() }))
    .output(aiDocumentProcessSchema.nullable())
    .mutation(async ({ input }) => {
      if (!input.text.trim()) {
        throw new Error('Input text is required to generate an invoice.');
      }
      return generateInvoiceFromText(input.text);
    }),

  createRequestNetworkInvoice: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/create-request-network-invoice' } })
    .input(createInvoiceInputSchema)
    .output(z.object({ requestId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log("[InboxRouter] Creating Request Network Invoice with input:", input);
      
      const currencyConfig = getCurrencyConfig(input.currency || 'USDC', input.network);
      if (!currencyConfig || !(currencyConfig as CryptoCurrencyConfig).type) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Unsupported currency or network: ${input.currency} on ${input.network}`,
        });
      }
      const cryptoConfig = currencyConfig as CryptoCurrencyConfig;

      if (!input.amount) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invoice amount is required.'});
      }
      const expectedAmount = ethers.utils.parseUnits(input.amount.toString(), cryptoConfig.decimals).toString();

      let resolvedInvoiceItems = input.items?.map(item => ({
        name: item.name || 'Item',
        quantity: typeof item.quantity === 'string' ? parseInt(item.quantity, 10) || 1 : item.quantity || 1,
        // Unit price needs to be in smallest unit
        unitPrice: item.unitPrice ? ethers.utils.parseUnits(item.unitPrice.toString(), cryptoConfig.decimals).toString() : '0',
        currency: cryptoConfig.symbol, // Use symbol from config
        tax: { type: 'percentage' as 'percentage', amount: '0' }, // Default no tax
      })) || []; // Initialize as empty array if input.items is undefined

      if (resolvedInvoiceItems.length === 0) {
        // Create a single line item if none provided but amount exists
        resolvedInvoiceItems.push({
            name: input.extractedSummary || 'Services rendered',
            quantity: 1,
            unitPrice: expectedAmount, // Total amount as unit price for single item
            currency: cryptoConfig.symbol,
            tax: { type: 'percentage' as 'percentage', amount: '0' },
        });
      }
      
      const requestData: InvoiceRequestData = {
        currency: {
          type: cryptoConfig.type as RequestLogicTypes.CURRENCY.ERC20, // Assuming ERC20 or ETH for now
          value: cryptoConfig.value, // Token address or 'ETH'
          network: cryptoConfig.network as 'xdai' | 'mainnet', // Needs to align with RN expectations
          paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT, // Common for ERC20s
          decimals: cryptoConfig.decimals,
        },
        expectedAmount: expectedAmount,
        paymentAddress: input.payeeAddress, 
        // contentData: {
        //   meta: { format: 'invoiceit-0.0.1', version: '0.0.3' }, // Standard meta
        //   creationDate: input.issueDate ? new Date(input.issueDate).toISOString() : new Date().toISOString(),
        //   invoiceNumber: input.invoiceNumber || `INV-${Date.now()}`,
        //   sellerInfo: {
        //     // TODO: Correctly populate sellerInfo from ctx.user once email/company structure is clarified
        //     businessName: input.sellerName || 'My Demo Company',
        //     email: 'seller-demo@example.com',
        //   },
        //   buyerInfo: {
        //     businessName: input.buyerName || undefined,
        //     email: 'buyer@example.com', // Placeholder, ideally get from AI or user input
        //   },
        //   invoiceItems: resolvedInvoiceItems,
        //   note: input.extractedSummary || undefined,
        //   paymentTerms: input.dueDate ? { dueDate: new Date(input.dueDate).toISOString() } : undefined,
        // },
        paymentNetwork: {
          id: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
          parameters: {
            paymentNetworkName: cryptoConfig.network, // e.g. 'base',
            paymentAddress: input.payeeAddress,
          },
        },
      };

      try {
        // The createInvoiceRequest in lib/request-network.ts might use a randomly generated wallet for signing
        // if userWallet is not passed. For Day 3, the user's actual wallet (via privy or similar) should be used.
        // For now, this will proceed with the library's default behavior (likely ephemeral wallet for request creation).
        const result = await createInvoiceRequest(requestData, input.payeeAddress /* payeeAddress for request itself */ ); 
        return { requestId: result.requestId };
      } catch (error: any) {
        console.error("Error creating Request Network invoice:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create Request Network invoice: ${error.message}`,
        });
      }
    }),
}); 