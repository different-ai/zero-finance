/**
 * Tracked Vaults Configuration
 *
 * Central configuration for all vaults we track in the admin dashboard.
 * Includes insurance status, monitoring flags, and vault metadata.
 *
 * INSURED VAULTS (Chainproof licensed insurer, coverage up to $1M):
 * - Hyperithm USDC (Arbitrum): 0x4B6F1C9E5d470b97181786b26da0d0945A7cf027
 * - Gauntlet USDC Prime (Base): 0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61
 * - Gauntlet USDC Prime (Optimism): 0xC30ce6A5758786e0F640cC5f881Dd96e9a1C5C59
 */

import { type Address } from 'viem';

export interface TrackedVault {
  id: string;
  name: string;
  displayName: string;
  address: Address;
  chainId: number;
  risk: 'Conservative' | 'Balanced' | 'High' | 'Optimized' | 'Market Risk';
  curator: string;
  appUrl: string;
  // Insurance tracking
  isInsured: boolean;
  insuranceCoverage?: {
    provider: string;
    amount: string;
    currency: string;
  };
  // Monitoring flags
  isActive: boolean; // Whether we actively use this vault
  isPrimary?: boolean; // Primary vault for its chain
  notes?: string;
}

/**
 * All tracked vaults across all chains
 * Ordered by: chain, then by priority/insurance status
 */
export const TRACKED_VAULTS: TrackedVault[] = [
  // ========================================
  // BASE CHAIN (8453)
  // ========================================
  {
    id: 'gauntlet-usdc-prime-base',
    name: 'Gauntlet USDC Prime',
    displayName: 'Base Prime (Insured)',
    address: '0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61',
    chainId: 8453,
    risk: 'Balanced',
    curator: 'Gauntlet',
    appUrl:
      'https://app.morpho.org/base/vault/0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61/gauntlet-usdc-prime',
    isInsured: true,
    insuranceCoverage: {
      provider: 'Lockton/Chainproof',
      amount: '100000',
      currency: 'USD',
    },
    isActive: true,
    isPrimary: true,
    notes: 'Primary insured vault for Base',
  },
  {
    id: 'morphoGauntlet',
    name: 'Gauntlet USDC Frontier',
    displayName: 'High-Yield Savings',
    address: '0x236919F11ff9eA9550A4287696C2FC9e18E6e890',
    chainId: 8453,
    risk: 'Optimized',
    curator: 'Morpho × Gauntlet',
    appUrl:
      'https://app.morpho.org/base/vault/0x236919F11ff9eA9550A4287696C2FC9e18E6e890/gauntlet-usdc-frontier',
    isInsured: false,
    isActive: true,
    notes: 'Higher yield, higher risk - Frontier vault',
  },
  {
    id: 'seamless',
    name: 'Seamless USDC',
    displayName: 'Balanced Yield',
    address: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
    chainId: 8453,
    risk: 'Balanced',
    curator: 'Gauntlet',
    appUrl:
      'https://app.morpho.org/base/vault/0x616a4E1db48e22028f6bbf20444Cd3b8e3273738/seamless-usdc-vault',
    isInsured: false,
    isActive: true,
  },
  {
    id: 'steakhouse',
    name: 'Steakhouse USDC',
    displayName: 'Stable Growth',
    address: '0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183',
    chainId: 8453,
    risk: 'Balanced',
    curator: 'Steakhouse',
    appUrl:
      'https://app.morpho.org/base/vault/0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183/steakhouse-usdc',
    isInsured: false,
    isActive: true,
  },

  // ========================================
  // ARBITRUM (42161)
  // ========================================
  {
    id: 'hyperithm-usdc-arbitrum',
    name: 'Hyperithm USDC',
    displayName: 'Arbitrum Prime (Insured)',
    address: '0x4B6F1C9E5d470b97181786b26da0d0945A7cf027',
    chainId: 42161,
    risk: 'Balanced',
    curator: 'Hyperithm',
    appUrl:
      'https://app.morpho.org/arbitrum/vault/0x4B6F1C9E5d470b97181786b26da0d0945A7cf027/hyperithm-usdc',
    isInsured: true,
    insuranceCoverage: {
      provider: 'Lockton/Chainproof',
      amount: '100000',
      currency: 'USD',
    },
    isActive: true,
    isPrimary: true,
    notes: 'Primary insured vault for Arbitrum',
  },
  {
    id: 'morphoGauntletArbitrum',
    name: 'Gauntlet USDC Core',
    displayName: 'Arbitrum High-Yield',
    address: '0x7e97fa6893871A2751B5fE961978DCCb2c201E65',
    chainId: 42161,
    risk: 'Optimized',
    curator: 'Morpho × Gauntlet',
    appUrl:
      'https://app.morpho.org/arbitrum/vault/0x7e97fa6893871A2751B5fE961978DCCb2c201E65/gauntlet-usdc-core',
    isInsured: false,
    isActive: true,
  },

  // ========================================
  // OPTIMISM (10)
  // ========================================
  {
    id: 'gauntlet-usdc-prime-optimism',
    name: 'Gauntlet USDC Prime',
    displayName: 'Optimism Prime (Insured)',
    address: '0xC30ce6A5758786e0F640cC5f881Dd96e9a1C5C59',
    chainId: 10,
    risk: 'Balanced',
    curator: 'Gauntlet',
    appUrl:
      'https://app.morpho.org/optimism/vault/0xC30ce6A5758786e0F640cC5f881Dd96e9a1C5C59/gauntlet-usdc-prime',
    isInsured: true,
    insuranceCoverage: {
      provider: 'Lockton/Chainproof',
      amount: '100000',
      currency: 'USD',
    },
    isActive: true,
    isPrimary: true,
    notes: 'Primary insured vault for Optimism',
  },
];

/**
 * Get all insured vaults
 */
export function getInsuredVaults(): TrackedVault[] {
  return TRACKED_VAULTS.filter((v) => v.isInsured);
}

/**
 * Get all active vaults
 */
export function getActiveVaults(): TrackedVault[] {
  return TRACKED_VAULTS.filter((v) => v.isActive);
}

/**
 * Get vaults by chain
 */
export function getVaultsByChain(chainId: number): TrackedVault[] {
  return TRACKED_VAULTS.filter((v) => v.chainId === chainId);
}

/**
 * Get primary vault for a chain
 */
export function getPrimaryVaultForChain(
  chainId: number,
): TrackedVault | undefined {
  return TRACKED_VAULTS.find((v) => v.chainId === chainId && v.isPrimary);
}

/**
 * Check if a vault is insured by address
 */
export function isVaultInsured(address: string, chainId: number): boolean {
  return TRACKED_VAULTS.some(
    (v) =>
      v.address.toLowerCase() === address.toLowerCase() &&
      v.chainId === chainId &&
      v.isInsured,
  );
}

/**
 * Get vault by address and chain
 */
export function getTrackedVault(
  address: string,
  chainId: number,
): TrackedVault | undefined {
  return TRACKED_VAULTS.find(
    (v) =>
      v.address.toLowerCase() === address.toLowerCase() &&
      v.chainId === chainId,
  );
}

/**
 * Chain names for display
 */
export const CHAIN_DISPLAY_NAMES: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  10: 'Optimism',
};
