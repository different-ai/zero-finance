import { OpenAIStream, StreamingTextResponse } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';

// Use node runtime instead of edge to work with Electron
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Get the API key from the store
    const apiKey = getApiKey();
    if (!apiKey) {
      return new Response('OpenAI API key not configured', { status: 400 });
    }

    // Get the chat messages from the request
    const { messages } = await req.json();

    // Create an instance of the OpenAI client
    const openai = createOpenAI({ apiKey });

    // Create a response from OpenAI
    const response = await openai('o3-mini').chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an invoice assistant that helps users fill out invoices. 
          You can help them create invoices by asking questions about services, clients, amounts, etc. 
          When appropriate, include structured data that can be used to populate the invoice form.
          
          When you have enough information, include a JSON block with invoice data formatted like this:
          
          \`\`\`json
          {
            "sellerInfo": {
              "businessName": "Company Name",
              "email": "email@example.com"
            },
            "buyerInfo": {
              "businessName": "Client Company",
              "email": "client@example.com"
            },
            "invoiceItems": [
              {
                "name": "Service description",
                "quantity": 1,
                "unitPrice": "100.00"
              }
            ],
            "paymentTerms": {
              "dueDate": "2023-04-30T00:00:00.000Z"
            },
            "note": "Thank you for your business!"
          }
          \`\`\`
          
          Only include the JSON when you have actual data to provide. Be conversational and helpful.
          Today's date is ${new Date().toISOString().split('T')[0]}.`
        },
        ...messages
      ],
      stream: true,
    });

    // Return a streaming response
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('Error in invoice chat API:', error);
    return new Response('Error processing request', { status: 500 });
  }
}