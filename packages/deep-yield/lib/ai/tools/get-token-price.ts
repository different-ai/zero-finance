import { tool } from 'ai';
import { z } from 'zod';

// Example using CoinGecko API (free tier)
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Map common token symbols to their CoinGecko IDs
const TOKEN_ID_MAP: Record<string, string> = {
  // Stablecoins
  'eure': 'euro-coin',
  'eurt': 'tether-eurt',
  'ageur': 'ageur',
  'usdc': 'usd-coin',
  'usdt': 'tether',
  'usdc.e': 'bridged-usdc-polygon-pos-bridge',
  'busd': 'binance-usd',
  'dai': 'dai',
  'frax': 'frax',
  'lusd': 'liquity-usd',
  'tusd': 'true-usd',
  'gusd': 'gemini-dollar',
  'usdp': 'paxos-standard',
  'usdd': 'usdd',
  
  // Major cryptocurrencies
  'eth': 'ethereum',
  'weth': 'weth',
  'steth': 'staked-ether',
  'btc': 'bitcoin',
  'wbtc': 'wrapped-bitcoin',
  'sol': 'solana',
  'bnb': 'binancecoin',
  'avax': 'avalanche-2',
  'matic': 'matic-network',
  'wmatic': 'wmatic',
  'arb': 'arbitrum',
  'op': 'optimism',
  'ftm': 'fantom',
  'gno': 'gnosis',
  'xdai': 'xdai',
  'link': 'chainlink',
  'ada': 'cardano',
  'doge': 'dogecoin',
  'shib': 'shiba-inu',
  'dot': 'polkadot',
  'ltc': 'litecoin',
  'trx': 'tron',
  'near': 'near',
  'atom': 'cosmos',
  'uni': 'uniswap',
  'aave': 'aave',
  'sushi': 'sushi',
  'crv': 'curve-dao-token',
  'mkr': 'maker',
  'comp': 'compound-governance-token',
  'snx': 'havven',
  'ens': 'ethereum-name-service',
  'bal': 'balancer',
  '1inch': '1inch',
  'grt': 'the-graph',
  'ldo': 'lido-dao',
  'ren': 'republic-protocol',
  'sand': 'the-sandbox',
  'mana': 'decentraland',
  'axs': 'axie-infinity',
  'rpl': 'rocket-pool',
  'cvx': 'convex-finance',
  'fxs': 'frax-share',
  'gmx': 'gmx',
  'stg': 'stargate-finance',
  'pepe': 'pepe',
  'sui': 'sui',
  'apt': 'aptos',
  'vet': 'vechain',
  'fil': 'filecoin',
  'cake': 'pancakeswap-token',
  'flow': 'flow',
};

// Cache for storing coin list (to avoid repeated API calls)
let coinListCache: Record<string, string> | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Function to fetch all supported coins from CoinGecko
async function fetchCoinList(): Promise<Record<string, string>> {
  // Return cached value if available and not expired
  const now = Date.now();
  if (coinListCache && (now - lastCacheTime < CACHE_DURATION)) {
    console.log('Using cached coin list');
    return coinListCache;
  }

  console.log('Fetching full coin list from CoinGecko');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/list`, 
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`CoinGecko coin list fetch failed: ${response.status}`);
      return {};
    }
    
    const coins = await response.json();
    
    // Create a mapping of symbol to id
    const symbolToId: Record<string, string> = {};
    for (const coin of coins) {
      if (coin.symbol && coin.id) {
        // For duplicate symbols, prioritize more established coins
        // This is a simple heuristic - in practice, you might want more complex logic
        const existingId = symbolToId[coin.symbol.toLowerCase()];
        if (!existingId || 
            (coin.id.toLowerCase() === coin.symbol.toLowerCase()) || // Exact match gets priority
            (coin.id.length < existingId.length)) { // Shorter IDs tend to be more established coins
          symbolToId[coin.symbol.toLowerCase()] = coin.id;
        }
      }
    }
    
    // Cache the result
    coinListCache = symbolToId;
    lastCacheTime = now;
    
    console.log(`Cached ${Object.keys(symbolToId).length} coins from CoinGecko`);
    return symbolToId;
  } catch (error) {
    console.error('Error fetching coin list:', error);
    return {};
  }
}

// Function to find a CoinGecko ID for a token symbol
async function findCoinGeckoId(symbol: string): Promise<string | null> {
  const lowerSymbol = symbol.toLowerCase();
  
  // 1. Check our hardcoded map first (most reliable)
  if (TOKEN_ID_MAP[lowerSymbol]) {
    return TOKEN_ID_MAP[lowerSymbol];
  }
  
  // 2. Try to fetch from the complete list if not in our map
  try {
    const coinList = await fetchCoinList();
    if (coinList[lowerSymbol]) {
      console.log(`Found ${lowerSymbol} in CoinGecko list: ${coinList[lowerSymbol]}`);
      return coinList[lowerSymbol];
    }
    
    // 3. Try common variations
    // Remove .e, -e, etc. suffixes that denote bridged tokens
    const baseSymbol = lowerSymbol.split('.')[0].split('-')[0];
    if (baseSymbol !== lowerSymbol && coinList[baseSymbol]) {
      console.log(`Found base symbol ${baseSymbol} in CoinGecko list: ${coinList[baseSymbol]}`);
      return coinList[baseSymbol];
    }
  } catch (error) {
    console.error(`Error finding CoinGecko ID for ${symbol}:`, error);
  }
  
  // 4. Fallback: just use the symbol itself (sometimes works)
  return lowerSymbol;
}

async function fetchPrice(tokenSymbol: string, vsCurrency: string = 'usd'): Promise<number | null> {
  try {
    // Convert token symbol to CoinGecko ID
    const lowerSymbol = tokenSymbol.toLowerCase();
    const tokenId = await findCoinGeckoId(lowerSymbol);
    
    if (!tokenId) {
      console.error(`Could not determine CoinGecko ID for ${tokenSymbol}`);
      return null;
    }
    
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
    const price = await fetchPrice(tokenSymbol, vsCurrency || 'usd');

    if (price !== null) {
      return {
        success: true,
        price: price,
        message: `The current price of ${tokenSymbol} is approximately ${price} ${vsCurrency?.toUpperCase() || 'USD'}.`
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
      
      // Fallback for native chain tokens
      const nativeTokenFallbacks: Record<string, number> = {
        'eth': 1800,
        'matic': 0.55,
        'avax': 27,
        'ftm': 0.45,
        'bnb': 550,
        'arb': 1.0,
        'op': 2.0,
      };
      
      const lowerSymbol = tokenSymbol.toLowerCase();
      if (nativeTokenFallbacks[lowerSymbol]) {
        return {
          success: true,
          price: nativeTokenFallbacks[lowerSymbol],
          message: `Could not fetch exact price for ${tokenSymbol}. Using estimate: 1 ${tokenSymbol} ≈ $${nativeTokenFallbacks[lowerSymbol]}.`
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