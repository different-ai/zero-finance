import { Types } from '@requestnetwork/request-client.js';

export type NetworkType = 'gnosis';
export type CurrencyType = 'EUR';

export const NETWORK_CURRENCIES: Record<NetworkType, CurrencyType[]> = {
  gnosis: ['EUR'],
};

export const CURRENCY_CONFIG= {
  EURe: {
    type: Types.RequestLogic.CURRENCY.ERC20,
    value: '0x420CA0f9B9b604cE0fd9C18EF134C705e5Fa3430', // EURe on Gnosis
    network: 'xdai',
    paymentNetworkId: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
  },
  EUR : {
    type: Types.RequestLogic.CURRENCY.ISO4217,
    value: 'EUR',
    network: 'xdai',
    paymentNetworkId: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
  },
} as const; 
