import { Agent } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { useApiKeyStore } from '@/stores/api-key-store';

export const taskAgent: Agent = {
  id: 'task-agent',
  name: 'Task Agent',
  description: 'Recognizes and processes tasks from content',
  isActive: true,
  type: 'task',
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
          priority: z.enum(['high', 'medium', 'low']).optional(),
          dueDate: z.string().nullable().optional(),
          details: z.string().optional(),
        }),
        prompt: `Extract a task from this content. Focus on actionable items.
        Return null if no clear task found.
        Content: ${content}`
      });

      return {
        title: object.title,
        content: content,
        data: {
          priority: object.priority || 'medium',
          dueDate: object.dueDate,
          details: object.details
        }
      };
    } catch (error) {
      console.error('Task agent processing error:', error);
      return null;
    }
  }
}; 