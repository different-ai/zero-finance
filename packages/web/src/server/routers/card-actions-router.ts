import { z } from 'zod';
import { router as createTRPCRouter, protectedProcedure } from '../create-router';
import { CardActionsService } from '../services/card-actions-service';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { inboxCards } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateObject } from 'ai';
import { openai } from '@/lib/ai/providers';

// Zod schema for the LLM to structure the extracted payment data
const extractedPaymentDataSchema = z.object({
  // Amount and currency
  amount: z.string().describe('The payment amount as a string (e.g., "2500.00")'),
  currency: z.string().default('USD').describe('The currency code (USD, EUR, etc.)'),
  
  // Vendor/recipient information
  vendorName: z.string().optional().describe('The name of the vendor or recipient'),
  description: z.string().optional().describe('A brief description of what this payment is for'),
  
  // Payment details that could help pre-fill the form
  suggestedAccountHolderType: z.enum(['individual', 'business']).default('business').describe('Whether this appears to be a business or individual payment'),
  suggestedFirstName: z.string().optional().describe('Suggested first name if individual payment'),
  suggestedLastName: z.string().optional().describe('Suggested last name if individual payment'),
  suggestedBusinessName: z.string().optional().describe('Suggested business name if business payment'),
  
  // Address information if available
  suggestedCountry: z.string().optional().describe('Suggested country based on vendor location'),
  suggestedCity: z.string().optional().describe('Suggested city based on vendor location'),
  
  // Additional context
  confidence: z.number().min(0).max(100).describe('Confidence score for the extraction (0-100)'),
  extractionReason: z.string().describe('Brief explanation of how the data was extracted'),
});

export const cardActionsRouter = createTRPCRouter({
  // Track a new action
  trackAction: protectedProcedure
    .input(z.object({
      cardId: z.string(),
      actionType: z.enum([
        'status_changed',
        'marked_seen',
        'marked_paid',
        'dismissed',
        'ignored',
        'snoozed',
        'deleted',
        'approved',
        'executed',
        'marked_fraud',
        'category_added',
        'category_removed',
        'note_added',
        'note_updated',
        'amount_updated',
        'due_date_updated',
        'added_to_expenses',
        'payment_recorded',
        'reminder_set',
        'reminder_sent',
        'ai_classified',
        'ai_auto_approved',
        'ai_suggested_update',
        'attachment_downloaded',
        'shared',
        'comment_added',
        // New action types
        'classification_evaluated',
        'classification_matched',
        'classification_auto_approved',
        'payment_scheduled',
        'payment_cancelled',
      ]),
      actor: z.enum(['human', 'ai', 'system']).optional(),
      actorDetails: z.any().optional(),
      previousValue: z.any().optional(),
      newValue: z.any().optional(),
      details: z.any().optional(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const actionId = await CardActionsService.trackAction({
        ...input,
        userId: ctx.user.id,
      });

      return { actionId };
    }),

  // Get all actions for a card
  getCardActions: protectedProcedure
    .input(z.object({
      cardId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const actions = await CardActionsService.getCardActions(
        input.cardId,
        ctx.user.id
      );

      return { actions };
    }),

  // Get recent actions across all cards
  getRecentActions: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const actions = await CardActionsService.getUserRecentActions(
        ctx.user.id,
        input.limit
      );

      return { actions };
    }),


  // Get action statistics
  getActionStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const stats = await CardActionsService.getActionStats(ctx.user.id);

      return stats;
    }),

  // Track batch actions
  trackBatchActions: protectedProcedure
    .input(z.object({
      actions: z.array(z.object({
        cardId: z.string(),
        actionType: z.enum([
          'status_changed',
          'marked_seen',
          'marked_paid',
          'dismissed',
          'ignored',
          'snoozed',
          'deleted',
          'approved',
          'executed',
          'marked_fraud',
          'category_added',
          'category_removed',
          'note_added',
          'note_updated',
          'amount_updated',
          'due_date_updated',
          'added_to_expenses',
          'payment_recorded',
          'reminder_set',
          'reminder_sent',
          'ai_classified',
          'ai_auto_approved',
          'ai_suggested_update',
          'attachment_downloaded',
          'shared',
          'comment_added',
          // New action types
          'classification_evaluated',
          'classification_matched',
          'classification_auto_approved',
          'payment_scheduled',
          'payment_cancelled',
        ]),
        actor: z.enum(['human', 'ai', 'system']).optional(),
        actorDetails: z.any().optional(),
        previousValue: z.any().optional(),
        newValue: z.any().optional(),
        details: z.any().optional(),
        metadata: z.any().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const actionsWithUser = input.actions.map(action => ({
        ...action,
        userId: ctx.user.id,
      }));

      const actionIds = await CardActionsService.trackBatchActions(actionsWithUser);

      return { actionIds };
    }),

  /**
   * Extract payment data from an inbox card using LLM
   */
  extractPaymentData: protectedProcedure
    .input(z.object({
      cardId: z.string().describe('The ID of the inbox card to extract payment data from'),
    }))
    .output(extractedPaymentDataSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      // Fetch the card data
      const card = await db.query.inboxCards.findFirst({
        where: eq(inboxCards.cardId, input.cardId),
        columns: {
          title: true,
          subtitle: true,
          amount: true,
          currency: true,
          fromEntity: true,
          toEntity: true,
          parsedInvoiceData: true,
          sourceDetails: true,
          rationale: true,
          chainOfThought: true,
        },
      });

      if (!card) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Card not found' });
      }

      try {
        // Prepare the card data for the LLM
        const cardDataForLLM = {
          title: card.title,
          subtitle: card.subtitle,
          amount: card.amount,
          currency: card.currency,
          fromEntity: card.fromEntity,
          toEntity: card.toEntity,
          parsedInvoiceData: card.parsedInvoiceData,
          sourceDetails: card.sourceDetails,
          rationale: card.rationale,
          chainOfThought: card.chainOfThought,
        };

        const { object: extractedData } = await generateObject({
          model: openai('o3-2025-04-16'),
          schema: extractedPaymentDataSchema,
          prompt: `You are an AI assistant that extracts payment information from inbox card data to pre-fill a payment form.

Your task is to analyze the provided inbox card data and extract relevant information that would be useful for pre-filling a payment form (SimplifiedOffRamp).

Key guidelines:
1. Extract the payment amount and currency
2. Identify the vendor/recipient name
3. Create a clear description of what the payment is for
4. Determine if this is likely a business or individual payment
5. Extract any name or address information that could help pre-fill the form
6. Be conservative - only extract information you're confident about
7. Provide a confidence score and explanation

Here is the inbox card data to analyze:
${JSON.stringify(cardDataForLLM, null, 2)}

Focus on accuracy and only extract information that is clearly present in the data.`,
          temperature: 0.1, // Low temperature for consistent extraction
        });

        console.log(`[Card Actions] Successfully extracted payment data for card ${input.cardId} with confidence ${extractedData.confidence}%`);
        
        return extractedData;
      } catch (error) {
        console.error('[Card Actions] Error extracting payment data:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to extract payment data from card',
        });
      }
    }),
}); 