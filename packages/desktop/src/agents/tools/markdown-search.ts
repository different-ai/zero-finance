import { z } from 'zod';
import { tool } from 'ai';

export interface MarkdownSearchResult {
  type: 'markdown';
  content: {
    text: string;
    filePath: string;
    fileName: string;
    lineNumber?: number;
    matchContext?: string;
    metadata?: {
      title?: string;
      tags?: string[];
      created?: string;
      updated?: string;
      [key: string]: any;
    };
  };
}

export interface MarkdownSearchConfig {
  description?: string;
}

export function createMarkdownSearch(config?: MarkdownSearchConfig) {
  return tool({
    description: config?.description || `
      Search through markdown files in the hyperscroll directory.
      Provide a query or keywords, and optionally filter by metadata, tags, or date ranges.
      Results are ordered by relevance and recency.
    `,
    parameters: z.object({
      query: z.string().optional(),
      tags: z.array(z.string()).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      metadata: z.record(z.any()).optional(),
      fuzzyMatch: z.boolean().optional(),
    }),
    execute: async ({ query, tags, startDate, endDate, metadata, fuzzyMatch }) => {
      try {
        // This will be implemented in the preload/main process
        // @ts-ignore
        const results = await window.api.searchMarkdownFiles({
          query,
          tags,
          startDate,
          endDate,
          metadata,
          fuzzyMatch: fuzzyMatch ?? true
        });

        return results as MarkdownSearchResult[];
      } catch (error) {
        console.error('0xHypr', 'Error in markdown search:', error);
        return { error: 'Failed to search markdown files' };
      }
    },
  });
}

// Export the default instance for backward compatibility
export const markdownSearch = createMarkdownSearch(); 