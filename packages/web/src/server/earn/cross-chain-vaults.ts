/**
 * Cross-chain vault registry
 * Unified interface for accessing vaults across all supported chains
 */

import { type Address } from 'viem';
import {
  SUPPORTED_CHAINS,
  type SupportedChainId,
} from '@/lib/constants/chains';
import { type CrossChainVault } from '@/lib/types/multi-chain';
import {
  BASE_USDC_VAULTS,
  BASE_ETH_VAULTS,
  PRIMARY_VAULT,
} from './base-vaults';
import { ARBITRUM_USDC_VAULTS } from './arbitrum-vaults';

/**
 * All available vaults across all chains
 */
export const ALL_CROSS_CHAIN_VAULTS: CrossChainVault[] = [
  ...(BASE_USDC_VAULTS as CrossChainVault[]),
  ...(BASE_ETH_VAULTS as CrossChainVault[]),
  ...ARBITRUM_USDC_VAULTS,
];

/**
 * Get all vaults for a specific chain
 * @param chainId - The chain ID to filter vaults by
 * @returns Array of vaults available on the specified chain
 */
export function getVaultsByChain(chainId: SupportedChainId): CrossChainVault[] {
  return ALL_CROSS_CHAIN_VAULTS.filter((vault) => vault.chainId === chainId);
}

/**
 * Get vault by ID across all chains
 * @param vaultId - The unique vault identifier
 * @returns The vault if found, undefined otherwise
 */
export function getVaultById(vaultId: string): CrossChainVault | undefined {
  return ALL_CROSS_CHAIN_VAULTS.find((vault) => vault.id === vaultId);
}

/**
 * Get vault by address and chain
 * @param address - The vault contract address
 * @param chainId - The chain ID where the vault is deployed
 * @returns The vault if found, undefined otherwise
 */
export function getVaultByAddress(
  address: Address,
  chainId: SupportedChainId,
): CrossChainVault | undefined {
  return ALL_CROSS_CHAIN_VAULTS.find(
    (vault) =>
      vault.address.toLowerCase() === address.toLowerCase() &&
      vault.chainId === chainId,
  );
}

/**
 * Get the primary (default) vault for a specific chain
 * @param chainId - The chain ID
 * @returns The primary vault for the chain
 */
export function getPrimaryVaultForChain(
  chainId: SupportedChainId,
): CrossChainVault {
  const vaults = getVaultsByChain(chainId);
  if (vaults.length === 0) {
    throw new Error(`No vaults available for chain ${chainId}`);
  }
  // Return the first vault (marked as primary in each registry)
  return vaults[0];
}

/**
 * Get the global primary vault (Base chain)
 * @returns The primary vault (Morpho Gauntlet on Base)
 */
export function getGlobalPrimaryVault(): CrossChainVault {
  return PRIMARY_VAULT as CrossChainVault;
}

/**
 * Get vaults grouped by chain
 * @returns Record mapping chain ID to vaults on that chain
 */
export function getVaultsGroupedByChain(): Record<
  SupportedChainId,
  CrossChainVault[]
> {
  return {
    [SUPPORTED_CHAINS.BASE]: getVaultsByChain(SUPPORTED_CHAINS.BASE),
    [SUPPORTED_CHAINS.ARBITRUM]: getVaultsByChain(SUPPORTED_CHAINS.ARBITRUM),
    [SUPPORTED_CHAINS.MAINNET]: getVaultsByChain(SUPPORTED_CHAINS.MAINNET),
  };
}

/**
 * Get vaults filtered by risk level
 * @param risk - The risk level to filter by
 * @returns Array of vaults matching the risk level
 */
export function getVaultsByRisk(
  risk: 'Conservative' | 'Balanced' | 'High' | 'Optimized',
): CrossChainVault[] {
  return ALL_CROSS_CHAIN_VAULTS.filter((vault) => vault.risk === risk);
}

/**
 * Get all supported chain IDs that have vaults
 * @returns Array of chain IDs with available vaults
 */
export function getChainsWithVaults(): SupportedChainId[] {
  const chains = new Set(ALL_CROSS_CHAIN_VAULTS.map((vault) => vault.chainId));
  return Array.from(chains);
}
