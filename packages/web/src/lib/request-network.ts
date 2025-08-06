import { RequestNetwork } from '@requestnetwork/request-client.js';
import { Types } from '@requestnetwork/request-client.js';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { ethers } from 'ethers';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { randomBytes } from 'crypto';

export interface InvoiceRequestData {
  currency: {
    type: RequestLogicTypes.CURRENCY;
    value: string;
    network: 'xdai' | 'mainnet';
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID;
    decimals?: number;
  };
  expectedAmount: string;
  paymentAddress: string;
  // contentData: {
  //   meta: {
  //     format: string;
  //     version: string;
  //   };
  //   creationDate: string;
  //   invoiceNumber: string;
  //   sellerInfo: {
  //     businessName: string;
  //     email: string;
  //     address?: {
  //       'street-address'?: string;
  //       locality?: string;
  //       region?: string;
  //       'postal-code'?: string;
  //       'country-name'?: string;
  //     };
  //     miscellaneous?: Record<string, any>;
  //   };
  //   buyerInfo?: {
  //     businessName?: string;
  //     email: string;
  //     firstName?: string;
  //     lastName?: string;
  //     address?: {
  //       'street-address'?: string;
  //       locality?: string;
  //       region?: string;
  //       'postal-code'?: string;
  //       'country-name'?: string;
  //     };
  //     miscellaneous?: Record<string, any>;
  //   };
  //   invoiceItems: Array<{
  //     name: string;
  //     quantity: number;
  //     unitPrice: string;
  //     currency: string;
  //     tax: {
  //       type: 'percentage';
  //       amount: string;
  //     };
  //     reference?: string;
  //     deliveryDate?: string;
  //     deliveryPeriod?: string;
  //   }>;
  //   paymentTerms?: {
  //     dueDate?: string;
  //     lateFeesPercent?: number;
  //     lateFeesFix?: string;
  //   };
  //   note?: string;
  //   terms?: string;
  // };
  paymentNetwork: {
    id: ExtensionTypes.PAYMENT_NETWORK_ID;
    parameters: {
      paymentNetworkName?: string;
      paymentAddress?: string;
      paymentInstruction?: string;
    };
  };
}

/**
 * Create a simple invoice with the Request Network
 * @param data The invoice data. IMPORTANT: `contentData.invoiceItems.unitPrice` MUST be a string representing the value in the smallest unit (e.g., cents, wei).
 * @param payeeAddress The Ethereum address to set as the payee for the request (e.g., user's Safe address)
 * @param userWallet Optional user wallet - if provided, will use this instead of generating a random one
 */
export async function createInvoiceRequest(
  data: InvoiceRequestData,
  payeeAddress: string,
  userWallet?: { address: string, privateKey: string, publicKey: string }
) {
  try {
    // Log request data
    console.log('Creating invoice with data:', JSON.stringify(data, null, 2));

    // Use provided wallet or generate a random one
    const wallet = userWallet 
      ? new ethers.Wallet(userWallet.privateKey) 
      : ethers.Wallet.createRandom();
    
    // Debug wallet creation
    console.log('0xHypr DEBUG - Invoice creation wallet:', {
      address: wallet.address,
      usingProvidedWallet: !!userWallet,
      publicKey: wallet.publicKey.substring(0, 20) + '...',
      hasProvider: !!wallet.provider,
    });
    
    console.log('Using wallet:', wallet.address);

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
        baseURL: network === 'mainnet' 
          ? 'https://mainnet.gateway.request.network/' 
          : 'https://xdai.gateway.request.network/',
      },
      cipherProvider,
      signatureProvider,
    });

    // Now only using the main wallet's key for potential encryption
    const encryptionParams = [{
      method: Types.Encryption.METHOD.ECIES,
      key: wallet.publicKey,
    }];

    // Log the request parameters for debugging
    console.log('0xHypr DEBUG - Request creation parameters:', {
      currencyType: Types.RequestLogic.CURRENCY.ERC20,
      network: network,
      payeeType: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      payeeValue: payeeAddress,
      timestamp: Math.floor(Date.now() / 1000),
    });
    
    // Create request parameters
    const requestParameters: Types.ICreateRequestParameters = {
      requestInfo: {
        currency: {
          type: data.currency.type,
          value: data.currency.value,
          ...(data.currency.decimals && { decimals: data.currency.decimals }),
          ...(data.currency.network && { network: data.currency.network }),
        },
        expectedAmount: data.expectedAmount,
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: wallet.address,
        },
      },
      paymentNetwork: data.paymentNetwork.id === ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE
        ? {
            id: data.paymentNetwork.id,
            parameters: {
              paymentInstruction: data.paymentNetwork.parameters.paymentInstruction,
            } as any,
          }
        : {
            id: data.paymentNetwork.id,
            parameters: {
              paymentAddress: data.paymentNetwork.parameters.paymentAddress,
              feeAddress: '0x0000000000000000000000000000000000000000',
              feeAmount: '0',
              network: data.currency.network,
              ...(data.paymentNetwork.parameters.paymentNetworkName && { 
                paymentNetworkName: data.paymentNetwork.parameters.paymentNetworkName 
              }),
            } as any,
          },
      // contentData: data.contentData,
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: wallet.address,
      },
      topics: encryptionParams.map(param => param.key)
    };

    console.log('0xHypr DEBUG - Creating request...', JSON.stringify(requestParameters, null, 2));
    const request = await requestClient.createRequest(requestParameters);

    console.log('0xHypr DEBUG - Waiting for confirmation...');
    const confirmedRequest = await request.waitForConfirmation();
    const requestData = confirmedRequest;

    console.log('0xHypr DEBUG - Request created successfully:', requestData.requestId);
    
    return {
      requestId: requestData.requestId,
    };
  } catch (error) {
    console.error('Error creating Request Network request:', error);
    throw error;
  }
}

/**
 * Create a basic client for reading requests
 */
export const requestClient = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: 'https://gnosis.gateway.request.network/',
  },
});

/**
 * Interface for the user request data returned by getUserRequests
 */
export interface UserRequest {
  request: any;
  requestData: any;
  contentData: any;
  requestId: string;
  creationDate: string;
  description: string;
  client: string;
  amount: string;
  currency: string;
  status: 'paid' | 'pending';
  url: string;
  role: 'seller' | 'buyer';
}

/**
 * Get user requests from the Request Network
 * This function fetches and filters requests based on user's wallet address and email
 * @param userWalletAddress - The ethereum address of the user's wallet
 * @param userEmail - The email address of the user (as fallback for content data)
 * @returns Array of UserRequest objects with metadata about the request
 */
export async function getUserRequests(userWalletAddress: string, userEmail: string): Promise<UserRequest[]> {
  try {
    console.log('0xHypr', 'Fetching requests for wallet:', userWalletAddress, 'and email:', userEmail);
    
    // Try to find requests by the wallet address identity first
    let requests: any[] = [];
    
    // We'll make an attempt to fetch by wallet address only if we have one
    if (userWalletAddress && userWalletAddress.trim() !== '') {
      try {
        // Debug what wallet address we're using
        console.log('0xHypr DEBUG - fromIdentity params:', {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          typeValue: typeof Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: userWalletAddress,
          valueNormalized: userWalletAddress.toLowerCase(),
        });
        
        // Debug what constants are available
        console.log('0xHypr DEBUG - Types constants:', {
          availableTypes: Object.keys(Types.Identity.TYPE),
          ethereumAddressType: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          stringValue: String(Types.Identity.TYPE.ETHEREUM_ADDRESS),
        });
        
        // Fetch requests by the user's Ethereum address identity
        const requestsByAddress = await requestClient.fromIdentity({
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: userWalletAddress,
        });
        
        // Debug the raw response
        console.log('0xHypr DEBUG - Raw requestsByAddress response:', {
          type: typeof requestsByAddress,
          isArray: Array.isArray(requestsByAddress),
          hasRequestsProp: !Array.isArray(requestsByAddress) && typeof requestsByAddress === 'object' ? 'requests' in requestsByAddress : false,
          responseLength: Array.isArray(requestsByAddress) ? requestsByAddress.length : 
                      (requestsByAddress && typeof requestsByAddress === 'object' && 'requests' in requestsByAddress ? 
                        requestsByAddress.requests.length : 'unknown'),
        });
        
        // Handle different return types
        if (Array.isArray(requestsByAddress)) {
          requests = requestsByAddress;
        } else if (requestsByAddress && typeof requestsByAddress === 'object' && 'requests' in requestsByAddress) {
          requests = requestsByAddress.requests;
        }
        
        console.log('0xHypr DEBUG', `Found ${requests.length} requests by wallet address ${userWalletAddress}`);
      } catch (error) {
        console.error('0xHypr DEBUG - Error fetching by wallet address:', error);
        // Log detailed error for debugging
        if (error instanceof Error) {
          console.error('0xHypr DEBUG - Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
        } else {
          console.error('0xHypr DEBUG - Unknown error type:', error);
        }
      }
    } else {
      console.log('0xHypr DEBUG - No wallet address provided, skipping fromIdentity query');
    }
    
    // Always try to fetch all requests as a fallback or if no wallet address was provided
    if (requests.length === 0) {
      console.log('0xHypr', 'Fetching all requests to filter by user data');
      try {
        const allRequests = await requestClient.fromTopic('*');
        
        // Handle the different return types
        if (Array.isArray(allRequests)) {
          requests = allRequests;
        } else if (allRequests && typeof allRequests === 'object' && 'requests' in allRequests) {
          requests = allRequests.requests;
        }
        
        console.log('0xHypr', 'Total requests found in system:', requests.length);
      } catch (error) {
        console.error('0xHypr DEBUG - Error fetching all requests:', error);
      }
    }
    
    // Get request data details and filter by the user's address or email
    const userRequests = await Promise.all(
      requests.map(async (request: any) => {
        try {
          const requestData = request.getData();
          const contentData = requestData.contentData || {};
          
          // Check if the request involves the user's wallet address
          const payeeIdentity = requestData.payee?.value || '';
          const payerIdentity = requestData.payer?.value || '';
          
          const isAddressInvolved = 
            payeeIdentity.toLowerCase() === userWalletAddress.toLowerCase() || 
            payerIdentity.toLowerCase() === userWalletAddress.toLowerCase();
          
          // Fall back to email check in content data if no address match
          const sellerEmail = contentData.sellerInfo?.email;
          const buyerEmail = contentData.buyerInfo?.email;
          const isEmailInvolved = sellerEmail === userEmail || buyerEmail === userEmail;
          
          if (isAddressInvolved || isEmailInvolved) {
            // Log that we found a matching request for debug
            console.log('0xHypr DEBUG - Found matching request:', {
              requestId: requestData.requestId,
              payee: requestData.payee?.value,
              payer: requestData.payer?.value,
              timestamp: requestData.timestamp,
              expectedAmount: requestData.expectedAmount,
              matchedByAddress: isAddressInvolved,
              matchedByEmail: isEmailInvolved,
            });
            
            // Check payment status
            const paymentStatus = await request.getPaymentHistory();
            const isPaid = requestData.state === 'paid' || 
                          paymentStatus.some((p: any) => p.type === 'payment');
            const status: 'paid' | 'pending' = isPaid ? 'paid' : 'pending';
            
            // Format amount for display
            let displayAmount = requestData.expectedAmount || '0';
            try {
              // Convert from wei to decimal
              const amountInEth = ethers.utils.formatUnits(displayAmount, 18);
              displayAmount = parseFloat(amountInEth).toFixed(2);
            } catch (error) {
              console.error('0xHypr', 'Error formatting amount:', error);
            }
            
            // Format currency info
            let currencyDisplay = 'Unknown';
            if (requestData.currency?.type === Types.RequestLogic.CURRENCY.ERC20) {
              // Known ERC20 tokens
              if (requestData.currency.value === '0xcB444e90D8198415266c6a2724b7900fb12FC56E') {
                currencyDisplay = 'EURe';
              } else {
                // Try to extract token symbol from value
                const parts = requestData.currency.value.split('-');
                currencyDisplay = parts.length > 1 ? parts[0] : 'ERC20';
              }
            } else if (requestData.currency?.value) {
              currencyDisplay = requestData.currency.value;
            }
            
            // Determine user role
            // First check by wallet address, then fall back to email
            const isUserSeller = payeeIdentity.toLowerCase() === userWalletAddress.toLowerCase() || 
                              (payeeIdentity === '' && sellerEmail === userEmail);
            const role: 'seller' | 'buyer' = isUserSeller ? 'seller' : 'buyer';
            
            // Get client name based on role
            const clientName = isUserSeller
              ? (contentData.buyerInfo?.businessName || buyerEmail || 'Unknown Client')
              : (contentData.sellerInfo?.businessName || sellerEmail || 'Unknown Seller');
            
            // Get invoice description
            const description = contentData.invoiceItems?.[0]?.name
              || contentData.reason
              || contentData.invoiceNumber
              || 'Invoice';
            
            return {
              request,
              requestData,
              contentData,
              requestId: requestData.requestId,
              creationDate: new Date(requestData.timestamp * 1000).toISOString(),
              description,
              client: clientName,
              amount: displayAmount,
              currency: currencyDisplay,
              status: status,
              url: `/invoice/${requestData.requestId}`,
              role: role,
            };
          }
          
          return null;
        } catch (error) {
          console.error('0xHypr', 'Error processing request:', error);
          return null;
        }
      })
    );
    
    // Filter out null values and return valid requests
    const validUserRequests = userRequests.filter(req => req !== null);
    console.log('0xHypr', `Found ${validUserRequests.length} requests for user ${userEmail}`);
    
    return validUserRequests;
  } catch (error) {
    console.error('Error fetching requests for user:', userWalletAddress, error);
    return [];
  }
}
