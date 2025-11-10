import { createPublicClient, http } from 'viem';
import { base, arbitrum } from 'viem/chains';
import { getBaseRpcUrl } from './base-rpc-url';

/**
 * Get Arbitrum RPC URL with fallback
 */
export function getArbitrumRpcUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
    process.env.ARBITRUM_RPC_URL ||
    'https://arb1.arbitrum.io/rpc';

  if (!process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL && !process.env.ARBITRUM_RPC_URL) {
    console.warn(
      '[Zero Finance] ARBITRUM RPC URL not set – falling back to public https://arb1.arbitrum.io/rpc'
    );
  }

  return url;
}

/**
 * Base mainnet public client
 */
export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(getBaseRpcUrl()),
});

/**
 * Arbitrum mainnet public client
 */
export const arbitrumPublicClient = createPublicClient({
  chain: arbitrum,
  transport: http(getArbitrumRpcUrl()),
});

/**
 * Get public client for a specific chain ID
 */
export function getPublicClient(chainId: number) {
  switch (chainId) {
    case 8453: // Base
      return basePublicClient;
    case 42161: // Arbitrum
      return arbitrumPublicClient;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}
