import { tool } from 'ai';
import { z } from 'zod';
import { simulateSwapWithTenderly } from '../../services/tenderly-service';

// Chain IDs for various networks
const CHAIN_ID_MAP: Record<string, number> = {
  'gnosis': 100,
  'ethereum': 1,
  'polygon': 137,
  'arbitrum': 42161,
  'optimism': 10,
  'base': 8453,
  'avalanche': 43114,
  'bsc': 56,
  'fantom': 250,
};

// Simplified fee structure for various chains (typical average gas costs in USD)
const CHAIN_GAS_ESTIMATE: Record<string, number> = {
  'gnosis': 0.01,         // Very cheap
  'polygon': 0.05,        // Very cheap
  'arbitrum': 0.10,       // Post-Nitro, relatively cheap
  'optimism': 0.15,       // L2, relatively cheap
  'base': 0.15,           // L2, relatively cheap
  'avalanche': 0.20,      // Relatively cheap
  'bsc': 0.10,            // Relatively cheap
  'fantom': 0.05,         // Very cheap
  'ethereum': 5.00,       // Most expensive by far
};

// Typical DEX fees by protocol (not including gas costs)
const DEX_FEE_ESTIMATE: Record<string, number> = {
  'uniswap': 0.003,       // 0.3% fee
  'sushiswap': 0.003,     // 0.3% fee
  'curve': 0.0004,        // 0.04% fee (much lower for stableswaps)
  'balancer': 0.002,      // 0.2% fee (varies by pool)
  'default': 0.003,       // Default 0.3% fee if unknown
};

interface SwapEstimate {
  estimatedAmountOut: number;
  estimatedFeeUsd: number;
  estimatedGasUsd: number;
  totalCostUsd: number;
  protocol?: string;
  rate?: number;
}

async function estimateSwap(
  chain: string,
  fromToken: string,
  toToken: string,
  amountIn: number,
  fromTokenPrice: number = 1.0,
  toTokenPrice: number = 1.0
): Promise<SwapEstimate | null> {
  try {
    const lowerChain = chain.toLowerCase();
    
    // Determine which protocol is likely to be used based on tokens
    let protocol = 'default';
    
    // For stablecoin pairs, prefer Curve if available on chain
    const stablecoins = ['usdc', 'usdt', 'dai', 'busd', 'eure', 'eurt'];
    const isStableSwap = 
      stablecoins.some(s => fromToken.toLowerCase().includes(s)) &&
      stablecoins.some(s => toToken.toLowerCase().includes(s));
    
    if (isStableSwap) {
      protocol = 'curve';
    } else {
      // For other swaps, default to Uniswap or equivalent
      protocol = 'uniswap';
    }
    
    // Calculate fee percentage
    const feePercent = DEX_FEE_ESTIMATE[protocol] || DEX_FEE_ESTIMATE.default;
    
    // Calculate value of input amount in USD
    const inputValueUsd = amountIn * fromTokenPrice;
    
    // Calculate fee in USD
    const feeUsd = inputValueUsd * feePercent;
    
    // Calculate output amount (accounting for fees, not including gas)
    const valueAfterFees = inputValueUsd - feeUsd;
    const estimatedAmountOut = valueAfterFees / toTokenPrice;
    
    // Calculate the exchange rate
    const rate = estimatedAmountOut / amountIn;

    // Simulate the swap using Tenderly to get more accurate gas estimates
    const amountInWei = (amountIn * 1e18).toString(); // Convert to wei string (simplified)
    const gasSimulation = await simulateSwapWithTenderly({
      chainName: lowerChain,
      fromToken: fromToken,
      toToken: toToken,
      amountIn: amountInWei,
      protocol: protocol
    });
    
    // Get gas cost estimate
    let estimatedGasUsd;
    if (gasSimulation && gasSimulation.success) {
      estimatedGasUsd = gasSimulation.gasCostUsd;
    } else {
      // Fallback to static estimates if simulation fails
      estimatedGasUsd = getStaticGasEstimate(lowerChain);
    }
    
    // Total cost including gas
    const totalCostUsd = feeUsd + estimatedGasUsd;
    
    return {
      estimatedAmountOut,
      estimatedFeeUsd: feeUsd,
      estimatedGasUsd,
      totalCostUsd,
      protocol,
      rate
    };
  } catch (error) {
    console.error('Error estimating swap:', error);
    return null;
  }
}

// Fallback function for static gas estimates when simulation fails
function getStaticGasEstimate(chain: string): number {
  const CHAIN_GAS_ESTIMATE: Record<string, number> = {
    'gnosis': 0.01,         // Very cheap
    'polygon': 0.05,        // Very cheap
    'arbitrum': 0.10,       // Post-Nitro, relatively cheap
    'optimism': 0.15,       // L2, relatively cheap
    'base': 0.15,           // L2, relatively cheap
    'avalanche': 0.20,      // Relatively cheap
    'bsc': 0.10,            // Relatively cheap
    'fantom': 0.05,         // Very cheap
    'ethereum': 5.00,       // Most expensive by far
  };
  
  return CHAIN_GAS_ESTIMATE[chain] || 0.50; // Default if unknown
}

export const getSwapEstimate = tool({
  description: `Estimate the cost (fees + gas) and outcome of swapping one token for another on a specific blockchain. Used to calculate realistic net returns after transaction costs.`,
  parameters: z.object({
    chain: z.string().describe("The blockchain name (e.g., 'Gnosis', 'Ethereum', 'Arbitrum')."),
    fromToken: z.string().describe("The symbol of the token you are selling (e.g., 'EURe', 'USDC')."),
    toToken: z.string().describe("The symbol of the token you are buying (e.g., 'USDC', 'ETH')."),
    amountIn: z.number().describe("The amount of the source token you are selling."),
    fromTokenPrice: z.number().nullable().describe("The price of the source token in USD (optional)."),
    toTokenPrice: z.number().nullable().describe("The price of the target token in USD (optional)."),
  }),
  execute: async ({ 
    chain, 
    fromToken, 
    toToken, 
    amountIn,
    fromTokenPrice = 1.0,
    toTokenPrice = 1.0 
  }) => {
    console.log(`Estimating swap: ${amountIn} ${fromToken} -> ${toToken} on ${chain}`);
    
    const estimate = await estimateSwap(
      chain, 
      fromToken, 
      toToken, 
      amountIn,
      fromTokenPrice || 1.0,
      toTokenPrice || 1.0
    );

    if (!estimate) {
      return {
        success: false,
        message: `Could not estimate swap from ${fromToken} to ${toToken} on ${chain}.`
      };
    }

    // Format the numbers for readability
    const formattedAmountOut = estimate.estimatedAmountOut.toFixed(4);
    const formattedFeeUsd = estimate.estimatedFeeUsd.toFixed(2);
    const formattedGasUsd = estimate.estimatedGasUsd.toFixed(2);
    const formattedTotalCost = estimate.totalCostUsd.toFixed(2);
    const formattedRate = estimate.rate ? estimate.rate.toFixed(6) : 'unknown';
    
    // Return both formatted data for display and raw data for UI components
    return {
      success: true,
      fromAmount: amountIn,
      fromToken: fromToken,
      toAmount: estimate.estimatedAmountOut,
      toToken: toToken,
      chain: chain,
      rate: formattedRate,
      protocolFee: (DEX_FEE_ESTIMATE[estimate.protocol || 'default'] * 100).toFixed(2),
      gasFee: formattedGasUsd,
      totalCost: formattedTotalCost,
      protocol: estimate.protocol,
      message: `Swap estimate for ${amountIn} ${fromToken} -> ${toToken} on ${chain}:
- Estimated output: ~${formattedAmountOut} ${toToken}
- Estimated trading fee: ~$${formattedFeeUsd}
- Estimated gas cost: ~$${formattedGasUsd}
- Total estimated cost: ~$${formattedTotalCost}
- Likely protocol: ${estimate.protocol}`
    };
  },
}); 