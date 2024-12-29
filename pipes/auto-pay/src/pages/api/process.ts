import { NextApiRequest, NextApiResponse } from 'next';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import type { PaymentInfo } from '@/types/wise';

interface FormattedOCRData {
  text: string;
  timestamp: string;
  appName: string;
  windowName: string;
}

interface ProcessRequestBody {
  screenData: FormattedOCRData[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { screenData } = req.body as ProcessRequestBody;
    console.log(JSON.stringify(screenData), 'screenData', 'process');

    // Combine all OCR text with context
    const ocrContext = screenData
      .map(
        (item) =>
          `[${item.timestamp}] ${item.appName} - ${item.windowName}:\n${item.text}`
      )
      .join('\n\n');

    // This is our modified prompt, incorporating more robust instructions
    const prompt = `
      You are analyzing OCR data that may contain invoice or payment information. Your goal is to:
      1. Identify the payee (the person or business who is owed payment).
         - Look for labels or context such as "Bill From," "Vendor," "Supplier," "Invoiced By," "Remit Payment To," etc.
      2. Identify the payer (the person or business who must pay).
         - Look for labels or context such as "Billed To," "Client," "Customer," "Buyer," "Bill To," or "Invoiced To," etc.
      3. Extract key invoice/payment details:
         - recipientName: The payee or vendor’s name (the entity receiving the payment).
         - amount: The amount (numeric value only).
         - currency: The three-letter currency code (e.g. "USD", "EUR", "GBP").
         - referenceNote: Any invoice number or description that references the payment.
         - accountNumber: The bank account number (digits only, no spaces).
         - routingNumber: The bank routing number (digits only; for US banks, exactly 9 digits).
      4. Only extract information if you are highly confident it represents a legitimate payment request.
      5. If multiple potential payments are found, select the most recent or most relevant one.
      6. If no clear payment request is found, return an empty object ({}).
      7. ignore text form localhost, or development environment, or any that indicates it is not a real payment.

      Some invoices may present "Billed To" and "Bill From" in different ways or wording. Use your best judgment to correctly identify who is receiving the payment (the payee). 
      Also note that US routing numbers must be 9 digits.

      Here is the OCR data with context (application name, window name, timestamp, and text):
      ---
      ${ocrContext}
      ---
    `;

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        recipientName: z.string().optional(),
        amount: z.string().optional(),
        currency: z.string().optional(),
        referenceNote: z.string().optional(),
        accountNumber: z.string().optional(),
        routingNumber: z.string().optional(),
      }),
      prompt,
      temperature: 0.1 // Lower temperature for more consistent results
    });

    return res.status(200).json({ paymentInfo: object });
  } catch (err) {
    console.error('Failed to process payment information:', err);
    return res.status(500).json({ error: 'Failed to process payment information' });
  }
}