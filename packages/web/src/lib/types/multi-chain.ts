/**
 * Multi-chain type definitions for Zero Finance
 */

import { type Address } from 'viem';
import { type SUPPORTED_CHAINS } from '@/lib/constants/chains';

/**
 * Supported chain ID type
 */
export type SupportedChainId =
  (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS];

/**
 * Cross-chain vault information
 */
export interface CrossChainVault {
  id: string;
  name: string;
  displayName: string;
  address: Address;
  chainId: SupportedChainId;
  risk: 'Conservative' | 'Balanced' | 'High' | 'Optimized';
  curator: string;
  appUrl: string;
  apy?: number;
}

/**
 * Safe deployment information for a specific chain
 */
export interface SafeInfo {
  safeAddress: Address;
  chainId: SupportedChainId;
  isDeployed: boolean;
  balance?: bigint;
  owners?: Address[];
  threshold?: number;
}

/**
 * Multi-chain Safe deployment status
 */
export interface MultiChainSafeStatus {
  userDid: string;
  safeType: 'primary' | 'tax' | 'liquidity' | 'yield';
  chains: Record<SupportedChainId, SafeInfo | null>;
}

/**
 * Chain balance information
 */
export interface ChainBalance {
  chainId: SupportedChainId;
  balance: bigint;
  formattedBalance: string;
  usdcAddress: Address;
}

/**
 * Cross-chain allocation strategy
 */
export interface CrossChainAllocation {
  chainId: SupportedChainId;
  vaultId: string;
  percentage: number;
  expectedApy: number;
}

/**
 * Cross-chain transaction status
 */
export interface CrossChainTransactionStatus {
  sourceChain: SupportedChainId;
  destinationChain?: SupportedChainId;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
  timestamp: Date;
}
