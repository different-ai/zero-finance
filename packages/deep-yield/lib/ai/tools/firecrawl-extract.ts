import { tool } from 'ai';
import { z } from 'zod';
import FirecrawlApp from '@mendable/firecrawl-js';
import 'dotenv/config';

// Ensure FIRECRAWL_API_KEY is set
const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.warn(
    'FIRECRAWL_API_KEY environment variable not set. Firecrawl Extract tool will not work.',
  );
}

// Initialize FirecrawlApp only if apiKey is available
const app = apiKey ? new FirecrawlApp({ apiKey }) : null;

// Define the schema for the parameters required by the extraction tool
const extractParametersSchema = z.object({
  urls: z
    .array(z.string().url())
    .min(1)
    .max(10) // Limit the number of URLs to process at once
    .describe('An array of URLs to extract information from.'),
  extractionPrompt: z
    .string()
    .min(10)
    .max(500)
    .describe(
      'A natural language prompt describing the information to extract (e.g., "Extract user opinions on trustworthiness", "Summarize the key points").',
    ),
  // Optional: Define an extraction schema if needed, otherwise Firecrawl returns structured JSON
  // extractionSchema: z.object({ ... }).optional().describe('Optional Zod schema for structured extraction.')
});

export const firecrawlExtract = tool({
  description:
    'Extracts specific information from a list of URLs based on a natural language prompt using Firecrawl. Returns the extracted data, often in JSON format.',
  parameters: extractParametersSchema,
  execute: async ({ urls, extractionPrompt }) => {
    if (!app) {
      return 'Error: Firecrawl App not initialized due to missing API key.';
    }
    try {
      console.log(`Attempting Firecrawl extraction from URLs: ${urls.join(', ')}`);
      console.log(`Extraction prompt: "${extractionPrompt}"`);

      // Use app.extract without a predefined schema for flexibility
      // Firecrawl will attempt to structure the output based on the prompt
      const extractResponse = await app.extract(urls, {
        prompt: extractionPrompt,
        // No explicit schema provided here; let Firecrawl structure it
        // mode: 'llm-extraction' // Default mode
      });

      console.log('Firecrawl extractResponse:', JSON.stringify(extractResponse, null, 2));

      // Check for success - app.extract returns { success: boolean, data: any, error?: string }
      if (!extractResponse || !extractResponse.success || !extractResponse.data) {
        console.error(`Firecrawl extraction failed for URLs: ${urls.join(', ')}`);
        const errorReason = extractResponse?.error || 'Unknown error or no data extracted.';
        return `Error: Failed to extract information. Reason: ${errorReason}.`;
      }

      console.log('Successfully extracted data using Firecrawl.');

      // Return the extracted data directly (likely JSON)
      // Stringify for consistent return type, truncate if very large
      const jsonData = JSON.stringify(extractResponse.data);
      const MAX_LENGTH = 15000;
      return jsonData.length > MAX_LENGTH
        ? jsonData.substring(0, MAX_LENGTH) + '... [truncated]'
        : jsonData;

    } catch (error: any) {
      console.error(`Error during Firecrawl extraction:`, error);
      const errorMessage = error.message || String(error);
      return `Error: An exception occurred during data extraction. Details: ${errorMessage}`;
    }
  },
}); 