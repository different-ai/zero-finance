/// <reference types="vite/client" />

interface Window {
  ethereum: any;
}

declare module '@requestnetwork/request-client.js' {
  export interface Identity {
    type: string;
    value: string;
  }

  export namespace Types {
    export namespace RequestLogic {
      export interface ICurrency {
        type: string;
        value: string;
        network?: string;
      }
      
      export enum CURRENCY {
        ETH = 'ETH',
        ERC20 = 'ERC20'
      }

      export enum STATE {
        PENDING = 'PENDING',
        ACCEPTED = 'ACCEPTED',
        CANCELED = 'CANCELED',
        PAID = 'PAID'
      }
    }

    export interface IRequestData {
      requestId: string;
      currency: RequestLogic.ICurrency;
      expectedAmount: string;
      payee: Identity;
      payer?: Identity;
      timestamp: number;
      state: RequestLogic.STATE;
      contentData?: Record<string, any>;
    }
  }
}
