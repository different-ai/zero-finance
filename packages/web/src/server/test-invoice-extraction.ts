#!/usr/bin/env tsx

/**
 * Test script for debugging invoice extraction
 * Run with: npx tsx src/server/test-invoice-extraction.ts
 */

import { z } from 'zod';

// Sample invoice data from the screenshot
const SAMPLE_INVOICE_TEXT = `
INVOICE

Invoice #: INV-2025-0711
Date Issued: July 11, 2025
Due Date: August 10, 2025 (Net 30)

Seller:
Company: Orion Web Infrastructure Ltd.
Address: 850 Mission St, 5th Floor, San Francisco, CA 94103
Phone: +1 (415) 555-1034
Email: billing@oroninfra.com
Tax ID: 94-2938471

Buyer:
Company: Zero Finance Inc.
Address: 166 Geary St, Suite 1500, San Francisco, CA 94108
Contact: Benjamin Shafii
Email: ops@0.finance
Tax ID: 88-7293847

Line Items:
Qty  Description                           Unit Price  Total
1    Dedicated VPS (8 cores, 32 GB RAM)   €220.00     €220.00
1    Premium Uptime Monitoring (June 2025) €75.00      €75.00
1    Static IP Allocation + Redundancy Tier €55.00     €55.00
1    DNS Failover Management               €40.00      €40.00
1    Priority SLA Support (24/7)          €60.00      €60.00

Subtotal: €450.00
Tax (0.0%): €0.00
Total Due: €450.00

Payment Instructions:
Bank Name: First Horizon Bank
Routing Number: 121000358
Account Number: 0987654321
Account Name: Orion Web Infrastructure Ltd.
SWIFT Code for international: FHBKUS44XXX

Please include invoice number in payment memo.

Notes:
• All services billed are for usage during June 2025.
• This invoice reflects a discounted rate under the Zero Finance strategic partner plan.
• For questions, contact our billing department.
`;

// Enhanced schema matching the invoice router
const aiInvoiceSchema = z.object({
  // Seller info (the company sending the invoice)
  sellerInfo: z.object({
    businessName: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    postalCode: z.string().nullable(),
    country: z.string().nullable(),
    phone: z.string().nullable(),
    taxId: z.string().nullable(),
  }).nullable(),
  
  // Buyer info (the company receiving/paying the invoice)
  buyerInfo: z.object({
    businessName: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    postalCode: z.string().nullable(),
    country: z.string().nullable(),
    contactName: z.string().nullable(),
    phone: z.string().nullable(),
    taxId: z.string().nullable(),
  }).nullable(),
  
  // Invoice details
  invoiceNumber: z.string().nullable(),
  issuedAt: z.string().nullable(),
  dueDate: z.string().nullable(),
  
  // Items
  invoiceItems: z.array(z.object({
    name: z.string(),
    description: z.string().nullable(),
    quantity: z.number(),
    unitPrice: z.string(),
    tax: z.number().nullable(),
    total: z.string().nullable(),
  })).nullable(),
  
  // Financial summary
  currency: z.string(),
  subtotal: z.string().nullable(),
  taxAmount: z.string().nullable(),
  totalAmount: z.string().nullable(),
  amount: z.number().nullable(),
  paymentType: z.enum(['crypto', 'fiat']).nullable(),
  
  // Additional
  note: z.string().nullable(),
  terms: z.string().nullable(),
  paymentInstructions: z.string().nullable(),
  
  // Bank details
  bankDetails: z.object({
    accountHolder: z.string().nullable(),
    accountNumber: z.string().nullable(),
    routingNumber: z.string().nullable(),
    iban: z.string().nullable(),
    bic: z.string().nullable(),
    swiftCode: z.string().nullable(),
    bankName: z.string().nullable(),
    bankAddress: z.string().nullable(),
  }).nullable(),
});

const systemPrompt = `You are an expert invoice data extraction AI. Extract ALL available structured invoice information from unstructured text. Be thorough and comprehensive.

EXTRACTION RULES:
1. **SELLER vs BUYER identification**:
   - SELLER = The service provider/contractor who is billing (sends the invoice)
   - BUYER = The client/company who needs to pay (receives the invoice)
   - Look for labels like "From:", "Bill To:", "Seller:", "Vendor:", "Provider:"
   - Bank details and payment instructions usually belong to the SELLER
   
2. **Complete Data Extraction**:
   - Extract EVERY piece of information available
   - Parse ALL line items with their quantities, prices, and descriptions
   - Extract complete addresses including street, city, postal codes, countries
   - Extract ALL contact information (emails, phones, tax IDs)
   - Extract ALL payment details (bank names, account numbers, routing numbers, IBAN, BIC, SWIFT)
   
3. **Financial Data**:
   - Extract numeric values without currency symbols (e.g., "220.00" not "€220.00")
   - For line items: Extract exact quantities and unit prices
   - Calculate totals if not explicitly stated
   - Extract tax rates and amounts
   
4. **Date Handling**:
   - Convert to ISO format (YYYY-MM-DD)
   - For relative dates like "Net 30", calculate from issue date
   - Extract both issue date and due date
   
5. **Address Parsing**:
   - Split full addresses into components: street, city, postal code, country
   - Handle formats like "850 Mission St, 5th Floor, San Francisco, CA 94103"
   
6. **Payment Information**:
   - Extract complete bank details including bank names
   - Look for account holder names
   - Extract routing numbers, account numbers, IBAN, BIC, SWIFT codes
   - Detect payment type: "fiat" for EUR/USD/GBP, "crypto" for USDC/ETH
   
7. **Line Items**:
   - Extract ALL services/products listed
   - Parse descriptions, quantities, unit prices, taxes
   - Handle various formats and layouts

EXAMPLES OF WHAT TO EXTRACT:
- Company names: "Orion Web Infrastructure Ltd." 
- Addresses: Street "850 Mission St, 5th Floor", City "San Francisco", Postal "94103", Country "CA"
- Bank details: Bank "First Horizon Bank", Routing "121000358", Account "0987654321"
- Line items: "Dedicated VPS (8 cores, 32 GB RAM)" qty=1, price="220.00"

IMPORTANT:
- Be extremely thorough - extract every piece of data visible
- Business names exactly as written
- All monetary values as strings without symbols  
- Addresses split into components when possible
- Default currency to "USD" if not specified, but look for € symbols for EUR

Current date for reference: ${new Date().toISOString().split('T')[0]}`;

async function testInvoiceExtraction() {
  try {
    console.log('🧪 Testing Invoice Extraction Pipeline\n');
    console.log('Sample Invoice Text:');
    console.log('='.repeat(50));
    console.log(SAMPLE_INVOICE_TEXT);
    console.log('='.repeat(50));
    console.log('\n');

    // Import AI dependencies
    console.log('📦 Loading AI dependencies...');
    const { createOpenAI } = await import('@ai-sdk/openai');
    const { generateObject } = await import('ai');

    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    console.log('🤖 Calling AI model for extraction...');
    
    // Test different models - using gpt-4.1 as specified in CLAUDE.md
    const modelsToTest = ['gpt-4.1'];
    
    for (const modelName of modelsToTest) {
      console.log(`\n🔍 Testing with model: ${modelName}`);
      console.log('-'.repeat(40));
      
      try {
        const startTime = Date.now();
        
        const result = await generateObject({
          model: openai(modelName),
          schema: aiInvoiceSchema,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Please extract ALL available invoice information from the following text. Be extremely thorough and extract every piece of data you can find including:

1. Complete seller/vendor information (name, address, email, phone, tax ID)
2. Complete buyer/client information (name, address, email, contact person)  
3. All invoice details (number, dates, terms)
4. Every line item with exact descriptions, quantities, and prices
5. All financial totals (subtotal, tax, total)
6. Complete payment/banking information (bank name, account details, routing numbers)
7. Any additional notes or payment instructions

INVOICE TEXT TO EXTRACT FROM:
${SAMPLE_INVOICE_TEXT}

Extract everything comprehensively - leave no data behind!`
            }
          ],
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`✅ Extraction completed in ${duration}ms`);
        console.log('\n📊 Extracted Data:');
        console.log(JSON.stringify(result.object, null, 2));
        
        // Analyze extraction quality
        console.log('\n🔍 Extraction Quality Analysis:');
        const extracted = result.object;
        
        const checks = [
          { field: 'sellerInfo?.businessName', value: extracted.sellerInfo?.businessName, expected: 'Orion Web Infrastructure Ltd.' },
          { field: 'sellerInfo?.email', value: extracted.sellerInfo?.email, expected: 'billing@oroninfra.com' },
          { field: 'sellerInfo?.phone', value: extracted.sellerInfo?.phone, expected: '+1 (415) 555-1034' },
          { field: 'buyerInfo?.businessName', value: extracted.buyerInfo?.businessName, expected: 'Zero Finance Inc.' },
          { field: 'buyerInfo?.contactName', value: extracted.buyerInfo?.contactName, expected: 'Benjamin Shafii' },
          { field: 'invoiceNumber', value: extracted.invoiceNumber, expected: 'INV-2025-0711' },
          { field: 'currency', value: extracted.currency, expected: 'EUR' },
          { field: 'totalAmount', value: extracted.totalAmount, expected: '450.00' },
          { field: 'bankDetails?.bankName', value: extracted.bankDetails?.bankName, expected: 'First Horizon Bank' },
          { field: 'bankDetails?.routingNumber', value: extracted.bankDetails?.routingNumber, expected: '121000358' },
          { field: 'bankDetails?.accountNumber', value: extracted.bankDetails?.accountNumber, expected: '0987654321' },
          { field: 'invoiceItems length', value: extracted.invoiceItems?.length, expected: 5 },
        ];

        let score = 0;
        checks.forEach(check => {
          const match = check.value === check.expected || 
                       (check.field === 'invoiceItems length' && check.value === check.expected);
          console.log(`  ${match ? '✅' : '❌'} ${check.field}: ${check.value} ${match ? '' : `(expected: ${check.expected})`}`);
          if (match) score++;
        });

        console.log(`\n📈 Extraction Score: ${score}/${checks.length} (${Math.round(score/checks.length*100)}%)`);
        
        if (score === checks.length) {
          console.log('🎉 Perfect extraction!');
        } else if (score >= checks.length * 0.8) {
          console.log('👍 Good extraction with minor issues');
        } else {
          console.log('⚠️  Poor extraction quality - needs improvement');
        }
        
      } catch (error: any) {
        console.error(`❌ Error with ${modelName}:`, error.message);
        if (error.cause) {
          console.error('Cause:', error.cause);
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testInvoiceExtraction().catch(console.error);
}

export { testInvoiceExtraction, SAMPLE_INVOICE_TEXT, aiInvoiceSchema };