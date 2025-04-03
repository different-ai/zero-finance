import { tool } from 'ai';
import { z } from 'zod';
import FirecrawlApp from '@mendable/firecrawl-js';
import 'dotenv/config';

// Ensure FIRECRAWL_API_KEY is set in your environment variables
const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.warn(
    'FIRECRAWL_API_KEY environment variable not set. Firecrawl tool will not work.',
  );
}

const app = new FirecrawlApp({ apiKey });

export const firecrawlSearch = tool({
  description:
    'Crawls a specific URL using Firecrawl to extract its content in markdown format. Use this when you need the full content of a known webpage.',
  parameters: z.object({
    urlToCrawl: z
      .string()
      .url()
      .min(1)
      .max(200) // Increased max length slightly
      .describe(
        'The exact URL to crawl (must include http:// or https://)',
      ),
  }),
  execute: async ({ urlToCrawl }) => {
    if (!apiKey) {
      return 'Error: Firecrawl API key not configured.';
    }
    try {
      console.log(`Attempting to crawl URL: ${urlToCrawl}`);
      // Using crawlUrl as per the user's example
      const crawlResponse = await app.crawlUrl(urlToCrawl, {
        limit: 1, // Limit to crawling only the specified URL
        pageOptions: { // Corrected parameter name based on firecrawl-js docs
            onlyMainContent: true, // Try to extract only the main content
        },
        crawlerOptions: {
            includes: [], // No need to follow further links for this tool
            excludes: ['*'], // Exclude all other paths
        },
        scrapeOptions: {
            formats: ['markdown'], // Request only markdown format
        }

      });

      console.log('Firecrawl crawlResponse:', crawlResponse);

      if (!crawlResponse || !crawlResponse.data || crawlResponse.data.length === 0) {
          // Firecrawl v0.1.33 might return an empty array or null on failure/no content
          console.error(`Firecrawl failed to crawl or returned no data for URL: ${urlToCrawl}`);
          return `Error: Failed to crawl or extract content from ${urlToCrawl}. The page might be inaccessible or empty.`;
      }

      // Assuming success if we have data, accessing the markdown content
      const markdownContent = crawlResponse.data[0]?.markdown; // Access the first item's markdown

      if (!markdownContent) {
          console.error(`Firecrawl returned no markdown content for URL: ${urlToCrawl}`);
          return `Error: No markdown content could be extracted from ${urlToCrawl}.`;
      }

      console.log(`Successfully crawled and extracted markdown from: ${urlToCrawl}`);
      // Return only the markdown content, truncated if necessary
      const MAX_LENGTH = 15000; // Limit response size
      return markdownContent.length > MAX_LENGTH
        ? markdownContent.substring(0, MAX_LENGTH) + '... [truncated]'
        : markdownContent;

    } catch (error: any) {
      console.error(`Error crawling URL ${urlToCrawl} with Firecrawl:`, error);
      return `Error: An exception occurred while trying to crawl ${urlToCrawl}. ${error.message || error}`;
    }
  },
}); 