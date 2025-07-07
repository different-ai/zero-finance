import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { db } from '@/db';
import { userClassificationSettings } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import type { AiProcessedDocument } from './ai-service';

// Schema for classification results - simplified to avoid OpenAI API validation issues
export const classificationResultSchema = z.object({
  matchedRules: z.array(z.object({
    ruleName: z.string(),
    ruleId: z.string(),
    confidence: z.number().min(0).max(100),
    actions: z.array(z.string()), // Simplified: ["approve", "mark_seen", "categorize:personal"]
  })),
  suggestedCategories: z.array(z.string()),
  shouldAutoApprove: z.boolean(),
  shouldMarkPaid: z.boolean(),
  shouldSchedulePayment: z.boolean(),
  paymentDelayDays: z.number().nullable(),
  expenseCategory: z.string().nullable(),
  additionalNotes: z.string().nullable(),
  overallConfidence: z.number().min(0).max(100),
});

export type ClassificationResult = z.infer<typeof classificationResultSchema>;

/**
 * Apply user classification rules to an already-processed document
 * This is phase 2 of the processing pipeline
 */
export async function applyClassificationRules(
  document: AiProcessedDocument,
  userId: string,
  sourceText?: string
): Promise<ClassificationResult> {
  try {
    // Fetch user's classification settings
    const classificationSettings = await db
      .select()
      .from(userClassificationSettings)
      .where(and(
        eq(userClassificationSettings.userId, userId),
        eq(userClassificationSettings.enabled, true)
      ))
      .orderBy(asc(userClassificationSettings.priority));

    if (classificationSettings.length === 0) {
      // No rules to apply
      return {
        matchedRules: [],
        suggestedCategories: [],
        shouldAutoApprove: false,
        shouldMarkPaid: false,
        shouldSchedulePayment: false,
        paymentDelayDays: null,
        expenseCategory: null,
        additionalNotes: null,
        overallConfidence: 0,
      };
    }

    // Build the rules section for the AI
    const rulesSection = classificationSettings.map((setting, index) => 
      `Rule ${index + 1} (ID: ${setting.id}, Name: "${setting.name}"): ${setting.prompt}`
    ).join('\n');

    // Create a comprehensive document summary for classification
    const documentSummary = `
Document Type: ${document.documentType}
Title: ${document.cardTitle || document.extractedTitle || 'Unknown'}
Summary: ${document.extractedSummary || 'No summary'}
Amount: ${document.amount ? `${document.amount} ${document.currency || 'USD'}` : 'No amount'}
Vendor/Seller: ${document.sellerName || 'Unknown'}
Date: ${document.issueDate || 'No date'}
Due Date: ${document.dueDate || 'No due date'}
AI Analysis: ${document.aiRationale || 'No analysis'}

${sourceText ? `Original Text:\n${sourceText.substring(0, 1000)}${sourceText.length > 1000 ? '...' : ''}` : ''}
`;

    const { object: classificationResult } = await generateObject({
      model: openai('o3-2025-04-16'),
      schema: classificationResultSchema,
      messages: [
        {
          role: 'system',
          content: `You are an AI classification specialist. Your job is to analyze documents against user-defined rules and determine which rules match and what actions should be taken.

IMPORTANT: For each matched rule, specify actions as simple strings. Common actions include:
- "approve" or "auto-approve": Mark the document as automatically approved
- "dismiss" or "ignore": Automatically dismiss the document (e.g., for spam, promotions)
- "mark_seen" or "seen": Mark the document as seen/reviewed without further action
- "mark_paid": Set the payment status to paid
- "categorize:CATEGORY_NAME": Add a specific category tag (e.g., "categorize:personal", "categorize:business")
- "add_to_expenses": Mark for expense tracking
- "set_expense_category:CATEGORY": Set a specific expense category
- "schedule_payment": Schedule an automatic payment
- "schedule_payment:2_days": Schedule payment with specific delay

USER CLASSIFICATION RULES:
${rulesSection}

INSTRUCTIONS:
1. Carefully analyze the document against EACH rule
2. For each rule that matches, list ALL actions it specifies as simple strings
3. Extract specific categories mentioned in the rules (e.g., "personal", "business", "travel")
4. Set shouldAutoApprove=true if ANY rule mentions auto-approval
5. Set shouldMarkPaid=true if ANY rule mentions marking as paid
6. Set shouldSchedulePayment=true if ANY rule mentions payment scheduling
7. Extract payment delay days from rules (e.g., "2 business days" -> paymentDelayDays: 2)
8. Suggest relevant categories based on the document and matching rules
9. Provide confidence scores for each match
10. If a rule mentions expense categories, extract them to expenseCategory field

EXAMPLE OUTPUT FORMAT:
{
  "matchedRules": [
    {
      "ruleName": "Sightglass Weekend Personal",
      "ruleId": "rule-123",
      "confidence": 95,
      "actions": ["approve", "mark_seen", "categorize:personal"]
    }
  ],
  "shouldAutoApprove": true,
  "shouldMarkPaid": false,
  "shouldSchedulePayment": false,
  "paymentDelayDays": null,
  "expenseCategory": "personal",
  "suggestedCategories": ["personal", "food"],
  "additionalNotes": null,
  "overallConfidence": 95
}`,
        },
        {
          role: 'user',
          content: `Please analyze this document against the classification rules and determine which rules match and what actions should be taken:

${documentSummary}`,
        },
      ],
    });

    return classificationResult;
  } catch (error) {
    console.error('[Classification Service] Error applying classification rules:', error);
    
    // Return empty result on error
    return {
      matchedRules: [],
      suggestedCategories: [],
      shouldAutoApprove: false,
      shouldMarkPaid: false,
      shouldSchedulePayment: false,
      paymentDelayDays: null,
      expenseCategory: null,
      additionalNotes: null,
      overallConfidence: 0,
    };
  }
}

/**
 * Convert classification results to inbox card fields
 */
export async function applyClassificationToCard(
  classification: ClassificationResult,
  card: any,
  userId?: string
): Promise<any> {
  console.log(`[Classification] Applying classification to card ${card.id}:`, {
    matchedRules: classification.matchedRules.length,
    shouldAutoApprove: classification.shouldAutoApprove,
    shouldMarkPaid: classification.shouldMarkPaid,
    expenseCategory: classification.expenseCategory,
  });

  // Check for dismiss action first
  const hasDismissAction = classification.matchedRules.some(rule =>
    rule.actions.some(action => action === 'dismiss' || action.startsWith('dismiss'))
  );
  
  if (hasDismissAction) {
    card.status = 'dismissed';
    card.requiresAction = false;
    card.suggestedActionLabel = 'Auto-dismissed';
    console.log(`[Classification] Card ${card.id} auto-dismissed`);
  }
  
  // Check for mark_seen action
  const hasMarkSeenAction = classification.matchedRules.some(rule =>
    rule.actions.some(action => action === 'mark_seen' || action === 'seen' || action.startsWith('mark_seen'))
  );
  
  if (hasMarkSeenAction && card.status !== 'dismissed') {
    card.status = 'seen';
    card.requiresAction = false;
    card.suggestedActionLabel = 'Auto-marked as seen';
    console.log(`[Classification] Card ${card.id} auto-marked as seen`);
  }
  
  // Apply auto-approval (only if not dismissed or seen)
  if (classification.shouldAutoApprove && !['dismissed', 'seen'].includes(card.status)) {
    card.status = 'auto';
    card.requiresAction = false;
    card.suggestedActionLabel = 'Auto-approved';
    console.log(`[Classification] Card ${card.id} auto-approved`);
  }

  // Apply payment status
  if (classification.shouldMarkPaid) {
    card.paymentStatus = 'paid';
    card.paidAt = new Date();
  }
  
  // Handle payment scheduling
  if (classification.shouldSchedulePayment && userId && card.amount) {
    try {
      const { PaymentExecutionService } = await import('./payment-execution-service');
      
      // Extract recipient name from document or use seller name
      const recipientName = card.parsedInvoiceData?.sellerName || 
                           card.sourceDetails?.fromAddress?.split('<')[0]?.trim() ||
                           'Unknown Vendor';
      
      const delayDays = classification.paymentDelayDays || 2; // Default to 2 business days
      
      await PaymentExecutionService.schedulePayment({
        cardId: card.id,
        userId: userId,
        amount: card.amount,
        currency: card.currency || 'USD',
        recipientName: recipientName,
        delayBusinessDays: delayDays,
        paymentMethod: 'ach', // Default payment method
        reason: `Auto-scheduled via classification rule (${delayDays} business day${delayDays !== 1 ? 's' : ''} delay)`,
      });
      
      console.log(`[Classification] Scheduled payment for ${card.amount} ${card.currency} to ${recipientName}`);
    } catch (error) {
      console.error('[Classification] Error scheduling payment:', error);
      // Don't fail the classification if payment scheduling fails
    }
  }

  // Apply categories
  const categories = new Set<string>();
  
  // Add categories from matched rules (parse from action strings)
  classification.matchedRules.forEach(rule => {
    rule.actions.forEach(action => {
      if (action.startsWith('categorize:') || action.startsWith('category:')) {
        const category = action.split(':')[1]?.trim();
        if (category) categories.add(category);
      } else if (action.startsWith('add_category:')) {
        const category = action.split(':')[1]?.trim();
        if (category) categories.add(category);
      }
    });
  });
  
  // Add suggested categories
  classification.suggestedCategories.forEach(cat => categories.add(cat));
  
  if (categories.size > 0) {
    card.categories = Array.from(categories);
  }

  // Apply expense category
  if (classification.expenseCategory) {
    card.expenseCategory = classification.expenseCategory;
    card.addedToExpenses = true;
    card.expenseAddedAt = new Date();
  }

  // Track classification application - convert actions back to object format for storage
  card.appliedClassifications = classification.matchedRules.map(rule => ({
    id: rule.ruleId,
    name: rule.ruleName,
    matched: true,
    confidence: rule.confidence,
    actions: rule.actions.map(action => {
      if (action.includes(':')) {
        const [type, value] = action.split(':', 2);
        return { type, value };
      } else {
        return { type: action, value: null };
      }
    }),
  }));
  
  card.classificationTriggered = classification.matchedRules.length > 0;
  card.autoApproved = classification.shouldAutoApprove;

  console.log(`[Classification] Final card state for ${card.id}:`, {
    status: card.status,
    requiresAction: card.requiresAction,
    classificationTriggered: card.classificationTriggered,
    autoApproved: card.autoApproved,
    appliedClassifications: card.appliedClassifications.length,
    categories: card.categories?.length || 0,
    expenseCategory: card.expenseCategory,
  });

  return card;
} 