import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { invoiceParserSchema } from '@/lib/utils/invoice-tools';

// Maximum file size: 25MB (PDF limit for OpenAI)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Define supported file types
const SUPPORTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
];

export async function POST(req: NextRequest) {
  try {
    // Check if the request is JSON (for URL-based processing)
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // Handle JSON request with file URL
      const { fileUrl, filename } = await req.json();

      if (!fileUrl) {
        return NextResponse.json(
          { error: 'No file URL provided' },
          { status: 400 },
        );
      }

      // Fetch the file from the URL
      const fileResponse = await fetch(fileUrl);

      if (!fileResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch file from URL' },
          { status: 400 },
        );
      }

      // Get the file content
      const fileBuffer = await fileResponse.arrayBuffer();

      // Get the content type
      const fileMimeType = fileResponse.headers.get('content-type') || '';

      // Validate the file type
      if (!SUPPORTED_TYPES.includes(fileMimeType)) {
        return NextResponse.json(
          {
            error: 'Unsupported file type. Please upload a PDF or image file.',
          },
          { status: 400 },
        );
      }

      // Extract invoice data using AI SDK
      const invoiceData = await extractInvoiceData(
        Buffer.from(fileBuffer),
        fileMimeType,
        filename || 'unnamed-file',
      );

      // Return the extracted data
      return NextResponse.json({
        success: true,
        invoiceData,
        filename: filename || 'unnamed-file',
      });
    } else if (contentType.includes('multipart/form-data')) {
      // Handle multipart form data (direct file upload)
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      // Validate file
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 },
        );
      }

      // Check file type
      if (!SUPPORTED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: 'Unsupported file type. Please upload a PDF or image file.',
          },
          { status: 400 },
        );
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size exceeds the 25MB limit' },
          { status: 400 },
        );
      }

      // Convert file to buffer
      const buffer = await file.arrayBuffer();

      // Extract invoice data using AI SDK
      const invoiceData = await extractInvoiceData(
        Buffer.from(buffer),
        file.type,
        file.name,
      );

      // Return the extracted data
      return NextResponse.json({
        success: true,
        invoiceData,
        filename: file.name,
      });
    } else {
      return NextResponse.json(
        {
          error:
            'Unsupported content type. Use multipart/form-data for direct uploads or application/json for URL-based processing.',
        },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error('Error in file extraction:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing file' },
      { status: 500 },
    );
  }
}

// Helper function to extract invoice data using AI SDK with generateObject
async function extractInvoiceData(
  fileData: Buffer,
  mimeType: string,
  filename: string,
): Promise<any> {
  try {
    // Use generateObject for structured data extraction
    const { object } = await generateObject({
      model: openai.responses('gpt-4o'),
      schema: z.object({
        invoiceData: z.object({
          // Main priority fields (displayed in preview)
          buyerInfo: z
            .object({
              businessName: z.string().nullable(),
              email: z.string().nullable(),
              address: z
                .object({
                  'street-address': z.string().nullable(),
                  locality: z.string().nullable(),
                  region: z.string().nullable(),
                  'postal-code': z.string().nullable(),
                  'country-name': z.string().nullable(),
                })
                .nullable(),
            })
            .nullable(),
          amount: z.number().nullable(),
          currency: z.string().nullable(),
          dueDate: z.string().nullable(),

          // Secondary fields (extracted but not in preview)
          invoiceNumber: z.string().nullable(),
          issuedAt: z.string().nullable(),
          sellerInfo: z
            .object({
              businessName: z.string().nullable(),
              email: z.string().nullable(),
              address: z
                .object({
                  'street-address': z.string().nullable(),
                  locality: z.string().nullable(),
                  region: z.string().nullable(),
                  'postal-code': z.string().nullable(),
                  'country-name': z.string().nullable(),
                })
                .nullable(),
            })
            .nullable(),
          invoiceItems: z
            .array(
              z.object({
                name: z.string().nullable(),
                quantity: z.number().nullable(),
                unitPrice: z.string().nullable(),
                description: z.string().nullable(),
              }),
            )
            .nullable(),
          additionalNotes: z.string().nullable(),
        }),
        confidence: z.number(),
        notes: z.string().nullable(),
      }),
      system: `Extract comprehensive invoice information from the provided file: ${filename} (${mimeType}).
      
      HIGHEST PRIORITY ELEMENTS (will be shown in the preview to user):
      1. BUYER: Business name, email
      2. AMOUNT: The total invoice amount (as a number without currency symbols)
      3. CURRENCY: The currency code (USD, EUR, etc.)
      4. DUE DATE: When payment is due (YYYY-MM-DD format)
      
      ALSO EXTRACT THESE ELEMENTS (not shown in preview but used in form):
      5. INVOICE NUMBER
      6. ISSUE DATE
      7. SELLER: Business name, email, address
      8. INVOICE ITEMS: Extract line items including:
         - Item name/description
         - Quantity
         - Unit price
      9. ANY ADDITIONAL NOTES
      
      If you cannot find a specific field with high confidence, return null for that field rather than guessing.
      The buyer information is absolutely the most critical - focus your efforts there first.
      
      Return data in a clean, structured format with nested objects where appropriate.`,
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant specialized in extracting structured invoice information from documents.
          Extract all invoice data from the provided document according to the schema.
          
          If certain fields are not found in the document, leave them as undefined instead of making up values.
          Provide a confidence score between 0 and 1 for your extraction.`,
        },
        // is image than type image, if pdf than type pdf
        mimeType === 'image/jpeg' ||
        mimeType === 'image/png' ||
        mimeType === 'image/jpg' ||
        mimeType === 'image/webp'
          ? {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all relevant invoice information from this document and return it as a structured object.',
                },
                {
                  type: 'image',
                  image: fileData,

                  // data: fileData,
                  // mimeType: mimeType,
                  // filename: filename,
                },
              ],
            }
          : {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all relevant invoice information from this document and return it as a structured object.',
                },
                {
                  type: 'file',
                  data: fileData,
                  mediaType: mimeType,
                },
              ],
            },
      ],
    });
    console.log(object);

    // Transform the object to the format expected by the frontend
    const transformedData = {
      // Critical fields (shown in preview)
      buyerInfo: object.invoiceData.buyerInfo,
      amount: object.invoiceData.amount,
      currency: object.invoiceData.currency,
      dueDate: object.invoiceData.dueDate
        ? new Date(object.invoiceData.dueDate).toISOString().split('T')[0]
        : null,

      // Secondary fields (not shown in preview but used in form)
      invoiceNumber: object.invoiceData.invoiceNumber,
      issuedAt: object.invoiceData.issuedAt
        ? new Date(object.invoiceData.issuedAt).toISOString().split('T')[0]
        : null,
      sellerInfo: object.invoiceData.sellerInfo,
      invoiceItems: object.invoiceData.invoiceItems || [],
      additionalNotes: object.invoiceData.additionalNotes,

      // Metadata
      confidence: object.confidence,
      notes: object.notes,
    };

    return transformedData;
  } catch (error: any) {
    console.error('Error in AI processing:', error);
    throw new Error(error.message || 'Error extracting invoice data');
  }
}
