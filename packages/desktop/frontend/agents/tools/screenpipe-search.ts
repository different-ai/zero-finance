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

// Helper to properly encode search terms
function sanitizeSearchTerm(term: string): string {
  // Remove problematic characters but keep spaces within phrases
  return term
    .replace(/['"`]/g, '') // Remove quotes
    .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
    .trim();
}

function buildSearchQuery(query: string): string {
  // Split on OR, being careful with spaces
  const terms = query
    .split(/\s+OR\s+/)
    .map(term => {
      const sanitized = sanitizeSearchTerm(term);
      // If term has spaces, wrap in quotes for FTS5
      return sanitized.includes(' ') ? `"${sanitized}"` : sanitized;
    })
    .filter(Boolean);

  // Join with OR operator
  return terms.join(' OR ');
}

// Helper to build URL with proper encoding
function buildSearchUrl(params: Record<string, any>): string {
  const baseUrl = 'http://localhost:3030/search';
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'q') {
        // Build and encode the search query
        const searchQuery = buildSearchQuery(value as string);
        console.log('0xHypr', 'Built search query:', searchQuery);
        searchParams.set(key, searchQuery);
      } else {
        searchParams.set(key, String(value));
      }
    }
  });

  const url = `${baseUrl}?${searchParams.toString()}`;
  console.log('0xHypr', 'Final URL:', url);
  return url;
}

export function createScreenpipeSearch(config?: ScreenpipeSearchConfig) {
  return tool({
    description: `
      Search Screenpipe's local database (OCR, audio, UI captures).
      Uses SQLite FTS5 for full-text search.
      Supports basic OR queries and word matches.
      Example: "task OR todo OR reminder"
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
        const url = buildSearchUrl({
          q: query,
          content_type: contentType,
          start_time: startTime,
          end_time: endTime,
          window_name: windowName,
          limit: 20,
          min_length: 20,
          app_name: 'Arc'
        });

        console.log('0xHypr', 'Search URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('0xHypr', 'Screenpipe search failed:', errorText);
          return { 
            error: `Screenpipe search failed: ${errorText}`,
            query: query,
            sanitizedQuery: buildSearchQuery(query)
          };
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('0xHypr', 'Error in screenpipe search:', error);
        return { 
          error: error instanceof Error ? error.message : 'Failed to search Screenpipe',
          query: query,
          sanitizedQuery: buildSearchQuery(query)
        };
      }
    },
  });
}

// Export the default instance for backward compatibility
export const screenpipeSearch = createScreenpipeSearch();
