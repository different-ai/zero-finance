import { NextApiRequest, NextApiResponse } from 'next';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import type { PaymentInfo } from '@/types/wise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { screenData } = req.body;

        const prompt = `
            You are analyzing this OCR data to see if there's a mention of needing a payment.
            If yes, return an object with:
                recipientName
                amount
                currency
                referenceNote
            If none, return an empty object.

            OCR DATA:
            ${JSON.stringify(screenData)}
        `;

        const { object } = await generateObject({
            model: openai('gpt-4-turbo'),
            schema: z.object({
                recipientName: z.string().optional(),
                amount: z.string().optional(),
                currency: z.string().optional(),
                referenceNote: z.string().optional(),
            }),
            prompt
        });

        return res.status(200).json({ paymentInfo: object });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to process' });
    }
}
