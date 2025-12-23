import {
  SUPPORTED_CHAINS,
  type SupportedChainId,
} from '@/lib/constants/chains';

export const BASE_CHAIN_ID = SUPPORTED_CHAINS.BASE;
export const ETHEREUM_CHAIN_ID = 1;

// Asset configuration for vaults
export type VaultAsset = {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  isNative?: boolean; // If true, UI handles ETH -> WETH wrapping
};

// Default USDC asset on Base
export const USDC_ASSET: VaultAsset = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  symbol: 'USDC',
  decimals: 6,
  isNative: false,
};

// WETH asset on Base
export const WETH_ASSET: VaultAsset = {
  address: '0x4200000000000000000000000000000000000006',
  symbol: 'WETH',
  decimals: 18,
  isNative: true, // Treat as native ETH in UI
};

export type BaseVault = {
  id:
    | 'morphoGauntlet'
    | 'morphoUsdcPrime'
    | 'seamless'
    | 'gauntletCore'
    | 'steakhouse'
    | 'originSuperOeth';
  name: string; // Technical name (shown in Level 2 - Technical Details)
  displayName: string; // Banking-friendly name (shown in Level 0 - Primary UI)
  address: `0x${string}`;
  risk: 'Conservative' | 'Balanced' | 'High' | 'Optimized' | 'Market Risk';
  curator: string;
  appUrl: string;
  chainId: SupportedChainId;
  asset: VaultAsset; // Underlying asset configuration
  zapper?: `0x${string}`; // Optional zapper contract for native ETH deposits
  category: 'stable' | 'growth'; // For UI grouping
  isPrimary?: boolean; // Mark as the default vault for banking mode
};

// Primary vault for banking mode - Morpho USDC Prime on Base
// This is the recommended vault shown to non-technical users
export const PRIMARY_VAULT: BaseVault = {
  id: 'morphoUsdcPrime',
  name: 'USDC Prime',
  displayName: 'Stable Savings',
  address: '0x050cE30b927Da55177A4914EC73480238BAD56f0',
  risk: 'Balanced',
  curator: '0 Finance',
  appUrl:
    'https://app.morpho.org/base/vault/0x050cE30b927Da55177A4914EC73480238BAD56f0/usdc-prime',
  chainId: BASE_CHAIN_ID,
  asset: USDC_ASSET,
  category: 'stable',
  isPrimary: true,
};

// Alternative high-yield vault - Gauntlet USDC Frontier (for technical users)
export const GAUNTLET_FRONTIER_VAULT: BaseVault = {
  id: 'morphoGauntlet',
  name: 'Gauntlet USDC Frontier',
  displayName: 'Frontier Yield',
  address: '0x236919F11ff9eA9550A4287696C2FC9e18E6e890',
  risk: 'Optimized',
  curator: 'Morpho × Gauntlet',
  appUrl:
    'https://app.morpho.org/base/vault/0x236919F11ff9eA9550A4287696C2FC9e18E6e890/gauntlet-usdc-frontier',
  chainId: BASE_CHAIN_ID,
  asset: USDC_ASSET,
  category: 'stable',
};

// Origin Protocol Super OETH vault on Base
export const ORIGIN_SUPER_OETH_VAULT: BaseVault = {
  id: 'originSuperOeth',
  name: 'Super OETH (Base)',
  displayName: 'Ethereum Growth Account',
  address: '0x7FcD174E80f264448ebeE8c88a7C4476AAF58Ea6', // Wrapped Super OETH (ERC4626)
  risk: 'Market Risk',
  curator: 'Origin Protocol',
  appUrl: 'https://www.originprotocol.com/super',
  chainId: BASE_CHAIN_ID,
  asset: WETH_ASSET,
  zapper: '0x3b56c09543D3068f8488ED34e6F383c3854d2bC1', // Origin Zapper for native ETH deposits
  category: 'growth',
};

// Stable vaults (USDC-based)
export const BASE_USDC_VAULTS: BaseVault[] = [
  // Primary vault first (shown to banking users)
  PRIMARY_VAULT,
  // Gauntlet Frontier (alternative for technical users)
  GAUNTLET_FRONTIER_VAULT,
  // Other Base chain vaults
  {
    id: 'seamless',
    name: 'Seamless USDC',
    displayName: 'Balanced Yield',
    address: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
    risk: 'Balanced',
    curator: 'Gauntlet',
    appUrl:
      'https://app.morpho.org/base/vault/0x616a4E1db48e22028f6bbf20444Cd3b8e3273738/seamless-usdc-vault',
    chainId: BASE_CHAIN_ID,
    asset: USDC_ASSET,
    category: 'stable',
  },
  {
    id: 'steakhouse',
    name: 'Steakhouse USDC',
    displayName: 'Stable Growth',
    address: '0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183',
    risk: 'Balanced',
    curator: 'Steakhouse',
    appUrl:
      'https://app.morpho.org/base/vault/0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183/steakhouse-usdc',
    chainId: BASE_CHAIN_ID,
    asset: USDC_ASSET,
    category: 'stable',
  },
];

// Growth vaults (ETH-based)
export const BASE_ETH_VAULTS: BaseVault[] = [ORIGIN_SUPER_OETH_VAULT];

// All vaults combined
export const ALL_BASE_VAULTS: BaseVault[] = [
  ...BASE_USDC_VAULTS,
  ...BASE_ETH_VAULTS,
];
