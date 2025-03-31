import { tool } from 'ai';
import { z } from 'zod';
import { BigNumber } from 'bignumber.js';

// --- Configuration ---
// Use Li.Fi Chain IDs (numeric IDs required by the API)
const LIFI_CHAIN_MAP: Record<string, number> = {
  ethereum: 1,
  eth: 1,
  gnosis: 100,
  gno: 100,
  xdai: 100,
  arbitrum: 42161,
  arb: 42161,
  optimism: 10,
  opt: 10,
  polygon: 137,
  pol: 137,
  matic: 137,
  base: 8453,
  avalanche: 43114,
  avax: 43114,
  ava: 43114,
  fantom: 250,
  ftm: 250,
  bsc: 56,
  bnb: 56,
  binance: 56,
  zksync: 324,
  zks: 324,
  mantle: 5000,
  mnt: 5000,
  linea: 59144,
  lna: 59144,
};

// Token Symbol Mapping
const LIFI_TOKEN_MAP: Record<string, string> = {
  // Most standard tokens will use the same symbol
  eth: 'ETH',
  usdc: 'USDC',
  usdt: 'USDT',
  dai: 'DAI',
  weth: 'WETH',
  wbtc: 'WBTC',
  btc: 'BTC',
  xdai: 'XDAI',
  matic: 'MATIC',
  // Add common aliases
  'usdc.e': 'USDC',
};

// Common Token Decimals
const TOKEN_DECIMALS: Record<string, number> = {
  ETH: 18,
  WETH: 18,
  USDC: 6,
  'USDC.e': 6,
  USDT: 6,
  DAI: 18,
  XDAI: 18,
  WBTC: 8,
  BTC: 8,
  MATIC: 18,
};

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  options.signal = controller.signal;

  try {
    console.log(`Fetching Li.Fi Quote: ${url}`);
    const response = await fetch(url, options);
    clearTimeout(timeoutId);
    if (!response.ok) {
      let errorBody = `Li.Fi API request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorBody += ` - ${errorData.message || JSON.stringify(errorData)}`;
      } catch (_) { /* ignore if error body is not JSON */ }
      
      // For debugging purposes, log the full error
      console.error(`Li.Fi API error details: ${errorBody}`);
      
      // Try to provide helpful error message
      if (errorBody.includes('fromAddress')) {
        console.error("Address error from Li.Fi API - will need further investigation");
        throw new Error(errorBody); // Let the main error handler deal with this
      }
      
      throw new Error(errorBody);
    }
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Li.Fi API request timed out');
    }
    throw error;
  }
}

export const getBridgeQuote = tool({
  description: `Provides a real-time quote for bridging tokens between two blockchains using the Li.Fi aggregator. Estimates include bridge fees and current gas costs. Use this for questions like "How much does it cost to bridge 10 USDC from Ethereum to Gnosis?" or "Best way to bridge 0.1 ETH from Arbitrum to Base?". Specify chains and tokens clearly. Supported chains: Ethereum (1), Arbitrum (42161), Optimism (10), Polygon (137), Gnosis/xDAI (100), Avalanche (43114), Fantom (250), BSC (56), Base (8453), ZkSync (324), Mantle (5000), Linea (59144).`,
  parameters: z.object({
    fromChain: z.string().describe("The source blockchain name (e.g., 'Ethereum', 'Gnosis', 'Arbitrum')."),
    toChain: z.string().describe("The destination blockchain name (e.g., 'Gnosis', 'Polygon', 'Base')."),
    fromToken: z.string().describe("The symbol of the token to send (e.g., 'USDC', 'ETH', 'DAI')."),
    toToken: z.string().describe("The symbol of the token to receive (e.g., 'USDC', 'WETH', 'XDAI')."),
    amount: z.string().describe("The amount of the 'fromToken' to bridge (e.g., '10', '0.5', '1000'). Use decimal format."),
  }),
  execute: async ({ fromChain, toChain, fromToken, toToken, amount }) => {
    console.log(`Executing getBridgeQuote: ${amount} ${fromToken} from ${fromChain} to ${toChain} (${toToken})`);

    // Normalize inputs
    const normalizedFromChain = fromChain.toLowerCase().trim();
    const normalizedToChain = toChain.toLowerCase().trim();
    const normalizedFromToken = fromToken.toUpperCase().trim();
    const normalizedToToken = toToken.toUpperCase().trim();

    // Get Li.Fi chain keys
    const fromChainKey = LIFI_CHAIN_MAP[normalizedFromChain];
    const toChainKey = LIFI_CHAIN_MAP[normalizedToChain];
    
    // Get token symbols (most will be the same as input)
    const fromTokenSymbol = LIFI_TOKEN_MAP[normalizedFromToken.toLowerCase()] || normalizedFromToken;
    const toTokenSymbol = LIFI_TOKEN_MAP[normalizedToToken.toLowerCase()] || normalizedToToken;

    if (!fromChainKey) {
      return `Error: Unsupported source chain "${fromChain}". Supported chains include: Ethereum, Arbitrum, Optimism, Polygon, Gnosis, Avalanche, Fantom, BSC, Base.`;
    }
    
    if (!toChainKey) {
      return `Error: Unsupported destination chain "${toChain}". Supported chains include: Ethereum, Arbitrum, Optimism, Polygon, Gnosis, Avalanche, Fantom, BSC, Base.`;
    }

    // Get token decimals
    const fromTokenDecimals = TOKEN_DECIMALS[fromTokenSymbol];
    const toTokenDecimals = TOKEN_DECIMALS[toTokenSymbol];

    if (fromTokenDecimals === undefined || toTokenDecimals === undefined) {
      // For tokens without known decimals, we'll use default values but warn the user
      console.warn(`Unknown token decimals for ${fromTokenSymbol} or ${toTokenSymbol}. Using defaults.`);
    }

    // Use known decimals or fallback to common defaults
    const fromDecimals = fromTokenDecimals || (fromTokenSymbol === 'ETH' || fromTokenSymbol === 'WETH' ? 18 : 6);
    const toDecimals = toTokenDecimals || (toTokenSymbol === 'ETH' || toTokenSymbol === 'WETH' ? 18 : 6);

    try {
      // Convert decimal amount to base units
      const amountBigNumber = new BigNumber(amount);
      const amountInBaseUnits = amountBigNumber.shiftedBy(fromDecimals).toFixed(0);

      // Construct Li.Fi API URL
      const params = new URLSearchParams({
        fromChain: fromChainKey.toString(), // Ensure chain ID is a string
        toChain: toChainKey.toString(),     // Ensure chain ID is a string
        fromToken: fromTokenSymbol,
        toToken: toTokenSymbol,
        fromAmount: amountInBaseUnits,
        // Li.Fi requires a valid fromAddress (can't be zero address)
        fromAddress: '0x58907D99768c34c9da54e5f94d47dDb150b7da82', // Dummy wallet address
        // Optional parameters
        slippage: '0.5', // Default 0.5%
      });
      const apiUrl = `https://li.quest/v1/quote?${params.toString()}`;

      const quoteResponse = await fetchWithTimeout(apiUrl);

      // Handle error object returned from fetchWithTimeout - this error path should rarely be hit now
      if (quoteResponse.error) {
        console.log("Handled error from fetch:", quoteResponse.error);
        return `Error: ${quoteResponse.error} Try another chain pair or token combination.`;
      }

      if (!quoteResponse || !quoteResponse.estimate) {
        // Handle Li.Fi API success with error message
        if(quoteResponse.message) {
          return `Error fetching quote from Li.Fi: ${quoteResponse.message}`;
        }
        if(quoteResponse.status === "ERROR" && quoteResponse.statusMessage) {
          return `Bridge error: ${quoteResponse.statusMessage}. Some bridges might not support this route or token combination.`;
        }
        if(quoteResponse.included?.length === 0) {
          return `No bridges available for this chain combination (${fromChain} to ${toChain}) or token pair (${fromToken} to ${toToken}).`;
        }
        
        // Log the full response for debugging
        console.error("Unexpected Li.Fi response format:", JSON.stringify(quoteResponse, null, 2));
        return 'Error: Received invalid quote response from Li.Fi aggregator. This chain or token combination might not be supported.';
      }

      const estimate = quoteResponse.estimate;
      const action = quoteResponse.action;

      // Calculate total estimated fees in USD
      let totalGasCostUSD = 0;
      if (Array.isArray(estimate.gasCosts)) {
        estimate.gasCosts.forEach((cost: any) => {
          totalGasCostUSD += parseFloat(cost.amountUSD || '0');
        });
      }

      let totalFeeCostUSD = 0;
      if (Array.isArray(estimate.feeCosts)) {
        estimate.feeCosts.forEach((cost: any) => {
          totalFeeCostUSD += parseFloat(cost.amountUSD || '0');
        });
      }

      const totalEstimatedCostUSD = totalGasCostUSD + totalFeeCostUSD;

      // Calculate estimated received amount
      const receivedAmountInBaseUnits = new BigNumber(estimate.toAmountMin || estimate.toAmount);
      const receivedAmountDecimal = receivedAmountInBaseUnits.shiftedBy(-toDecimals);

      // Find the bridge/tool used
      const toolName = estimate.toolDetails?.name || estimate.tool || 'Unknown Bridge';

      // Calculate the percentage lost in fees and gas
      const initialValueUSD = parseFloat(estimate.fromAmountUSD || '0');
      const finalValueUSD = parseFloat(estimate.toAmountUSD || '0');
      let percentageLost = 0;
      
      if (initialValueUSD > 0) {
        percentageLost = ((initialValueUSD - finalValueUSD) / initialValueUSD) * 100;
      }

      // Format the result
      const result = `
## Bridging ${amount} ${fromTokenSymbol} from ${fromChain} to ${toChain}

**Bridge**: ${toolName}
**Estimated Amount Received**: ${receivedAmountDecimal.toFixed(6)} ${toTokenSymbol}
**Total Cost**: ~$${totalEstimatedCostUSD.toFixed(2)} USD (${percentageLost.toFixed(2)}% of value)

### Breakdown
* Gas Fees: ~$${totalGasCostUSD.toFixed(2)} USD
* Bridge Fees: ~$${totalFeeCostUSD.toFixed(2)} USD

### Value
* Initial Amount: ~$${estimate.fromAmountUSD || 'N/A'} USD
* Final Value: ~$${estimate.toAmountUSD || 'N/A'} USD

*Note: This is a real-time estimate using Li.Fi. Actual costs may vary due to gas price volatility and potential slippage.*

Data source: Li.Fi Aggregator
`.trim();

      return result;

    } catch (error: unknown) {
      console.error("Error during getBridgeQuote:", error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      
      // Extract useful information for the user
      let userFriendlyMessage = "Error getting bridge quote. ";
      
      if (message.includes("toChain") || message.includes("fromChain")) {
        userFriendlyMessage += "There might be an issue with the chain selection. Not all chains support direct bridges between them. ";
        userFriendlyMessage += `Supported chains include: Ethereum, Arbitrum, Optimism, Polygon, Gnosis/xDAI, Avalanche, Fantom, BSC, Base.`;
      } else if (message.includes("token")) {
        userFriendlyMessage += "There might be an issue with the token selection. Not all tokens are supported on all chains. ";
        userFriendlyMessage += "Common tokens like USDC, ETH, WETH, DAI are most likely to be supported.";
      } else {
        userFriendlyMessage += "Please check your inputs or try a different chain/token combination.";
      }
      
      return userFriendlyMessage;
    }
  },
});