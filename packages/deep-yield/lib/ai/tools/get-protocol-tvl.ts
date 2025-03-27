import { tool } from 'ai';
import { z } from 'zod';

// Basic cache for protocol TVL
const protocolTvlCache: Record<string, { value: number, timestamp: number }> = {};
const CACHE_DURATION_TVL = 5 * 60 * 1000; // 5 minutes

async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      // Try to get error message from DefiLlama if available
      let errorBody = `API request failed with status ${response.status}`;
      try {
        const text = await response.text();
        errorBody += `: ${text}`;
      } catch (_) { /* ignore */ }
      throw new Error(errorBody);
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API request timed out');
    }
    throw error;
  }
}

export const getProtocolTvl = tool({
  description: `Fetches the current Total Value Locked (TVL) in USD for a specific DeFi protocol using its slug name (e.g., 'aave', 'uniswap-v3', 'curve-finance'). Use this for requests like "What is the TVL of Uniswap?".`,
  parameters: z.object({
    protocolSlug: z.string().describe(
      `The unique slug identifier for the protocol on DefiLlama. Examples: 'aave', 'uniswap-v3', 'makerdao', 'lido'. Should be lowercase and often includes hyphens.`
    ),
  }),
  execute: async ({ protocolSlug }) => {
    console.log(`Executing getProtocolTvl for slug: ${protocolSlug}`);
    const cacheKey = protocolSlug.toLowerCase();
    const now = Date.now();

    // Check cache first
    if (protocolTvlCache[cacheKey] && (now - protocolTvlCache[cacheKey].timestamp) < CACHE_DURATION_TVL) {
      console.log(`Returning cached TVL for ${protocolSlug}`);
      const cachedValue = protocolTvlCache[cacheKey].value;
      return `The current cached TVL for ${protocolSlug} is $${cachedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`;
    }

    try {
      const apiUrl = `https://api.llama.fi/tvl/${protocolSlug}`;
      console.log(`Fetching TVL from: ${apiUrl}`);
      const response = await fetchWithTimeout(apiUrl);
      const tvl = await response.json(); // This endpoint returns just the number

      if (typeof tvl !== 'number') {
        throw new Error('Invalid TVL data received from API');
      }

      // Update cache
      protocolTvlCache[cacheKey] = { value: tvl, timestamp: now };

      const formattedTvl = tvl.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return `The current TVL for ${protocolSlug} is $${formattedTvl}. Data source: DefiLlama.`;

    } catch (error: unknown) {
      console.error(`Error fetching TVL for ${protocolSlug}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      // Provide a more informative error message if it's a 404-like error
      if (errorMessage.includes('404') || errorMessage.toLowerCase().includes('not found')) {
         return `Error fetching TVL: Could not find protocol with slug '${protocolSlug}' on DefiLlama. Please ensure the slug is correct.`;
      }
      return `Error fetching TVL for ${protocolSlug}: ${errorMessage}.`;
    }
  },
});