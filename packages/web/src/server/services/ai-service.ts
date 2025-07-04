import { openai } from '@ai-sdk/openai';
import { generateObject, streamText, generateText } from 'ai';
import { z } from 'zod';

// Enhanced AI Schema for document processing
export const aiDocumentProcessSchema = z.object({
  documentType: z.enum(["invoice", "receipt", "payment_reminder", "other_document"]) // Added document type
    .describe("The classified type of the document (e.g., invoice, receipt, payment_reminder, other_document)."),
  aiRationale: z.string().nullable() // Added field for LLM's rationale
    .describe("A brief explanation from the AI about its categorization and key findings."),
  confidence: z.number().min(0).max(100)
    .describe("Overall confidence score (0-100) of the categorization and extracted data. If confidence is below 60 for non-invoice types, or below 80 for invoices, treat with caution."),
  requiresAction: z.boolean().describe("Does this document clearly require an action from the user (e.g., payment, approval, response)? Set to true if an action is needed."),
  suggestedActionLabel: z.string().nullable().describe("A concise label for the primary suggested action (e.g., 'Pay Invoice', 'Mark as Paid', 'Archive Receipt', 'Review Document'). Should align with requiresAction."),
  cardTitle: z.string().describe("A user-friendly, concise title for the inbox card. Should be descriptive and actionable (e.g., 'Amazon Order #123', 'Electricity Bill - Due Dec 15', 'Uber Receipt - $45.23'). Maximum 60 characters."),
  // Invoice specific fields (can be null if not an invoice or data not found)
  invoiceNumber: z.string().nullable().describe("Invoice reference number or ID"),
  buyerName: z.string().nullable().describe("Full name or business name of the buyer/customer"),
  sellerName: z.string().nullable().describe("Full name or business name of the seller/vendor"),
  amount: z.number().nullable().describe("Total amount due for the invoice or mentioned in the document"),
  currency: z.string().nullable().describe("Currency code (e.g., USD, EUR)"),
  dueDate: z.string().nullable().describe("Payment due date in YYYY-MM-DD format"),
  issueDate: z.string().nullable().describe("Date the document was issued or pertains to, in YYYY-MM-DD format"),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().nullable(),
    unitPrice: z.number().nullable(),
    total: z.number().nullable(),
  })).nullable().describe("Line items if available"),
  extractedTitle: z.string().nullable().describe("The main title or heading from the document"),
  extractedSummary: z.string().nullable().describe("A brief summary of the document's content"),
  // Classification tracking
  triggeredClassifications: z.array(z.string()).nullable().describe("Names of user classification rules that matched this document"),
  shouldAutoApprove: z.boolean().describe("Whether this document should be auto-approved based on classification rules"),
});
export type AiProcessedDocument = z.infer<typeof aiDocumentProcessSchema>;

// For Day 1, a very simple confidence heuristic based on keywords.
// For Day 2, this will involve more sophisticated o4-mini prompting.
export async function getSimpleEmailConfidence(
  subject?: string | null,
  snippet?: string | null,
  attachmentCount?: number,
): Promise<number> {
  let score = 30; // Base score
  const keywords = ['invoice', 'receipt', 'bill', 'payment', 'due', 'statement'];

  const textToSearch = `${subject?.toLowerCase() || ''} ${snippet?.toLowerCase() || ''}`;

  for (const keyword of keywords) {
    if (textToSearch.includes(keyword)) {
      score += 10;
    }
  }

  if (attachmentCount && attachmentCount > 0) {
    score += 20;
  }

  // Simulate some variability like a real model would have
  score += Math.floor(Math.random() * 10) - 5;

  return Math.max(0, Math.min(100, score)); // Cap between 0-100
}

// Function to extract structured data from email text (subject + body)
// Renamed to reflect broader document processing
export async function processDocumentFromEmailText(
  emailBodyText: string,
  emailSubject?: string,
  userClassificationPrompts?: string[]
): Promise<AiProcessedDocument | null> {
  try {
    const contentToProcess = `Subject: ${emailSubject || 'No Subject'}\n\nBody:\n${emailBodyText}`.trim();
    
    if (!contentToProcess || contentToProcess.length < 10) {
      console.warn('[AI Service] Content too short to process.');
      return null;
    }

    // Build classification prompts section
    let classificationPromptsSection = '';
    if (userClassificationPrompts && userClassificationPrompts.length > 0) {
      classificationPromptsSection = `
CLASSIFICATION RULES TO EVALUATE:
${userClassificationPrompts.map((prompt, index) => `${index + 1}. ${prompt}`).join('\n')}

For each rule above, evaluate if it matches and include in triggeredClassifications array with:
- ruleIndex: the number of the rule (1-based)
- matched: true/false
- confidence: 0-100
- reason: why it matched or didn't match
`;
    }

    const systemPrompt = `You are an AI assistant specialized in processing financial documents from emails. Extract structured data and classify the document type.

${classificationPromptsSection}

IMPORTANT: Only process documents that are clearly financial in nature (invoices, receipts, bills, payment reminders, financial statements). 
For non-financial emails (introductions, newsletters, marketing, general correspondence), set documentType to "other_document" and provide minimal extraction.

Return a JSON object with this structure:
{
  "documentType": "invoice" | "receipt" | "payment_reminder" | "other_document",
  "confidence": number (0-100),
  "extractedTitle": string,
  "extractedSummary": string (2-3 sentences),
  "amount": number | null,
  "currency": string | null,
  "dueDate": string | null (ISO date),
  "vendor": string | null,
  "invoiceNumber": string | null,
  "paymentMethod": string | null,
  "requiresAction": boolean,
  "suggestedActionLabel": string,
  "aiRationale": string,
  "cardTitle": string (short title for UI card),
  "triggeredClassifications": array of classification results
}`;

    const userPrompt = `Process this email content and extract financial information if present:\n\n${contentToProcess}`;

    const { object: processedDocument } = await generateObject({
      model: openai('o3-2025-04-16'),
      schema: aiDocumentProcessSchema,
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      temperature: 0.3,
    });
    
    // Log the classification result
    console.log(`[AI Service] Document classified as: ${processedDocument.documentType} with confidence: ${processedDocument.confidence}%`);
    if (processedDocument.documentType === 'other_document') {
      console.log(`[AI Service] Non-financial document detected: ${processedDocument.extractedTitle || 'No title'}`);
    }
    
    return processedDocument;
  } catch (error) {
    console.error('[AI Service] Error processing document:', error);
    return null;
  }
}

// Modify generateInvoiceFromText to use the new schema and provide rationale
export async function generateInvoiceFromText(naturalText: string): Promise<AiProcessedDocument | null> {
  try {
    const prompt = `You are an expert financial assistant AI. Convert the following natural language text into a structured invoice object. 
    Set 'documentType' to "invoice".
    You MUST determine if this invoice 'requiresAction' (typically true for new invoices needing payment/sending) and set it to either true or false - this field is required.
    If an action is required, suggest a 'suggestedActionLabel' (e.g., "Send Invoice", "Schedule Payment").
    Also, provide a brief rationale for your generated fields in 'aiRationale'.
    User input: """${naturalText}"""
    
    Rules:
    1.  Infer buyer, seller, amount, currency, due date, line items.
    2.  Dates should be YYYY-MM-DD. Assume current year. If due date relative, calculate from today.
    3.  Provide 'confidence' score (0-100). If < 80, set uncertain fields to null.
    4.  Populate 'extractedTitle' (e.g., "Invoice for [Buyer]") and 'extractedSummary'.
    5.  IMPORTANT: 'requiresAction' must always be provided as either true or false.`;

    const { object: generatedData, usage } = await generateObject({
      model: openai('o4-mini'), // Replace with o4-mini
      schema: aiDocumentProcessSchema, // Use new schema
      prompt,
      
    });

    console.log('[AI Service] Invoice generation from text usage:', usage);
    const finalData = { ...generatedData, documentType: "invoice" as const }; // Ensure documentType
    if (!finalData.suggestedActionLabel) finalData.suggestedActionLabel = "Process Invoice";

    return finalData;
  } catch (error) {
    console.error('[AI Service] Error generating invoice from text:', error);
    return null;
  }
}

// Placeholder for streaming chat responses (Day 2/3)
// export async function getAIChatResponseStream(messages: CoreMessage[]): Promise<ReadableStream<any>> {
//   const result = await streamText({
//     model: openai('o3-2025-04-16'), // Replace with o4-mini
//     messages,
//   });
//   return result.toAIStream();
// } 