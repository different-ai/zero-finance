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
  emailText: string, 
  emailSubject?: string,
  userClassificationPrompts?: string[]
): Promise<AiProcessedDocument | null> {
  try {
    // print the api key for openai
    console.log('[AI Service] OpenAI API Key:', process.env.OPENAI_API_KEY);

    const prompt = `You are an expert document processing AI. 
    First, classify the document type from the following email content. Valid types are: "invoice", "receipt", "payment_reminder", "other_document".
    Second, determine if this document requires a direct action from the user (e.g., a payment is due, an approval is needed). You MUST set 'requiresAction' to either true or false - this field is required.
    Third, if an action is required, suggest a concise button label for it in 'suggestedActionLabel' (e.g., "Pay Invoice", "Confirm Receipt", "Review Alert"). If no specific action, this can be null or a general label like "View Details".
    Fourth, provide a brief rationale for your classification and key findings in the 'aiRationale' field.
    Fifth, create a user-friendly 'cardTitle' that clearly identifies what this document is about. Examples:
       - For invoices: "Acme Corp Invoice #1234 - $500"
       - For receipts: "Starbucks Receipt - $12.45"
       - For bills: "Electric Bill - Due Jan 15"
       - For statements: "Bank Statement - December 2024"
       The title should be concise (max 60 chars) and include key details like vendor/source, amount, and/or due date.
    Sixth, if the document is an "invoice", extract all relevant invoice fields. 
    If it's another document type, try to extract a meaningful 'extractedTitle', 'extractedSummary', and any relevant 'amount', 'currency', 'issueDate'. For non-invoices, invoice-specific fields like 'invoiceNumber', 'buyerName', 'sellerName', 'dueDate', 'items' can be null.
    
    The email subject is: "${emailSubject || 'N/A'}".
    Email text: """${emailText}"""
    
    Extraction Rules:
    1.  Prioritize accuracy for 'documentType', 'requiresAction', 'suggestedActionLabel', 'aiRationale', and 'cardTitle'.
    2.  The 'cardTitle' should be the most user-friendly representation of this document.
    3.  If a field is not clearly present or ambiguous, its value should be null.
    4.  Dates (dueDate, issueDate) should be in YYYY-MM-DD format if possible.
    5.  'amount' should be the total numerical value. 'currency' its ISO code.
    6.  Provide an overall 'confidence' score (0-100). If confidence < 60 for non-invoices, or < 80 for invoices, the output might be less reliable.
    7.  If the text is nonsensical or clearly not a financial document, classify as "other_document" with very low confidence and minimal extraction, and set requiresAction to false.
    8.  Populate 'extractedTitle' and 'extractedSummary' appropriately for all document types.
    9.  IMPORTANT: 'requiresAction' must always be provided as either true or false.
    10. IMPORTANT: 'cardTitle' must always be provided and should be user-friendly and descriptive.`;

    const { object: processedDocument, usage } = await generateObject({
      model: openai('gpt-4o-mini'), // Use the correct model name
      schema: aiDocumentProcessSchema, // Use the new schema
      prompt,
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
//     model: openai('gpt-4o-mini'), // Replace with o4-mini
//     messages,
//   });
//   return result.toAIStream();
// } 