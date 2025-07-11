import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') });

// Test invoice text from the provided examples
const testText = `from: rachel@karmarealestate.com  
subject: FW: RE: Invoice for Jan Work

hi ben,  

see below from our contractor. can you take care of this?

---

Hey Rachel,  

Here's the breakdown for January:

- Consulting: 12 hours @ $95/hr = $1,140  
- Travel (Uber + subway): $68.12  
- Hardware (router + cabling): $233.50  

Subtotal: $1,441.62  
Add 8.75% tax on services: $99.86  
TOTAL: $1,541.48  

Please wire to Chase  
Acct #: 574839302  
Routing: 021000021  
Name: Jon Marcel`;

async function testAIPrefill() {
  console.log('Testing AI prefill with sample invoice text...\n');
  console.log('Input text:', testText.substring(0, 200) + '...\n');
  
  try {
    // Import the necessary modules
    const { myProvider } = await import('../src/lib/ai/providers');
    const { generateObject } = await import('ai');
    const { z } = await import('zod');
    
    // Use the same schema as in the router
    const aiInvoiceSchema = z.object({
      sellerInfo: z.object({
        businessName: z.string().nullable(),
        email: z.string().email().nullable(),
        address: z.string().nullable(),
        city: z.string().nullable(),
        postalCode: z.string().nullable(),
        country: z.string().nullable(),
      }).nullable(),
      
      buyerInfo: z.object({
        businessName: z.string().nullable(),
        email: z.string().email().nullable(),
        address: z.string().nullable(),
        city: z.string().nullable(),
        postalCode: z.string().nullable(),
        country: z.string().nullable(),
      }).nullable(),
      
      invoiceNumber: z.string().nullable(),
      issuedAt: z.string().nullable(),
      dueDate: z.string().nullable(),
      
      invoiceItems: z.array(z.object({
        name: z.string(),
        quantity: z.number(),
        unitPrice: z.string(),
        description: z.string().nullable(),
      })).nullable(),
      
      currency: z.string(),
      amount: z.number().nullable(),
      paymentType: z.enum(['crypto', 'fiat']).nullable(),
      
      note: z.string().nullable(),
      terms: z.string().nullable(),
      
      bankDetails: z.object({
        accountHolder: z.string().nullable(),
        accountNumber: z.string().nullable(),
        routingNumber: z.string().nullable(),
        iban: z.string().nullable(),
        bic: z.string().nullable(),
        bankName: z.string().nullable(),
      }).nullable(),
    });
    
    const systemPrompt = `You are an expert invoice data extraction AI. Extract structured invoice information from unstructured text.

EXTRACTION RULES:
1. Extract ALL available information about seller and buyer (names, emails, addresses)
2. For amounts: Extract numeric values without currency symbols (e.g., "1140" not "$1,140")
3. For dates: Convert to ISO format (YYYY-MM-DD). If relative (e.g., "Net 30"), calculate from today
4. For line items: Extract name, quantity, and unit price. Default quantity to 1 if not specified
5. Detect currency from context (USD, EUR, GBP, USDC, ETH, etc.)
6. Detect payment type: "crypto" for USDC/ETH/crypto mentions, "fiat" for traditional currencies
7. Extract bank details if mentioned (account numbers, routing numbers, IBAN, etc.)
8. If total amount is given without items, set 'amount' field

IMPORTANT:
- Business names should be extracted exactly as written
- Email addresses must be valid format
- All monetary values as strings without symbols
- Dates in ISO format (YYYY-MM-DD)
- Extract addresses as single strings (not structured)

Current date for reference: ${new Date().toISOString().split('T')[0]}`;
    
    const chatModel = myProvider('gpt-4o-mini');
    
    console.log('Calling AI model...\n');
    
    const result = await generateObject({
      model: chatModel,
      schema: aiInvoiceSchema,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Extract invoice data from this text:\n\n${testText}`
        }
      ],
    });
    
    console.log('AI extraction result:');
    console.log(JSON.stringify(result.object, null, 2));
    
  } catch (error) {
    console.error('Error testing AI prefill:', error);
  }
}

// Run the test
testAIPrefill(); 