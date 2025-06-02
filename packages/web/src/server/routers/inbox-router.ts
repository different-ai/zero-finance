import { z } from 'zod';
import { router, protectedProcedure } from '../create-router'; // Corrected import
import { fetchEmails, SimplifiedEmail } from '../services/gmail-service';
import { processEmailsToInboxCards } from '../services/email-processor';
import type { InboxCard } from '@/types/inbox';
import { processDocumentFromEmailText, generateInvoiceFromText, AiProcessedDocument, aiDocumentProcessSchema } from '../services/ai-service';

export const inboxRouter = router({ // Use 'router' from create-router
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
    .output(z.array(z.custom<InboxCard>())) // Define output as an array of InboxCard
    .mutation(async ({ input }) => {
      try {
        console.log(`Syncing Gmail, fetching up to ${input.count} emails, dateQuery: ${input.dateQuery || 'all time'}...`);
        const emails: any[] = await fetchEmails(input.count, undefined /* keywords default */, input.dateQuery);
        if (!emails || emails.length === 0) {
          console.log('No new emails to process from Gmail.');
          return [];
        }
        const inboxCards: InboxCard[] = await processEmailsToInboxCards(emails);
        console.log(`Processed ${inboxCards.length} emails into InboxCards.`);
        return inboxCards;
      } catch (error) {
        console.error('Error during Gmail sync:', error);
        // Consider throwing a TRPCError or returning a structured error response
        throw new Error('Failed to sync Gmail and process emails.');
      }
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
}); 