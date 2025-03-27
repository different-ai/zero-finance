export const LIFI_CHAIN_MAP: Record<string, number> = {
  ethereum: 1, eth: 1, mainnet: 1,
  gnosis: 100, gno: 100, xdai: 100,
  arbitrum: 42161, arb: 42161,
  optimism: 10, opt: 10,
  polygon: 137, pol: 137, matic: 137,
  base: 8453,
  avalanche: 43114, avax: 43114, ava: 43114,
  fantom: 250, ftm: 250,
  bsc: 56, bnb: 56, binance: 56,
  zksync: 324, zks: 324, 'zkera': 324,
  mantle: 5000, mnt: 5000,
  linea: 59144, lna: 59144,
};

// Native token address used by Li.Fi (used for ETH, MATIC, etc.)
export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';