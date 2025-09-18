export const BASE_CHAIN_ID = 8453;
export const ETHEREUM_CHAIN_ID = 1;

export type BaseVault = {
  id: 'morphoGauntlet' | 'seamless' | 'gauntletCore' | 'steakhouse';
  name: string;
  address: `0x${string}`;
  risk: 'Conservative' | 'Balanced' | 'High' | 'Optimized';
  curator: string;
  appUrl: string;
  chainId?: number;
};

// Primary vault - Morpho Gauntlet USDC Frontier on Ethereum
export const PRIMARY_VAULT: BaseVault = {
  id: 'morphoGauntlet',
  name: 'Gauntlet USDC Frontier',
  address: '0x236919F11ff9eA9550A4287696C2FC9e18E6e890',
  risk: 'Optimized',
  curator: 'Morpho × Gauntlet',
  appUrl:
    'https://app.morpho.org/base/vault/0x236919F11ff9eA9550A4287696C2FC9e18E6e890/gauntlet-usdc-frontier',
  chainId: BASE_CHAIN_ID,
};

export const BASE_USDC_VAULTS: BaseVault[] = [
  // Primary vault first
  PRIMARY_VAULT,
  // Base chain vaults
  {
    id: 'seamless',
    name: 'Seamless USDC',
    address: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
    risk: 'Balanced',
    curator: 'Gauntlet',
    appUrl:
      'https://app.morpho.org/base/vault/0x616a4E1db48e22028f6bbf20444Cd3b8e3273738/seamless-usdc-vault',
    chainId: BASE_CHAIN_ID,
  },
  {
    id: 'steakhouse',
    name: 'Steakhouse USDC',
    address: '0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183',
    risk: 'Balanced',
    curator: 'Steakhouse',
    appUrl:
      'https://app.morpho.org/base/vault/0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183/steakhouse-usdc',
    chainId: BASE_CHAIN_ID,
  },
];
