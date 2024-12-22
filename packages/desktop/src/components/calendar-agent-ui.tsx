import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createEvents, EventAttributes } from 'ics';
import { EventData, RecognizedContext, isRecognizedContext } from '@/agents/base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getApiKey } from '@/stores/api-key-store';
import { createOpenAI } from '@ai-sdk/openai';

const eventSchema = z.object({
  event: z.object({
    title: z.string(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    content: z.string().optional(),
    details: z.string().optional(),
    location: z.string().optional(),
    attendees: z.array(z.string()).optional(),
  })
});

interface CalendarAgentUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

export const CalendarAgentUI: React.FC<CalendarAgentUIProps> = ({ context, onSuccess }) => {
  const { toast } = useToast();

  if (!isRecognizedContext(context)) {
    console.error('0xHypr', 'Invalid context provided to CalendarAgentUI');
    return null;
  }

  const processEvent = async () => {
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key in settings');
      }

      const openai = createOpenAI({ apiKey });
      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: eventSchema,
        prompt: `
          Create a calendar event from the following context:
          Content: ${context.content}
          ${context.summary ? `Summary: ${context.summary}` : ''}
          ${context.category ? `Category: ${context.category}` : ''}
          ${context.dueDate ? `Due Date: ${context.dueDate}` : ''}
          ${context.people?.length ? `Attendees: ${context.people.join(', ')}` : ''}
          ${context.location ? `Location: ${context.location}` : ''}
        `.trim()
      });

      const result = eventSchema.parse(object);
      const eventData: EventData = {
        title: result.event.title,
        startTime: result.event.startTime,
        endTime: result.event.endTime,
        content: result.event.content,
        details: result.event.details,
        location: result.event.location || context.location,
        attendees: result.event.attendees || context.people
      };

      const startDate = new Date(eventData.startTime);
      const endDate = new Date(eventData.endTime);

      // Validate times
      if (endDate <= startDate) {
        // If end time is before or equal to start time, set it to 1 hour after start
        endDate.setTime(startDate.getTime() + 60 * 60 * 1000);
      }

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
        title: eventData.title,
        description: eventData.details || eventData.content || '',
        location: eventData.location || '',
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        productId: 'hyprsqrl/v1.0'
      };

      if (eventData.attendees?.length) {
        event.attendees = eventData.attendees.map(name => ({ name }));
      }

      await new Promise<void>((resolve, reject) => {
        createEvents([event], async (error: Error | undefined, value: string) => {
          if (error) {
            console.error('0xHypr', 'Error creating calendar event:', error);
            reject(error);
            return;
          }

          try {
            // Create a temporary file with .ics extension
            const fileName = `event-${Date.now()}.ics`;
            
            // Use the electron API to add to system calendar
            await window.api.addToCalendar({
              icsPath: fileName,
              content: value,
              event: {
                title: eventData.title,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                location: eventData.location,
                description: eventData.details || eventData.content,
                attendees: eventData.attendees,
              },
            });

            // Also add to vault for tracking
            const config = await window.api.getVaultConfig();
            if (config?.path) {
              const filePath = `${config.path}/hyprsqrl.md`;
              let fileContent = '';

              try {
                const result = await window.api.readMarkdownFile(filePath);
                fileContent = result.content;
              } catch {
                fileContent = `# HyprSqrl Tasks\n\n## Calendar Events\n`;
              }

              const eventEntry = `- [ ] ${eventData.title}\n` +
                `  - Start: ${startDate.toLocaleString()}\n` +
                `  - End: ${endDate.toLocaleString()}\n` +
                (eventData.location ? `  - Location: ${eventData.location}\n` : '') +
                (eventData.details ? `  - Details: ${eventData.details}\n` : '') +
                (eventData.attendees?.length ? `  - Attendees: ${eventData.attendees.join(', ')}\n` : '') +
                `  - Created: ${new Date().toISOString()}\n`;

              if (fileContent.includes('## Calendar Events')) {
                fileContent = fileContent.replace('## Calendar Events\n', `## Calendar Events\n${eventEntry}`);
              } else {
                fileContent += `\n## Calendar Events\n${eventEntry}`;
              }

              await window.api.writeMarkdownFile(filePath, fileContent);
            }

            console.log('0xHypr', 'Calendar event created:', value);
            toast({
              title: 'Success',
              description: 'Event added to calendar'
            });
            onSuccess?.();
            resolve();
          } catch (error) {
            console.error('0xHypr', 'Error adding event to system calendar:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('0xHypr', 'Error creating event:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create event',
        variant: 'destructive'
      });
    }
  };

  return React.createElement(Card, null,
    React.createElement(CardContent, { className: "p-4" },
      React.createElement('div', { className: "flex justify-between items-center" },
        React.createElement('div', null,
          React.createElement('h3', { className: "font-medium" }, "Event Detected"),
          React.createElement('p', { className: "text-sm text-muted-foreground" }, context.content),
          context.summary && React.createElement('p', { className: "text-xs text-muted-foreground mt-1" }, context.summary),
          context.people?.length && React.createElement('p', { className: "text-xs text-muted-foreground" }, 
            `With: ${context.people.join(', ')}`
          ),
          context.location && React.createElement('p', { className: "text-xs text-muted-foreground" }, 
            `At: ${context.location}`
          )
        ),
        React.createElement(Button, { onClick: processEvent }, "Add to Calendar")
      )
    )
  );
}; 