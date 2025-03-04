import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

import type { 
  ScreenpipeSearchParams, 
  ScreenpipeSearchResult
} from '@/lib/utils/ai-tools';

// Import the invoice schema (or define it inline if import is not possible)
const invoiceParserSchema = z.object({
  invoice: z.object({
    creationDate: z.string().nullable(),
    invoiceNumber: z.string().nullable(),
    sellerInfo: z.object({
      businessName: z.string().nullable(),
      email: z.string().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      phone: z.string().nullable(),
      address: z.object({
        'country-name': z.string().nullable(),
        'extended-address': z.string().nullable(),
        locality: z.string().nullable(),
        'post-office-box': z.string().nullable(),
        'postal-code': z.string().nullable(),
        region: z.string().nullable(),
        'street-address': z.string().nullable(),
      }).nullable(),
      taxRegistration: z.string().nullable(),
      companyRegistration: z.string().nullable(),
      miscellaneous: z.record(z.string(), z.string()).nullable(),
    }).required(),
    buyerInfo: z.object({
      businessName: z.string().nullable(),
      email: z.string().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      phone: z.string().nullable(),
      address: z.object({
        'country-name': z.string().nullable(),
        'extended-address': z.string().nullable(),
        locality: z.string().nullable(),
        'post-office-box': z.string().nullable(),
        'postal-code': z.string().nullable(),
        region: z.string().nullable(),
        'street-address': z.string().nullable(),
      }).nullable(),
      taxRegistration: z.string().nullable(),
    }).required(),
    defaultCurrency: z.string().nullable(),
    invoiceItems: z.array(z.object({
      name: z.string().nullable(),
      quantity: z.number().nullable(),
      unitPrice: z.string().nullable(),
      currency: z.string().nullable(),
      tax: z.object({
        type: z.enum(['percentage', 'fixed']).nullable(),
        amount: z.string().nullable(),
      }).nullable(),
      reference: z.string().nullable(),
      deliveryDate: z.string().nullable(),
      deliveryPeriod: z.string().nullable(),
    })).nullable(),
    paymentTerms: z.object({
      dueDate: z.string().nullable(),
      lateFeesPercent: z.number().nullable(),
      lateFeesFix: z.string().nullable(),
    }).nullable(),
    note: z.string().nullable(),
    terms: z.string().nullable(),
    purchaseOrderId: z.string().nullable(),
  }).required(),
});

// Simple validation function to replace @requestnetwork/data-format
function validateInvoice(invoice: any) {
  // Perform basic validation checks
  const errors = [];
  
  // Check essential fields
  if (!invoice.sellerInfo || typeof invoice.sellerInfo !== 'object') {
    errors.push('Missing or invalid sellerInfo');
  }
  
  if (!invoice.buyerInfo || typeof invoice.buyerInfo !== 'object') {
    errors.push('Missing or invalid buyerInfo');
  }
  
  // Additional validations could be added here
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array is required' }), 
        { status: 400 }
      );
    }

    // Create a streaming text response using the AI SDK
    const result = streamText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that helps users create invoices. You can use screenpipeSearch to retrieve OCR data from the user's screen and invoiceAnswer to generate structured invoice data from the context.

When helping a user create an invoice, follow these steps:
1. Use screenpipeSearch to find relevant information when the user mentions specific data.
2. Use invoiceAnswer to generate structured invoice data from the retrieved OCR context.
3. DO NOT restate all the invoice details in your text response as the invoiceAnswer tool will display the structured data automatically.
4. Instead, provide a brief confirmation that you've found the invoice data and mention any missing fields that might need attention.

Always be helpful, concise, and professional. Focus on extracting relevant invoice information without duplicating what the tool will display.`
        },
        ...messages
      ],
      // Enable streaming tool calls for better UX
      toolCallStreaming: true,
      // Enable multiple steps of tool calling
      maxSteps: 5,
      tools: {
        // Tool for OCR search functionality
        screenpipeSearch: {
          description: 'Search for information in the user\'s screen captures using OCR',
          parameters: z.object({
            query: z.string().describe('The search query to find relevant information in screen captures')
          }),
          execute: async ({ query }: ScreenpipeSearchParams): Promise<ScreenpipeSearchResult[]> => {
            // Mock OCR results based on the query
            const mockResults: ScreenpipeSearchResult[] = [];
            
            if (query.toLowerCase().includes('invoice') || query.toLowerCase().includes('bill')) {
              mockResults.push({
                content: `INVOICE #: INV-2024-05121
Date: February 25, 2024
Due Date: March 25, 2024

From: Acme Web Solutions
Email: billing@acmewebsolutions.com
Address: 123 Tech Lane, San Francisco, CA 94107

To: GlobalTech Inc.
Email: accounts@globaltech.com
Address: 456 Corporate Drive, Suite 300, New York, NY 10001

Items:
1. Website Redesign - $3,500.00 (1 x $3,500.00)
2. SEO Optimization - $1,200.00 (2 x $600.00)
3. Content Management System - $950.00 (1 x $950.00)

Subtotal: $5,650.00
Tax (8%): $452.00
Total: $6,102.00

Payment Terms: Net 30
Notes: Thank you for your business!`,
                source: "screen-capture-1.jpg",
                confidence: 0.92
              });
            }
            
            if (query.toLowerCase().includes('client') || query.toLowerCase().includes('customer')) {
              mockResults.push({
                content: `Client Information:
GlobalTech Inc.
EIN: 82-1234567
Contact: Sarah Johnson, Procurement Manager
Email: accounts@globaltech.com, sarah.j@globaltech.com
Phone: (212) 555-7890
Address: 456 Corporate Drive, Suite 300, New York, NY 10001`,
                source: "screen-capture-2.jpg",
                confidence: 0.89
              });
            }
            
            if (query.toLowerCase().includes('service') || query.toLowerCase().includes('product')) {
              mockResults.push({
                content: `Service Agreement - Project Details:
1. Website Redesign - Complete redesign of corporate website with responsive design
   Estimated hours: 70
   Rate: $50/hour
   Total: $3,500.00

2. SEO Optimization - Keyword research, meta descriptions, and content optimization
   Package price: $600.00 per month
   Duration: 2 months
   Total: $1,200.00

3. Content Management System Implementation - Custom WordPress setup
   One-time fee: $950.00`,
                source: "screen-capture-3.jpg",
                confidence: 0.87
              });
            }
            
            // Add a small delay to simulate processing time
            await new Promise(resolve => setTimeout(resolve, 800));
            
            return mockResults;
          }
        },
        
        // Tool for generating invoice data from OCR context
        invoiceAnswer: {
          description: 'Returns the final invoice object that was parsed/refined',
          parameters: invoiceParserSchema,
          execute: async (args: z.infer<typeof invoiceParserSchema>) => {
            // Validate the invoice format using our simple validator
            const validationResult = validateInvoice(args.invoice);
            if (!validationResult.valid) {
              return {
                error: 'Invalid invoice format',
                details: validationResult.errors,
              };
            }
            
            // Extract invoice details for human-readable explanation
            const { invoice } = args;
            const seller = invoice.sellerInfo.businessName || 'Unknown Seller';
            const buyer = invoice.buyerInfo.businessName || 'Unknown Buyer';
            const itemCount = invoice.invoiceItems?.length || 0;
            
            // Identify missing fields
            const missingFields: string[] = [];
            if (!invoice.sellerInfo.businessName) missingFields.push('Seller Business Name');
            if (!invoice.sellerInfo.email) missingFields.push('Seller Email');
            if (!invoice.buyerInfo.businessName) missingFields.push('Buyer Business Name');
            if (!invoice.buyerInfo.email) missingFields.push('Buyer Email');
            if (!invoice.invoiceItems || invoice.invoiceItems.length === 0) missingFields.push('Invoice Items');
            
            return {
              invoiceData: invoice,
              explanation: `Invoice data has been processed for ${seller} to ${buyer} with ${itemCount} item(s). ${missingFields.length > 0 ? 'Some fields are missing.' : 'All required fields are present.'}`,
              missingFields: missingFields.length > 0 ? missingFields : undefined
            };
          },
        },
        
        // Optional tool for user confirmation before processing
        askForConfirmation: {
          description: 'Ask the user for confirmation before proceeding with an action',
          parameters: z.object({
            message: z.string().describe('The confirmation message to display to the user'),
            action: z.string().describe('The action that requires confirmation')
          })
          // This tool doesn't have an execute function because it requires user interaction
        }
      }
    });

    // Create error handler function for better error messages
    function errorHandler(error: unknown) {
      console.error('Tool execution error:', error);
      
      if (error == null) {
        return 'An unknown error occurred while processing your request';
      }

      if (typeof error === 'string') {
        return error;
      }

      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }

      return JSON.stringify(error);
    }

    // Return streaming response with error handling
    return result.toDataStreamResponse({
      getErrorMessage: errorHandler
    });
    
  } catch (error) {
    console.error('Error processing invoice chat:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }), 
      { status: 500 }
    );
  }
}