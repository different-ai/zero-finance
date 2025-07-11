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
  // Amount and currency (always provided)
  amount: z.string().describe('The payment amount as a string (e.g., "2500.00")'),
  currency: z.string().describe('The currency code (USD, EUR, etc.)'),
  
  // Vendor/recipient information
  vendorName: z.string().nullable().describe('The name of the vendor or recipient'),
  description: z.string().nullable().describe('A brief description of what this payment is for'),
  
  // Payment details for form prefilling
  suggestedAccountHolderType: z.enum(['individual', 'business']).nullable().describe('Likely account holder type'),
  suggestedFirstName: z.string().nullable().describe('Suggested first name if individual payment'),
  suggestedLastName: z.string().nullable().describe('Suggested last name if individual payment'),
  suggestedBusinessName: z.string().nullable().describe('Suggested business name if business payment'),
  
  // Address information
  suggestedCountry: z.string().nullable().describe('Suggested country'),
  suggestedCity: z.string().nullable().describe('Suggested city'),
  suggestedBankName: z.string().nullable().describe('Suggested bank name'),
  suggestedStreetAddress: z.string().nullable().describe('Suggested street address'),
  suggestedPostalCode: z.string().nullable().describe('Suggested postal/ZIP code'),
  
  // Bank account details
  suggestedAccountNumber: z.string().nullable().describe('Bank account number if found in the invoice'),
  suggestedRoutingNumber: z.string().nullable().describe('Bank routing number if found in the invoice'),
  suggestedIban: z.string().nullable().describe('IBAN if found in the invoice'),
  suggestedBicSwift: z.string().nullable().describe('BIC/SWIFT code if found in the invoice'),
  
  // Additional context
  confidence: z.number().describe('Confidence score 0-100'),
  extractionReason: z.string().describe('Explanation of extraction logic'),
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
        'payment_executed',
        'document_uploaded',
        'document_rejected',
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
          'payment_executed',
          'document_uploaded',
          'document_rejected',
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
          prompt: `You are an AI assistant specialized in extracting payment information from invoice/receipt data to pre-fill payment forms.

ANALYSIS TASK:
Extract structured payment data from the provided inbox card to pre-fill a payment transfer form.

KEY EXTRACTION RULES:
1. **Amount & Currency**: Extract exact payment amount and currency (default to USD if unclear)
2. **Vendor Analysis**: 
   - Extract company/vendor name from title, fromEntity, or parsedInvoiceData
   - If it's a company (Corp, LLC, Inc, Ltd, etc.) → Business payment
   - If it's an individual name → Individual payment
3. **Smart Business Detection**:
   - "Acme Corp" → Business (suggestedBusinessName: "Acme Corp")
   - "John Smith Services" → Business (suggestedBusinessName: "John Smith Services")  
   - "John Smith" (personal) → Individual (suggestedFirstName: "John", suggestedLastName: "Smith")
4. **Address Inference**: Use company name to suggest realistic location data
5. **Description**: Create clear payment description from context
6. **Bank Account Details**: 
   - Look for ACH details: routing number (9 digits) and account number
   - Look for IBAN and BIC/SWIFT codes for international payments
   - Look for bank names in payment instructions
   - Common patterns: "routing: 123456789", "account: 1234567890", "bank: First Republic"

EXAMPLE ANALYSIS:
Title: "Acme Corp Invoice #2024-001 - $2,500"
Payment instructions: "remit payment via ach bank: first republic bank routing: 321081669 account: 1420098765"
→ Business payment to "Acme Corp" for "Professional Services Invoice #2024-001"
→ Bank: First Republic Bank, Routing: 321081669, Account: 1420098765
→ Suggest US business address details

DATA TO ANALYZE:
${JSON.stringify(cardDataForLLM, null, 2)}

IMPORTANT: 
- Always provide ALL required fields (amount, currency, vendorName, description, suggestedAccountHolderType)
- Extract bank account details if present (routing numbers, account numbers, IBANs, bank names)
- Use business logic to infer missing details
- Be confident in standard business payment scenarios
- Confidence should be 70-95% for clear business invoices`,
          temperature: 0.2, // Slightly higher for more creative inference
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

  /**
   * Look up bank name from routing number using AI knowledge
   */
  lookupBankFromRoutingNumber: protectedProcedure
    .input(z.object({
      routingNumber: z.string().describe('The routing number to look up'),
    }))
    .output(z.object({
      bankName: z.string().nullable(),
      confidence: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      try {
        // Use AI SDK to look up bank information from its knowledge
        const { generateText } = await import('ai');
        const { openai } = await import('@ai-sdk/openai');
        
        const { text } = await generateText({
          model: openai('o4-mini'),
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that knows about US bank routing numbers. Based on your knowledge, identify the bank name for the given routing number. Return ONLY the bank name without any additional text or explanation. If you cannot identify the bank with confidence, return "Unknown".'
            },
            {
              role: 'user',
              content: `What is the name of the bank with routing number ${input.routingNumber}? Common routing numbers include: 321081669 for First Republic Bank, 026009593 for Bank of America, 021000021 for JPMorgan Chase, etc.`
            }
          ],
          temperature: 0,
        });

        const bankName = text.trim();
        const confidence = bankName && bankName !== 'Unknown' ? 85 : 0;

        console.log(`[Card Actions] Bank lookup for routing ${input.routingNumber}: ${bankName} (confidence: ${confidence}%)`);
        
        return {
          bankName: bankName === 'Unknown' ? null : bankName,
          confidence,
        };
      } catch (error) {
        console.error('[Card Actions] Error looking up bank:', error);
        // Return null instead of throwing to allow graceful degradation
        return {
          bankName: null,
          confidence: 0,
        };
      }
    }),
}); 