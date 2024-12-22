import { ethers } from 'ethers';
import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';

export class RequestService {
  private requestClient: RequestNetwork;
  private signatureProvider: Web3SignatureProvider | EthereumPrivateKeySignatureProvider;

  constructor() {
    // Initialize Request Network client
    this.requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: 'https://goerli.gateway.request.network/api/v1',
      },
    });
  }

  private async initializeSignatureProvider(privateKey?: string) {
    if (privateKey) {
      // Use private key if provided
      this.signatureProvider = new EthereumPrivateKeySignatureProvider({
        method: Types.Signature.METHOD.ECDSA,
        privateKey,
      });
    } else {
      // Use Web3 provider (MetaMask) if no private key
      this.signatureProvider = new Web3SignatureProvider(window.ethereum);
    }
  }

  async createInvoiceRequest({
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
  }) {
    try {
      // Initialize signature provider
      await this.initializeSignatureProvider();

      // Convert amount to request format (consider decimals)
      const requestAmount = ethers.utils.parseUnits(amount.toString(), 18).toString();

      // Get the signer's address
      let signerAddress = '';
      if (this.signatureProvider instanceof EthereumPrivateKeySignatureProvider) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        signerAddress = await signer.getAddress();
      } else {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        signerAddress = accounts[0];
      }

      // Create the request data
      const requestData: Types.IRequestInfo = {
        currency: {
          type: Types.RequestLogic.CURRENCY.ERC20,
          value: currency,
          network: 'goerli',
        },
        expectedAmount: requestAmount,
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: recipient.address || signerAddress,
        },
        payer: recipient.email ? {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: recipient.address || '',
        } : undefined,
        timestamp: Date.now(),
        extensionsData: [{
          id: 'content-data',
          value: {
            reason: description,
            dueDate: dueDate || '',
            invoiceNumber: Date.now().toString(),
            buyerInfo: {
              email: recipient.email || '',
              name: recipient.name,
            },
          },
        }],
      };

      // Create the request
      const request = await this.requestClient.createRequest({
        requestInfo: requestData,
        signer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: signerAddress,
        },
      });

      // Wait for request to be confirmed
      await request.waitForConfirmation();

      console.log('0xHypr', 'Created request:', request.requestId);
      
      return {
        success: true,
        requestId: request.requestId,
      };
    } catch (error) {
      console.error('0xHypr', 'Failed to create request:', error);
      throw error;
    }
  }
} 