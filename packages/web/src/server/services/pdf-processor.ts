import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import type { GmailAttachmentMetadata } from './gmail-service';
import { downloadAttachment } from './gmail-service';
import { aiDocumentProcessSchema, type AiProcessedDocument } from './ai-service';
import { put } from '@vercel/blob';

// PDF processing result schema
export const pdfProcessingResultSchema = z.object({
  success: z.boolean(),
  extractedText: z.string().nullable(),
  documentData: aiDocumentProcessSchema.nullable(),
  error: z.string().nullable(),
  blobUrl: z.string().nullable(), // Add URL for stored PDF
});

export type PdfProcessingResult = z.infer<typeof pdfProcessingResultSchema>;

/**
 * Process a PDF attachment by downloading it and extracting invoice/document data
 * @param emailId The Gmail message ID
 * @param attachment The attachment metadata
 * @param accessToken Optional OAuth access token
 * @returns Processing result with extracted data
 */
export async function processPdfAttachment(
  emailId: string,
  attachment: GmailAttachmentMetadata,
  accessToken?: string,
  userClassificationPrompts?: string[]
): Promise<PdfProcessingResult> {
  try {
    // Check if it's a PDF
    if (!attachment.mimeType.includes('pdf')) {
      return {
        success: false,
        extractedText: null,
        documentData: null,
        error: 'Not a PDF file',
        blobUrl: null,
      };
    }

    // Download the attachment
    if (!attachment.attachmentId) {
      return {
        success: false,
        extractedText: null,
        documentData: null,
        error: 'No attachment ID provided',
        blobUrl: null,
      };
    }

    console.log(`[PDF Processor] Downloading PDF: ${attachment.filename} from email ${emailId}`);
    const pdfBuffer = await downloadAttachment(emailId, attachment.attachmentId, accessToken);
    
    if (!pdfBuffer) {
      return {
        success: false,
        extractedText: null,
        documentData: null,
        error: 'Failed to download PDF',
        blobUrl: null,
      };
    }

    console.log(`[PDF Processor] Downloaded ${pdfBuffer.length} bytes, processing with AI...`);

    // Upload PDF to Vercel Blob storage
    let blobUrl: string | null = null;
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `invoices/${emailId}/${timestamp}-${attachment.filename}`;
      
      console.log(`[PDF Processor] Uploading PDF to blob storage: ${filename}`);
      const blob = await put(filename, pdfBuffer, {
        access: 'public',
        contentType: attachment.mimeType,
      });
      blobUrl = blob.url;
      console.log(`[PDF Processor] PDF uploaded to: ${blobUrl}`);
    } catch (uploadError) {
      console.error(`[PDF Processor] Failed to upload PDF to blob storage:`, uploadError);
      // Continue processing even if upload fails
    }

    // Build user classification rules if provided
    let userClassificationSection = '';
    if (userClassificationPrompts && userClassificationPrompts.length > 0) {
      userClassificationSection = `
    
    ADDITIONAL USER CLASSIFICATION RULES:
    ${userClassificationPrompts.map((prompt, index) => `${index + 1}. ${prompt}`).join('\n    ')}
    
    Apply these user-specific rules in addition to the standard classification logic.`;
    }

    // Process the PDF using OpenAI's file handling capabilities
    const { object: extractedData } = await generateObject({
      model: openai('o3-2025-04-16'), // Use o3 as requested
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
          5. Create a user-friendly cardTitle that clearly identifies the document
             Examples:
             - "Amazon Invoice #1234 - $567.89"
             - "Uber Receipt - $23.45"
             - "Electric Bill - Due Jan 15"
             - "Bank Statement - December 2024"
          6. Provide confidence scores for your analysis
          
          ${userClassificationSection}
          
          Focus on accuracy and extract all relevant financial information.
          The cardTitle should be concise (max 60 chars) and include key details like vendor/source, amount, and/or date.`,
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
              data: pdfBuffer,
              mimeType: attachment.mimeType,
              filename: attachment.filename,
            },
          ],
        },
      ],
    });

    console.log(`[PDF Processor] Successfully processed PDF: ${attachment.filename}`);
    console.log(`[PDF Processor] Document type: ${extractedData.documentData.documentType}, Confidence: ${extractedData.documentData.confidence}`);

    return {
      success: true,
      extractedText: extractedData.extractedText,
      documentData: extractedData.documentData,
      error: null,
      blobUrl: blobUrl,
    };
  } catch (error) {
    console.error(`[PDF Processor] Error processing PDF ${attachment.filename}:`, error);
    return {
      success: false,
      extractedText: null,
      documentData: null,
      error: error instanceof Error ? error.message : 'Unknown error processing PDF',
      blobUrl: null,
    };
  }
}

/**
 * Process multiple PDF attachments from an email
 * @param emailId The Gmail message ID
 * @param attachments Array of attachment metadata
 * @param accessToken Optional OAuth access token
 * @returns Array of processing results
 */
export async function processPdfAttachments(
  emailId: string,
  attachments: GmailAttachmentMetadata[],
  accessToken?: string,
  userClassificationPrompts?: string[]
): Promise<PdfProcessingResult[]> {
  const pdfAttachments = attachments.filter(att => att.mimeType.includes('pdf'));
  
  if (pdfAttachments.length === 0) {
    console.log(`[PDF Processor] No PDF attachments found in email ${emailId}`);
    return [];
  }

  console.log(`[PDF Processor] Processing ${pdfAttachments.length} PDF attachments from email ${emailId}`);
  
  // Process PDFs in parallel for better performance
  const results = await Promise.all(
    pdfAttachments.map(attachment => 
      processPdfAttachment(emailId, attachment, accessToken, userClassificationPrompts)
    )
  );

  return results;
}

/**
 * Merge PDF processing results with email content for comprehensive analysis
 * @param emailContent The email text content
 * @param pdfResults Results from PDF processing
 * @returns Combined document data with highest confidence
 */
export function mergePdfResultsWithEmail(
  emailData: AiProcessedDocument | null,
  pdfResults: PdfProcessingResult[]
): AiProcessedDocument | null {
  // Filter successful PDF results with document data
  const validPdfResults = pdfResults
    .filter(result => result.success && result.documentData)
    .map(result => result.documentData!)
    .filter(data => data.confidence >= 60); // Only consider reasonably confident results

  if (validPdfResults.length === 0) {
    return emailData; // No valid PDF data, return email analysis
  }

  // If we have PDF results, prioritize them over email content
  // Sort by confidence and document type priority
  const prioritizedResults = validPdfResults.sort((a, b) => {
    // Prioritize invoices and receipts
    const typePriority = { invoice: 3, receipt: 2, payment_reminder: 1, other_document: 0 };
    const aPriority = typePriority[a.documentType] || 0;
    const bPriority = typePriority[b.documentType] || 0;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Then sort by confidence
    return b.confidence - a.confidence;
  });

  const bestPdfResult = prioritizedResults[0];

  // If email data is null or has lower confidence, use PDF data
  if (!emailData || emailData.confidence < bestPdfResult.confidence) {
    return bestPdfResult;
  }

  // If both have good confidence, merge the data preferring PDF for financial details
  return {
    ...emailData,
    // Override with PDF data for key financial fields if available
    documentType: bestPdfResult.documentType !== 'other_document' ? bestPdfResult.documentType : emailData.documentType,
    invoiceNumber: bestPdfResult.invoiceNumber || emailData.invoiceNumber,
    amount: bestPdfResult.amount ?? emailData.amount,
    currency: bestPdfResult.currency || emailData.currency,
    dueDate: bestPdfResult.dueDate || emailData.dueDate,
    issueDate: bestPdfResult.issueDate || emailData.issueDate,
    buyerName: bestPdfResult.buyerName || emailData.buyerName,
    sellerName: bestPdfResult.sellerName || emailData.sellerName,
    items: bestPdfResult.items && bestPdfResult.items.length > 0 ? bestPdfResult.items : emailData.items,
    // Keep the higher confidence
    confidence: Math.max(emailData.confidence, bestPdfResult.confidence),
    // Combine rationales
    aiRationale: `Email analysis: ${emailData.aiRationale || 'N/A'}. PDF analysis: ${bestPdfResult.aiRationale || 'N/A'}`,
  };
} 