/**
 * Token addresses and configuration constants for Zero Finance
 */

// USDC on Base
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const USDC_DECIMALS = 6;

// WETH on Base
export const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';
export const WETH_DECIMALS = 18;

// Native ETH
export const ETH_DECIMALS = 18;

// Environment
export const isProductionEnvironment = process.env.NODE_ENV === 'production';
