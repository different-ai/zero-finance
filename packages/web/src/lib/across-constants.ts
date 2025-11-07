/**
 * Across Protocol constants for cross-chain deposits
 * @see https://docs.across.to/
 */

import { type Address } from 'viem';

// Across SpokePool addresses (V3)
export const ACROSS_SPOKE_POOL_BASE: Address =
  '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64';

export const ACROSS_SPOKE_POOL_ARBITRUM: Address =
  '0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A';

// Our cross-chain vault contracts
export const CROSS_CHAIN_VAULT_MANAGER_BASE: Address =
  (process.env.NEXT_PUBLIC_CROSS_CHAIN_VAULT_MANAGER_BASE as Address) ||
  '0x0000000000000000000000000000000000000000';

export const CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM: Address =
  (process.env.NEXT_PUBLIC_CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM as Address) ||
  '0x0000000000000000000000000000000000000000';

// Across fee estimates (basis points)
// Typical range: 0.3-1% depending on route and market conditions
export const ACROSS_FEE_BPS = 50; // 0.5% default estimate

// Bridge timing estimates (milliseconds)
export const ACROSS_ESTIMATED_TIME_MS = 30000; // 30 seconds typical

// Slippage tolerance for deposits (basis points)
export const DEFAULT_SLIPPAGE_BPS = 50; // 0.5%
