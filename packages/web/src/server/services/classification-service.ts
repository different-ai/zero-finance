import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { db } from '@/db';
import { userClassificationSettings } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import type { AiProcessedDocument } from './ai-service';

// Schema for classification results (AI SDK 5.0 compatible)
export const classificationResultSchema = z.object({
  matchedRules: z.array(z.object({
    ruleName: z.string(),
    ruleId: z.string(),
    confidence: z.number().min(0).max(100),
    actions: z.array(z.object({
      type: z.enum(['approve', 'mark_paid', 'add_category', 'add_note', 'set_expense_category', 'dismiss', 'mark_seen', 'schedule_payment']),
      value: z.string().nullable(), // Changed from optional() to nullable() for AI SDK 5.0 compatibility
    })),
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

IMPORTANT: Each rule may specify multiple actions. Common actions include:
- "approve" or "auto-approve": Mark the document as automatically approved
- "dismiss" or "ignore": Automatically dismiss the document (e.g., for spam, promotions)
- "mark as seen" or "mark seen": Mark the document as seen/reviewed without further action
- "mark as paid": Set the payment status to paid
- "categorize as [category]": Add a specific category tag
- "add to expenses": Mark for expense tracking
- "set expense category": Set a specific expense category
- "schedule payment": Schedule an automatic payment (specify delay days like "schedule payment in 2 days")

USER CLASSIFICATION RULES:
${rulesSection}

INSTRUCTIONS:
1. Carefully analyze the document against EACH rule
2. For each rule that matches, determine ALL actions it specifies
3. Extract specific categories mentioned in the rules (e.g., "dev tools", "office supplies", "travel")
4. Set shouldAutoApprove=true if ANY rule mentions auto-approval
5. Set shouldMarkPaid=true if ANY rule mentions marking as paid
6. Set shouldSchedulePayment=true if ANY rule mentions payment scheduling
7. Extract payment delay days from rules (e.g., "2 business days" -> paymentDelayDays: 2)
8. Suggest relevant categories based on the document and matching rules
9. Provide confidence scores for each match
10. If a rule mentions expense categories, extract them to expenseCategory field`,
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
export function applyClassificationToCard(
  _classification: ClassificationResult,
  card: any,
): any {
  return card;
}
