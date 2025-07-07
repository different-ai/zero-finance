import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { fetchEmails, SimplifiedEmail } from '../services/gmail-service';
import type { GmailAttachmentMetadata } from '../services/gmail-service';
import { processEmailsToInboxCards } from '../services/email-processor';
import { GmailTokenService } from '../services/gmail-token-service';
import type { InboxCard } from '@/types/inbox';
import { processDocumentFromEmailText, generateInvoiceFromText, AiProcessedDocument, aiDocumentProcessSchema } from '../services/ai-service';
import { dbCardToUiCard } from '@/lib/inbox-card-utils';
import { createInvoiceRequest, type InvoiceRequestData } from '@/lib/request-network';
import { getCurrencyConfig, type CryptoCurrencyConfig } from '@/lib/currencies';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { ethers } from 'ethers';
import { eq, and, desc, or, asc, ne, not, isNull } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { gmailSyncJobs, inboxCards, gmailProcessingPrefs, actionLedger, userClassificationSettings } from '@/db/schema';

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
                        triggeredClassifications: card.parsedInvoiceData?.triggeredClassifications,
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
                        triggeredClassifications: card.parsedInvoiceData?.triggeredClassifications,
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

      try {
        console.log(`[Inbox] Processing uploaded document: ${input.fileName}`);
        
        // Fetch the file from blob storage
        const response = await fetch(input.fileUrl);
        if (!response.ok) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Failed to fetch uploaded file' });
        }

        const fileBuffer = Buffer.from(await response.arrayBuffer());
        
        // Process through the AI pipeline
        let aiResult: AiProcessedDocument | null = null;
        let extractedData: any = null;
        
        if (input.fileType === 'application/pdf') {
          // Process PDF through AI directly
          const { generateObject } = await import('ai');
          const { openai } = await import('@ai-sdk/openai');
          const { aiDocumentProcessSchema } = await import('../services/ai-service');
          const { put } = await import('@vercel/blob');
          
          // PHASE 1: Extract and transcribe document WITHOUT classification rules
          // This ensures clean extraction without interference
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
                1. Extract all text content from the PDF
                2. Classify the document type (invoice, receipt, payment_reminder, other_document)
                3. Determine if action is required from the user
                4. Extract structured data based on the document type
                5. Create a user-friendly cardTitle that clearly identifies the document (e.g., "Amazon Invoice #123 - $45.67", "Uber Receipt - Dec 15")
                6. Provide confidence scores for your analysis
                
                Focus on accuracy and extract all relevant financial information.
                The cardTitle should be concise (max 60 chars) and include key details like vendor, amount, and/or date.
                
                DO NOT apply any user-specific rules or classifications at this stage. Just extract the raw data.`,
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Please extract and analyze this PDF document. First extract all text, then analyze it according to the schema.`,
                  },
                  {
                    type: 'file',
                    data: fileBuffer,
                    mimeType: input.fileType,
                    filename: input.fileName,
                  },
                ],
              },
            ],
          });

          extractedData = extractResult.object;
          if (extractedData.documentData) {
            aiResult = extractedData.documentData;
          }
        } else if (input.fileType.startsWith('image/')) {
          // Process image through AI vision
          const { generateObject } = await import('ai');
          const { openai } = await import('@ai-sdk/openai');
          const { aiDocumentProcessSchema } = await import('../services/ai-service');
          
          // PHASE 1: Extract document content WITHOUT classification rules
          const { object: processedDocument } = await generateObject({
            model: openai('o3-2025-04-16'),
            schema: aiDocumentProcessSchema,
            messages: [
              {
                role: 'system',
                content: `You are an expert document processing AI specialized in extracting and analyzing images of documents.
                
                Your task is to:
                1. Analyze the image content
                2. Classify the document type (invoice, receipt, payment_reminder, other_document)
                3. Determine if action is required from the user
                4. Extract structured data based on the document type
                5. Create a user-friendly cardTitle that clearly identifies the document (e.g., "Starbucks Receipt - $12.45", "Electric Bill - Due Jan 15")
                6. Provide confidence scores for your analysis
                
                Focus on accuracy and extract all relevant financial information from the image.
                The cardTitle should be concise (max 60 chars) and include key details like vendor, amount, and/or date.
                
                DO NOT apply any user-specific rules or classifications at this stage. Just extract the raw data.`,
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Please analyze this document image and extract all relevant financial information according to the schema.',
                  },
                  {
                    type: 'image',
                    image: input.fileUrl, // Direct URL to the image
                    // Optional: Add provider-specific options for better quality
                    providerOptions: {
                      openai: { imageDetail: 'high' },
                    },
                  },
                ],
              },
            ],
          });
          
          aiResult = processedDocument;
        }

        if (!aiResult) {
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: 'Failed to process document through AI' 
          });
        }

        // Financial validation for manual uploads
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

        if (!isFinancialDocument) {
          console.log(`[Inbox] Document rejected - not financial: ${input.fileName}`);
          
          // Still log to action ledger but mark as rejected
          const actionEntry = {
            approvedBy: userId,
            inboxCardId: `rejected-${Date.now()}`, // Use a unique ID for rejected items
            actionType: 'document_rejected',
            actionTitle: `Upload rejected: ${input.fileName}`,
            actionSubtitle: 'Document does not contain financial information',
            sourceType: 'manual_upload',
            sourceDetails: {
              fileName: input.fileName,
              fileType: input.fileType,
              uploadedAt: new Date().toISOString(),
            },
            status: 'failed' as const,
            confidence: aiResult.confidence || 0,
            executedAt: new Date(),
            originalCardData: {}, // Empty object instead of null
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

          return {
            success: false,
            message: 'This document does not appear to contain financial information. Only invoices, receipts, bills, and other financial documents can be added to the inbox.',
          };
        }

        // PHASE 2: Apply classification rules
        const { applyClassificationRules, applyClassificationToCard } = await import('../services/classification-service');
        const classificationResult = await applyClassificationRules(
          aiResult, 
          userId,
          input.fileType === 'application/pdf' && extractedData ? extractedData.extractedText : undefined
        );

        // Generate a unique code hash for this upload
        const codeHash = `upload_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Create inbox card from the processed document
        const cardId = uuidv4();
        
        let card: any = {
          id: uuidv4(),
          cardId,
          userId,
          logId: `upload-${Date.now()}`,
          sourceType: 'manual_upload',
          sourceDetails: {
            fileName: input.fileName,
            fileType: input.fileType,
            uploadedAt: new Date().toISOString(),
            fileUrl: input.fileUrl,
          },
          timestamp: new Date(),
          title: aiResult.cardTitle || aiResult.extractedTitle || input.fileName,
          subtitle: aiResult.extractedSummary || 'Uploaded document',
          icon: input.fileType === 'application/pdf' ? 'pdf' : 'image',
          status: 'pending' as const,
          confidence: aiResult.confidence || 90,
          requiresAction: true,
          suggestedActionLabel: 'Review Document',
          parsedInvoiceData: aiResult,
          rationale: aiResult.aiRationale || 'Document uploaded for processing',
          chainOfThought: [],
          comments: [],
          impact: {},
          // Financial fields
          amount: aiResult.amount?.toString(),
          currency: aiResult.currency === null ? undefined : aiResult.currency,
          paymentStatus: 'unpaid' as const,
          dueDate: aiResult.dueDate ? new Date(aiResult.dueDate) : null,
          hasAttachments: true,
          attachmentUrls: [input.fileUrl],
          from: aiResult.sellerName === null ? 'Unknown' : aiResult.sellerName,
          to: aiResult.buyerName === null ? userId : aiResult.buyerName,
          codeHash,
          subjectHash: null,
          // Initialize empty classification fields
          appliedClassifications: [],
          classificationTriggered: false,
          autoApproved: false,
          categories: [],
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

        // Apply classification results to the card
        card = await applyClassificationToCard(classificationResult, card, userId);

        // Insert into database
        await db.insert(inboxCards).values(card);

        // Log classification evaluation to action ledger
        if (card.classificationTriggered) {
          try {
            // Determine action type based on what happened
            let actionType = 'classification_evaluated';
            let actionTitle = `AI Rules Evaluated: ${card.title}`;
            let actionSubtitle = 'No rules matched';
            let status: 'approved' | 'executed' = 'approved';
            
            const matchedRules = card.appliedClassifications.filter((c: any) => c.matched);
            
            if (matchedRules.length > 0) {
              actionType = 'classification_matched';
              actionSubtitle = `Matched rules: ${matchedRules.map((r: any) => r.name).join(', ')}`;
              
              if (card.autoApproved) {
                actionType = 'classification_auto_approved';
                actionTitle = `Auto-approved: ${card.title}`;
                status = 'executed';
              }
            }
            
            const classificationActionEntry = {
              approvedBy: userId,
              inboxCardId: cardId,
              actionTitle: actionTitle,
              actionSubtitle: actionSubtitle,
              actionType: actionType,
              sourceType: 'manual_upload',
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
                  evaluated: card.appliedClassifications,
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
                  documentType: aiResult.documentType,
                  aiConfidence: aiResult.confidence,
                }
              }
            };
            
            await db.insert(actionLedger).values(classificationActionEntry);
            console.log(`[Inbox] Logged classification action for uploaded document ${cardId}: ${actionType}`);
          } catch (error) {
            console.error(`[Inbox] Error logging classification action for uploaded document ${cardId}:`, error);
            // Continue processing even if logging fails
          }
        }

        // Create action ledger entry for the upload itself
        const actionEntry = {
          approvedBy: userId,
          inboxCardId: cardId,
          actionType: 'document_uploaded',
          actionTitle: `Uploaded ${input.fileName}`,
          actionSubtitle: card.autoApproved ? 'Auto-approved by AI rules' : undefined,
          sourceType: 'manual_upload',
          status: 'executed' as const,
          confidence: 100,
          executedAt: new Date(),
          originalCardData: card,
          metadata: {
            fileName: input.fileName,
            fileType: input.fileType,
            processedSuccessfully: true,
            autoApproved: card.autoApproved,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.insert(actionLedger).values(actionEntry);

        return {
          success: true,
          cardId: card.cardId,
          message: 'Document processed successfully',
        };

      } catch (error) {
        console.error('[Inbox] Error processing document:', error);
        
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
        // Process the email content with the provided classification prompts
        const result = await processDocumentFromEmailText(
          input.emailContent,
          undefined, // No specific subject
          input.classificationPrompts
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
}); 