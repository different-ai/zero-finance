import { RequestNetwork } from '@requestnetwork/request-client.js';
import { Types, Utils } from '@requestnetwork/request-client.js';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { ethers } from 'ethers';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { randomBytes } from 'crypto';

// Network gateways for different blockchains
const NETWORK_GATEWAYS = {
  xdai: 'https://xdai.gateway.request.network/',
  mainnet: 'https://ethereum-goerli.gateway.request.network/',
} as const;

// Supported stablecoins on xDai for EUR conversion

interface InvoiceRequestData {
  currency: {
    type: RequestLogicTypes.CURRENCY;
    value: string;
    network: 'xdai' | 'mainnet';
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID;
    decimals?: number;
  };
  expectedAmount: string;
  paymentAddress: string;
  contentData: {
    meta: {
      format: string;
      version: string;
    };
    creationDate: string;
    invoiceNumber: string;
    sellerInfo: {
      businessName: string;
      email: string;
      address?: {
        'street-address'?: string;
        locality?: string;
        region?: string;
        'postal-code'?: string;
        'country-name'?: string;
      };
      miscellaneous?: Record<string, any>;
    };
    buyerInfo?: {
      businessName?: string;
      email: string;
      firstName?: string;
      lastName?: string;
      address?: {
        'street-address'?: string;
        locality?: string;
        region?: string;
        'postal-code'?: string;
        'country-name'?: string;
      };
      miscellaneous?: Record<string, any>;
    };
    invoiceItems: Array<{
      name: string;
      quantity: number;
      unitPrice: string;
      currency: string;
      tax: {
        type: 'percentage';
        amount: string;
      };
      reference?: string;
      deliveryDate?: string;
      deliveryPeriod?: string;
    }>;
    paymentTerms?: {
      dueDate?: string;
      lateFeesPercent?: number;
      lateFeesFix?: string;
    };
    note?: string;
    terms?: string;
  };
  paymentNetwork: {
    id: ExtensionTypes.PAYMENT_NETWORK_ID;
    parameters: {
      paymentNetworkName: string;
      paymentAddress: string;
    };
  };
}

/**
 * Create a simple invoice request with the Request Network
 * This is a minimal implementation that follows the desktop app exactly
 */
export async function createInvoiceRequest(data: InvoiceRequestData, ephemeralKey: { token: string, publicKey: string }) {
  try {
    // Log request data
    console.log('Creating invoice with data:', JSON.stringify(data, null, 2));

    // Generate a random wallet
    const wallet = ethers.Wallet.createRandom();
    console.log('Generated wallet:', wallet.address);

    // Generate ephemeral key for viewer
    const viewerWallet = ethers.Wallet.createRandom();

    // Save the public key and the address
    console.log(
      '0xHypr KEY-DEBUG',
      '--- CREATOR AND VIEWER KEYS GENERATION ---'
    );
    console.log('0xHypr KEY-DEBUG', 'Creator wallet address:', wallet.address);
    console.log(
      '0xHypr KEY-DEBUG',
      'Creator private key (actual):',
      wallet.privateKey
    );
    console.log(
      '0xHypr KEY-DEBUG',
      'Creator private key (without 0x):',
      wallet.privateKey.substring(2)
    );
    console.log('0xHypr KEY-DEBUG', 'Creator public key:', wallet.publicKey);
    console.log(
      '0xHypr KEY-DEBUG',
      'Viewer wallet address:',
      viewerWallet.address
    );
    console.log(
      '0xHypr KEY-DEBUG',
      'Viewer private key (actual):',
      viewerWallet.privateKey
    );
    console.log(
      '0xHypr KEY-DEBUG',
      'Viewer private key (without 0x):',
      viewerWallet.privateKey.substring(2)
    );
    console.log(
      '0xHypr KEY-DEBUG',
      'Viewer public key:',
      viewerWallet.publicKey
    );

    const token = randomBytes(16).toString('hex');
    console.log('Generated viewer token:', token);

    // Get the network from currency config
    const network = data.currency.network === 'mainnet' ? 'mainnet' : 'xdai';

    // Create providers
    const cipherProvider = new EthereumPrivateKeyCipherProvider({
      key: wallet.privateKey,
      method: Types.Encryption.METHOD.ECIES,
    });

    const signatureProvider = new EthereumPrivateKeySignatureProvider({
      privateKey: wallet.privateKey,
      method: Types.Signature.METHOD.ECDSA,
    });

    // Create request client
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: NETWORK_GATEWAYS[network],
      },
      cipherProvider,
      signatureProvider,
    });

    // Set up encryption parameters
    console.log(
      '0xHypr KEY-DEBUG',
      '--- Creating encrypted request with keys:'
    );
    console.log('0xHypr KEY-DEBUG', 'Creator wallet address:', wallet.address);
    console.log('0xHypr KEY-DEBUG', 'Creator private key:', wallet.privateKey);
    console.log('0xHypr KEY-DEBUG', 'Creator public key:', wallet.publicKey);
    console.log(
      '0xHypr KEY-DEBUG',
      'Viewer wallet address:',
      viewerWallet.address
    );
    console.log(
      '0xHypr KEY-DEBUG',
      'Viewer private key:',
      viewerWallet.privateKey
    );
    console.log(
      '0xHypr KEY-DEBUG',
      'Viewer public key:',
      viewerWallet.publicKey
    );
    console.log('0xHypr KEY-DEBUG', 'Viewer token:', token);

    const payeeEncryptionPublicKey = {
      method: Types.Encryption.METHOD.ECIES,
      key: wallet.publicKey,
    };

    const payerEncryptionPublicKey = {
      method: Types.Encryption.METHOD.ECIES,
      key: ephemeralKey.publicKey,
    };

    const encryptionParams = [payeeEncryptionPublicKey, payerEncryptionPublicKey];

    // Prepare request creation parameters based on currency type
    const requestCreateParameters: Types.ICreateRequestParameters = {
      requestInfo: {
        currency: {
          type: Types.RequestLogic.CURRENCY.ERC20,
          // only EURe
          value: '0xcB444e90D8198415266c6a2724b7900fb12FC56E',
          network: 'xdai',
        },
        expectedAmount: data.expectedAmount,
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: wallet.address,
        },
        timestamp: Utils.getCurrentTimestampInSecond(),
      },
      paymentNetwork: {
        id: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentAddress: data.paymentNetwork.parameters.paymentAddress,
          paymentNetworkName: data.currency.network,
          feeAddress: '0x0000000000000000000000000000000000000000',
          feeAmount: '0',
        },
      },
      // data.currency.type === RequestLogicTypes.CURRENCY.ISO4217
      //    {
      //       id: ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY,
      //       parameters: {
      //         paymentAddress: data.paymentNetwork.parameters.paymentAddress,
      //         acceptedTokens: [
      //           '0xcB444e90D8198415266c6a2724b7900fb12FC56E', // wxDAI
      //         ],
      //         paymentNetworkName: 'xdai',
      //         network: 'xdai',
      //         maxRateTimespan: 1800, // 30 minutes
      //       },
      //     }
      contentData: data.contentData,
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: wallet.address,
      },
      topics: [wallet.address],
    };

    console.log(
      'Final request data:',
      JSON.stringify(
        {
          requestInfo: requestCreateParameters.requestInfo,
          signer: requestCreateParameters.signer,
          paymentNetwork: requestCreateParameters.paymentNetwork,
        },
        null,
        2
      )
    );

    // Create the request
    const request = await requestClient._createEncryptedRequest(
      requestCreateParameters,
      encryptionParams
    );

    // Wait for confirmation
    await request.waitForConfirmation();

    console.log('Request created:', request.requestId);

    return {
      requestId: request.requestId,
      token,
      success: true,
    };
  } catch (error) {
    console.error('Error creating invoice request:', error);
    throw error;
  }
}

/**
 * Create a basic client for reading requests
 */
export const requestClient = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: 'https://xdai.gateway.request.network/',
  },
});

export default requestClient;
