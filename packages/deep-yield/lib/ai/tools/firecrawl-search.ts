import { tool } from 'ai';
import { z } from 'zod';
import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';
import 'dotenv/config';

// Ensure FIRECRAWL_API_KEY is set in your environment variables
const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.warn(
    'FIRECRAWL_API_KEY environment variable not set. Firecrawl tool will not work.',
  );
}

// Initialize FirecrawlApp only if apiKey is available
const app = apiKey ? new FirecrawlApp({ apiKey }) : null;

// Type guard to check for a successful ScrapeResponse with markdown
function isSuccessfulMarkdownScrape(response: any): response is ScrapeResponse & { markdown: string } {
    return response && typeof response.markdown === 'string' && !response.error;
}

export const fireCrawlExtract = tool({
  description:
    'Scrapes a specific URL using Firecrawl to extract its main content in markdown format. Use this when you need the full content of a known webpage (avoid reddit).',
  parameters: z.object({
    urlToCrawl: z
      .string()
      .describe(
        'The exact URL to scrape (must include http:// or https://)',
      ),
  }),
  execute: async ({ urlToCrawl }) => {
    if (!app) {
      return 'Error: Firecrawl App not initialized due to missing API key.';
    }
    try {
      console.log(`Attempting to scrape URL: ${urlToCrawl} with Firecrawl`);
      const scrapeResponse = await app.scrapeUrl(urlToCrawl, {
        formats: ['markdown'], // Request markdown format
        timeout: 30000, // 30 seconds
      });

      console.log('Firecrawl scrapeResponse:', JSON.stringify(scrapeResponse, null, 2));

      // Use the type guard to check for success
      if (!isSuccessfulMarkdownScrape(scrapeResponse)) {
          console.error(`Firecrawl failed to scrape or returned no markdown data for URL: ${urlToCrawl}`);
          const errorReason = (scrapeResponse as any)?.error || 'Unknown error or no valid markdown content found.';
          return `Error: Failed to scrape content from ${urlToCrawl}. Reason: ${errorReason}. The page might be inaccessible, empty, or blocked.`;
      }

      // Now TypeScript should be confident scrapeResponse has markdown
      const markdownContent = scrapeResponse.markdown;

      console.log(`Successfully scraped and extracted markdown from: ${urlToCrawl}`);
      const MAX_LENGTH = 20000;
      return markdownContent.length > MAX_LENGTH
        ? markdownContent.substring(0, MAX_LENGTH) + '... [truncated]'
        : markdownContent;

    } catch (error: any) {
      console.error(`Error scraping URL ${urlToCrawl} with Firecrawl:`, error);
      const errorMessage = error.message || String(error);
      return `Error: An exception occurred while trying to scrape ${urlToCrawl}. Details: ${errorMessage}`;
    }
  },
}); 