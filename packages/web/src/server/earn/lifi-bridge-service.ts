/**
 * LI.FI Bridge Service
 * Handles cross-chain bridging via LI.FI protocol
 *
 * Used for chains not supported by Across (e.g., Gnosis Chain)
 * Supports direct swaps: Base USDC -> Gnosis sDAI (or xDAI)
 */

import { type Address, getAddress } from 'viem';
import {
  SUPPORTED_CHAINS,
  type SupportedChainId,
  getChainConfig,
} from '@/lib/constants/chains';
import { GNOSIS_ASSETS } from './gnosis-vaults';

const LIFI_API_URL = 'https://li.quest/v1';

/**
 * LI.FI Quote Response
 */
export interface LiFiQuote {
  id: string;
  type: string;
  tool: string;
  action: {
    fromChainId: number;
    toChainId: number;
    fromToken: {
      address: string;
      symbol: string;
      decimals: number;
      chainId: number;
    };
    toToken: {
      address: string;
      symbol: string;
      decimals: number;
      chainId: number;
    };
    fromAmount: string;
    slippage: number;
  };
  estimate: {
    fromAmount: string;
    toAmount: string;
    toAmountMin: string;
    approvalAddress: string;
    executionDuration: number;
    feeCosts?: Array<{
      name: string;
      percentage: string;
      token: { symbol: string };
      amount: string;
      amountUSD: string;
    }>;
    gasCosts?: Array<{
      type: string;
      price: string;
      estimate: string;
      limit: string;
      amount: string;
      amountUSD: string;
    }>;
  };
  transactionRequest: {
    to: string;
    data: string;
    value: string;
    from: string;
    chainId: number;
    gasLimit?: string;
    gasPrice?: string;
  };
}

/**
 * Bridge quote result
 */
export interface LiFiBridgeQuote {
  inputAmount: bigint;
  outputAmount: bigint;
  outputAmountMin: bigint;
  totalFeeUsd: string;
  estimatedTime: number; // seconds
  tool: string;
  transactionRequest: {
    to: Address;
    data: `0x${string}`;
    value: bigint;
    chainId: SupportedChainId;
  };
  approvalAddress?: Address;
  rawQuote: LiFiQuote;
}

/**
 * Bridge transaction for user to sign
 */
export interface LiFiBridgeTransaction {
  to: Address;
  data: `0x${string}`;
  value: bigint;
  chainId: SupportedChainId;
}

/**
 * Get a bridge quote from LI.FI
 *
 * @example
 * ```ts
 * // Bridge Base USDC to Gnosis sDAI
 * const quote = await getLiFiBridgeQuote({
 *   fromChainId: SUPPORTED_CHAINS.BASE,
 *   toChainId: SUPPORTED_CHAINS.GNOSIS,
 *   fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC
 *   toToken: '0xaf204776c7245bf4147c2612bf6e5972ee483701', // Gnosis sDAI
 *   amount: parseUnits('100', 6), // 100 USDC
 *   fromAddress: userSafeOnBase,
 *   toAddress: userSafeOnGnosis,
 * });
 * ```
 */
export async function getLiFiBridgeQuote(params: {
  fromChainId: SupportedChainId;
  toChainId: SupportedChainId;
  fromToken: Address;
  toToken: Address;
  amount: bigint;
  fromAddress: Address;
  toAddress: Address;
  slippage?: number; // Percentage, e.g., 0.5 for 0.5%
}): Promise<LiFiBridgeQuote> {
  const {
    fromChainId,
    toChainId,
    fromToken,
    toToken,
    amount,
    fromAddress,
    toAddress,
    slippage = 0.5,
  } = params;

  const queryParams = new URLSearchParams({
    fromChain: fromChainId.toString(),
    toChain: toChainId.toString(),
    fromToken,
    toToken,
    fromAmount: amount.toString(),
    fromAddress,
    toAddress,
    slippage: (slippage / 100).toString(), // LI.FI expects decimal (0.005 for 0.5%)
    order: 'RECOMMENDED',
    allowBridges: 'all', // Use all available bridges
    allowExchanges: 'all', // Use all available DEXes
  });

  const quoteUrl = `${LIFI_API_URL}/quote?${queryParams.toString()}`;
  console.log('LI.FI Bridge Quote Request:', quoteUrl);

  const response = await fetch(quoteUrl);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('LI.FI API Error:', errorBody);
    throw new Error(
      `LI.FI API request failed: ${response.status} ${response.statusText}`,
    );
  }

  const quote: LiFiQuote = await response.json();
  console.log('LI.FI Bridge Quote Response:', quote);

  if (!quote.transactionRequest) {
    throw new Error('LI.FI did not return transaction request');
  }

  // Calculate total fees in USD
  const totalFeeUsd =
    quote.estimate.feeCosts?.reduce(
      (sum, fee) => sum + parseFloat(fee.amountUSD || '0'),
      0,
    ) || 0;
  const totalGasUsd =
    quote.estimate.gasCosts?.reduce(
      (sum, gas) => sum + parseFloat(gas.amountUSD || '0'),
      0,
    ) || 0;

  return {
    inputAmount: BigInt(quote.estimate.fromAmount),
    outputAmount: BigInt(quote.estimate.toAmount),
    outputAmountMin: BigInt(quote.estimate.toAmountMin),
    totalFeeUsd: (totalFeeUsd + totalGasUsd).toFixed(2),
    estimatedTime: quote.estimate.executionDuration,
    tool: quote.tool,
    transactionRequest: {
      to: getAddress(quote.transactionRequest.to) as Address,
      data: quote.transactionRequest.data as `0x${string}`,
      value: BigInt(quote.transactionRequest.value || '0'),
      chainId: fromChainId,
    },
    approvalAddress: quote.estimate.approvalAddress
      ? (getAddress(quote.estimate.approvalAddress) as Address)
      : undefined,
    rawQuote: quote,
  };
}

/**
 * Get a quote for bridging Base USDC to Gnosis sDAI
 * This is a convenience function for the most common Gnosis bridge flow
 */
export async function getBaseUsdcToGnosisSdaiQuote(params: {
  amount: bigint; // Amount in USDC (6 decimals)
  fromAddress: Address; // User's Safe on Base
  toAddress: Address; // User's Safe on Gnosis
  slippage?: number;
}): Promise<LiFiBridgeQuote> {
  const baseConfig = getChainConfig(SUPPORTED_CHAINS.BASE);

  return getLiFiBridgeQuote({
    fromChainId: SUPPORTED_CHAINS.BASE,
    toChainId: SUPPORTED_CHAINS.GNOSIS,
    fromToken: baseConfig.usdcAddress,
    toToken: GNOSIS_ASSETS.sDAI.address, // sDAI on Gnosis
    amount: params.amount,
    fromAddress: params.fromAddress,
    toAddress: params.toAddress,
    slippage: params.slippage,
  });
}

/**
 * Get a quote for bridging Base USDC to Gnosis xDAI (native)
 * Fallback option if direct sDAI liquidity is low
 */
export async function getBaseUsdcToGnosisXdaiQuote(params: {
  amount: bigint;
  fromAddress: Address;
  toAddress: Address;
  slippage?: number;
}): Promise<LiFiBridgeQuote> {
  const baseConfig = getChainConfig(SUPPORTED_CHAINS.BASE);

  // For native xDAI, we use the wrapped version (WXDAI) as the target
  // The bridge will typically unwrap to native xDAI
  return getLiFiBridgeQuote({
    fromChainId: SUPPORTED_CHAINS.BASE,
    toChainId: SUPPORTED_CHAINS.GNOSIS,
    fromToken: baseConfig.usdcAddress,
    toToken: GNOSIS_ASSETS.WXDAI.address, // WXDAI on Gnosis (gets unwrapped to xDAI)
    amount: params.amount,
    fromAddress: params.fromAddress,
    toAddress: params.toAddress,
    slippage: params.slippage,
  });
}

/**
 * Encode approval transaction for LI.FI bridge
 */
export function encodeLiFiApproval(params: {
  tokenAddress: Address;
  spenderAddress: Address;
  amount: bigint;
}): LiFiBridgeTransaction {
  const { tokenAddress, spenderAddress, amount } = params;

  // ERC20 approve function selector
  const approveSelector = '0x095ea7b3';
  const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
  const paddedAmount = amount.toString(16).padStart(64, '0');

  return {
    to: tokenAddress,
    data: `${approveSelector}${paddedSpender}${paddedAmount}` as `0x${string}`,
    value: 0n,
    chainId: SUPPORTED_CHAINS.BASE,
  };
}

/**
 * Get a quote for bridging Gnosis xDAI to Base USDC
 * Used for withdrawals: sDAI -> xDAI -> USDC on Base
 */
export async function getGnosisXdaiToBaseUsdcQuote(params: {
  amount: bigint; // Amount in xDAI (18 decimals)
  fromAddress: Address; // User's Safe on Gnosis
  toAddress: Address; // User's Safe on Base
  slippage?: number;
}): Promise<LiFiBridgeQuote> {
  const baseConfig = getChainConfig(SUPPORTED_CHAINS.BASE);

  // Use WXDAI as fromToken since LI.FI works with ERC20 tokens
  // The user will need to wrap xDAI -> WXDAI first if using native xDAI
  return getLiFiBridgeQuote({
    fromChainId: SUPPORTED_CHAINS.GNOSIS,
    toChainId: SUPPORTED_CHAINS.BASE,
    fromToken: GNOSIS_ASSETS.WXDAI.address, // WXDAI on Gnosis
    toToken: baseConfig.usdcAddress, // USDC on Base
    amount: params.amount,
    fromAddress: params.fromAddress,
    toAddress: params.toAddress,
    slippage: params.slippage,
  });
}

/**
 * Get a quote for bridging Gnosis sDAI to Base USDC
 * Used for withdrawals: sDAI -> USDC on Base (direct route if available)
 */
export async function getGnosisSdaiToBaseUsdcQuote(params: {
  amount: bigint; // Amount in sDAI (18 decimals)
  fromAddress: Address; // User's Safe on Gnosis
  toAddress: Address; // User's Safe on Base
  slippage?: number;
}): Promise<LiFiBridgeQuote> {
  const baseConfig = getChainConfig(SUPPORTED_CHAINS.BASE);

  return getLiFiBridgeQuote({
    fromChainId: SUPPORTED_CHAINS.GNOSIS,
    toChainId: SUPPORTED_CHAINS.BASE,
    fromToken: GNOSIS_ASSETS.sDAI.address, // sDAI on Gnosis
    toToken: baseConfig.usdcAddress, // USDC on Base
    amount: params.amount,
    fromAddress: params.fromAddress,
    toAddress: params.toAddress,
    slippage: params.slippage,
  });
}

/**
 * Check if a chain is supported by LI.FI for bridging
 */
export function isLiFiSupportedChain(chainId: SupportedChainId): boolean {
  // LI.FI supports many chains including Gnosis
  const LIFI_SUPPORTED_CHAINS: SupportedChainId[] = [
    SUPPORTED_CHAINS.BASE,
    SUPPORTED_CHAINS.ARBITRUM,
    SUPPORTED_CHAINS.MAINNET,
    SUPPORTED_CHAINS.GNOSIS,
  ];

  return LIFI_SUPPORTED_CHAINS.includes(chainId);
}

/**
 * Get the appropriate bridge service for a chain pair
 */
export function getBridgeServiceForChains(
  sourceChain: SupportedChainId,
  destChain: SupportedChainId,
): 'across' | 'lifi' {
  // Across supports Base <-> Arbitrum, Base <-> Mainnet
  // LI.FI supports everything including Gnosis
  if (destChain === SUPPORTED_CHAINS.GNOSIS) {
    return 'lifi';
  }

  // Default to Across for other supported routes
  return 'across';
}
