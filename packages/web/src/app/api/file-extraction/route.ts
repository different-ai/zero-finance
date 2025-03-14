import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';

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
    // Check if request is multipart form data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Request must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Parse the form data
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

    // Extract text from the file using OpenAI Responses API
    const result = await openai.responses('gpt-4o').chat({
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that extracts invoice information from documents.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all relevant invoice information from this document. Focus on details like invoice number, dates, seller/buyer information, line items, amounts, and payment terms.',
            },
            {
              type: 'file',
              data: Buffer.from(fileBytes),
              mimeType: file.type,
              filename: file.name,
            },
          ],
        },
      ],
      temperature: 0,
      max_tokens: 1000,
      providerOptions: {
        openai: {
          strictSchemas: true,
          reasoningEffort: 'high',
        },
      },
    });

    // Return the extracted text
    return NextResponse.json({
      success: true,
      extractedText: result.choices[0]?.message.content || '',
      filename: file.name,
    });
  } catch (error: any) {
    console.error('Error in file extraction:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing file' },
      { status: 500 }
    );
  }
}