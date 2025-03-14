import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Maximum file size: 25MB (PDF limit for OpenAI)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Configure route options
export const config = {
  api: {
    bodyParser: false,
  },
};

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
          { status: 400 }
        );
      }
      
      // Fetch the file from the URL
      const fileResponse = await fetch(fileUrl);
      
      if (!fileResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch file from URL' },
          { status: 400 }
        );
      }
      
      // Get the file content
      const fileBuffer = await fileResponse.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);
      
      // Get the content type
      const fileMimeType = fileResponse.headers.get('content-type') || '';
      
      // Validate the file type
      if (!SUPPORTED_TYPES.includes(fileMimeType)) {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload a PDF or image file.' },
          { status: 400 }
        );
      }
      
      // Process the file with OpenAI
      return await processFileWithOpenAI(fileBytes, fileMimeType, filename || 'unnamed-file');
      
    } else if (contentType.includes('multipart/form-data')) {
      // Handle multipart form data (direct file upload)
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      // Validate file
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Check file type
      if (!SUPPORTED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload a PDF or image file.' },
          { status: 400 }
        );
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size exceeds the 25MB limit' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const buffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(buffer);
      
      // Process the file with OpenAI
      return await processFileWithOpenAI(fileBytes, file.type, file.name);
      
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type. Use multipart/form-data for direct uploads or application/json for URL-based processing.' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error in file extraction:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing file' },
      { status: 500 }
    );
  }
}

// Helper function to process file with OpenAI
async function processFileWithOpenAI(fileBytes: Uint8Array, mimeType: string, filename: string) {
  try {
    // Convert fileBytes to base64
    const base64File = Buffer.from(fileBytes).toString('base64');
    
    // Extract text from the file using OpenAI API with advanced prompting for invoices
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specialized in extracting structured invoice information from documents.
          Extract all invoice data and return it as a valid JSON object matching the InvoiceData interface.
          
          Focus on extracting these key elements:
          - Invoice number and dates (issued date, due date)
          - Seller information (business name, contact details, address)
          - Buyer information (business name, contact details, address)
          - Line items (name, quantity, unit price, total)
          - Payment terms and totals (subtotal, tax, discount, total amount)
          
          Format the response as a valid JSON object that follows this structure:
          {
            "invoiceNumber": "string",
            "issuedAt": "string", // ISO date format
            "dueDate": "string", // ISO date format
            "fromName": "string", // Seller business name
            "fromIdentity": "string", // Seller VAT/Tax ID
            "fromEmail": "string",
            "toName": "string", // Buyer business name
            "toIdentity": "string", // Buyer VAT/Tax ID
            "toEmail": "string",
            "items": [
              {
                "name": "string",
                "quantity": number,
                "price": "string",
                "total": "string"
              }
            ],
            "currency": "string",
            "subtotal": "string",
            "tax": "string",
            "discount": "string",
            "total": "string",
            "additionalNotes": "string",
            
            // Additional detailed information
            "sellerInfo": {
              "businessName": "string",
              "email": "string",
              "phone": "string",
              "address": {
                "street-address": "string",
                "locality": "string",
                "region": "string",
                "postal-code": "string",
                "country-name": "string"
              }
            },
            "buyerInfo": {
              // Same structure as sellerInfo
            },
            "paymentTerms": "string"
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all relevant invoice information from this document and return it in valid JSON format following the structure described in the system prompt."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64File}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      temperature: 0,
      max_tokens: 1500,
    });

    // Return the extracted text
    return NextResponse.json({
      success: true,
      extractedText: response.choices[0]?.message.content || '',
      filename: filename,
    });
  } catch (error: any) {
    console.error('Error in OpenAI processing:', error);
    throw new Error(error.message || 'Error processing file with OpenAI');
  }
}