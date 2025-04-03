import { tool } from 'ai';
import { z } from 'zod';
import FirecrawlApp, { SearchResponse, FirecrawlDocument } from '@mendable/firecrawl-js';
import 'dotenv/config';

// Ensure FIRECRAWL_API_KEY is set in your environment variables
const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.warn(
    'FIRECRAWL_API_KEY environment variable not set. Firecrawl Web Search tool will not work.',
  );
}

// Initialize FirecrawlApp only if apiKey is available
const app = apiKey ? new FirecrawlApp({ apiKey }) : null;

// Zod schema for individual items within the searchResponse.data array
// Should align with the structure of FirecrawlDocument or the actual item structure
const searchResultItemSchema = z.object({
  url: z.string().url(),
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  markdown: z.string().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
  // Add other potential fields from FirecrawlDocument if known
});

// Zod schema for the data array itself
const searchResultsDataSchema = z.array(searchResultItemSchema);

// Type guard for successful search response (checks the overall structure)
function isSuccessfulSearchResponse(response: any): response is SearchResponse {
    // SearchResponse likely has a `data` array property upon success
    return response && Array.isArray(response.data);
}

export const firecrawlWebSearch = tool({
  description:
    'Performs a web search using Firecrawl based on a query string. Returns a list of relevant URLs, titles, and potentially content snippets. Use this for general web searches.',
  parameters: z.object({
    query: z
      .string()
      .min(3)
      .max(200)
      .describe('The search query string.'),
  }),
  execute: async ({ query }) => {
    if (!app) {
      return 'Error: Firecrawl App not initialized due to missing API key.';
    }
    try {
      console.log(`Attempting web search with Firecrawl for query: "${query}"`);

      // searchResponse should be of type SearchResponse | ErrorResponse
      const searchResponse = await app.search(query, {
          pageOptions: {
              fetchPageContent: true,
          },
          limit: 5,
          timeout: 20000,
      });

      console.log('Firecrawl searchResponse:', JSON.stringify(searchResponse, null, 2));

      // Use the type guard for the overall response
      if (!isSuccessfulSearchResponse(searchResponse) || searchResponse.data.length === 0) {
          console.error(`Firecrawl search failed or returned no results for query: "${query}"`);
          const errorReason = (searchResponse as any)?.error || 'Unknown error or no results found.';
          return `Error: Web search failed for query "${query}". Reason: ${errorReason}.`;
      }

      // Now searchResponse is narrowed to SearchResponse, access searchResponse.data
      const resultsData = searchResponse.data;

      // Validate the structure of the data array
      const validationResult = searchResultsDataSchema.safeParse(resultsData);
      if (!validationResult.success) {
        console.warn('Firecrawl search response data validation failed: ', validationResult.error);
        // Logged warning, proceed with raw data
      }

      // Use the validated data if successful, otherwise use raw data for formatting
      // The items in the array are what we need to map over
      const dataToFormat = validationResult.success ? validationResult.data : resultsData;

      // Map over the items in the data array. Assume item type is FirecrawlDocument or use 'any'
      const formattedResults = dataToFormat.map((item: FirecrawlDocument | any, index: number) => {
        let resultString = `${index + 1}. URL: ${item.url}`;
        // Access properties safely, checking existence
        if (item.title) resultString += `\n   Title: ${item.title}`;
        const snippet = item.markdown || item.content;
        if (snippet) {
            const truncatedSnippet = snippet.length > 300 ? snippet.substring(0, 300) + '...' : snippet;
            resultString += `\n   Snippet: ${truncatedSnippet.replace(/\n+/g, ' ')}`;
        }
        return resultString;
      }).join('\n\n');

      console.log(`Successfully performed Firecrawl web search for query: "${query}"`);
      return formattedResults || 'Search completed, but no results found.';

    } catch (error: any) {
      console.error(`Error during Firecrawl web search for query "${query}":`, error);
      const errorMessage = error.message || String(error);
      return `Error: An exception occurred during web search for "${query}". Details: ${errorMessage}`;
    }
  },
}); 