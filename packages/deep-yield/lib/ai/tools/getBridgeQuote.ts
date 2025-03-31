import { tool } from 'ai';
import { z } from 'zod';
import { BigNumber } from 'bignumber.js';
import { LIFI_CHAIN_MAP, NATIVE_TOKEN_ADDRESS } from './liFiConstants';

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
      console.error(`Li.Fi API error details: ${errorBody}`);
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
  description: `Provides a real-time quote for bridging tokens between two blockchains using Li.Fi. Requires precise token ADDRESSES and DECIMALS, usually obtained from the 'getTokenInfo' tool first. Estimates include fees and gas costs.`,
  parameters: z.object({
    // Chain names are still needed for context and mapping
    fromChain: z.string().describe("The source blockchain name (e.g., 'Ethereum', 'Gnosis')."),
    toChain: z.string().describe("The destination blockchain name (e.g., 'Gnosis', 'Polygon')."),
    // Use address and decimals now
    fromTokenAddress: z.string().describe("The contract address of the token to send ON THE SOURCE CHAIN."),
    toTokenAddress: z.string().describe("The contract address of the token to receive ON THE DESTINATION CHAIN."),
    fromTokenDecimals: z.number().int().describe("The number of decimals for the source token."),
    toTokenDecimals: z.number().int().describe("The number of decimals for the destination token."),
    // Amount remains the same
    amount: z.string().describe("The amount of the source token to bridge (e.g., '10', '0.5'). Use decimal format."),
    // Optional but recommended: Symbols for display purposes in the final output
    fromTokenSymbol: z.string().nullable().describe("Symbol of the source token (e.g., 'USDC'). For display only."),
    toTokenSymbol: z.string().nullable().describe("Symbol of the destination token (e.g., 'USDC'). For display only."),
  }),
  execute: async ({
    fromChain, toChain,
    fromTokenAddress, toTokenAddress,
    fromTokenDecimals, toTokenDecimals,
    amount,
    fromTokenSymbol, toTokenSymbol // Optional symbols for output
   }) => {
    console.log(`Executing getBridgeQuote: ${amount} (Dec: ${fromTokenDecimals}) Addr: ${fromTokenAddress} from ${fromChain} to Addr: ${toTokenAddress} (Dec: ${toTokenDecimals}) on ${toChain}`);

    // Normalize and validate chain names to get IDs
    const normalizedFromChain = fromChain.toLowerCase().trim();
    const normalizedToChain = toChain.toLowerCase().trim();
    const fromChainKey = LIFI_CHAIN_MAP[normalizedFromChain];
    const toChainKey = LIFI_CHAIN_MAP[normalizedToChain];

    if (!fromChainKey) return { error: `Unsupported source chain "${fromChain}". Cannot get quote.` };
    if (!toChainKey) return { error: `Unsupported destination chain "${toChain}". Cannot get quote.` };

    // Validate addresses (basic check)
    if (!fromTokenAddress.startsWith('0x') || fromTokenAddress.length < 42) { // Allow NATIVE_TOKEN_ADDRESS
        if (fromTokenAddress !== NATIVE_TOKEN_ADDRESS) {
            return { error: `Invalid source token address format: ${fromTokenAddress}.` };
        }
    }
     if (!toTokenAddress.startsWith('0x') || toTokenAddress.length < 42) { // Allow NATIVE_TOKEN_ADDRESS
        if (toTokenAddress !== NATIVE_TOKEN_ADDRESS) {
            return { error: `Invalid destination token address format: ${toTokenAddress}.` };
        }
    }

    // Validate decimals
    if (fromTokenDecimals <= 0 || toTokenDecimals <= 0) {
        return { error: `Invalid token decimals provided (${fromTokenDecimals}, ${toTokenDecimals}).` };
    }

    // Use provided symbols for output, or fallback
    const displayFromSymbol = fromTokenSymbol || fromTokenAddress.slice(0, 6);
    const displayToSymbol = toTokenSymbol || toTokenAddress.slice(0, 6);

    try {
      const amountBigNumber = new BigNumber(amount);
      if (amountBigNumber.isNaN() || amountBigNumber.isLessThanOrEqualTo(0)) {
        throw new Error('Invalid amount');
      }
      // Use fromTokenDecimals provided as input
      const amountInBaseUnits = amountBigNumber.shiftedBy(fromTokenDecimals).integerValue(BigNumber.ROUND_FLOOR).toFixed();

      // Construct Li.Fi API URL using ADDRESSES
      const params = new URLSearchParams({
        fromChain: fromChainKey.toString(),
        toChain: toChainKey.toString(),
        fromToken: fromTokenAddress, // <-- USE ADDRESS
        toToken: toTokenAddress,   // <-- USE ADDRESS
        fromAmount: amountInBaseUnits,
        // A non-zero, valid address is often required by Li.Fi now
        fromAddress: '0x58907D99768c34c9da54e5f94d47dDb150b7da82', // Placeholder - replace if user address is available
        order: 'RECOMMENDED',
      });
      const apiUrl = `https://li.quest/v1/quote?${params.toString()}`;

      const quoteResponse = await fetchWithTimeout(apiUrl);

      if (!quoteResponse || !quoteResponse.estimate) {
         if(quoteResponse.message) return { error: `Error fetching quote from Li.Fi: ${quoteResponse.message}` };
         if(quoteResponse.status === "ERROR" && quoteResponse.statusMessage) {
           return { error: `Bridge error: ${quoteResponse.statusMessage}. Some bridges might not support this route or token combination.` };
         }
         if(quoteResponse.included?.length === 0) {
           return { error: `No bridges available for this chain combination (${fromChain} to ${toChain}) or token pair (${displayFromSymbol} to ${displayToSymbol}).` };
         }
         console.error("Unexpected Li.Fi quote response format:", JSON.stringify(quoteResponse, null, 2));
         return { error: 'Received invalid quote response from Li.Fi aggregator.' };

      }

      console.log("Li.Fi quote response:", JSON.stringify(quoteResponse, null, 2));
      const estimate = quoteResponse.estimate;
      // const action = quoteResponse.action; // If needed

      let totalGasCostUSD = new BigNumber(0);
      if (Array.isArray(estimate.gasCosts)) {
        estimate.gasCosts.forEach((cost: any) => totalGasCostUSD = totalGasCostUSD.plus(cost.amountUSD || '0'));
      }
      let totalFeeCostUSD = new BigNumber(0);
      if (Array.isArray(estimate.feeCosts)) {
        estimate.feeCosts.forEach((cost: any) => totalFeeCostUSD = totalFeeCostUSD.plus(cost.amountUSD || '0'));
      }
      const totalEstimatedCostUSD = totalGasCostUSD.plus(totalFeeCostUSD);

      // Use toTokenDecimals from input
      const receivedAmountInBaseUnits = new BigNumber(estimate.toAmountMin || estimate.toAmount);
      const receivedAmountDecimal = receivedAmountInBaseUnits.shiftedBy(-toTokenDecimals);

      const toolName = estimate.toolDetails?.name || estimate.tool || 'Unknown Bridge';
      const estimatedTime = estimate.executionDuration ? `~${Math.ceil(estimate.executionDuration / 60)} min` : 'N/A';

      const initialValueUSD = new BigNumber(estimate.fromAmountUSD || '0');
      const finalValueUSD = new BigNumber(estimate.toAmountUSD || '0');
      let percentageLost = new BigNumber(0);
      if (initialValueUSD.isGreaterThan(0)) {
        percentageLost = initialValueUSD.minus(finalValueUSD).dividedBy(initialValueUSD).times(100);
      }

      // Return JSON structure instead of formatted text
      return {
        success: true,
        source: "Li.Fi Aggregator API",
        quote: {
          bridge: toolName,
          fromChain: fromChain,
          toChain: toChain,
          fromToken: {
            symbol: displayFromSymbol,
            amount: amountBigNumber.toFixed(),
            valueUSD: initialValueUSD.toNumber()
          },
          toToken: {
            symbol: displayToSymbol,
            estimatedAmount: receivedAmountDecimal.toNumber(),
            valueUSD: finalValueUSD.toNumber()
          },
          costs: {
            totalUSD: totalEstimatedCostUSD.toNumber(),
            gasCostsUSD: totalGasCostUSD.toNumber(),
            feeCostsUSD: totalFeeCostUSD.toNumber(),
            percentageLost: percentageLost.toNumber()
          },
          estimatedTime: estimatedTime
        }
      };

    } catch (error: unknown) {
        console.error("Error during getBridgeQuote execution:", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        // More specific error checking could be added here based on common Li.Fi errors
        return { 
          success: false,
          error: `Error getting bridge quote: ${message}. Please ensure token addresses and decimals are correct.` 
        };
    }
  },
});