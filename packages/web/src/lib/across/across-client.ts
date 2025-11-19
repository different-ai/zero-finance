/**
 * Across Protocol client for cross-chain bridging
 * Handles bridge quotes and fee estimation using the Across SDK
 *
 * Architecture:
 * - Uses @across-protocol/app-sdk for real-time bridge quotes
 * - NO hardcoded fees - all fees come from Across API
 * - Supports Base <-> Arbitrum USDC bridging
 */

import { createAcrossClient, type Quote } from '@across-protocol/app-sdk';
import { base, arbitrum } from 'viem/chains';
import type { SupportedChainId } from '@/lib/types/multi-chain';
import { SUPPORTED_CHAINS, getUSDCAddress } from '@/lib/constants/chains';

/**
 * Bridge quote with detailed fee breakdown
 * All fees are in the smallest unit (e.g., USDC has 6 decimals)
 */
export interface BridgeQuote {
  inputAmount: bigint;
  outputAmount: bigint;
  bridgeFee: bigint;
  lpFee: bigint;
  relayerGasFee: bigint;
  relayerCapitalFee: bigint;
  totalFee: bigint;
  estimatedFillTime: number; // seconds
  rawQuote: Quote; // Store raw quote for later use in executeQuote
}

/**
 * Across Protocol client singleton
 * Initialized with supported chains and integrator ID
 */
class AcrossClientSingleton {
  private static instance: AcrossClientSingleton;
  private client: ReturnType<typeof createAcrossClient>;

  private constructor() {
    // Initialize Across client with Zero Finance integrator ID
    // TODO: Replace with actual integrator ID from Across team
    this.client = createAcrossClient({
      integratorId: '0x0000', // Placeholder - need to fill form at https://docs.google.com/forms/d/e/1FAIpQLSe-HY6mzTeGZs91HxObkQmwkMQuH7oy8ngZ1ROiu-f4SR4oMw/viewform
      chains: [base, arbitrum],
      useTestnet: false, // Production mode
    });
  }

  public static getInstance(): AcrossClientSingleton {
    if (!AcrossClientSingleton.instance) {
      AcrossClientSingleton.instance = new AcrossClientSingleton();
    }
    return AcrossClientSingleton.instance;
  }

  public getClient() {
    return this.client;
  }
}

/**
 * Get bridge quote from Across Protocol API
 *
 * @param params - Bridge parameters
 * @returns Real-time bridge quote with fee breakdown
 *
 * @example
 * ```ts
 * const quote = await getAcrossBridgeQuote({
 *   amount: parseUnits('100', 6), // 100 USDC
 *   originChainId: SUPPORTED_CHAINS.BASE,
 *   destinationChainId: SUPPORTED_CHAINS.ARBITRUM,
 * });
 * console.log(`Bridge fee: ${formatUnits(quote.bridgeFee, 6)} USDC`);
 * console.log(`Fill time: ${quote.estimatedFillTime}s`);
 * ```
 */
export async function getAcrossBridgeQuote(params: {
  amount: bigint;
  originChainId: SupportedChainId;
  destinationChainId: SupportedChainId;
}): Promise<BridgeQuote> {
  const { amount, originChainId, destinationChainId } = params;

  // Get USDC addresses for both chains
  const inputToken = getUSDCAddress(originChainId);
  const outputToken = getUSDCAddress(destinationChainId);

  // Map our chain IDs to viem chain IDs
  const originViemChainId =
    originChainId === SUPPORTED_CHAINS.BASE ? base.id : arbitrum.id;
  const destViemChainId =
    destinationChainId === SUPPORTED_CHAINS.BASE ? base.id : arbitrum.id;

  try {
    const client = AcrossClientSingleton.getInstance().getClient();

    // Get quote from Across SDK
    const quote = await client.getQuote({
      route: {
        originChainId: originViemChainId,
        destinationChainId: destViemChainId,
        inputToken,
        outputToken,
      },
      inputAmount: amount,
    });

    // Extract fees from quote
    const outputAmount = quote.deposit.outputAmount;
    const totalRelayFee = quote.fees.totalRelayFee.total;
    const lpFeeTotal = quote.fees.lpFee.total;
    const relayerGasFeeTotal = quote.fees.relayerGasFee.total;
    const relayerCapitalFeeTotal = quote.fees.relayerCapitalFee.total;

    return {
      inputAmount: amount,
      outputAmount,
      bridgeFee: totalRelayFee,
      lpFee: lpFeeTotal,
      relayerGasFee: relayerGasFeeTotal,
      relayerCapitalFee: relayerCapitalFeeTotal,
      totalFee: totalRelayFee,
      estimatedFillTime: quote.estimatedFillTimeSec || 60, // Default 60s if not provided
      rawQuote: quote, // Store for later use
    };
  } catch (error) {
    console.error('Failed to get Across bridge quote:', error);
    throw new Error(
      `Failed to get bridge quote from Across Protocol: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Get recommended relayer fee for fast fills
 * This ensures the bridge is filled quickly by relayers
 *
 * @param params - Fee estimation parameters
 * @returns Recommended relayer fee in wei
 */
export async function getRecommendedRelayerFee(params: {
  originChainId: SupportedChainId;
  destinationChainId: SupportedChainId;
  amount: bigint;
}): Promise<bigint> {
  // The Across SDK automatically includes optimal relayer fees in the quote
  // We can get this by requesting a quote and extracting the fee
  const quote = await getAcrossBridgeQuote(params);
  return quote.relayerGasFee + quote.relayerCapitalFee;
}

/**
 * Get Across client instance for advanced usage
 * Use this if you need direct access to the SDK
 */
export function getAcrossClient() {
  return AcrossClientSingleton.getInstance().getClient();
}
