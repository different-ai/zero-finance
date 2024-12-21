import { Agent } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { useApiKeyStore } from '@/stores/api-key-store';

export const invoiceAgent: Agent = {
  id: 'invoice-agent',
  name: 'Invoice Agent',
  description: 'Recognizes and processes invoices from content',
  isActive: true,
  type: 'invoice',
  process: async (content: string) => {
    if (!content?.trim()) {
      return null;
    }

    try {
      const apiKey = useApiKeyStore.getState().apiKey;
      if (!apiKey) {
        throw new Error('No API key found');
      }

      const openai = createOpenAI({ apiKey });

      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          title: z.string(),
          amount: z.number(),
          currency: z.string(),
          dueDate: z.string().optional(),
          recipient: z.object({
            name: z.string(),
            address: z.string().optional(),
            email: z.string().optional(),
          }),
          description: z.string(),
        }),
        prompt: `Extract invoice information from this content.
        Return null if no clear invoice found.
        Content: ${content}`
      });

      return {
        title: object.title,
        content: content,
        data: {
          amount: object.amount,
          currency: object.currency,
          dueDate: object.dueDate,
          recipient: object.recipient,
          description: object.description
        }
      };
    } catch (error) {
      console.error('Invoice agent processing error:', error);
      return null;
    }
  }
}; 