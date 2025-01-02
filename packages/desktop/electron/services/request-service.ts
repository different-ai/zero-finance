import { ethers } from 'ethers';
import { RequestNetwork, Types, Utils } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import type { ICreateRequestParameters } from '../../src/types/electron';

export class RequestService {
  private requestClient: RequestNetwork;
  private signatureProvider: EthereumPrivateKeySignatureProvider;
  private payeeWallet: ethers.Wallet;
  private static WALLET_PATH = path.join(app.getPath('userData'), 'wallet.json');

  constructor() {
    this.initializeWallet();
    
    // Initialize signature provider
    this.signatureProvider = new EthereumPrivateKeySignatureProvider({
      method: Types.Signature.METHOD.ECDSA,
      privateKey: this.payeeWallet.privateKey,
    });

    // Initialize Request Network client
    this.requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: 'https://xdai.gateway.request.network/',
      },
      signatureProvider: this.signatureProvider,
    });
  }

  private initializeWallet() {
    try {
      if (fs.existsSync(RequestService.WALLET_PATH)) {
        const walletData = JSON.parse(fs.readFileSync(RequestService.WALLET_PATH, 'utf8'));
        this.payeeWallet = new ethers.Wallet(walletData.privateKey);
        console.log('0xHypr', 'Loaded existing wallet:', this.payeeWallet.address);
      } else {
        this.payeeWallet = ethers.Wallet.createRandom();
        fs.writeFileSync(
          RequestService.WALLET_PATH,
          JSON.stringify({
            address: this.payeeWallet.address,
            privateKey: this.payeeWallet.privateKey,
          })
        );
        console.log('0xHypr', 'Created new wallet:', this.payeeWallet.address);
      }
    } catch (error) {
      console.error('0xHypr', 'Error initializing wallet:', error);
      this.payeeWallet = ethers.Wallet.createRandom();
    }
  }

  getPayeeAddress(): string {
    return this.payeeWallet.address;
  }

  async getUserRequests() {
    try {
      const requests = await this.requestClient.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: this.payeeWallet.address,
      });
      
      return await Promise.all(requests.map(async (request) => {
        const data = await request.getData();
        return {
          requestId: data.requestId,
          amount: ethers.utils.formatUnits(data.expectedAmount, 18),
          currency: data.currency,
          status: data.state,
          timestamp: data.timestamp,
          description: data.contentData?.reason || '',
          payer: data.payer,
          payee: data.payee,
        };
      }));
    } catch (error) {
      console.error('0xHypr', 'Failed to get user requests:', error);
      throw error;
    }
  }

  async createInvoiceRequest(requestData: ICreateRequestParameters) {
    try {
      // Add signer to the request data
      const requestCreateParameters: Types.ICreateRequestParameters = {
        ...requestData,
        signer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: this.payeeWallet.address,
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