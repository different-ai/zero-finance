import { ethers } from 'ethers';
import { RequestNetwork, Types, Utils } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';

export class RequestService {
  private requestClient: RequestNetwork;
  private signatureProvider: EthereumPrivateKeySignatureProvider;
  private payeeWallet: ethers.Wallet;

  constructor(privateKey: string) {
    // Initialize the wallet
    // create a new wallet on the fly
    const wallet = ethers.Wallet.createRandom();
    this.payeeWallet = wallet;
    
    // Initialize signature provider
    this.signatureProvider = new EthereumPrivateKeySignatureProvider({
      method: Types.Signature.METHOD.ECDSA,
      privateKey: this.payeeWallet.privateKey, // Must include 0x prefix
    });

    // Initialize Request Network client
    this.requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: 'https://sepolia.gateway.request.network/',
      },
      signatureProvider: this.signatureProvider,
    });
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
      const payeeIdentity = this.payeeWallet.address;
      const requestAmount = ethers.utils.parseUnits(amount.toString(), 18).toString();
      const feeRecipient = '0x0000000000000000000000000000000000000000';

      // Create the request data
      const requestCreateParameters = {
        requestInfo: {
          currency: {
            type: Types.RequestLogic.CURRENCY.ERC20,
            value: '0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C',
            network: 'sepolia',
          },
          expectedAmount: requestAmount,
          payee: {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: payeeIdentity,
          },
          payer: recipient.address ? {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: recipient.address,
          } : undefined,
          timestamp: Utils.getCurrentTimestampInSecond(),
        },
        paymentNetwork: {
          id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
          parameters: {
            paymentNetworkName: 'sepolia',
            paymentAddress: payeeIdentity,
            feeAddress: feeRecipient,
            feeAmount: '0',
          },
        },
        contentData: {
          reason: description,
          dueDate: dueDate || '',
          invoiceNumber: Date.now().toString(),
          buyerInfo: {
            email: recipient.email || '',
            name: recipient.name,
          },
        },
        signer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payeeIdentity,
        },
      };

      // Create the request
      const request = await this.requestClient.createRequest(requestCreateParameters);
      
      // Wait for request to be confirmed
      const confirmedRequest = await request.waitForConfirmation();

      console.log('0xHypr', 'Created request:', confirmedRequest.requestId);
      
      return {
        success: true,
        requestId: confirmedRequest.requestId,
      };
    } catch (error) {
      console.error('0xHypr', 'Failed to create request:', error);
      throw error;
    }
  }
} 