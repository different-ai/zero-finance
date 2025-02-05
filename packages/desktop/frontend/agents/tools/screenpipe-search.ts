import { z } from 'zod';
import { tool } from 'ai';
import { pipe } from '@screenpipe/browser';
import type { ContentType } from '@screenpipe/browser';

// Define the schema for search parameters and results
export const screenpipeSearchParamsSchema = z.object({
  query: z.string().optional(),
  contentType: z.enum(['ocr', 'audio', 'ui']),
  appName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  humanReadableAction: z.string().describe('Human readable action to be displayed to the user'),
});

export const screenpipeContentSchema = z.object({
  text: z.string(),
  timestamp: z.string(),
  frame_id: z.number().optional(),
  file_path: z.string().optional(),
  offset_index: z.number().optional(),
  app_name: z.string().optional(),
  window_name: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const screenpipeResultSchema = z.object({
  type: z.string(),
  content: screenpipeContentSchema,
  humanReadableAction: z.string().optional(),
});

export type ScreenpipeSearchParams = z.infer<typeof screenpipeSearchParamsSchema>;
export type ScreenpipeSearchResult = z.infer<typeof screenpipeResultSchema>;

// Clean and sanitize search query to prevent FTS5 syntax errors
function sanitizeSearchQuery(query: string): string {
  // Remove special characters that can cause FTS5 syntax errors
  return query
    .replace(/[#"*^{}[\]()~?\\$]/g, ' ')  // Remove special chars that break FTS5
    .replace(/\s+/g, ' ')                  // Normalize whitespace
    .trim();                               // Remove leading/trailing whitespace
}

export const screenpipeSearch = tool({
  description: `
  Use me to search for content you must use me.
    Search Screenpipe's local database (OCR, audio, UI captures).
    Provide a query or keywords, optional appName, startTime, endTime, etc.
    sample query: 
    - I need to do OR Could you finish 
    - Please send an invoice for 
    - Add to my calendar OR 
    - Pay X to Y
  `,
  
  parameters: screenpipeSearchParamsSchema,
  execute: async (params) => {
    console.log('0xHypr', 'screenpipeSearch', params);
    // encode start end time to iso string
    const startTimeIso = new Date(params.startTime).toISOString();
    const endTimeIso = new Date(params.endTime).toISOString();
    try {
      // Use the Screenpipe SDK to perform the search
      const results = await pipe.queryScreenpipe({
        q: params.query ? sanitizeSearchQuery(params.query) : undefined,
        contentType: params.contentType as ContentType, // Cast to SDK's ContentType
        //  disable for now
        // appName: params.appName,
        startTime: startTimeIso,
        endTime: endTimeIso,
        limit: 10,
        minLength: 10,
        includeFrames: false
      });

      // Validate response structure
      if (!results?.data) {
        console.error('0xHypr', 'Invalid response format from Screenpipe:', results);
        return { error: 'Invalid response format from Screenpipe' };
      }
      console.log('0xHypr', 'results', results);
      // filter out app name HyprSqrl
      const filteredResults = results.data.filter((result) => 
        !result.content?.window_name?.toLowerCase().includes('hyprsqrl')
      );
      console.log('0xHypr', 'filteredResults', filteredResults);

      return filteredResults.map(result => screenpipeResultSchema.parse({
        type: result.type,
        content: result.content,
        humanReadableAction: params.humanReadableAction
      }));
    } catch (error) {
      console.error('0xHypr', 'Error in screenpipe search:', error);
      return { 
        error: 'Failed to search Screenpipe',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  },
});
