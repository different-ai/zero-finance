import { tool } from 'ai';
import { z } from 'zod';

// Example using CoinGecko API (free tier)
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Map common token symbols to their CoinGecko IDs
const TOKEN_ID_MAP: Record<string, string> = {
  'eure': 'euro-coin',
  'eurt': 'tether-eurt',
  'ageur': 'ageur',
  'usdc': 'usd-coin',
  'usdt': 'tether',
  'dai': 'dai',
  'eth': 'ethereum',
  'weth': 'weth',
  'wbtc': 'wrapped-bitcoin',
  'btc': 'bitcoin',
  'gno': 'gnosis',
  'xdai': 'xdai',
};

async function fetchPrice(tokenSymbol: string, vsCurrency: string = 'usd'): Promise<number | null> {
  try {
    // Convert token symbol to CoinGecko ID if possible
    const lowerSymbol = tokenSymbol.toLowerCase();
    const tokenId = TOKEN_ID_MAP[lowerSymbol] || lowerSymbol;
    
    console.log(`Fetching price for token ID ${tokenId} in ${vsCurrency}`);
    
    // Add a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${tokenId}&vs_currencies=${vsCurrency}`, 
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`CoinGecko price fetch failed for ${tokenId}: ${response.status}`);
        return null;
      }
      
      const data = await response.json();

      console.log(`Data: ${JSON.stringify(data)}`);
      
      if (data && data[tokenId] && data[tokenId][vsCurrency]) {
        return data[tokenId][vsCurrency];
      }
      
      console.warn(`Price data not found for ${tokenId} in ${vsCurrency}`);
      return null;
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`Fetch for ${tokenId} timed out after 10 seconds`);
      } else {
        console.error(`Fetch error for ${tokenId}:`, fetchError);
      }
      
      return null;
    }
  } catch (error) {
    console.error(`Error fetching price for ${tokenSymbol}:`, error);
    return null;
  }
}

export const getTokenPrice = tool({
  description: `Get the current market price of a cryptocurrency token in a reference currency (usually USD). Use this to value investments or compare different assets.`,
  parameters: z.object({
    tokenSymbol: z.string().describe("The symbol of the token to get the price for (e.g., 'EURe', 'GNO', 'USDC', 'WETH')."),
    vsCurrency: z.string().nullable().describe("The currency to get the price in (default: 'usd')."),
  }),
    execute: async ({ tokenSymbol, vsCurrency = 'usd' }) => {
    console.log(`Executing getTokenPrice for ${tokenSymbol} vs ${vsCurrency}`);
    const price = await  fetchPrice(tokenSymbol, vsCurrency || 'usd');

    if (price !== null) {
      return {
        success: true,
        price: price,
        message: `The current price of ${tokenSymbol} is approximately ${price} ${vsCurrency.toUpperCase()}.`
      };
    } else {
      // Fallback values for common stablecoins if API fails
      if (tokenSymbol.toLowerCase().includes('eur') && price === null) {
        // Assume 1 EUR ~ 1.1 USD
        return {
          success: true,
          price: 1.1,
          message: `Could not fetch exact price for ${tokenSymbol}. Using estimate: 1 ${tokenSymbol} ≈ 1.10 USD.`
        };
      }
      if (tokenSymbol.toLowerCase().includes('usd') && price === null) {
        // Assume 1 USD stablecoin ~ 1 USD
        return {
          success: true,
          price: 1.0,
          message: `Could not fetch exact price for ${tokenSymbol}. Using estimate: 1 ${tokenSymbol} ≈ 1.00 USD.`
        };
      }
      
      return {
        success: false,
        price: null,
        message: `Could not retrieve the current price for ${tokenSymbol}. The token might not be listed or there was an API error.`
      };
    }
  },
}); 