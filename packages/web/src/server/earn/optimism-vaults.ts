/**
 * Optimism USDC vault configuration
 * Defines available yield vaults on Optimism network
 */

import { type Address } from 'viem';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { type CrossChainVault } from '@/lib/types/multi-chain';

/**
 * Optimism USDC vaults
 * All vaults are Morpho-based vaults on Optimism mainnet
 */
export const OPTIMISM_USDC_VAULTS: CrossChainVault[] = [
  {
    id: 'gauntletUsdcPrimeOptimism',
    name: 'Gauntlet USDC Prime',
    displayName: 'Optimism Prime',
    address: '0xC30ce6A5758786e0F640cC5f881Dd96e9a1C5C59' as Address,
    chainId: SUPPORTED_CHAINS.OPTIMISM,
    risk: 'Balanced',
    curator: 'Gauntlet',
    appUrl:
      'https://app.morpho.org/opmainnet/vault/0xC30ce6A5758786e0F640cC5f881Dd96e9a1C5C59/gauntlet-usdc-prime',
    asset: {
      symbol: 'USDC',
      decimals: 6,
      isNative: false,
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85' as Address,
    },
    category: 'stable',
  },
];

/**
 * Get the primary (default) vault for Optimism
 */
export function getPrimaryOptimismVault(): CrossChainVault {
  return OPTIMISM_USDC_VAULTS[0];
}

/**
 * Get Optimism vault by ID
 */
export function getOptimismVaultById(id: string): CrossChainVault | undefined {
  return OPTIMISM_USDC_VAULTS.find((vault) => vault.id === id);
}

/**
 * Get Optimism vault by address
 */
export function getOptimismVaultByAddress(
  address: Address,
): CrossChainVault | undefined {
  return OPTIMISM_USDC_VAULTS.find(
    (vault) => vault.address.toLowerCase() === address.toLowerCase(),
  );
}
