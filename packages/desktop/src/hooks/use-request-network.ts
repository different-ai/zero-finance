import { useWalletClient } from 'wagmi';
import { RequestNetwork, Types, Utils } from '@requestnetwork/request-client.js';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import { useCallback } from 'react';

export const useRequestNetwork = () => {
  const { data: walletClient } = useWalletClient();

  const createInvoiceRequest = useCallback(async ({
    recipient,
    amount,
    currency,
    description,
    dueDate,
  }: {
    recipient: {
      name: string;
      address?: string;
      email?: string;
    };
    amount: number;
    currency: string;
    description: string;
    dueDate?: string;
  }) => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    console.log('0xHypr', 'Creating request network client');
    
    // Create signature provider using wallet
    const web3SignatureProvider = new Web3SignatureProvider(walletClient);
    
    // Create request client
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: 'https://goerli.gateway.request.network/',
      },
      signatureProvider: web3SignatureProvider,
    });

    const payeeIdentity = walletClient.account.address;
    
    console.log('0xHypr', 'Creating request with params', {
      payeeIdentity,
      amount,
      currency,
      description,
    });

    // Create request parameters
    const requestCreateParameters = {
      requestInfo: {
        currency: {
          type: Types.RequestLogic.CURRENCY.ERC20,
          value: currency, // ERC20 token address
          network: 'goerli',
        },
        expectedAmount: amount.toString(),
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payeeIdentity,
        },
        timestamp: Utils.getCurrentTimestampInSecond(),
      },
      paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentNetworkName: 'goerli',
          paymentAddress: payeeIdentity,
          feeAddress: '0x0000000000000000000000000000000000000000',
          feeAmount: '0',
        },
      },
      contentData: {
        reason: description,
        dueDate,
        recipientName: recipient.name,
        recipientEmail: recipient.email,
        recipientAddress: recipient.address,
      },
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
    };

    try {
      // Create the request
      console.log('0xHypr', 'Creating request');
      const request = await requestClient.createRequest(requestCreateParameters);
      
      // Wait for confirmation
      console.log('0xHypr', 'Waiting for confirmation');
      const confirmedRequestData = await request.waitForConfirmation();
      
      console.log('0xHypr', 'Request confirmed', confirmedRequestData);
      
      return confirmedRequestData.requestId;
    } catch (error) {
      console.error('0xHypr', 'Failed to create request:', error);
      throw error;
    }
  }, [walletClient]);

  return {
    createInvoiceRequest,
  };
}; 