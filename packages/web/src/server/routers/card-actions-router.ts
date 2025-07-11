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
          rawTextContent: true,
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
          rawTextContent: card.rawTextContent,
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
6. **ENHANCED Bank Account Details Extraction**: 
   - PRIORITY 1: Scan rawTextContent field thoroughly for payment instructions
   - PRIORITY 2: Check parsedInvoiceData for any financial details
   - PRIORITY 3: Look in sourceDetails and other fields
   
   **Search Patterns (be very thorough):**
   - ACH patterns: "routing", "routing number", "aba", "transit", "rt", "rtn"
   - Account patterns: "account", "account number", "acct", "acc #", "account #"
   - Bank patterns: "bank", "financial institution", "credit union"
   - Wire patterns: "wire", "wire transfer", "remit to", "send payment to"
   - International: "iban", "bic", "swift", "sort code", "bsb"
   - Payment instructions: "pay to", "remit payment", "send funds", "payment details"
   - Common formats:
     * "Routing: 123456789 Account: 1234567890"
     * "ABA: 123456789 Acct: 1234567890"
     * "Bank: First Republic, RTN: 123456789, Account: 1234567890"
     * "Wire to: Bank Name, ABA 123456789, Account 1234567890"
     * "ACH: RT 123456789 / ACCT 1234567890"
     * "IBAN: DE89370400440532013000 BIC: COBADEFFXXX"
   
   **Address/Contact Extraction:**
   - Look for business addresses in payment instructions
   - Common patterns: "123 Main St", "Suite 100", "New York, NY 10001"
   - Extract from signature blocks and company headers
   - Use vendor name to intelligently guess likely US states/cities

EXAMPLE ANALYSIS:
Title: "Acme Corp Invoice #2024-001 - $2,500"
rawTextContent: "Invoice for professional services. Please remit payment via ACH to:
Bank: First Republic Bank
Routing Number: 321081669
Account Number: 1420098765
Account Name: Acme Corporation
Address: 123 Business Ave, San Francisco, CA 94105"
→ Business payment to "Acme Corp" for "Professional Services Invoice #2024-001"
→ Bank: First Republic Bank, Routing: 321081669, Account: 1420098765
→ Address: 123 Business Ave, San Francisco, CA 94105

DATA TO ANALYZE:
${JSON.stringify(cardDataForLLM, null, 2)}

CRITICAL INSTRUCTIONS: 
- Examine EVERY field thoroughly, especially rawTextContent and parsedInvoiceData
- Extract even partial bank details (routing without account, bank name without numbers)
- If you find ANY banking information, include it in the response
- Be aggressive in pattern matching - look for numbers that could be routing/account numbers
- Use regex-like thinking: find 9-digit numbers (likely routing), 8-12 digit numbers (likely accounts)
- Always provide ALL required fields (amount, currency, vendorName, description, suggestedAccountHolderType)
- Confidence should be 80-95% for business invoices with any payment details
- If you find payment instructions, confidence should be 90%+`,
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
   * Look up bank name from routing number using web search
   */
  lookupBankFromRoutingNumber: protectedProcedure
    .input(z.object({
      routingNumber: z.string().describe('The routing number to look up'),
    }))
    .output(z.object({
      bankName: z.string().nullable(),
      confidence: z.number(),
      sources: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      try {
        // Use AI SDK with web search to look up bank information
        const { generateText } = await import('ai');
        const { openai } = await import('@ai-sdk/openai');
        
        const result = await generateText({
          model: openai.responses('o4-mini'),
          prompt: `What is the name of the bank associated with routing number ${input.routingNumber}? Please search for current information about this US bank routing number and return ONLY the bank name.`,
          tools: {
            web_search_preview: openai.tools.webSearchPreview({
              searchContextSize: 'high',
              userLocation: {
                type: 'approximate',
                city: 'San Francisco',
                region: 'California',
              },
            }),
          },
          // Force web search tool to be used
          toolChoice: { type: 'tool', toolName: 'web_search_preview' },
          temperature: 0,
        });

        const bankName = result.text.trim();
        const confidence = bankName && bankName !== 'Unknown' && result.sources && result.sources.length > 0 ? 95 : 50;

        console.log(`[Card Actions] Bank lookup for routing ${input.routingNumber}: ${bankName} (confidence: ${confidence}%)`);
        if (result.sources && result.sources.length > 0) {
          console.log(`[Card Actions] Sources:`, result.sources);
        }
        
        return {
          bankName: bankName === 'Unknown' ? null : bankName,
          confidence,
          sources: result.sources?.map(source => source.url || source.toString()) || [],
        };
      } catch (error) {
        console.error('[Card Actions] Error looking up bank with web search:', error);
        // Return null instead of throwing to allow graceful degradation
        return {
          bankName: null,
          confidence: 0,
          sources: [],
        };
      }
    }),
}); 