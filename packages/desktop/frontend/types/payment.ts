import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';

export type NetworkType = 'gnosis' | 'ethereum';
export type CurrencyType = 'EUR' | 'USDC';

export const NETWORK_CURRENCIES: Record<NetworkType, CurrencyType[]> = {
  gnosis: ['EUR'],
  ethereum: ['USDC'],
};

export const CURRENCY_CONFIG = {
  EURe: {
    type: RequestLogicTypes.CURRENCY.ERC20,
    value: '0x420CA0f9B9b604cE0fd9C18EF134C705e5Fa3430', // EURe on Gnosis
    network: 'xdai',
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
  },
  EUR: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'EUR',
    network: 'xdai',
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
  },
  USDC: {
    type: RequestLogicTypes.CURRENCY.ERC20,
    value: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC on Ethereum Mainnet
    network: 'mainnet',
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
    decimals: 6,
  },
} as const; 