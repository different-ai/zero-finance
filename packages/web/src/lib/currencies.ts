'use strict';
 

import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';

/**
 * Defines the structure for a cryptocurrency configuration.
 */
export interface CryptoCurrencyConfig {
  type: RequestLogicTypes.CURRENCY.ETH | RequestLogicTypes.CURRENCY.ERC20;
  value: string; // Token address for ERC20, currency symbol (e.g., 'ETH') for native
  symbol: string; // Add explicit symbol (e.g., 'ETH', 'USDC')
  network: string; // e.g., 'base', 'mainnet', 'goerli'
  decimals: number;
}

/**
 * Defines the structure for a fiat currency configuration.
 */
export interface FiatCurrencyConfig {
  type: RequestLogicTypes.CURRENCY.ISO4217;
  value: string; // ISO 4217 currency code (e.g., 'EUR', 'USD')
  symbol: string; // Add explicit symbol, same as value for fiat
  decimals: number;
  network?: string; // Optional, usually not needed for fiat
}

export type CurrencyConfig = CryptoCurrencyConfig | FiatCurrencyConfig;

// --- Crypto Configurations ---

/**
 * Ethereum Configuration (Base Network)
 */
const ETH_BASE_CONFIG: CryptoCurrencyConfig = {
  type: RequestLogicTypes.CURRENCY.ETH,
  value: 'ETH', // Native token symbol
  symbol: 'ETH', // Added symbol
  network: 'base', 
  decimals: 18,
};

/**
 * USDC Configuration (Base Network)
 */
const USDC_BASE_CONFIG: CryptoCurrencyConfig = {
  type: RequestLogicTypes.CURRENCY.ERC20,
  value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet USDC address
  symbol: 'USDC', // Added symbol
  network: 'base', 
  decimals: 6,
};

// --- Fiat Configurations ---

const FIAT_CURRENCIES: Record<string, FiatCurrencyConfig> = {
  EUR: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'EUR',
    symbol: 'EUR', // Added symbol
    decimals: 2,
  },
  USD: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'USD',
    symbol: 'USD', // Added symbol
    decimals: 2,
  },
  // Add other supported fiat currencies here
};

// --- Lookup Function ---

/**
 * Retrieves the currency configuration based on symbol/address and network.
 * Supports crypto (network specific) and fiat currencies.
 */
export function getCurrencyConfig(
  identifier: string, // Can be symbol (ETH, USDC, EUR) or address (for ERC20)
  network?: string // Network required for crypto lookup by symbol/address
): CurrencyConfig | undefined {
  const upperIdentifier = identifier.toUpperCase();

  // 1. Check Fiat first (uses symbol)
  if (FIAT_CURRENCIES[upperIdentifier]) {
    return FIAT_CURRENCIES[upperIdentifier];
  }

  // 2. Crypto lookup requires network
  if (!network) {
    // If identifier looks like an address, we can't guess network
    if (identifier.startsWith('0x') && identifier.length === 42) {
      console.warn(`Network is required to get crypto currency config for address: ${identifier}`);
    } else {
      // Maybe it was a crypto symbol without network?
      console.warn(`Network is required to get crypto currency config for symbol: ${identifier}`);
    }
    return undefined;
  }
  
  const lowerNetwork = network.toLowerCase();

  // 3. Crypto lookup by symbol or address
  // --- Add specific crypto configs here ---
  if (lowerNetwork === 'base') {
    // Check by symbol
    if (upperIdentifier === 'ETH') return ETH_BASE_CONFIG;
    if (upperIdentifier === 'USDC') return USDC_BASE_CONFIG;
    // Check by address (case-insensitive comparison)
    if (upperIdentifier === ETH_BASE_CONFIG.value.toUpperCase()) return ETH_BASE_CONFIG; // Should not happen for ETH, but safe
    if (upperIdentifier === USDC_BASE_CONFIG.value.toUpperCase()) return USDC_BASE_CONFIG;
  }

  // --- Add other networks and their currencies here ---
  // e.g., if (lowerNetwork === 'mainnet') { ... }

  console.warn(`Unsupported currency/network combination: ${identifier} on ${network}`);
  return undefined;
} 