import { Agent, RecognizedEventItem, EventData, RecognizedItem } from './base-agent';
import { createEvents, EventAttributes } from 'ics';
import { CalendarAgentUI } from '@/components/calendar-agent-ui';
import React from 'react';

export const calendarAgent: Agent = {
  id: 'calendar',
  name: 'Calendar Agent',
  description: 'Creates and manages calendar events',
  type: 'event',
  isActive: true,

  process: async (content: string) => {
    throw new Error('Process method is deprecated. Use CalendarAgentUI component instead.');
  },

  action: async (item: RecognizedEventItem) => {
    try {
      const startDate = new Date(item.data.startTime);
      const endDate = new Date(item.data.endTime);

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
        title: item.data.title,
        description: item.data.details || item.data.content || '',
        location: item.data.location || '',
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        productId: 'hyprsqrl/v1.0'
      };

      if (item.data.attendees?.length) {
        event.attendees = item.data.attendees.map(name => ({ name }));
      }

      return new Promise<void>((resolve, reject) => {
        createEvents([event], async (error: Error | undefined, value: string) => {
          if (error) {
            console.error('0xHypr', 'Error creating calendar event:', error);
            reject(error);
            return;
          }

          try {
            // Create a temporary file with .ics extension
            const fileName = `event-${item.id}.ics`;
            
            // Use the electron API to add to system calendar
            await window.api.addToCalendar({
              icsPath: fileName,
              content: value,
              event: {
                title: item.data.title,
                startTime: item.data.startTime,
                endTime: item.data.endTime,
                location: item.data.location,
                description: item.data.details || item.data.content,
                attendees: item.data.attendees,
              },
            });

            // Also add to vault for tracking
            const config = await window.api.getVaultConfig();
            if (config?.path) {
              const filePath = `${config.path}/hyprsqrl.md`;
              let content = '';

              try {
                const result = await window.api.readMarkdownFile(filePath);
                content = result.content;
              } catch {
                content = `# HyprSqrl Tasks\n\n## Calendar Events\n`;
              }

              const eventEntry = `- [ ] ${item.data.title}\n` +
                `  - Start: ${startDate.toLocaleString()}\n` +
                `  - End: ${endDate.toLocaleString()}\n` +
                (item.data.location ? `  - Location: ${item.data.location}\n` : '') +
                (item.data.details ? `  - Details: ${item.data.details}\n` : '') +
                (item.data.attendees?.length ? `  - Attendees: ${item.data.attendees.join(', ')}\n` : '') +
                `  - Source: ${item.source}\n` +
                `  - Created: ${new Date(item.timestamp).toISOString()}\n` +
                `  - Confidence: ${(item.confidence * 100).toFixed(0)}%\n`;

              if (content.includes('## Calendar Events')) {
                content = content.replace('## Calendar Events\n', `## Calendar Events\n${eventEntry}`);
              } else {
                content += `\n## Calendar Events\n${eventEntry}`;
              }

              await window.api.writeMarkdownFile(filePath, content);
            }

            console.log('0xHypr', 'Calendar event created:', value);
            resolve();
          } catch (error) {
            console.error('0xHypr', 'Error adding event to system calendar:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('0xHypr', 'Error handling calendar event:', error);
      throw error;
    }
  },

  render: (item: RecognizedItem, onSuccess: () => void) => {
    if (item.type !== 'event') return null;
    return React.createElement(CalendarAgentUI, {
      initialData: item.data as EventData,
      onSuccess
    });
  }
}; 