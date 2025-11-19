/**
 * Arbitrum USDC vault configuration
 * Defines available yield vaults on Arbitrum network
 */

import { type Address } from 'viem';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { type CrossChainVault } from '@/lib/types/multi-chain';

/**
 * Arbitrum USDC vaults
 * All vaults are Morpho-based vaults on Arbitrum mainnet
 */
export const ARBITRUM_USDC_VAULTS: CrossChainVault[] = [
  {
    id: 'morphoGauntletArbitrum',
    name: 'Gauntlet USDC Core',
    displayName: 'Arbitrum High-Yield',
    address: '0x7e97fa6893871A2751B5fE961978DCCb2c201E65' as Address,
    chainId: SUPPORTED_CHAINS.ARBITRUM,
    risk: 'Optimized',
    curator: 'Morpho × Gauntlet',
    appUrl:
      'https://app.morpho.org/arbitrum/vault/0x7e97fa6893871A2751B5fE961978DCCb2c201E65/gauntlet-usdc-core',
  },
  // {
  //   id: 'steakhouseArbitrum',
  //   name: 'Steakhouse USDC',
  //   displayName: 'Arbitrum Stable',
  //   address: '0x69c58c4c7f6c3be200aac5d2d0e0e8097c83c409' as Address,
  //   chainId: SUPPORTED_CHAINS.ARBITRUM,
  //   risk: 'Balanced',
  //   curator: 'Steakhouse',
  //   appUrl:
  //     'https://app.morpho.org/vault?vault=0x69c58c4c7f6c3be200aac5d2d0e0e8097c83c409&network=arbitrum',
  // },
  // {
  //   id: 'reLendArbitrum',
  //   name: 'Re7 USDC Flagship',
  //   displayName: 'Arbitrum Conservative',
  //   address: '0xd21c58f16d004723cf5495fd8cb6872faf17ef7d' as Address,
  //   chainId: SUPPORTED_CHAINS.ARBITRUM,
  //   risk: 'Conservative',
  //   curator: 'Re7 Labs',
  //   appUrl:
  //     'https://app.morpho.org/vault?vault=0xd21c58f16d004723cf5495fd8cb6872faf17ef7d&network=arbitrum',
  // },
];

/**
 * Get the primary (default) vault for Arbitrum
 */
export function getPrimaryArbitrumVault(): CrossChainVault {
  return ARBITRUM_USDC_VAULTS[0];
}

/**
 * Get Arbitrum vault by ID
 */
export function getArbitrumVaultById(id: string): CrossChainVault | undefined {
  return ARBITRUM_USDC_VAULTS.find((vault) => vault.id === id);
}

/**
 * Get Arbitrum vault by address
 */
export function getArbitrumVaultByAddress(
  address: Address,
): CrossChainVault | undefined {
  return ARBITRUM_USDC_VAULTS.find(
    (vault) => vault.address.toLowerCase() === address.toLowerCase(),
  );
}
