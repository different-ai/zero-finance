import { tool } from 'ai';
import { z } from 'zod';

// Basic cache for chain TVL
const chainTvlCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION_TVL = 5 * 60 * 1000; // 5 minutes

// Common blockchain names mapping to their DefiLlama slug
const CHAIN_SLUG_MAPPING: Record<string, string> = {
  'eth': 'ethereum',
  'ethereum': 'ethereum',
  'polygon': 'polygon',
  'matic': 'polygon',
  'bsc': 'bsc',
  'binance': 'bsc',
  'binance smart chain': 'bsc',
  'avax': 'avalanche',
  'avalanche': 'avalanche',
  'ftm': 'fantom',
  'fantom': 'fantom',
  'arb': 'arbitrum',
  'arbitrum': 'arbitrum',
  'op': 'optimism',
  'optimism': 'optimism',
  'sol': 'solana',
  'solana': 'solana',
  'base': 'base'
};

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

export const getChainTvl = tool({
  description: `Fetches the current Total Value Locked (TVL) in USD for a specific blockchain (e.g., 'ethereum', 'arbitrum', 'polygon'). Use this for requests like "What is the TVL on Arbitrum?" or "How much is locked in Optimism?".`,
  parameters: z.object({
    chainName: z.string().describe(
      `The blockchain name or its common abbreviation. Examples: 'ethereum', 'eth', 'arbitrum', 'arb', 'polygon', 'matic', 'solana', 'sol', 'optimism', 'avalanche', 'bsc', 'base', etc.`
    ),
  }),
  execute: async ({ chainName }) => {
    console.log(`Executing getChainTvl for chain: ${chainName}`);
    
    // Normalize chain name and find proper slug
    const normalizedChain = chainName.trim().toLowerCase();
    const chainSlug = CHAIN_SLUG_MAPPING[normalizedChain] || normalizedChain;
    
    const cacheKey = chainSlug;
    const now = Date.now();

    // Check cache first
    if (chainTvlCache[cacheKey] && (now - chainTvlCache[cacheKey].timestamp) < CACHE_DURATION_TVL) {
      console.log(`Returning cached TVL for ${chainSlug}`);
      const cachedData = chainTvlCache[cacheKey].data;
      
      // Format the cached data response
      const formattedTvl = cachedData.tvl.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return `The current cached TVL for ${chainSlug} is $${formattedTvl}.`;
    }

    try {
      // First check if we need to get all chains if chain name is unclear
      if (!CHAIN_SLUG_MAPPING[normalizedChain] && normalizedChain !== 'ethereum') {
        // Get all chains data to find the right match
        const allChainsUrl = 'https://api.llama.fi/v2/chains';
        console.log('Fetching all chains data to find the right match');
        const allChainsResponse = await fetchWithTimeout(allChainsUrl);
        const allChains = await allChainsResponse.json();
        
        if (!Array.isArray(allChains)) {
          throw new Error('Invalid data format received for chains list');
        }
        
        // Try to find the chain by name or partial match
        const matchedChain = allChains.find(chain => 
          chain.name.toLowerCase() === normalizedChain || 
          chain.name.toLowerCase().includes(normalizedChain)
        );
        
        if (matchedChain) {
          // Use the proper slug from the matched chain
          const tvl = matchedChain.tvl;
          
          // Update cache
          chainTvlCache[cacheKey] = { 
            data: { tvl, chainName: matchedChain.name }, 
            timestamp: now 
          };

          const formattedTvl = tvl.toLocaleString(undefined, { maximumFractionDigits: 0 });
          return `The current TVL for ${matchedChain.name} is $${formattedTvl}. Data source: DefiLlama.`;
        }
      }
      
      // If we have a known slug or ethereum, use the direct endpoint
      const apiUrl = `https://api.llama.fi/v2/historicalChainTvl/${chainSlug}`;
      console.log(`Fetching chain TVL from: ${apiUrl}`);
      const response = await fetchWithTimeout(apiUrl);
      const tvlData = await response.json();
      
      if (!Array.isArray(tvlData) || tvlData.length === 0) {
        throw new Error(`No TVL data found for chain: ${chainSlug}`);
      }
      
      // Get the most recent TVL data point
      const latestData = tvlData[tvlData.length - 1];
      const tvl = latestData.tvl;
      
      // Update cache
      chainTvlCache[cacheKey] = { 
        data: { tvl, chainName: chainSlug }, 
        timestamp: now 
      };

      const formattedTvl = tvl.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return `The current TVL for ${chainSlug} is $${formattedTvl}. Data source: DefiLlama.`;

    } catch (error: unknown) {
      console.error(`Error fetching TVL for chain ${chainSlug}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      // Provide a more informative error message if it's a 404-like error
      if (errorMessage.includes('404') || errorMessage.toLowerCase().includes('not found')) {
         return `Error fetching TVL: Could not find blockchain with name '${chainName}' on DefiLlama. Please ensure the blockchain name is correct.`;
      }
      
      return `Error fetching TVL for ${chainName}: ${errorMessage}.`;
    }
  },
});