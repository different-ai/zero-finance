import { tool } from 'ai';
import { z } from 'zod';
import { LIFI_CHAIN_MAP, NATIVE_TOKEN_ADDRESS } from './liFiConstants';

// --- Token Info Cache ---
interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  name: string;
  logoURI?: string;
  priceUSD?: string;
  source: 'Li.Fi' | 'Li.Fi (Native Token)';
}

interface ChainTokenData {
  tokens: {
    [chainId: number]: TokenInfo[];
  };
}
let tokenCache: { [chainId: number]: { data: TokenInfo[], timestamp: number } } = {};
const TOKEN_CACHE_DURATION = 60 * 60 * 1000; // Cache for 1 hour

async function fetchLiFiTokens(chainId: number): Promise<TokenInfo[]> {
  const now = Date.now();
  if (tokenCache[chainId] && (now - tokenCache[chainId].timestamp < TOKEN_CACHE_DURATION)) {
    console.log(`Using cached token data for chainId ${chainId}`);
    return tokenCache[chainId].data;
  }

  console.log(`Fetching fresh token data for chainId ${chainId} from Li.Fi`);
  const url = `https://li.quest/v1/tokens?chains=${chainId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Li.Fi /tokens API request failed: ${response.status} ${response.statusText}`);
    }
    const data: ChainTokenData = await response.json();

    if (!data.tokens || !data.tokens[chainId]) {
       console.warn(`No tokens found for chainId ${chainId} in Li.Fi response.`);
       tokenCache[chainId] = { data: [], timestamp: now }; // Cache empty result
       return [];
    }

    const tokens = data.tokens[chainId];
    tokenCache[chainId] = { data: tokens, timestamp: now };
    return tokens;

  } catch (error) {
    console.error(`Error fetching Li.Fi tokens for chainId ${chainId}:`, error);
    // Don't cache errors indefinitely, maybe return empty or rethrow
    return []; // Return empty on error to avoid blocking, but log it
  }
}

export const getTokenInfo = tool({
  description: `Looks up detailed information (contract address, decimals, name) for a given token symbol on a specific blockchain using the Li.Fi directory. Returns a structured object with token details or an error object. Essential for getting the correct inputs for other tools like getBridgeQuote.`,
  parameters: z.object({
    chainName: z.string().describe("The name of the blockchain (e.g., 'Ethereum', 'Gnosis', 'Arbitrum')."),
    tokenSymbol: z.string().describe("The token symbol (e.g., 'USDC', 'ETH', 'DAI', 'WETH'). Case-insensitive."),
  }),
  // Define the schema for the OBJECT the tool returns
  
  execute: async ({ chainName, tokenSymbol }) => {
    console.log(`Executing getTokenInfo: Symbol=${tokenSymbol}, Chain=${chainName}`);
    const normalizedChain = chainName.toLowerCase().trim();
    const normalizedSymbol = tokenSymbol.toUpperCase().trim();

    const chainId = LIFI_CHAIN_MAP[normalizedChain];
    if (!chainId) {
      // Return ERROR OBJECT
      return { error: `Unsupported chain name: '${chainName}'. Cannot find token info.` };
    }

    // Handle native token symbols explicitly (like ETH, MATIC, AVAX, etc.)
    // Li.Fi uses a specific zero-address convention for native tokens
    const nativeSymbols: Record<number, string> = {
        1: 'ETH', 42161: 'ETH', 10: 'ETH', // Ethereum, Arbitrum, Optimism
        137: 'MATIC', // Polygon
        100: 'XDAI', // Gnosis
        43114: 'AVAX', // Avalanche
        250: 'FTM', // Fantom
        56: 'BNB', // BSC
        8453: 'ETH', // Base
        324: 'ETH', // ZkSync
        5000: 'MNT', // Mantle
        59144: 'ETH', // Linea
    };

    if (normalizedSymbol === nativeSymbols[chainId]) {
        console.log(`Identified native token ${normalizedSymbol} for chain ${chainId}`);
         // Find the native token entry if it exists in Li.Fi's list (might have details like logo)
         const tokens = await fetchLiFiTokens(chainId);
         const nativeInfo = tokens.find(t => t.address === NATIVE_TOKEN_ADDRESS);
         // Return SUCCESS OBJECT for native token
         return {
             address: NATIVE_TOKEN_ADDRESS,
             symbol: normalizedSymbol,
             decimals: nativeInfo?.decimals ?? 18, // Default native to 18 if not found
             chainId: chainId,
             name: nativeInfo?.name ?? `${normalizedSymbol} (Native Token)`,
             logoURI: nativeInfo?.logoURI,
             priceUSD: nativeInfo?.priceUSD, // Pass price if available
             source: 'Li.Fi (Native Token)' as const // Use 'as const' for literal type
         };
    }

    try {
      const tokens = await fetchLiFiTokens(chainId);
      if (tokens.length === 0) {
          // Return ERROR OBJECT
          return { error: `No token data found for chain '${chainName}' (ID: ${chainId}) via Li.Fi.` };
      }

      // --- Search Logic ---
      // 1. Exact symbol match
      let foundToken = tokens.find(t => t.symbol.toUpperCase() === normalizedSymbol);

      // 2. Exact name match (as fallback)
      if (!foundToken) {
        foundToken = tokens.find(t => t.name.toUpperCase() === normalizedSymbol); // Sometimes users type full name
      }

      // 3. Partial symbol match (e.g., 'USDC.e' matching 'USDC') - use with caution
      if (!foundToken && normalizedSymbol.includes('.')) {
          const baseSymbol = normalizedSymbol.split('.')[0];
          foundToken = tokens.find(t => t.symbol.toUpperCase() === baseSymbol);
      }

      // 4. Add specific common variations
      if (!foundToken && (normalizedSymbol === 'USDC.E' || normalizedSymbol === 'USDC')) {
          foundToken = tokens.find(t => t.symbol.toUpperCase() === 'USDC' || t.symbol.toUpperCase() === 'USDC.E');
      }
      
      // 5. Special case for sDAI
      if (!foundToken && normalizedSymbol === 'SDAI') {
         foundToken = tokens.find(t => t.symbol.toUpperCase() === 'SDAI');
      }

      if (foundToken) {
        const result = {
            ...foundToken,
            source: 'Li.Fi' as const // Use 'as const' for literal type
        };
        console.log(`Found token info for ${tokenSymbol} on ${chainName}:`, result);
        // Return SUCCESS OBJECT
        return result;
      } else {
        console.log(`Token symbol '${tokenSymbol}' not found on chain '${chainName}' (ID: ${chainId}) via Li.Fi.`);
        // Return ERROR OBJECT
        return { error: `Token symbol '${tokenSymbol}' not found on chain '${chainName}' via Li.Fi directory.` };
      }
    } catch (error) {
      console.error(`Error in getTokenInfo execute for ${tokenSymbol} on ${chainName}:`, error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      // Return ERROR OBJECT
      return { error: `Failed to get token info: ${message}` };
    }
  },
});