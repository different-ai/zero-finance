export const ARBITRUM_CHAIN_ID = 42161;
export const HYPERLIQUID_CHAIN_ID = 998; // Custom chain ID for Hyperliquid

export type CrossChainVaultType = 'morpho' | 'hlp';

export type CrossChainVault = {
  id: string;
  name: string; // Technical name
  displayName: string; // Banking-friendly name
  address: `0x${string}`;
  risk: 'Conservative' | 'Balanced' | 'High' | 'Optimized';
  curator: string;
  appUrl: string;
  chainId: number;
  chainName: string;
  type: CrossChainVaultType;
  bridgeProtocol?: 'across' | 'manual'; // How to get funds there
  isVoucher?: boolean; // Uses voucher NFT system (for HLP)
};

/**
 * Arbitrum Morpho Vaults - ERC-4626 compatible
 * Bridge via Across Protocol from Base
 */
export const ARBITRUM_MORPHO_VAULTS: CrossChainVault[] = [
  {
    id: 'morpho-arb-gauntlet',
    name: 'Gauntlet USDC Core (Arbitrum)',
    displayName: 'Arbitrum High-Yield',
    address: '0x7e97fa6893871A2751B5fE961978DCCb2c201E65',
    risk: 'Optimized',
    curator: 'Morpho × Gauntlet',
    appUrl:
      'https://app.morpho.org/vault?vault=0x7e97fa6893871A2751B5fE961978DCCb2c201E65&network=arbitrum',
    chainId: ARBITRUM_CHAIN_ID,
    chainName: 'Arbitrum',
    type: 'morpho',
    bridgeProtocol: 'across',
  },
];

/**
 * Hyperliquid HLP Vault - NOT ERC-4626, uses custom API
 * Uses voucher NFT system on Base to represent positions
 */
export const HYPERLIQUID_HLP_VAULT: CrossChainVault = {
  id: 'hlp-main',
  name: 'Hyperliquid HLP Vault',
  displayName: 'HLP Trading Vault',
  address: '0x0000000000000000000000000000000000000000', // No contract address
  risk: 'High',
  curator: 'Hyperliquid',
  appUrl: 'https://app.hyperliquid.xyz/vaults',
  chainId: HYPERLIQUID_CHAIN_ID,
  chainName: 'Hyperliquid',
  type: 'hlp',
  bridgeProtocol: 'manual', // Manual bridge to Hyperliquid
  isVoucher: true, // Uses voucher NFT on Base
};

/**
 * All cross-chain vaults combined
 */
export const CROSS_CHAIN_VAULTS: CrossChainVault[] = [
  ...ARBITRUM_MORPHO_VAULTS,
  HYPERLIQUID_HLP_VAULT,
];

/**
 * Helper: Get vault by ID
 */
export function getCrossChainVault(id: string): CrossChainVault | undefined {
  return CROSS_CHAIN_VAULTS.find((v) => v.id === id);
}

/**
 * Helper: Get vaults by chain
 */
export function getVaultsByChain(chainId: number): CrossChainVault[] {
  return CROSS_CHAIN_VAULTS.filter((v) => v.chainId === chainId);
}

/**
 * Helper: Get vaults by type
 */
export function getVaultsByType(type: CrossChainVaultType): CrossChainVault[] {
  return CROSS_CHAIN_VAULTS.filter((v) => v.type === type);
}
