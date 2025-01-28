import { z } from 'zod';
import { tool } from 'ai';
import { pipe } from '@screenpipe/browser';
import type { ContentType } from '@screenpipe/browser';

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
  };
  humanReadableAction?: string;
}

// Clean and sanitize search query to prevent FTS5 syntax errors
function sanitizeSearchQuery(query: string): string {
  // Remove special characters that can cause FTS5 syntax errors
  return query
    .replace(/[#"*^{}[\]()~?\\]/g, ' ')  // Remove special chars that break FTS5
    .replace(/\s+/g, ' ')                 // Normalize whitespace
    .trim();                              // Remove leading/trailing whitespace
}

export const screenpipeSearch = tool({
  description: `
  Use me to search for content you must use me.
    Search Screenpipe's local database (OCR, audio, UI captures).
    Provide a query or keywords, optional appName, startTime, endTime, etc.
  `,
  
  parameters: z.object({
    query: z.string().optional(),
    contentType: z.enum(['ocr', 'audio', 'ui']),
    appName: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    humanReadableAction: z.string().describe('Human readable action to be displayed to the user e.g. "Searching for keywords in OCR content between specified timestamps."'),
  }),
  execute: async ({ query, contentType, appName, startTime, endTime }) => {
    console.log('0xHypr', 'screenpipeSearch', { query, contentType, appName, startTime, endTime });
    try {
      // Use the Screenpipe SDK to perform the search
      const results = await pipe.queryScreenpipe({
        q: query ? sanitizeSearchQuery(query) : undefined,
        contentType: contentType as ContentType, // Cast to SDK's ContentType
        appName: appName,
        startTime,
        endTime,
        limit: 10,
        minLength: 10,
        includeFrames: false
      });

      // Validate response structure
      if (!results?.data) {
        console.error('0xHypr', 'Invalid response format from Screenpipe:', results);
        return { error: 'Invalid response format from Screenpipe' };
      }

      return results.data;
    } catch (error) {
      console.error('0xHypr', 'Error in screenpipe search:', error);
      return { 
        error: 'Failed to search Screenpipe',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  },
});
