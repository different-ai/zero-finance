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
  requiresAction: z.boolean().default(false).describe("Does this document clearly require an action from the user (e.g., payment, approval, response)? Set to true if an action is needed."),
  suggestedActionLabel: z.string().nullable().describe("A concise label for the primary suggested action (e.g., 'Pay Invoice', 'Mark as Paid', 'Archive Receipt', 'Review Document'). Should align with requiresAction."),
  // Invoice specific fields (can be null if not an invoice or data not found)
  invoiceNumber: z.string().nullable().describe("Invoice reference number or ID"),
  buyerName: z.string().nullable().describe("Full name or business name of the buyer/customer"),
  sellerName: z.string().nullable().describe("Full name or business name of the seller/vendor"),
  amount: z.number().nullable().describe("Total amount due for the invoice or mentioned in the document"),
  currency: z.string().nullable().describe("Currency code (e.g., USD, EUR)"),
  dueDate: z.string().nullable().describe("Payment due date in YYYY-MM-DD format"),
  issueDate: z.string().nullable().describe("Date the document was issued or pertains to, in YYYY-MM-DD format"),
  items: z.array(z.object({
    name: z.string().describe("Description of the line item or service"),
    quantity: z.number().nullable().default(1).describe("Quantity of the item/service"),
    unitPrice: z.number().nullable().describe("Price per unit of the item/service"),
  })).nullable().describe("Array of line items or services, if applicable (mainly for invoices)"),
  // Add a generic title/summary for non-invoice documents
  extractedTitle: z.string().nullable().describe("A concise title for the document if not an invoice (e.g., 'Payment Receipt from X', 'Reminder: Bill Y'). For invoices, can be similar to subject or derived."),
  extractedSummary: z.string().nullable().describe("A brief summary of the document content, especially for non-invoices."),
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
export async function processDocumentFromEmailText(emailText: string, emailSubject?: string): Promise<AiProcessedDocument | null> {
  try {
    const prompt = `You are an expert document processing AI. 
    First, classify the document type from the following email content. Valid types are: "invoice", "receipt", "payment_reminder", "other_document".
    Second, determine if this document requires a direct action from the user (e.g., a payment is due, an approval is needed). Set 'requiresAction' to true or false.
    Third, if an action is required, suggest a concise button label for it in 'suggestedActionLabel' (e.g., "Pay Invoice", "Confirm Receipt", "Review Alert"). If no specific action, this can be null or a general label like "View Details".
    Fourth, provide a brief rationale for your classification and key findings in the 'aiRationale' field.
    Fifth, if the document is an "invoice", extract all relevant invoice fields. 
    If it's another document type, try to extract a meaningful 'extractedTitle', 'extractedSummary', and any relevant 'amount', 'currency', 'issueDate'. For non-invoices, invoice-specific fields like 'invoiceNumber', 'buyerName', 'sellerName', 'dueDate', 'items' can be null.
    
    The email subject is: "${emailSubject || 'N/A'}".
    Email text: """${emailText}"""
    
    Extraction Rules:
    1.  Prioritize accuracy for 'documentType', 'requiresAction', 'suggestedActionLabel', and 'aiRationale'.
    2.  If a field is not clearly present or ambiguous, its value should be null.
    3.  Dates (dueDate, issueDate) should be in YYYY-MM-DD format if possible.
    4.  'amount' should be the total numerical value. 'currency' its ISO code.
    5.  Provide an overall 'confidence' score (0-100). If confidence < 60 for non-invoices, or < 80 for invoices, the output might be less reliable.
    6.  If the text is nonsensical or clearly not a financial document, classify as "other_document" with very low confidence and minimal extraction, and set requiresAction to false.
    7.  Populate 'extractedTitle' and 'extractedSummary' appropriately for all document types.`;

    const { object: processedDocument, usage } = await generateObject({
      model: openai('o4-mini'), // Replace with o4-mini
      schema: aiDocumentProcessSchema, // Use the new schema
      prompt,
      temperature: 0.1, // Very low temperature for classification and factual extraction
    });
    
    console.log('[AI Service] Document processing usage:', usage);

    // Initial confidence check (can be refined)
    if (processedDocument.confidence < 30) { // Universal low confidence threshold
        console.log('[AI Service] Overall confidence too low (<30), potentially irrelevant document. Data:', processedDocument);
        // Still return it, let calling function decide how to handle based on documentType and other fields
    }

    return processedDocument;
  } catch (error) {
    console.error('[AI Service] Error processing document from email text:', error);
    return null;
  }
}

// Modify generateInvoiceFromText to use the new schema and provide rationale
export async function generateInvoiceFromText(naturalText: string): Promise<AiProcessedDocument | null> {
  try {
    const prompt = `You are an expert financial assistant AI. Convert the following natural language text into a structured invoice object. 
    Set 'documentType' to "invoice".
    Determine if this invoice 'requiresAction' (typically true for new invoices needing payment/sending) and suggest a 'suggestedActionLabel' (e.g., "Send Invoice", "Schedule Payment").
    Also, provide a brief rationale for your generated fields in 'aiRationale'.
    User input: """${naturalText}"""
    
    Rules:
    1.  Infer buyer, seller, amount, currency, due date, line items.
    2.  Dates should be YYYY-MM-DD. Assume current year. If due date relative, calculate from today.
    3.  Provide 'confidence' score (0-100). If < 80, set uncertain fields to null.
    4.  Populate 'extractedTitle' (e.g., "Invoice for [Buyer]") and 'extractedSummary'.`;

    const { object: generatedData, usage } = await generateObject({
      model: openai('gpt-4o-mini'), // Replace with o4-mini
      schema: aiDocumentProcessSchema, // Use new schema
      prompt,
      temperature: 0.5, 
    });

    console.log('[AI Service] Invoice generation from text usage:', usage);
    const finalData = { ...generatedData, documentType: "invoice" as const }; // Ensure documentType
    if (finalData.requiresAction === undefined) finalData.requiresAction = true; // Default for new invoices
    if (finalData.suggestedActionLabel === undefined) finalData.suggestedActionLabel = "Process Invoice";

    return finalData;
  } catch (error) {
    console.error('[AI Service] Error generating invoice from text:', error);
    return null;
  }
}

// Placeholder for streaming chat responses (Day 2/3)
// export async function getAIChatResponseStream(messages: CoreMessage[]): Promise<ReadableStream<any>> {
//   const result = await streamText({
//     model: openai('gpt-4o-mini'), // Replace with o4-mini
//     messages,
//   });
//   return result.toAIStream();
// } 