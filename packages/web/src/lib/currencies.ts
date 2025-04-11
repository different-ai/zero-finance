'use strict';

import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';

/**
 * Defines the structure for a cryptocurrency configuration.
 */
export interface CryptoCurrencyConfig {
  type: RequestLogicTypes.CURRENCY.ETH | RequestLogicTypes.CURRENCY.ERC20;
  value: string; // Token address for ERC20, currency symbol (e.g., 'ETH') for native
  network: string; // e.g., 'base', 'mainnet', 'goerli'
  decimals: number;
}

/**
 * Defines the structure for a fiat currency configuration.
 */
export interface FiatCurrencyConfig {
  type: RequestLogicTypes.CURRENCY.ISO4217;
  value: string; // ISO 4217 currency code (e.g., 'EUR', 'USD')
  decimals: number;
  network?: string; // Optional, usually not needed for fiat
}

export type CurrencyConfig = CryptoCurrencyConfig | FiatCurrencyConfig;

// --- Crypto Configurations ---

export const ETH_BASE_CONFIG: CryptoCurrencyConfig = {
  type: RequestLogicTypes.CURRENCY.ETH,
  value: 'ETH', // Native token symbol
  network: 'base', 
  decimals: 18,
};

export const USDC_BASE_CONFIG: CryptoCurrencyConfig = {
  type: RequestLogicTypes.CURRENCY.ERC20,
  value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet USDC address
  network: 'base', 
  decimals: 6,
};

// --- Fiat Configurations ---

export const FIAT_CURRENCIES: Record<string, FiatCurrencyConfig> = {
  EUR: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'EUR',
    decimals: 2,
  },
  USD: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'USD',
    decimals: 2,
  },
  // Add other supported fiat currencies here
};

// --- Lookup Function ---

/**
 * Retrieves the currency configuration based on symbol and network.
 * Supports crypto (network specific) and fiat currencies.
 */
export function getCurrencyConfig(
  symbol: string,
  paymentType: 'crypto' | 'fiat',
  network?: string // Required for crypto, optional for fiat
): CurrencyConfig | undefined {
  const upperSymbol = symbol.toUpperCase();

  if (paymentType === 'fiat') {
    return FIAT_CURRENCIES[upperSymbol];
  }

  // Crypto requires a network
  if (!network) {
    console.error(`Network is required to get crypto currency config for ${symbol}`);
    return undefined;
  }

  // --- Add specific crypto configs here ---
  if (network === 'base') {
    if (upperSymbol === 'ETH') {
      return ETH_BASE_CONFIG;
    }
    if (upperSymbol === 'USDC') {
      return USDC_BASE_CONFIG;
    }
  }

  // --- Add other networks and their currencies here ---
  // e.g., if (network === 'mainnet') { ... }

  console.warn(`Unsupported crypto currency/network combination: ${symbol} on ${network}`);
  return undefined;
} 