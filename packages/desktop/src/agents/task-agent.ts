import { Agent, RecognizedTaskItem } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getApiKey } from '@/stores/api-key-store';

export const taskAgent: Agent = {
  id: 'task',
  name: 'Task Agent',
  description: 'Recognizes tasks from text',
  type: 'task',
  isActive: true,

  process: async (content: string) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Please set your OpenAI API key in settings');
    }

    const { object } = await generateObject({
      model: {
        provider: 'openai',
        model: 'gpt-4',
        apiKey
      },
      schema: z.object({
        task: z.object({
          title: z.string(),
          content: z.string(),
          dueDate: z.string().datetime().optional(),
          priority: z.enum(['low', 'medium', 'high']).optional(),
        })
      }),
      prompt: content
    });

    return {
      type: 'task',
      data: object.task
    };
  },

  action: async (item: RecognizedTaskItem) => {
    try {
      // Here you would integrate with your task management system
      // For now, we'll just log the task
      console.log('0xHypr', 'Creating task:', {
        title: item.data.title,
        content: item.data.content,
        dueDate: item.data.dueDate,
        priority: item.data.priority
      });

      // TODO: Integrate with your preferred task management system
      // For example: GitHub Issues, Linear, etc.
      
      return Promise.resolve();
    } catch (error) {
      console.error('0xHypr', 'Error creating task:', error);
      throw error;
    }
  }
}; 