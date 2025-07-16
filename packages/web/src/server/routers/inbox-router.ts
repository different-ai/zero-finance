import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { fetchEmails, SimplifiedEmail } from '../services/gmail-service';
import type { GmailAttachmentMetadata } from '../services/gmail-service';
import { processEmailsToInboxCards } from '../services/email-processor';
import { GmailTokenService } from '../services/gmail-token-service';
import type { InboxCard } from '@/types/inbox';
import { processDocumentFromEmailText, generateInvoiceFromText, AiProcessedDocument, aiDocumentProcessSchema } from '../services/ai-service';
import { processSampleEmail as processSampleEmailService } from './process-sample-email';
import { dbCardToUiCard } from '@/lib/inbox-card-utils';
import { createInvoiceRequest, type InvoiceRequestData } from '@/lib/request-network';
import { getCurrencyConfig, type CryptoCurrencyConfig } from '@/lib/currencies';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { ethers } from 'ethers';
import { eq, and, desc, or, asc, ne, not, isNull } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { gmailSyncJobs, inboxCards, gmailProcessingPrefs, actionLedger, userClassificationSettings, cardActions } from '@/db/schema';

// Progressive batch sizes: 1, 2, 4, 8, 10, 10...
function getNextBatchSize(currentProcessedCount: number): number {
  if (currentProcessedCount === 0) return 1;
  if (currentProcessedCount === 1) return 2;
  if (currentProcessedCount === 3) return 4;
  if (currentProcessedCount === 7) return 8;
  return 10; // Max batch size
}

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

export const inboxRouter = router({
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
   * Get Gmail processing preferences and status
   */
  getGmailProcessingStatus: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/inbox/gmail-processing-status' } })
    .output(z.object({
      isEnabled: z.boolean(),
      activatedAt: z.date().nullable(),
      keywords: z.array(z.string()),
      lastSyncedAt: z.date().nullable(),
    }))
    .query(async ({ ctx }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      const prefs = await db.query.gmailProcessingPrefs.findFirst({
        where: eq(gmailProcessingPrefs.userId, userId),
      });

      return {
        isEnabled: prefs?.isEnabled ?? false,
        activatedAt: prefs?.activatedAt ?? null,
        keywords: prefs?.keywords ?? ['invoice', 'bill', 'payment', 'receipt', 'order', 'statement'],
        lastSyncedAt: prefs?.lastSyncedAt ?? null,
      };
    }),

  /**
   * Toggle Gmail processing on/off
   */
  toggleGmailProcessing: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/toggle-gmail-processing' } })
    .input(z.object({
      enabled: z.boolean(),
      keywords: z.array(z.string()).optional(),
    }))
    .output(z.object({
      success: z.boolean(),
      isEnabled: z.boolean(),
      activatedAt: z.date().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      // Check if Gmail is connected first
      const hasTokens = await GmailTokenService.hasGmailTokens(userId);
      if (!hasTokens && input.enabled) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Gmail must be connected before enabling processing',
        });
      }

      const existingPrefs = await db.query.gmailProcessingPrefs.findFirst({
        where: eq(gmailProcessingPrefs.userId, userId),
      });

      let activatedAt = existingPrefs?.activatedAt ?? null;
      
      // If enabling for the first time, set activatedAt
      if (input.enabled && !existingPrefs?.isEnabled) {
        activatedAt = new Date();
      }

      // Upsert preferences
      const values = {
        userId,
        isEnabled: input.enabled,
        activatedAt,
        keywords: input.keywords ?? existingPrefs?.keywords ?? ['invoice', 'bill', 'payment', 'receipt', 'order', 'statement'],
        updatedAt: new Date(),
      };

      if (existingPrefs) {
        await db.update(gmailProcessingPrefs)
          .set(values)
          .where(eq(gmailProcessingPrefs.userId, userId));
      } else {
        await db.insert(gmailProcessingPrefs).values({
          ...values,
          createdAt: new Date(),
        });
      }

      return {
        success: true,
        isEnabled: input.enabled,
        activatedAt,
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
      count: z.number().optional().default(100), // Increased default from 50 to 100
      dateQuery: z.string().optional(),
      pageSize: z.number().optional().default(5), // Reduced from 20 to 5 for faster processing
    }))
    .output(z.object({ jobId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userPrivyDid = ctx.userId;
      if (!userPrivyDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      // Check processing preferences - AI processing MUST be enabled
      const prefs = await db.query.gmailProcessingPrefs.findFirst({
        where: eq(gmailProcessingPrefs.userId, userPrivyDid),
      });

      if (!prefs?.isEnabled) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'AI processing must be enabled to use the inbox service',
        });
      }

      // Build Gmail search query based on keywords
      const keywords = prefs.keywords ?? ['invoice', 'bill', 'payment', 'receipt', 'order', 'statement'];
      const keywordQuery = keywords.map(k => `"${k}"`).join(' OR ');
      
      // Use activatedAt as the starting point for syncing
      let dateQuery = input.dateQuery;
      if (!dateQuery && prefs.activatedAt) {
        dateQuery = `after:${Math.floor(prefs.activatedAt.getTime() / 1000)}`;
      }
      
      const fullQuery = dateQuery ? `(${keywordQuery}) ${dateQuery}` : keywordQuery;

      // Check for existing running jobs
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

      // Create new job
      const [job] = await db.insert(gmailSyncJobs).values({
        userId: userPrivyDid,
        status: 'PENDING',
      }).returning();

      const jobId = job.id;

      // For production: Use a queue service like Vercel Cron Jobs, QStash, or BullMQ
      // For now, we'll process synchronously in smaller chunks
      
      try {
        await db.update(gmailSyncJobs).set({ 
          status: 'RUNNING', 
          startedAt: new Date(),
          currentAction: 'Fetching first email...'
        }).where(eq(gmailSyncJobs.id, jobId));
        
        const accessToken = await GmailTokenService.getValidAccessToken(userPrivyDid);
        if (!accessToken) {
          throw new Error('Gmail not connected or token invalid.');
        }

        // Start with 1 email for immediate feedback
        const result = await fetchEmails(
          1, // Always fetch just 1 email initially
          undefined,
          fullQuery, // Use the full query with keywords
          accessToken,
          undefined
        );
        
        const emails = result.emails;
        let totalProcessed = 0;
        
        if (emails && emails.length > 0) {
          await db.update(gmailSyncJobs).set({ 
            currentAction: `Processing first email with AI...`
          }).where(eq(gmailSyncJobs.id, jobId));
          
          const processedCards = await processEmailsToInboxCards(emails, userPrivyDid, accessToken);
          
          if (processedCards.length > 0) {
            const newDbCards = processedCards.map(card => {
              const { 
                timestamp: cardTimestamp, 
                dueDate: cardDueDate, 
                reminderDate: cardReminderDate,
                paidAt: cardPaidAt,
                expenseAddedAt: cardExpenseAddedAt,
                fraudMarkedAt: cardFraudMarkedAt,
                ...restCard 
              } = card;
              
              // Get raw text from source details if available - combine all text sources
              const sourceDetails = card.sourceDetails as any;
              let rawText = '';
              
              // Combine text from multiple sources for better extraction
              if (sourceDetails?.textBody) {
                rawText += sourceDetails.textBody + '\n\n';
              }
              if (sourceDetails?.htmlBody && sourceDetails?.htmlBody !== sourceDetails?.textBody) {
                // Strip HTML tags and add HTML body content
                const htmlText = sourceDetails.htmlBody.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                if (htmlText && htmlText !== sourceDetails?.textBody) {
                  rawText += htmlText + '\n\n';
                }
              }
              if (sourceDetails?.subject) {
                rawText = `Subject: ${sourceDetails.subject}\n\n${rawText}`;
              }
              
              // Also include any structured invoice data for better extraction
              if (card.parsedInvoiceData) {
                rawText += '\n\nParsed Invoice Data:\n' + JSON.stringify(card.parsedInvoiceData, null, 2);
              }
              
              return {
                ...restCard,
                id: uuidv4(),
                cardId: card.id,
                userId: userPrivyDid,
                subjectHash: card.subjectHash,
                impact: card.impact || {},
                chainOfThought: card.chainOfThought || [],
                comments: card.comments || [],
                timestamp: new Date(cardTimestamp),
                dueDate: cardDueDate ? new Date(cardDueDate) : null,
                reminderDate: cardReminderDate ? new Date(cardReminderDate) : null,
                paidAt: cardPaidAt ? new Date(cardPaidAt) : null,
                expenseAddedAt: cardExpenseAddedAt ? new Date(cardExpenseAddedAt) : null,
                fraudMarkedAt: cardFraudMarkedAt ? new Date(cardFraudMarkedAt) : null,
                rawTextContent: rawText,
              };
            });
            
            await db.insert(inboxCards).values(newDbCards).onConflictDoNothing({ 
              target: [inboxCards.userId, inboxCards.logId] 
            });
            totalProcessed = processedCards.length;
            
            // Log auto-approved cards to action ledger
            for (const card of processedCards) {
              if (card.classificationTriggered) {
                try {
                  // Determine action type based on what happened
                  let actionType = 'classification_evaluated';
                  let actionTitle = `AI Rules Evaluated: ${card.title}`;
                  let actionSubtitle = 'No rules matched';
                  let status: 'approved' | 'executed' = 'approved';
                  
                  const matchedRules = card.appliedClassifications?.filter(c => c.matched) || [];
                  
                  if (matchedRules.length > 0) {
                    actionType = 'classification_matched';
                    actionSubtitle = `Matched rules: ${matchedRules.map(r => r.name).join(', ')}`;
                    
                    if (card.autoApproved) {
                      actionType = 'classification_auto_approved';
                      actionTitle = `Auto-approved: ${card.title}`;
                      status = 'executed';
                    }
                  }
                  
                  const actionEntry = {
                    approvedBy: userPrivyDid,
                    inboxCardId: card.id,
                    actionTitle: actionTitle,
                    actionSubtitle: actionSubtitle,
                    actionType: actionType,
                    sourceType: card.sourceType,
                    sourceDetails: card.sourceDetails,
                    impactData: card.impact,
                    amount: card.amount,
                    currency: card.currency,
                    confidence: card.confidence,
                    rationale: card.rationale,
                    chainOfThought: card.chainOfThought,
                    originalCardData: card as any,
                    parsedInvoiceData: card.parsedInvoiceData,
                    status: status,
                    executionDetails: {
                      classificationResults: {
                        evaluated: card.appliedClassifications || [],
                        matched: matchedRules,
                        autoApproved: card.autoApproved,
                        timestamp: new Date().toISOString(),
                      }
                    },
                    executedAt: status === 'executed' ? new Date() : null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    metadata: {
                      aiProcessing: {
                        documentType: card.parsedInvoiceData?.documentType,
                        aiConfidence: card.confidence,
                        triggeredClassifications: card.parsedInvoiceData?.classificationResults,
                      }
                    }
                  };
                  
                  await db.insert(actionLedger).values(actionEntry);
                  console.log(`[Inbox] Logged classification action for card ${card.id}: ${actionType}`);
                } catch (error) {
                  console.error(`[Inbox] Error logging classification action for card ${card.id}:`, error);
                  // Continue processing even if logging fails
                }
              }
            }
          }
        }
        
        // Update last synced timestamp
        await db.update(gmailProcessingPrefs)
          .set({ lastSyncedAt: new Date() })
          .where(eq(gmailProcessingPrefs.userId, userPrivyDid));
        
        // If there's more to process, save the state for continuation with next batch size
        if (result.nextPageToken && 1 < input.count) {
          await db.update(gmailSyncJobs)
            .set({ 
              cardsAdded: totalProcessed,
              processedCount: 1,
              nextPageToken: result.nextPageToken,
              currentAction: `First email processed! Preparing to fetch more...`,
              status: 'PENDING', // Use PENDING to indicate more work needed
            })
            .where(eq(gmailSyncJobs.id, jobId));
        } else {
          // Job completed
          await db.update(gmailSyncJobs).set({ 
            status: 'COMPLETED', 
            finishedAt: new Date(), 
            cardsAdded: totalProcessed,
            processedCount: 1,
            currentAction: null,
          }).where(eq(gmailSyncJobs.id, jobId));
        }
        
      } catch (error: any) {
        console.error(`[Job ${jobId}] Error during Gmail sync:`, error);
        const errorMessage = error.message || 'Failed to sync Gmail and process emails.';
        await db.update(gmailSyncJobs).set({ 
          status: 'FAILED', 
          finishedAt: new Date(), 
          error: errorMessage,
          currentAction: null,
        }).where(eq(gmailSyncJobs.id, jobId));
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage
        });
      }

      return { jobId };
    }),

  /**
   * Continue processing a sync job - can be called manually or via polling
   * This is useful for local development where cron jobs don't run
   */
  continueSyncJob: protectedProcedure
    .input(z.object({ 
      jobId: z.string().optional(), // If not provided, will find the latest pending job
    }))
    .output(z.object({ 
      success: z.boolean(), 
      message: z.string(),
      processed: z.number().optional(),
      status: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      // Get processing preferences - AI processing MUST be enabled
      const prefs = await db.query.gmailProcessingPrefs.findFirst({
        where: eq(gmailProcessingPrefs.userId, userId),
      });

      if (!prefs?.isEnabled) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'AI processing must be enabled to use the inbox service',
        });
      }

      // Build Gmail search query based on keywords
      const keywords = prefs.keywords ?? ['invoice', 'bill', 'payment', 'receipt', 'order', 'statement'];
      const keywordQuery = keywords.map(k => `"${k}"`).join(' OR ');
      let dateQuery = '';
      if (prefs.activatedAt) {
        dateQuery = `after:${Math.floor(prefs.activatedAt.getTime() / 1000)}`;
      }
      const fullQuery = dateQuery ? `(${keywordQuery}) ${dateQuery}` : keywordQuery;

      // Find the job to process
      let job;
      if (input.jobId) {
        job = await db.query.gmailSyncJobs.findFirst({
          where: and(
            eq(gmailSyncJobs.id, input.jobId),
            eq(gmailSyncJobs.userId, userId)
          ),
        });
      } else {
        // Find the latest pending job for this user
        job = await db.query.gmailSyncJobs.findFirst({
          where: and(
            eq(gmailSyncJobs.userId, userId),
            or(
              eq(gmailSyncJobs.status, 'PENDING'),
              eq(gmailSyncJobs.status, 'RUNNING')
            )
          ),
          orderBy: [desc(gmailSyncJobs.createdAt)],
        });
      }

      if (!job) {
        return { success: false, message: 'No pending sync job found' };
      }

      if (!job.startedAt || !job.nextPageToken) {
        return { success: false, message: 'Job not ready for continuation' };
      }

      try {
        // Update job to RUNNING if it was PENDING
        if (job.status === 'PENDING') {
          await db.update(gmailSyncJobs)
            .set({ status: 'RUNNING', currentAction: 'Continuing sync...' })
            .where(eq(gmailSyncJobs.id, job.id));
        }

        const accessToken = await GmailTokenService.getValidAccessToken(userId);
        if (!accessToken) {
          throw new Error('Gmail not connected or token invalid.');
        }

        let totalProcessed = job.cardsAdded || 0;
        let emailsFetched = job.processedCount || 0;
        const batchSize = getNextBatchSize(emailsFetched);
        
        await db.update(gmailSyncJobs).set({ 
          currentAction: `Fetching next ${batchSize} email${batchSize > 1 ? 's' : ''}...`
        }).where(eq(gmailSyncJobs.id, job.id));

        const result = await fetchEmails(batchSize, undefined, fullQuery, accessToken, job.nextPageToken);
        const emails = result.emails;
        const pageToken = result.nextPageToken || null;

        if (emails && emails.length > 0) {
          await db.update(gmailSyncJobs).set({ 
            currentAction: `Processing ${emails.length} email${emails.length > 1 ? 's' : ''} with AI...`
          }).where(eq(gmailSyncJobs.id, job.id));

          emailsFetched += emails.length;
          const processedCards = await processEmailsToInboxCards(emails, userId, accessToken);

          if (processedCards.length > 0) {
            const newDbCards = processedCards.map(card => {
              const { 
                timestamp: cardTimestamp, 
                dueDate: cardDueDate, 
                reminderDate: cardReminderDate,
                paidAt: cardPaidAt,
                expenseAddedAt: cardExpenseAddedAt,
                fraudMarkedAt: cardFraudMarkedAt,
                ...restCard 
              } = card;
              
              // Get raw text from source details if available - combine all text sources
              const sourceDetails = card.sourceDetails as any;
              let rawText = '';
              
              // Combine text from multiple sources for better extraction
              if (sourceDetails?.textBody) {
                rawText += sourceDetails.textBody + '\n\n';
              }
              if (sourceDetails?.htmlBody && sourceDetails?.htmlBody !== sourceDetails?.textBody) {
                // Strip HTML tags and add HTML body content
                const htmlText = sourceDetails.htmlBody.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                if (htmlText && htmlText !== sourceDetails?.textBody) {
                  rawText += htmlText + '\n\n';
                }
              }
              if (sourceDetails?.subject) {
                rawText = `Subject: ${sourceDetails.subject}\n\n${rawText}`;
              }
              
              // Also include any structured invoice data for better extraction
              if (card.parsedInvoiceData) {
                rawText += '\n\nParsed Invoice Data:\n' + JSON.stringify(card.parsedInvoiceData, null, 2);
              }
              
              return {
                ...restCard,
                id: uuidv4(),
                cardId: card.id,
                userId: userId,
                subjectHash: card.subjectHash,
                impact: card.impact || {},
                chainOfThought: card.chainOfThought || [],
                comments: card.comments || [],
                timestamp: new Date(cardTimestamp),
                dueDate: cardDueDate ? new Date(cardDueDate) : null,
                reminderDate: cardReminderDate ? new Date(cardReminderDate) : null,
                paidAt: cardPaidAt ? new Date(cardPaidAt) : null,
                expenseAddedAt: cardExpenseAddedAt ? new Date(cardExpenseAddedAt) : null,
                fraudMarkedAt: cardFraudMarkedAt ? new Date(cardFraudMarkedAt) : null,
                rawTextContent: rawText,
              };
            });

            await db.insert(inboxCards).values(newDbCards).onConflictDoNothing({ 
              target: [inboxCards.userId, inboxCards.logId] 
            });
            totalProcessed += processedCards.length;
            
            // Log auto-approved cards to action ledger
            for (const card of processedCards) {
              if (card.classificationTriggered) {
                try {
                  // Determine action type based on what happened
                  let actionType = 'classification_evaluated';
                  let actionTitle = `AI Rules Evaluated: ${card.title}`;
                  let actionSubtitle = 'No rules matched';
                  let status: 'approved' | 'executed' = 'approved';
                  
                  const matchedRules = card.appliedClassifications?.filter(c => c.matched) || [];
                  
                  if (matchedRules.length > 0) {
                    actionType = 'classification_matched';
                    actionSubtitle = `Matched rules: ${matchedRules.map(r => r.name).join(', ')}`;
                    
                    if (card.autoApproved) {
                      actionType = 'classification_auto_approved';
                      actionTitle = `Auto-approved: ${card.title}`;
                      status = 'executed';
                    }
                  }
                  
                  const actionEntry = {
                    approvedBy: userId,
                    inboxCardId: card.id,
                    actionTitle: actionTitle,
                    actionSubtitle: actionSubtitle,
                    actionType: actionType,
                    sourceType: card.sourceType,
                    sourceDetails: card.sourceDetails,
                    impactData: card.impact,
                    amount: card.amount,
                    currency: card.currency,
                    confidence: card.confidence,
                    rationale: card.rationale,
                    chainOfThought: card.chainOfThought,
                    originalCardData: card as any,
                    parsedInvoiceData: card.parsedInvoiceData,
                    status: status,
                    executionDetails: {
                      classificationResults: {
                        evaluated: card.appliedClassifications || [],
                        matched: matchedRules,
                        autoApproved: card.autoApproved,
                        timestamp: new Date().toISOString(),
                      }
                    },
                    executedAt: status === 'executed' ? new Date() : null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    metadata: {
                      aiProcessing: {
                        documentType: card.parsedInvoiceData?.documentType,
                        aiConfidence: card.confidence,
                        triggeredClassifications: card.parsedInvoiceData?.classificationResults,
                      }
                    }
                  };
                  
                  await db.insert(actionLedger).values(actionEntry);
                  console.log(`[Inbox] Logged classification action for card ${card.id}: ${actionType}`);
                } catch (error) {
                  console.error(`[Inbox] Error logging classification action for card ${card.id}:`, error);
                  // Continue processing even if logging fails
                }
              }
            }
          }
        }

        // Update last synced timestamp
        await db.update(gmailProcessingPrefs)
          .set({ lastSyncedAt: new Date() })
          .where(eq(gmailProcessingPrefs.userId, userId));

        // Update job status
        if (!pageToken) {
          await db.update(gmailSyncJobs).set({ 
            status: 'COMPLETED', 
            finishedAt: new Date(),
            cardsAdded: totalProcessed,
            processedCount: emailsFetched,
            currentAction: null,
          }).where(eq(gmailSyncJobs.id, job.id));
          
          return { 
            success: true, 
            message: 'Sync completed!', 
            processed: emailsFetched,
            status: 'completed'
          };
        } else {
          const nextBatchSize = getNextBatchSize(emailsFetched);
          await db.update(gmailSyncJobs).set({ 
            status: 'PENDING',
            cardsAdded: totalProcessed,
            processedCount: emailsFetched,
            nextPageToken: pageToken,
            currentAction: `Processed ${emailsFetched} emails so far. Ready for next batch of ${nextBatchSize}.`,
          }).where(eq(gmailSyncJobs.id, job.id));
          
          return { 
            success: true, 
            message: `Processed batch successfully. ${emailsFetched} emails total.`, 
            processed: emailsFetched,
            status: 'pending'
          };
        }

      } catch (error: any) {
        console.error(`Error continuing job ${job.id}:`, error);
        await db.update(gmailSyncJobs).set({ 
          status: 'FAILED', 
          finishedAt: new Date(),
          error: error.message || 'Unknown error',
          currentAction: null,
        }).where(eq(gmailSyncJobs.id, job.id));
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to continue sync'
        });
      }
    }),

  /**
   * Cancel a running sync job
   */
  cancelSync: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .output(z.object({ success: z.boolean(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      const job = await db.query.gmailSyncJobs.findFirst({
        where: and(
          eq(gmailSyncJobs.id, input.jobId),
          eq(gmailSyncJobs.userId, userId)
        ),
      });

      if (!job) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Job not found' });
      }

      if (job.status !== 'RUNNING' && job.status !== 'PENDING') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Job is not running or pending' });
      }

      // Update job status to FAILED with cancellation message
      await db.update(gmailSyncJobs)
        .set({ 
          status: 'FAILED', 
          finishedAt: new Date(),
          error: 'Sync cancelled by user'
        })
        .where(eq(gmailSyncJobs.id, input.jobId));

      return { success: true, message: 'Sync job cancelled successfully' };
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
    .mutation(async ({ ctx, input }) => {
      if (!input.emailBodyText && !input.emailSubject) {
        throw new Error('Email subject or body text is required for processing.');
      }
      const contentToProcess = `${input.emailSubject || ''}\n\n${input.emailBodyText || ''}`.trim();
      if (!contentToProcess) {
        console.warn('[API.processDocument] No content to process.');
        return null;
      }
      
      // Fetch user's classification settings
      const userId = ctx.userId;
      let userPrompts: string[] = [];
      
      if (userId) {
        const { userClassificationSettings } = await import('@/db/schema');
        const classificationSettings = await db
          .select()
          .from(userClassificationSettings)
          .where(and(
            eq(userClassificationSettings.userId, userId),
            eq(userClassificationSettings.enabled, true)
          ))
          .orderBy(asc(userClassificationSettings.priority));
        
        userPrompts = classificationSettings.map(setting => setting.prompt);
      }
      
      const subjectForAI = input.emailSubject === null || input.emailSubject === undefined ? undefined : input.emailSubject;
      return processDocumentFromEmailText(contentToProcess, subjectForAI, userPrompts);
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

  /**
   * Export inbox cards to CSV format
   */
  exportCsv: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/export-csv' } })
    .input(z.object({
      status: z.enum(['pending', 'executed', 'dismissed', 'auto', 'snoozed', 'error', 'seen']).optional(),
      sourceType: z.string().optional(),
      dateRange: z.object({
        start: z.date().optional(),
        end: z.date().optional()
      }).optional(),
      searchQuery: z.string().optional(),
    }))
    .output(z.object({ 
      csvContent: z.string(),
      totalCount: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      try {
        // Build query conditions
        const whereConditions = [eq(inboxCards.userId, userId)];
        
        if (input.status) {
          whereConditions.push(eq(inboxCards.status, input.status));
        } else {
          // When no status is specified, exclude pending cards (for history view)
          whereConditions.push(ne(inboxCards.status, 'pending'));
        }
        
        if (input.sourceType) {
          whereConditions.push(eq(inboxCards.sourceType, input.sourceType));
        }
        
        // Note: For date range and search query filtering, we'd need additional SQL operators
        // For now, we'll fetch all matching cards and filter in memory
        
        const cards = await db.select()
          .from(inboxCards)
          .where(and(...whereConditions))
          .orderBy(desc(inboxCards.timestamp));

        // Apply additional filters in memory
        let filteredCards = cards;
        
        if (input.dateRange?.start || input.dateRange?.end) {
          filteredCards = filteredCards.filter(card => {
            const cardDate = new Date(card.timestamp);
            if (input.dateRange?.start && cardDate < input.dateRange.start) return false;
            if (input.dateRange?.end && cardDate > input.dateRange.end) return false;
            return true;
          });
        }
        
        if (input.searchQuery) {
          const query = input.searchQuery.toLowerCase();
          filteredCards = filteredCards.filter(card => 
            card.title.toLowerCase().includes(query) ||
            card.subtitle.toLowerCase().includes(query) ||
            (card.fromEntity && card.fromEntity.toLowerCase().includes(query)) ||
            (card.toEntity && card.toEntity.toLowerCase().includes(query))
          );
        }

        // Import the CSV utility function
        const { inboxCardsToCSV } = await import('@/lib/utils/csv');
        const csvContent = inboxCardsToCSV(filteredCards);

        return {
          csvContent,
          totalCount: filteredCards.length
        };
      } catch (error) {
        console.error('[Inbox] Error exporting to CSV:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to export inbox data to CSV',
          cause: error,
        });
      }
    }),

  markAsPaid: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/mark-paid' } })
    .input(z.object({
      cardId: z.string(),
      amount: z.string().optional(),
      paymentMethod: z.string().optional(),
    }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userPrivyDid = ctx.userId;
      if (!userPrivyDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }
      
      // Update the card's payment status
      await db
        .update(inboxCards)
        .set({
          paymentStatus: 'paid',
          paidAt: new Date(),
          paidAmount: input.amount,
          paymentMethod: input.paymentMethod,
          status: 'done',
          updatedAt: new Date(),
        })
        .where(and(
          eq(inboxCards.cardId, input.cardId),
          eq(inboxCards.userId, userPrivyDid)
        ));
      
      // Also create an entry in the action ledger
      const card = await db
        .select()
        .from(inboxCards)
        .where(eq(inboxCards.cardId, input.cardId))
        .limit(1);
      
      if (card.length > 0) {
        await db.insert(actionLedger).values({
          approvedBy: userPrivyDid,
          inboxCardId: input.cardId,
          actionTitle: `Marked as paid: ${card[0].title}`,
          actionSubtitle: `Payment of ${input.amount || card[0].amount || 'unknown amount'}`,
          actionType: 'payment',
          sourceType: card[0].sourceType,
          sourceDetails: card[0].sourceDetails,
          amount: input.amount || card[0].amount,
          currency: card[0].currency,
          confidence: card[0].confidence,
          rationale: card[0].rationale,
          chainOfThought: card[0].chainOfThought,
          originalCardData: card[0] as any,
          parsedInvoiceData: card[0].parsedInvoiceData,
          status: 'executed',
          executedAt: new Date(),
          note: `Marked as paid via inbox`,
        });
      }
      
      return { success: true };
    }),

  addToExpense: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/add-expense' } })
    .input(z.object({
      cardId: z.string(),
      category: z.string().optional(),
      note: z.string().optional(),
    }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userPrivyDid = ctx.userId;
      if (!userPrivyDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }
      
      // Update the card's expense tracking
      await db
        .update(inboxCards)
        .set({
          addedToExpenses: true,
          expenseAddedAt: new Date(),
          expenseCategory: input.category || 'general',
          expenseNote: input.note,
          updatedAt: new Date(),
        })
        .where(and(
          eq(inboxCards.cardId, input.cardId),
          eq(inboxCards.userId, userPrivyDid)
        ));
      
      // Create an entry in the action ledger for expense tracking
      const card = await db
        .select()
        .from(inboxCards)
        .where(eq(inboxCards.cardId, input.cardId))
        .limit(1);
      
      if (card.length > 0) {
        await db.insert(actionLedger).values({
          approvedBy: userPrivyDid,
          inboxCardId: input.cardId,
          actionTitle: `Added to expenses: ${card[0].title}`,
          actionSubtitle: `Category: ${input.category || 'general'}`,
          actionType: 'expense',
          sourceType: card[0].sourceType,
          sourceDetails: card[0].sourceDetails,
          amount: card[0].amount,
          currency: card[0].currency,
          confidence: card[0].confidence,
          rationale: card[0].rationale,
          chainOfThought: card[0].chainOfThought,
          originalCardData: card[0] as any,
          parsedInvoiceData: card[0].parsedInvoiceData,
          status: 'executed',
          executedAt: new Date(),
          note: input.note || `Added to expenses from inbox`,
          categories: [input.category || 'general'],
        });
      }
      
      return { success: true };
    }),

  setReminder: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/set-reminder' } })
    .input(z.object({
      cardId: z.string(),
      reminderDate: z.string(), // ISO date string
    }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userPrivyDid = ctx.userId;
      if (!userPrivyDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }
      
      // Update the card's reminder
      await db
        .update(inboxCards)
        .set({
          reminderDate: new Date(input.reminderDate),
          reminderSent: false,
          updatedAt: new Date(),
        })
        .where(and(
          eq(inboxCards.cardId, input.cardId),
          eq(inboxCards.userId, userPrivyDid)
        ));
      
      return { success: true };
    }),

  getUnpaidSummary: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/inbox/unpaid-summary' } })
    .input(z.object({}))
    .output(z.object({
      totalUnpaid: z.number(),
      totalOverdue: z.number(),
      dueSoon: z.number(),
      byCategory: z.array(z.object({
        category: z.string(),
        count: z.number(),
        total: z.number(),
      })),
    }))
    .query(async ({ ctx }) => {
      const userPrivyDid = ctx.userId;
      if (!userPrivyDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }
      
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      
      // Get all unpaid cards with amounts
      const unpaidCards = await db
        .select()
        .from(inboxCards)
        .where(and(
          eq(inboxCards.userId, userPrivyDid),
          eq(inboxCards.paymentStatus, 'unpaid'),
          not(isNull(inboxCards.amount))
        ));
      
      let totalUnpaid = 0;
      let totalOverdue = 0;
      let dueSoon = 0;
      const byCategory: Record<string, { count: number; total: number }> = {};
      
      for (const card of unpaidCards) {
        const amount = parseFloat(card.amount || '0');
        totalUnpaid += amount;
        
        if (card.dueDate && new Date(card.dueDate) < now) {
          totalOverdue += amount;
        } else if (card.dueDate && new Date(card.dueDate) < sevenDaysFromNow) {
          dueSoon += amount;
        }
        
        const category = card.icon || 'other';
        if (!byCategory[category]) {
          byCategory[category] = { count: 0, total: 0 };
        }
        byCategory[category].count++;
        byCategory[category].total += amount;
      }
      
      return {
        totalUnpaid,
        totalOverdue,
        dueSoon,
        byCategory: Object.entries(byCategory).map(([category, data]) => ({
          category,
          ...data,
        })),
      };
    }),

  downloadAttachment: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/download-attachment' } })
    .input(z.object({
      cardId: z.string(),
      attachmentIndex: z.number().min(0),
    }))
    .output(z.object({ 
      url: z.string(),
      filename: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }
      
      // Get the card
      const card = await db.query.inboxCards.findFirst({
        where: and(
          eq(inboxCards.cardId, input.cardId),
          eq(inboxCards.userId, userId)
        ),
      });
      
      if (!card) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Card not found' });
      }
      
      // Check if attachment URLs exist
      if (!card.attachmentUrls || card.attachmentUrls.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'No attachments found' });
      }
      
      if (input.attachmentIndex >= card.attachmentUrls.length) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid attachment index' });
      }
      
      const url = card.attachmentUrls[input.attachmentIndex];
      const sourceDetails = card.sourceDetails as any;
      const filename = sourceDetails?.attachments?.[input.attachmentIndex]?.filename || 'document.pdf';
      
      return { url, filename };
    }),

  processDocument: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/inbox/process-document' } })
    .input(z.object({
      fileUrl: z.string().url(),
      fileName: z.string(),
      fileType: z.string(),
    }))
    .output(z.object({ 
      success: z.boolean(),
      cardId: z.string().optional(),
      message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      console.log(`[Inbox.processDocument] Starting document processing for user ${userId}`);
      console.log(`[Inbox.processDocument] File: ${input.fileName}, Type: ${input.fileType}, URL: ${input.fileUrl}`);

      try {
        // PHASE 1: Fetch user's classification settings (same as email-processor)
        console.log(`[Inbox.processDocument] Fetching user classification settings...`);
        const classificationSettings = await db
          .select()
          .from(userClassificationSettings)
          .where(and(
            eq(userClassificationSettings.userId, userId),
            eq(userClassificationSettings.enabled, true)
          ))
          .orderBy(asc(userClassificationSettings.priority));

        console.log(`[Inbox.processDocument] Found ${classificationSettings.length} active classification rules`);

        // PHASE 2: Fetch the file from blob storage
        console.log(`[Inbox.processDocument] Fetching file from blob storage...`);
        const response = await fetch(input.fileUrl);
        if (!response.ok) {
          console.error(`[Inbox.processDocument] Failed to fetch file: ${response.status} ${response.statusText}`);
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Failed to fetch uploaded file' });
        }

        const fileBuffer = Buffer.from(await response.arrayBuffer());
        console.log(`[Inbox.processDocument] File fetched successfully, size: ${fileBuffer.length} bytes`);
        
        // PHASE 3: Process through AI WITHOUT classification rules (same as email-processor)
        console.log(`[Inbox.processDocument] Starting AI document processing (phase 1)...`);
        let aiResult: AiProcessedDocument | null = null;
        let extractedRawText: string | null = null;
        
        if (input.fileType === 'application/pdf') {
          console.log(`[Inbox.processDocument] Processing PDF document...`);
          const { generateObject } = await import('ai');
          const { openai } = await import('@ai-sdk/openai');
          const { aiDocumentProcessSchema } = await import('../services/ai-service');
          
          const extractResult = await generateObject({
            model: openai('o3-2025-04-16'),
            schema: z.object({
              extractedText: z.string().describe('The full text content extracted from the PDF'),
              documentData: aiDocumentProcessSchema,
            }),
            messages: [
              {
                role: 'system',
                content: `You are an expert document processing AI specialized in extracting and analyzing PDF documents.
                
                Your task is to:
                1. Extract ALL text content from the PDF completely and thoroughly
                2. Classify the document type (invoice, receipt, payment_reminder, other_document)
                3. Determine if action is required from the user
                4. Extract structured data based on the document type
                5. Create a user-friendly cardTitle that clearly identifies the document (e.g., "Amazon Invoice #123 - $45.67", "Uber Receipt - Dec 15")
                6. Provide confidence scores for your analysis
                
                CRITICAL: For the extractedText field, provide ALL text content from the PDF, including:
                - Headers, titles, and company information
                - All invoice/receipt line items, amounts, and totals
                - Payment instructions, bank details, routing numbers, account numbers
                - Billing and shipping addresses
                - Terms and conditions, notes, and fine print
                - Contact information and legal text
                - Any other text present in the document
                
                Focus on accuracy and extract all relevant financial information.
                The cardTitle should be concise (max 60 chars) and include key details like vendor, amount, and/or date.
                
                DO NOT apply any classification rules or make decisions about auto-approval - just extract and analyze the document content.`,
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Please extract ALL text content from this PDF document completely and analyze it. First extract every text character, word, number, and symbol from the entire document, then analyze it according to the schema.`,
                  },
                  {
                    type: 'file',
                    data: fileBuffer,
                    mediaType: input.fileType,
                  },
                ],
              },
            ],
          });

          console.log(`[Inbox.processDocument] PDF processing completed`);
          if (extractResult.object.documentData) {
            aiResult = extractResult.object.documentData;
            extractedRawText = extractResult.object.extractedText;
            console.log(`[Inbox.processDocument] AI extracted document type: ${aiResult.documentType}, confidence: ${aiResult.confidence}%`);
          }
        } else if (input.fileType.startsWith('image/')) {
          console.log(`[Inbox.processDocument] Processing image document...`);
          const { generateObject } = await import('ai');
          const { openai } = await import('@ai-sdk/openai');
          const { aiDocumentProcessSchema } = await import('../services/ai-service');
          
          const extractResult = await generateObject({
            model: openai('o3-2025-04-16'),
            schema: z.object({
              extractedText: z.string().describe('The full text content extracted from the image via OCR'),
              documentData: aiDocumentProcessSchema,
            }),
            messages: [
              {
                role: 'system',
                content: `You are an expert document processing AI specialized in extracting and analyzing images of documents.
                
                Your task is to:
                1. Extract ALL text content from the image using OCR (optical character recognition)
                2. Classify the document type (invoice, receipt, payment_reminder, other_document)
                3. Determine if action is required from the user
                4. Extract structured data based on the document type
                5. Create a user-friendly cardTitle that clearly identifies the document (e.g., "Starbucks Receipt - $12.45", "Electric Bill - Due Jan 15")
                6. Provide confidence scores for your analysis
                
                CRITICAL: For the extractedText field, provide ALL text visible in the image, including:
                - Headers, titles, and company names
                - All line items, amounts, and prices
                - Payment instructions, bank details, routing numbers, account numbers
                - Addresses, phone numbers, and contact information
                - Terms, conditions, and fine print
                - Any other text visible in the document
                
                Focus on accuracy and extract all relevant financial information from the image.
                The cardTitle should be concise (max 60 chars) and include key details like vendor, amount, and/or date.
                
                DO NOT apply any classification rules or make decisions about auto-approval - just extract and analyze the document content.`,
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Please extract ALL text content from this document image and analyze it. First extract every visible text character, then analyze it according to the schema.',
                  },
                  {
                    type: 'image',
                    image: input.fileUrl,
                    providerOptions: {
                      openai: { imageDetail: 'high' },
                    },
                  },
                ],
              },
            ],
          });
          
          aiResult = extractResult.object.documentData;
          extractedRawText = extractResult.object.extractedText;
          console.log(`[Inbox.processDocument] Image processing completed`);
          console.log(`[Inbox.processDocument] AI extracted document type: ${aiResult.documentType}, confidence: ${aiResult.confidence}%`);
        }

        if (!aiResult) {
          console.error(`[Inbox.processDocument] AI processing failed - no result returned`);
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: 'Failed to process document through AI' 
          });
        }

        // PHASE 4: Financial validation (same logic as email-processor)
        console.log(`[Inbox.processDocument] Validating financial relevance...`);
        const isFinancialDocument = (
          // Has financial data
          (aiResult.amount !== null && aiResult.amount !== undefined && aiResult.amount > 0) ||
          // Is identified as a financial document type
          ['invoice', 'receipt', 'payment_reminder'].includes(aiResult.documentType || '') ||
          // Has high confidence and financial keywords
          (aiResult.confidence >= 70 && (
            aiResult.extractedSummary?.toLowerCase().includes('invoice') ||
            aiResult.extractedSummary?.toLowerCase().includes('payment') ||
            aiResult.extractedSummary?.toLowerCase().includes('receipt') ||
            aiResult.extractedSummary?.toLowerCase().includes('bill') ||
            aiResult.extractedSummary?.toLowerCase().includes('statement')
          ))
        );

        console.log(`[Inbox.processDocument] Financial validation result: ${isFinancialDocument}`);
        console.log(`[Inbox.processDocument] Document type: ${aiResult.documentType}, Amount: ${aiResult.amount}, Confidence: ${aiResult.confidence}%`);

        if (!isFinancialDocument) {
          console.log(`[Inbox.processDocument] Document rejected - not financial: ${input.fileName}`);
          
          // Still log to action ledger but mark as rejected (same as email-processor)
          const             actionEntry = {
            approvedBy: userId,
            inboxCardId: `rejected-${Date.now()}`,
            actionType: 'document_rejected',
            actionTitle: `Upload rejected: ${input.fileName}`,
            actionSubtitle: 'Document does not contain financial information',
            sourceType: 'manual',
            sourceDetails: {
              fileName: input.fileName,
              fileType: input.fileType,
              uploadedAt: new Date().toISOString(),
            },
            status: 'failed' as const,
            confidence: aiResult.confidence || 0,
            executedAt: new Date(),
            originalCardData: {},
            metadata: {
              fileName: input.fileName,
              fileType: input.fileType,
              rejectionReason: 'non_financial_document',
              aiAnalysis: {
                documentType: aiResult.documentType,
                amount: aiResult.amount,
                confidence: aiResult.confidence,
                summary: aiResult.extractedSummary,
              },
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await db.insert(actionLedger).values(actionEntry);
          console.log(`[Inbox.processDocument] Rejection logged to action ledger`);

          return {
            success: false,
            message: 'This document does not appear to contain financial information. Only invoices, receipts, bills, and other financial documents can be added to the inbox.',
          };
        }

        // PHASE 5: Check confidence threshold (same as email-processor)
        if (aiResult.confidence < 80) {
          console.log(`[Inbox.processDocument] Document rejected - low confidence: ${aiResult.confidence}% (threshold: 80%)`);
          
          const actionEntry = {
            approvedBy: userId,
            inboxCardId: `rejected-${Date.now()}`,
            actionType: 'document_rejected',
            actionTitle: `Upload rejected: ${input.fileName}`,
            actionSubtitle: 'Document confidence too low',
            sourceType: 'manual',
            sourceDetails: {
              fileName: input.fileName,
              fileType: input.fileType,
              uploadedAt: new Date().toISOString(),
            },
            status: 'failed' as const,
            confidence: aiResult.confidence || 0,
            executedAt: new Date(),
            originalCardData: {},
            metadata: {
              fileName: input.fileName,
              fileType: input.fileType,
              rejectionReason: 'low_confidence',
              aiAnalysis: {
                documentType: aiResult.documentType,
                amount: aiResult.amount,
                confidence: aiResult.confidence,
                summary: aiResult.extractedSummary,
              },
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await db.insert(actionLedger).values(actionEntry);
          console.log(`[Inbox.processDocument] Low confidence rejection logged to action ledger`);

          return {
            success: false,
            message: `Document processing confidence too low (${aiResult.confidence}%). Please ensure the document is clear and readable.`,
          };
        }

        // PHASE 6: Apply classification rules (same as email-processor)
        console.log(`[Inbox.processDocument] Applying classification rules...`);
        const { applyClassificationRules, applyClassificationToCard } = await import('../services/classification-service');
        
        // Create a comprehensive synthetic email body for classification and payment extraction
        const syntheticEmailBody = `
          Document: ${input.fileName}
          Type: ${aiResult.documentType}
          Title: ${aiResult.cardTitle || aiResult.extractedTitle || 'Unknown'}
          Summary: ${aiResult.extractedSummary || 'No summary available'}
          Vendor: ${aiResult.sellerName || 'Unknown'}
          Buyer: ${aiResult.buyerName || 'Unknown'}
          Amount: ${aiResult.amount || 'Unknown'}
          Currency: ${aiResult.currency || 'Unknown'}
          Due Date: ${aiResult.dueDate || 'Unknown'}
          Issue Date: ${aiResult.issueDate || 'Unknown'}
          Invoice Number: ${aiResult.invoiceNumber || 'Unknown'}
          
          Items:
          ${aiResult.items?.map((item: any) => `- ${item.name || 'Unknown item'}: ${item.quantity || 1} x ${item.unitPrice || 'Unknown'}`).join('\n') || 'No items listed'}
          
          Additional Information:
          ${aiResult.extractedSummary || 'No additional information'}
          
          Raw Extracted Text:
          ${extractedRawText || 'No raw text extracted'}
        `.trim();

        const classificationResult = await applyClassificationRules(
          aiResult, 
          userId,
          syntheticEmailBody
        );

        console.log(`[Inbox.processDocument] Classification complete - ${classificationResult.matchedRules.length} rules matched`);
        console.log(`[Inbox.processDocument] Auto-approve: ${classificationResult.shouldAutoApprove}, Overall confidence: ${classificationResult.overallConfidence}%`);

        // PHASE 7: Create inbox card (same structure as email-processor)
        console.log(`[Inbox.processDocument] Creating inbox card...`);
        const cardId = uuidv4();
        
        // Determine icon based on document type
        let cardIcon: InboxCard['icon'] = 'file-text';
        if (aiResult.documentType === 'invoice') cardIcon = 'invoice';
        else if (aiResult.documentType === 'receipt') cardIcon = 'receipt';
        else if (aiResult.documentType === 'payment_reminder') cardIcon = 'bell';
        else if (input.fileType === 'application/pdf') cardIcon = 'file-text';
        else if (input.fileType.startsWith('image/')) cardIcon = 'file-text';

        // Create the base inbox card (same structure as email-processor)
        let inboxCard: InboxCard = {
          id: cardId,
          icon: cardIcon,
          title: aiResult.cardTitle || aiResult.extractedTitle || input.fileName,
          subtitle: aiResult.extractedSummary || 'Uploaded document',
          confidence: aiResult.confidence || 90,
          status: 'pending',
          blocked: false,
          timestamp: new Date().toISOString(),
          requiresAction: aiResult.requiresAction ?? true,
          suggestedActionLabel: aiResult.suggestedActionLabel || 'Review',
          amount: aiResult.amount ? String(aiResult.amount) : undefined,
          currency: aiResult.currency || undefined,
          from: aiResult.sellerName || 'Unknown',
          to: aiResult.buyerName || userId,
          logId: `upload-${Date.now()}`,
          subjectHash: null,
          rationale: aiResult.aiRationale || 'Document uploaded for processing',
          codeHash: `upload_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          chainOfThought: [],
          impact: {
            currentBalance: 0,
            postActionBalance: 0,
          },
          parsedInvoiceData: aiResult.documentType === 'invoice' ? aiResult : undefined,
          sourceType: 'manual',
          sourceDetails: {
            name: 'File Upload',
            identifier: input.fileName,
          } as any, // Type assertion since we need to store file metadata
          // Payment tracking (same logic as email-processor)
          paymentStatus: aiResult.documentType === 'receipt' ? 'paid' : 
                        (aiResult.documentType === 'invoice' && aiResult.amount && aiResult.amount > 0) ? 'unpaid' : 
                        'not_applicable',
          dueDate: aiResult.dueDate || undefined,
          // Initialize empty classification fields
          appliedClassifications: [],
          classificationTriggered: false,
          autoApproved: false,
          categories: [],
          // Set attachment fields
          hasAttachments: true,
          attachmentUrls: [input.fileUrl],
        };

        console.log(`[Inbox.processDocument] Base card created with ID: ${cardId}`);

        // PHASE 8: Apply classification results to the card (same as email-processor)
        console.log(`[Inbox.processDocument] Applying classification results to card...`);
        inboxCard = await applyClassificationToCard(classificationResult, inboxCard, userId);
        
        console.log(`[Inbox.processDocument] Final card status: ${inboxCard.status}, auto-approved: ${inboxCard.autoApproved}`);

        // PHASE 9: Track AI classification actions (same as email-processor)
        if (classificationResult.matchedRules.length > 0) {
          console.log(`[Inbox.processDocument] Tracking AI classification actions...`);
          const { CardActionsService } = await import('../services/card-actions-service');
          
          for (const rule of classificationResult.matchedRules) {
            console.log(`[Inbox.processDocument] Tracking action for rule: ${rule.ruleName}`);
            await CardActionsService.trackAction({
              cardId: cardId,
              userId: userId,
              actionType: 'ai_classified',
              actor: 'ai',
              actorDetails: {
                aiModel: 'o3-2025-04-16',
                confidence: rule.confidence,
                ruleName: rule.ruleName,
                ruleId: rule.ruleId,
              },
              newValue: {
                appliedRule: rule.ruleName,
                actions: rule.actions,
                confidence: rule.confidence,
              },
              details: {
                ruleName: rule.ruleName,
                confidence: rule.confidence,
                actions: rule.actions,
                overallConfidence: classificationResult.overallConfidence,
              },
            });
          }
          
          // Track auto-approval separately if it happened
          if (classificationResult.shouldAutoApprove) {
            console.log(`[Inbox.processDocument] Tracking auto-approval action...`);
            await CardActionsService.trackAction({
              cardId: cardId,
              userId: userId,
              actionType: 'ai_auto_approved',
              actor: 'ai',
              actorDetails: {
                aiModel: 'o3-2025-04-16',
                confidence: classificationResult.overallConfidence,
              },
              previousValue: { status: 'pending' },
              newValue: { status: 'auto' },
              details: {
                reason: 'Matched auto-approval rules',
                matchedRules: classificationResult.matchedRules.map((r: any) => r.ruleName),
                overallConfidence: classificationResult.overallConfidence,
              },
            });
          }
        }

        // PHASE 10: Insert into database (same structure as email-processor)
        console.log(`[Inbox.processDocument] Inserting card into database...`);
        const dbCard = {
          id: uuidv4(),
          cardId: inboxCard.id,
          userId,
          logId: inboxCard.logId,
          sourceType: inboxCard.sourceType,
          sourceDetails: inboxCard.sourceDetails,
          timestamp: new Date(inboxCard.timestamp),
          title: inboxCard.title,
          subtitle: inboxCard.subtitle,
          icon: inboxCard.icon,
          status: inboxCard.status,
          confidence: inboxCard.confidence,
          requiresAction: inboxCard.requiresAction,
          suggestedActionLabel: inboxCard.suggestedActionLabel,
          parsedInvoiceData: inboxCard.parsedInvoiceData,
          rationale: inboxCard.rationale,
          chainOfThought: inboxCard.chainOfThought || [],
          comments: inboxCard.comments || [],
          impact: inboxCard.impact || {},
          amount: inboxCard.amount,
          currency: inboxCard.currency,
          paymentStatus: inboxCard.paymentStatus,
          dueDate: inboxCard.dueDate ? new Date(inboxCard.dueDate) : null,
          hasAttachments: inboxCard.hasAttachments,
          attachmentUrls: inboxCard.attachmentUrls,
          from: inboxCard.from,
          to: inboxCard.to,
          codeHash: inboxCard.codeHash,
          subjectHash: inboxCard.subjectHash,
          appliedClassifications: inboxCard.appliedClassifications || [],
          classificationTriggered: inboxCard.classificationTriggered || false,
          autoApproved: inboxCard.autoApproved || false,
          categories: inboxCard.categories || [],
          rawTextContent: extractedRawText || syntheticEmailBody || null, // Store the raw text for better extraction
          createdAt: new Date(),
          updatedAt: new Date(),
          reminderDate: null,
          paidAt: null,
          paidAmount: null,
          paymentMethod: null,
          expenseCategory: null,
          expenseNote: null,
          expenseAddedAt: null,
          fraudMarkedAt: null,
        };

        await db.insert(inboxCards).values(dbCard);
        console.log(`[Inbox.processDocument] Card inserted into database successfully`);

        // PHASE 11: Log classification evaluation to action ledger (same as email-processor)
        if (inboxCard.classificationTriggered) {
          console.log(`[Inbox.processDocument] Logging classification evaluation to action ledger...`);
          try {
            let actionType = 'classification_evaluated';
            let actionTitle = `AI Rules Evaluated: ${inboxCard.title}`;
            let actionSubtitle = 'No rules matched';
            let status: 'approved' | 'executed' = 'approved';
            
            const matchedRules = inboxCard.appliedClassifications?.filter(c => c.matched) || [];
            
            if (matchedRules.length > 0) {
              actionType = 'classification_matched';
              actionSubtitle = `Matched rules: ${matchedRules.map(r => r.name).join(', ')}`;
              
              if (inboxCard.autoApproved) {
                actionType = 'classification_auto_approved';
                actionTitle = `Auto-approved: ${inboxCard.title}`;
                status = 'executed';
              }
            }
            
            const classificationActionEntry = {
              approvedBy: userId,
              inboxCardId: cardId,
              actionTitle: actionTitle,
              actionSubtitle: actionSubtitle,
              actionType: actionType,
              sourceType: 'manual',
              sourceDetails: inboxCard.sourceDetails,
              impactData: inboxCard.impact,
              amount: inboxCard.amount,
              currency: inboxCard.currency,
              confidence: inboxCard.confidence,
              rationale: inboxCard.rationale,
              chainOfThought: inboxCard.chainOfThought,
              originalCardData: inboxCard as any,
              parsedInvoiceData: inboxCard.parsedInvoiceData,
              status: status,
              executionDetails: {
                classificationResults: {
                  evaluated: inboxCard.appliedClassifications,
                  matched: matchedRules,
                  autoApproved: inboxCard.autoApproved,
                  timestamp: new Date().toISOString(),
                }
              },
              executedAt: status === 'executed' ? new Date() : null,
              createdAt: new Date(),
              updatedAt: new Date(),
              metadata: {
                aiProcessing: {
                  documentType: aiResult.documentType,
                  aiConfidence: aiResult.confidence,
                  processingPipeline: 'unified_document_processor',
                }
              }
            };
            
            await db.insert(actionLedger).values(classificationActionEntry);
            console.log(`[Inbox.processDocument] Classification action logged: ${actionType}`);
          } catch (error) {
            console.error(`[Inbox.processDocument] Error logging classification action:`, error);
          }
        }

        // PHASE 12: Create action ledger entry for the upload itself
        console.log(`[Inbox.processDocument] Creating upload action ledger entry...`);
        const actionEntry = {
          approvedBy: userId,
          inboxCardId: cardId,
          actionType: 'document_uploaded',
          actionTitle: `Uploaded ${input.fileName}`,
          actionSubtitle: inboxCard.autoApproved ? 'Auto-approved by AI rules' : 'Pending review',
          sourceType: 'manual',
          status: 'executed' as const,
          confidence: 100,
          executedAt: new Date(),
          originalCardData: inboxCard,
          metadata: {
            fileName: input.fileName,
            fileType: input.fileType,
            processedSuccessfully: true,
            autoApproved: inboxCard.autoApproved,
            processingPipeline: 'unified_document_processor',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.insert(actionLedger).values(actionEntry);
        console.log(`[Inbox.processDocument] Upload action logged successfully`);

        console.log(`[Inbox.processDocument] Document processing completed successfully for ${input.fileName}`);
        console.log(`[Inbox.processDocument] Final result - Card ID: ${cardId}, Status: ${inboxCard.status}, Auto-approved: ${inboxCard.autoApproved}`);

        return {
          success: true,
          cardId: inboxCard.id,
          message: 'Document processed successfully',
        };

      } catch (error) {
        console.error('[Inbox.processDocument] Error during document processing:', error);
        console.error('[Inbox.processDocument] Error details:', {
          fileName: input.fileName,
          fileType: input.fileType,
          userId,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : 'No stack trace',
        });
        
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process document',
        });
      }
    }),

  // Test classification rule
  testClassificationRule: protectedProcedure
    .input(z.object({
      emailContent: z.string(),
      classificationPrompts: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // For testing, we need to format the prompts with rule names
        // Since we're getting just prompts, we'll create synthetic rule names
        const formattedPrompts = input.classificationPrompts.map((prompt, index) => 
          `Rule ${index + 1} - "Test Rule ${index + 1}": ${prompt}`
        );
        
        // Process the email content with the provided classification prompts
        const result = await processDocumentFromEmailText(
          input.emailContent,
          undefined, // No specific subject
          formattedPrompts
        );
        
        return result;
      } catch (error) {
        console.error('[Inbox] Error testing classification rule:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to test classification rule',
        });
      }
    }),

  /**
   * Process CSV file with financial data
   */
  processCSV: protectedProcedure
    .input(z.object({
      csvContent: z.string(),
      fileName: z.string(),
    }))
    .output(z.object({ 
      success: z.boolean(),
      message: z.string(),
      processedCount: z.number(),
      totalCount: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      try {
        // Parse CSV content
        const lines = input.csvContent.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          return { 
            success: false, 
            message: 'CSV file is empty or has no data rows',
            processedCount: 0,
            totalCount: 0
          };
        }

        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['date', 'vendor', 'description', 'amount', 'type'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          return { 
            success: false, 
            message: `Missing required columns: ${missingHeaders.join(', ')}`,
            processedCount: 0,
            totalCount: 0
          };
        }

        // Get column indexes
        const dateIdx = headers.indexOf('date');
        const vendorIdx = headers.indexOf('vendor');
        const descriptionIdx = headers.indexOf('description');
        const amountIdx = headers.indexOf('amount');
        const typeIdx = headers.indexOf('type');

        // Process data rows
        const cards = [];
        const errors = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Simple CSV parsing (handles basic cases, not quoted commas)
          const values = line.split(',').map(v => v.trim());
          
          try {
            const date = new Date(values[dateIdx]);
            if (isNaN(date.getTime())) {
              errors.push(`Row ${i}: Invalid date "${values[dateIdx]}"`);
              continue;
            }

            const amount = parseFloat(values[amountIdx]);
            if (isNaN(amount)) {
              errors.push(`Row ${i}: Invalid amount "${values[amountIdx]}"`);
              continue;
            }

            const type = values[typeIdx]?.toLowerCase();
            if (!['invoice', 'receipt', 'bill', 'payment'].includes(type)) {
              errors.push(`Row ${i}: Invalid type "${values[typeIdx]}". Must be: invoice, receipt, bill, or payment`);
              continue;
            }

            // Create inbox card
            const cardId = uuidv4();
            const card = {
              id: uuidv4(),
              cardId: cardId,
              userId: userId,
              logId: `csv-import-${Date.now()}-${i}`,
              
              // Core fields
              icon: type === 'invoice' ? 'invoice' : type === 'receipt' ? 'receipt' : type === 'bill' ? 'bill' : 'payment',
              title: values[descriptionIdx] || `${type.charAt(0).toUpperCase() + type.slice(1)} from ${values[vendorIdx]}`,
              subtitle: values[vendorIdx] || 'Unknown vendor',
              status: 'pending' as const,
              sourceType: 'csv',
              
              // Extracted data
              fromEntity: values[vendorIdx] || null,
              toEntity: null,
              amount: amount.toFixed(2),
              currency: 'USD',
              confidence: 100, // CSV data is 100% confident
              requiresAction: true,
              
              // Dates
              timestamp: date,
              dueDate: type === 'invoice' || type === 'bill' ? new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000) : null, // 30 days for invoices/bills
              
              // Source details
              sourceDetails: {
                fileName: input.fileName,
                importedAt: new Date().toISOString(),
                rowNumber: i,
                originalData: {
                  date: values[dateIdx],
                  vendor: values[vendorIdx],
                  description: values[descriptionIdx],
                  amount: values[amountIdx],
                  type: values[typeIdx]
                }
              },
              
              // AI processing fields (minimal for CSV imports)
              rationale: `Imported from CSV file: ${input.fileName}`,
              codeHash: 'csv-import-v1',
              chainOfThought: [`Row ${i}: ${type} from ${values[vendorIdx]} for $${amount.toFixed(2)}`],
              impact: {},
              parsedInvoiceData: null,
              rawTextContent: line,
              
              // Metadata
              subjectHash: `csv-${values[vendorIdx]}-${values[amountIdx]}-${i}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            cards.push(card);
          } catch (error) {
            errors.push(`Row ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        if (cards.length === 0) {
          return { 
            success: false, 
            message: errors.length > 0 ? `No valid rows found. Errors: ${errors.join('; ')}` : 'No valid data rows found',
            processedCount: 0,
            totalCount: lines.length - 1
          };
        }

        // Insert cards into database
        await db.insert(inboxCards).values(cards);
        
        // Log the import action
        await db.insert(actionLedger).values({
          approvedBy: userId,
          inboxCardId: 'csv-import-bulk', // Bulk import doesn't have a single card ID
          actionTitle: `CSV Import: ${input.fileName}`,
          actionSubtitle: `Imported ${cards.length} records`,
          actionType: 'csv_import',
          sourceType: 'csv',
          sourceDetails: {
            fileName: input.fileName,
            totalRows: lines.length - 1,
            successfulRows: cards.length,
            errors: errors
          },
          originalCardData: {
            csvImport: true,
            fileName: input.fileName,
            recordCount: cards.length,
            timestamp: new Date().toISOString()
          },
          status: 'executed' as const,
          executedAt: new Date(),
          note: `Imported from CSV file`,
        });

        return { 
          success: true, 
          message: errors.length > 0 
            ? `Imported ${cards.length} records. ${errors.length} rows had errors.`
            : `Successfully imported ${cards.length} records`,
          processedCount: cards.length,
          totalCount: lines.length - 1
        };
      } catch (error) {
        console.error('[Inbox] Error processing CSV:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process CSV file',
          cause: error,
        });
      }
    }),

  /**
   * Process a sample email for demonstration purposes
   */
  processSampleEmail: protectedProcedure
    .input(z.object({
      type: z.enum(['invoice', 'receipt', 'bank-transaction']).default('invoice'),
    }))
    .output(z.object({ 
      success: z.boolean(),
      message: z.string(),
      cardId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      try {
        // Use the real AI processing service
        return await processSampleEmailService(userId, input.type);
      } catch (error) {
        console.error('[Inbox] Error processing sample email:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process sample email',
          cause: error,
        });
      }
    }),

  /**
   * Upload and process a document (image or PDF)
   */
  uploadDocument: protectedProcedure
    .input(z.object({
      document: z.object({
        base64: z.string(),
        mimeType: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
      }),
      fileName: z.string(),
    }))
    .output(z.object({ 
      success: z.boolean(),
      message: z.string(),
      cardId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      try {
        // Process the document with AI
        const buffer = Buffer.from(input.document.base64, 'base64');
        
        // TODO: Integrate with actual document processing service
        // For now, return a mock response
        return {
          success: true,
          message: 'Document processing is not yet implemented',
          cardId: undefined,
        };
      } catch (error) {
        console.error('[Inbox] Error processing document:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process document',
          cause: error,
        });
      }
    }),
});
