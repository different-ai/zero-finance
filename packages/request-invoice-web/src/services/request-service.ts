import { Types } from '@requestnetwork/request-client.js';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import { ethers } from 'ethers';
import { RequestDetails, PaymentMethod, PaymentResult } from '../lib/types';

// @ts-ignore - RequestNetwork is available at runtime
const { RequestNetwork } = require('@requestnetwork/request-client.js');

export class RequestService {
  private requestClient: any;
  private provider: ethers.providers.Web3Provider | null = null;

  constructor() {
    // Initialize Request Network client without provider initially
    this.requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: 'https://xdai.gateway.request.network/',
      },
    });
  }

  private async initializeProvider() {
    if (this.provider) return;

    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      const signatureProvider = new Web3SignatureProvider(this.provider);
      this.requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: 'https://xdai.gateway.request.network/',
        },
        signatureProvider,
      });
    } else {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }
  }

  async connectWallet(): Promise<string> {
    await this.initializeProvider();
    if (!this.provider) throw new Error('Web3 provider not initialized');

    try {
      const accounts = await this.provider.send('eth_requestAccounts', []);
      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect wallet. Please try again.');
    }
  }

  async getRequestById(requestId: string): Promise<Types.IRequestData & RequestDetails> {
    try {
      const request = await this.requestClient.fromRequestId(requestId);
      const data = await request.getData();
      
      return {
        ...data,
        amount: ethers.utils.formatUnits(data.expectedAmount, 18),
        description: data.contentData?.reason || '',
        status: data.state,
      };
    } catch (error) {
      console.error('Failed to get request:', error);
      throw new Error('Failed to fetch invoice details. Please check the request ID.');
    }
  }

  async getPaymentMethods(requestData: Types.IRequestData): Promise<PaymentMethod[]> {
    const methods: PaymentMethod[] = [];
    const currency = requestData.currency;

    if (currency.type === Types.RequestLogic.CURRENCY.ETH) {
      methods.push({
        id: 'eth-direct',
        name: 'Pay with ETH',
        description: 'Direct payment using ETH',
      });
    } else if (currency.type === Types.RequestLogic.CURRENCY.ERC20 && currency.value) {
      methods.push({
        id: 'erc20-direct',
        name: `Pay with ${currency.value}`,
        description: `Direct payment using ${currency.value}`,
      });
    }

    return methods;
  }

  async processPayment(
    requestId: string,
    methodId: string,
    amount: string
  ): Promise<PaymentResult> {
    await this.initializeProvider();
    if (!this.provider) throw new Error('Web3 provider not initialized');

    try {
      const request = await this.requestClient.fromRequestId(requestId);
      const data = await request.getData();
      
      if (!data.payee?.value) {
        throw new Error('Invalid payee address');
      }

      // Get signer from provider
      const signer = this.provider.getSigner();

      // Prepare payment based on method
      if (methodId === 'eth-direct') {
        // Direct ETH payment
        const tx = await signer.sendTransaction({
          to: data.payee.value,
          value: ethers.utils.parseEther(amount),
        });
        
        await tx.wait();
        return {
          success: true,
          transactionHash: tx.hash,
        };
      } else if (methodId === 'erc20-direct' && data.currency.value) {
        // ERC20 payment
        const erc20Contract = new ethers.Contract(
          data.currency.value,
          ['function transfer(address to, uint256 amount) returns (bool)'],
          signer
        );
        
        const tx = await erc20Contract.transfer(
          data.payee.value,
          ethers.utils.parseUnits(amount, 18)
        );
        
        await tx.wait();
        return {
          success: true,
          transactionHash: tx.hash,
        };
      }
      
      throw new Error('Unsupported payment method');
    } catch (error) {
      console.error('Payment failed:', error);
      throw new Error('Payment failed. Please try again.');
    }
  }
}

// Create a singleton instance
export const requestService = new RequestService();
