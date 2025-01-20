import { z } from 'zod';
import { tool } from 'ai';

export interface ScreenpipeSearchResult {
  type: string;
  content: {
    text: string;
    timestamp: string;
    frame_id?: number;
    file_path?: string;
    offset_index?: number;
    app_name?: string;
    window_name?: string;
    tags?: string[];
    mime_type?: string;
  };
}

export interface ScreenpipeSearchConfig {
  description?: string;
}

export function createScreenpipeSearch(config?: ScreenpipeSearchConfig) {
  return tool({
    description: config?.description || `
      Search Screenpipe's local database (OCR, audio, UI captures).
      Provide a query or keywords, optional appName, startTime, endTime, etc.
    `,
    parameters: z.object({
      query: z.string().optional(),
      contentType: z.enum(['ocr', 'audio' ]),
      appName: z.string().optional().describe('The name of the application to search for'),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      windowName: z.string().optional(),
      humanReadableAction: z.string().optional().describe('A human readable action to be used in the agent explaining what the tool is doing'),
      
    }),
    execute: async ({ 
      query, 
      contentType, 
      appName, 
      startTime, 
      endTime,
      windowName,
    }) => {
      try {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (contentType) params.set('content_type', contentType);
        if (startTime) params.set('start_time', startTime);
        if (endTime) params.set('end_time', endTime);
        if (windowName) params.set('window_name', windowName);
        params.set('limit', '10');
        params.set('min_length', '10');

        const response = await fetch(`http://localhost:3030/search?${params}`);
        if (!response.ok) {
          console.error('0xHypr', 'Screenpipe search failed:', await response.text());
          return { error: `Screenpipe search failed: ${response.statusText}` };
        }

        const data = await response.json();
        
        // Post-process results to improve PDF detection
        const results = data.data as ScreenpipeSearchResult[];
    
        return results;
      } catch (error) {
        console.error('0xHypr', 'Error in screenpipe search:', error);
        return { error: 'Failed to search Screenpipe' };
      }
    },
  });
}

// Export the default instance for backward compatibility
export const screenpipeSearch = createScreenpipeSearch();
