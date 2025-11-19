/**
 * Multi-chain configuration for Zero Finance
 * Defines supported chains and their configuration
 */

import { type Address } from 'viem';

/**
 * Supported chain IDs
 */
export const SUPPORTED_CHAINS = {
  BASE: 8453,
  ARBITRUM: 42161,
  MAINNET: 1,
} as const;

export type SupportedChainId =
  (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS];

/**
 * Chain configuration including network details, RPC endpoints, and block explorers
 */
export interface ChainConfig {
  name: string;
  displayName: string;
  color: string;
  rpcUrls: {
    alchemy?: string;
    infura?: string;
    public: string[];
  };
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  usdcAddress: Address;
  acrossMulticallHandler?: Address;
}

/**
 * Configuration for each supported chain
 */
export const CHAIN_CONFIG: Record<SupportedChainId, ChainConfig> = {
  [SUPPORTED_CHAINS.BASE]: {
    name: 'base',
    displayName: 'Base',
    color: '#0052FF',
    rpcUrls: {
      alchemy: process.env.BASE_RPC_URL,
      public: [
        'https://mainnet.base.org',
        'https://base.llamarpc.com',
        'https://base.drpc.org',
      ],
    },
    explorerUrl: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  [SUPPORTED_CHAINS.ARBITRUM]: {
    name: 'arbitrum',
    displayName: 'Arbitrum',
    color: '#28A0F0',
    rpcUrls: {
      alchemy: process.env.ARBITRUM_RPC_URL,
      infura: process.env.ARBITRUM_INFURA_RPC_URL,
      public: [
        'https://arb1.arbitrum.io/rpc',
        'https://arbitrum.llamarpc.com',
        'https://arbitrum.drpc.org',
      ],
    },
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    acrossMulticallHandler: '0x924a9f036260DdD5808007E1AA95f08eD08aA569',
  },
  [SUPPORTED_CHAINS.MAINNET]: {
    name: 'mainnet',
    displayName: 'Ethereum',
    color: '#627EEA',
    rpcUrls: {
      alchemy: process.env.ETHEREUM_RPC_URL,
      public: [
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://1rpc.io/eth',
      ],
    },
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
} as const;

/**
 * Get chain configuration by chain ID
 */
export function getChainConfig(chainId: SupportedChainId): ChainConfig {
  const config = CHAIN_CONFIG[chainId];
  if (!config) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return config;
}

/**
 * Check if a chain ID is supported
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return Object.values(SUPPORTED_CHAINS).includes(chainId as SupportedChainId);
}

/**
 * Get all supported chain IDs as an array
 */
export function getSupportedChainIds(): SupportedChainId[] {
  return Object.values(SUPPORTED_CHAINS);
}

/**
 * Get chain display name
 */
export function getChainDisplayName(chainId: SupportedChainId): string {
  return getChainConfig(chainId).displayName;
}

/**
 * Get USDC address for a specific chain
 */
export function getUSDCAddress(chainId: SupportedChainId): Address {
  return getChainConfig(chainId).usdcAddress;
}
