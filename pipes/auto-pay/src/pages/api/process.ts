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
    data: FormattedOCRData[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { data } = req.body as ProcessRequestBody;

        // Combine all OCR text with context
        const ocrContext = data.map(item => 
            `[${item.timestamp}] ${item.appName} - ${item.windowName}:\n${item.text}`
        ).join('\n\n');

        const prompt = `
            You are analyzing this OCR data to see if there's a mention of needing a payment.
            If yes, return an object with:
                recipientName: The name of the recipient or company to be paid
                amount: The amount to be paid (numeric value only)
                currency: The three-letter currency code (e.g., USD, EUR, GBP)
                referenceNote: Any reference number, invoice number, or payment description

            Important:
            - Only extract information if you are highly confident it represents a payment request
            - For amounts, ensure they are properly formatted without currency symbols
            - For currency codes, always use standard three-letter codes
            - Consider the context (application name, window name, and timestamp) when determining if this is a payment request
            - If multiple potential payments are found, select the most recent one
            - If no clear payment request is found, return an empty object

            OCR DATA WITH CONTEXT:
            ${ocrContext}
        `;

        const { object } = await generateObject({
            model: openai('gpt-4-turbo'),
            schema: z.object({
                recipientName: z.string().optional(),
                amount: z.string().optional(),
                currency: z.string().optional(),
                referenceNote: z.string().optional(),
            }),
            prompt,
            temperature: 0.1, // Lower temperature for more consistent results
        });

        return res.status(200).json({ paymentInfo: object });
    } catch (err) {
        console.error('Failed to process payment information:', err);
        return res.status(500).json({ error: 'Failed to process payment information' });
    }
}
