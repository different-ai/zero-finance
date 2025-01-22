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
    description: `
      Search Screenpipe's local database (OCR, audio, UI captures).
      Provide a query or keywords, optional appName, startTime, endTime, etc.
      only on
      hmm actually in theory you can do that

/search&q=text:dog OR cat

(properly url encoded)
    `,
    parameters: z.object({
      query: z.string(),
      contentType: z.enum(['ocr', 'audio']),
      startTime: z.string(),
      endTime: z.string(),
      windowName: z.string(),
      humanReadableAction: z
        .string()
        .describe(
          'A human readable action to be used in the agent explaining what the tool is doing'
        ),
    }),
    execute: async ({ query, contentType, startTime, endTime, windowName }) => {
      try {
        // Sanitize the query to prevent FTS5 syntax errors
        const sanitizedQuery = query
          .replace(/['"`]/g, '') // Remove quotes that could break FTS5
          .replace(/[^\w\s:]/g, ' ') // Replace special chars with spaces
          .trim();

        const params = new URLSearchParams();
        if (sanitizedQuery) params.set('q', sanitizedQuery);
        if (contentType) params.set('content_type', contentType);
        if (startTime) params.set('start_time', startTime);
        if (endTime) params.set('end_time', endTime);
        // if (windowName) params.set('window_name', windowName);
        params.set('limit', '20');
        params.set('min_length', '20');
        params.set('app_name', 'Arc');

        console.log("0xHypr", 'sanitizedQuery', sanitizedQuery);

        const response = await fetch(`http://localhost:3030/search?${params}`);
        if (!response.ok) {
          console.error(
            '0xHypr',
            'Screenpipe search failed:',
            await response.text()
          );
          return { error: `Screenpipe search failed: ${response.statusText}` };
        }

        const data = await response.json();

        // Post-process results to improve PDF detection
        return data;
      } catch (error) {
        console.error('0xHypr', 'Error in screenpipe search:', error);
        return { error: 'Failed to search Screenpipe' };
      }
    },
  });
}

// Export the default instance for backward compatibility
export const screenpipeSearch = createScreenpipeSearch();
