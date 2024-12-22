import { Agent, RecognizedEventItem } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getApiKey } from '@/stores/api-key-store';
import { createEvents, EventAttributes } from 'ics';

export const calendarAgent: Agent = {
  id: 'calendar',
  name: 'Calendar Agent',
  description: 'Recognizes calendar events from text',
  type: 'event',
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
        event: z.object({
          title: z.string(),
          startTime: z.string().datetime(),
          endTime: z.string().datetime(),
          content: z.string().optional(),
          location: z.string().optional(),
        })
      }),
      prompt: content
    });

    return {
      type: 'event',
      data: object.event
    };
  },

  action: async (item: RecognizedEventItem) => {
    try {
      const startDate = new Date(item.data.startTime);
      const endDate = new Date(item.data.endTime);

      const event: EventAttributes = {
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes()
        ] as [number, number, number, number, number],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes()
        ] as [number, number, number, number, number],
        title: item.data.title,
        description: item.data.content || '',
        location: item.data.location || '',
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        productId: 'hyprsqrl/v1.0'
      };

      return new Promise<void>((resolve, reject) => {
        createEvents([event], (error: Error | undefined, value: string) => {
          if (error) {
            console.error('0xHypr', 'Error creating calendar event:', error);
            reject(error);
            return;
          }

          // Create a data URL with the ICS content
          const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(value)}`;
          
          // Open in a new window/tab
          window.open(dataUrl);
          console.log('0xHypr', 'Calendar event created:', value);
          resolve();
        });
      });
    } catch (error) {
      console.error('0xHypr', 'Error handling calendar event:', error);
      throw error;
    }
  }
}; 