import { type Address } from 'viem';

/**
 * Across Protocol SpokePool addresses
 * These are the contracts that handle cross-chain transfers
 */
export const ACROSS_SPOKE_POOLS = {
  // Mainnet
  1: '0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5' as Address, // Ethereum
  8453: '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64' as Address, // Base
  42161: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE' as Address, // Arbitrum
  10: '0x6f26Bf09B1C792e3228e5467807a900A503c0281' as Address, // Optimism
  137: '0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096' as Address, // Polygon
} as const;

/**
 * USDC addresses on different chains
 */
export const USDC_ADDRESSES = {
  // Mainnet
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address, // Ethereum
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address, // Base
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as Address, // Arbitrum
  10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85' as Address, // Optimism
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' as Address, // Polygon
} as const;

/**
 * Across Protocol fee estimate: ~0.5-1% of transfer amount
 */
export const ACROSS_FEE_PERCENT = 0.005; // 0.5%

/**
 * Across Protocol fill time estimate: ~15-30 seconds
 */
export const ACROSS_FILL_TIME_SECONDS = 20;

/**
 * Get SpokePool address for a chain
 */
export function getSpokePool(chainId: number): Address | undefined {
  return ACROSS_SPOKE_POOLS[chainId as keyof typeof ACROSS_SPOKE_POOLS];
}

/**
 * Get USDC address for a chain
 */
export function getUSDCAddress(chainId: number): Address | undefined {
  return USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES];
}

/**
 * Across Protocol MulticallHandler addresses
 * These handler contracts execute arbitrary calls on the destination chain
 * See: https://docs.across.to/reference/contract-addresses
 */
export const ACROSS_MULTICALL_HANDLERS = {
  42161: '0x924a9f036260DdD5808007E1AA95f08eD08aA569' as Address, // Arbitrum
  10: '0x924a9f036260DdD5808007E1AA95f08eD08aA569' as Address, // Optimism
  137: '0x924a9f036260DdD5808007E1AA95f08eD08aA569' as Address, // Polygon
  8453: '0x924a9f036260DdD5808007E1AA95f08eD08aA569' as Address, // Base
} as const;

/**
 * Get MulticallHandler address for a chain
 */
export function getMulticallHandler(chainId: number): Address | undefined {
  return ACROSS_MULTICALL_HANDLERS[
    chainId as keyof typeof ACROSS_MULTICALL_HANDLERS
  ];
}

/**
 * Check if Across Protocol is supported on a chain
 */
export function isAcrossSupported(chainId: number): boolean {
  return chainId in ACROSS_SPOKE_POOLS;
}
