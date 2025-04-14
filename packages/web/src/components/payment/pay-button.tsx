'use client';
import React, { useState, useEffect } from 'react';
import { RequestNetwork } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { Types } from '@requestnetwork/request-client.js';
import { providers, Wallet } from 'ethers';
import {
  payRequest,
  hasSufficientFunds,
  hasErc20Approval,
  approveErc20,
} from '@requestnetwork/payment-processor';
import { RequestLogicTypes } from '@requestnetwork/types';

// Add ethereum type to window
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Local formatter to avoid viem dependency if needed
const formatAmountLocal = (amount: string | bigint, decimals: number): string => {
  const value = BigInt(amount.toString());
  const pow = (base: bigint, exp: bigint): bigint => {
    let res = BigInt(1);
    while (exp > BigInt(0)) {
      if (exp % BigInt(2) === BigInt(1)) res *= base;
      base *= base;
      exp /= BigInt(2);
    }
    return res;
  };
  const divisor = pow(BigInt(10), BigInt(decimals));
  const beforeDecimal = value / divisor;
  const afterDecimal = value % divisor;
  const decimalString = afterDecimal.toString().padStart(decimals, '0');
  return `${beforeDecimal}.${decimalString}`;
};

// Helper function to reliably get decimals
const getCurrencyDecimals = (currencyInfo: RequestLogicTypes.ICurrency | undefined | null): number => {
  if (!currencyInfo) return 2; // Default if no info

  if (currencyInfo.type === RequestLogicTypes.CURRENCY.ISO4217) {
    return 2;
  } else if (currencyInfo.type === RequestLogicTypes.CURRENCY.ERC20) {
    return (currencyInfo as any)?.decimals || 6; // Default ERC20 to 6 if decimals missing
  } else if (currencyInfo.type === RequestLogicTypes.CURRENCY.ETH) {
    return (currencyInfo as any)?.decimals || 18; // Default ETH to 18 if decimals missing
  }

  return 2; // Fallback default
};

interface PayButtonProps {
  requestId: string;
  decryptionKey: string;
  amount: string;
  currency: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  usingDatabaseFallback?: boolean;
}

export function PayButton({
  requestId,
  decryptionKey,
  amount,
  currency,
  onSuccess,
  onError,
  usingDatabaseFallback = false,
}: PayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<Types.IRequestData | null>(null);
  
  // Fetch request data on component mount
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        setIsLoading(true);
        
        if (!requestId || !decryptionKey) {
          throw new Error('Missing request information');
        }
        
        // Clean the key - remove any leading/trailing whitespace or "0x" prefix if present
        let cleanKey = decryptionKey.trim();
        if (cleanKey.startsWith('0x')) {
          cleanKey = cleanKey.substring(2);
        }
        
        // Create a cipher provider with the decryption key
        const cipherProvider = new EthereumPrivateKeyCipherProvider({
          key: cleanKey, 
          method: Types.Encryption.METHOD.ECIES,
        });
        
        // Create request client 
        const requestClient = new RequestNetwork({
          nodeConnectionConfig: {
            baseURL: 'https://xdai.gateway.request.network/',
          },
          cipherProvider,
        });
        
        // Get the request data
        const request = await requestClient.fromRequestId(requestId);
        const data = request.getData();
        console.log('0xHypr PAYMENT', 'Fetched request data:', data);
        
        setRequestData(data);
        setError(null);
      } catch (err) {
        console.error('0xHypr PAYMENT', 'Error fetching request data:', err);
        // Don't set error here as the UI already shows a fallback
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only try to fetch request data if not using database fallback
    if (!usingDatabaseFallback) {
      fetchRequestData();
    }
  }, [requestId, decryptionKey, usingDatabaseFallback]);
  
  const handlePayment = async () => {
    try {
      console.log('0xHypr', 'handlePayment');
      setIsLoading(true);
      setError(null);

      if (!requestData || !requestData.currencyInfo || !requestData.expectedAmount) {
        throw new Error('Payment data not loaded yet. Please try again.');
      }
      
      // Ensure expected amount is valid (re-check here as well)
      if (BigInt(requestData.expectedAmount.toString()) <= BigInt(0)) {
        throw new Error('Invalid or zero amount specified in the invoice request.');
      }

      // Validate the request data
      console.log('0xHypr PAYMENT', 'Full request data:', JSON.stringify(requestData, null, 2));
      
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to make payments');
      }

      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Verify we're on the required network (Base for ETH/USDC)
      const network = await provider.getNetwork();
      if (network.chainId !== requiredChainId) {
        // Determine network name for error message
        const requiredNetworkName = requiredChainId === 8453 ? 'Base Mainnet' : `Chain ID ${requiredChainId}`;
        throw new Error(`Please switch to ${requiredNetworkName} in your wallet to pay with ${displaySymbol}.`);
      }

      console.log('0xHypr', 'address', address);
      const hasFunds = await hasSufficientFunds({
        request: requestData,
        address,
        providerOptions: { provider },
      });

      if (!hasFunds) {
        throw new Error(`Insufficient ${displaySymbol} balance`);
      }
      console.log('0xHypr', 'hasFunds', hasFunds);

      // Approval needed only for ERC20 tokens
      if (requestData.currencyInfo && requestData.currencyInfo.type === RequestLogicTypes.CURRENCY.ERC20) {
        const hasApproval = await hasErc20Approval(
          requestData,
          address,
          provider
        );

        console.log('0xHypr', 'hasApproval', hasApproval);
        console.log('0xHypr', 'requestData', requestData);
        if (!hasApproval) {
          const approvalTx = await approveErc20(requestData, signer);
          await approvalTx.wait(2);
        }
      }

      console.log('0xHypr', 'payRequest');
      const paymentTx = await payRequest(requestData, signer);
      await paymentTx.wait(2);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.log('0xHypr', 'err', err);
      const error = err instanceof Error ? err : new Error('Payment failed');
      setError(error.message);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Use handlePayment to check for requiredChainId and displaySymbol
  const checkAndHandlePayment = async () => {
    if (!requestData) {
      setError('Payment details not loaded yet.');
      return;
    }
    // Check if the wallet is on the correct network before proceeding
    if (window.ethereum) {
        const provider = new providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== requiredChainId) {
            const requiredNetworkName = requiredChainId === 8453 ? 'Base Mainnet' : `Chain ID ${requiredChainId}`;
            setError(`Please switch to ${requiredNetworkName} in your wallet to pay with ${displaySymbol}.`);
            // Optionally, you could try to trigger a network switch request here
            return; 
        }
    }
    // Now call the original handlePayment
    handlePayment();
  }

  // --- START: Calculate button text and formatted amount here --- 
  let buttonText = 'Loading payment details...';
  let isDisabled = true;
  let displayAmount = amount || '0.00'; // Default to prop amount
  let displaySymbol = currency || ''; // Default to prop currency
  let requiredChainId = 1; // Re-add default

  if (isLoading) {
    buttonText = 'Processing...';
    isDisabled = true;
  } else if (requestData) {
    // Use fetched data if available
    const fetchedCurrencyInfo = requestData.currencyInfo;
    const fetchedExpectedAmount = requestData.expectedAmount;
    // Use the helper function here
    const decimals = getCurrencyDecimals(fetchedCurrencyInfo);

    if (fetchedCurrencyInfo) {
      if (fetchedCurrencyInfo.type === RequestLogicTypes.CURRENCY.ISO4217) {
        displaySymbol = fetchedCurrencyInfo.value;
        // decimals already set by helper
        requiredChainId = 1; 
      } else if (fetchedCurrencyInfo.type === RequestLogicTypes.CURRENCY.ERC20) {
        displaySymbol = (fetchedCurrencyInfo as any)?.symbol || displaySymbol; 
        // decimals already set by helper
        // Determine chain ID based on network
        if (fetchedCurrencyInfo.network === 'base') {
          requiredChainId = 8453;
        } else if (fetchedCurrencyInfo.network === 'mainnet') {
          requiredChainId = 1;
        } // Add more networks as needed
        else {
           requiredChainId = 1; // Default fallback
        }
      } else if (fetchedCurrencyInfo.type === RequestLogicTypes.CURRENCY.ETH) {
         displaySymbol = (fetchedCurrencyInfo as any)?.symbol || 'ETH'; 
         // decimals already set by helper
         // Determine chain ID based on network
         if (fetchedCurrencyInfo.network === 'base') {
           requiredChainId = 8453;
         } else if (fetchedCurrencyInfo.network === 'mainnet') {
           requiredChainId = 1;
         } // Add more networks as needed
         else {
            requiredChainId = 1; // Default fallback
         }
      }
    }

    // Format the amount *after* determining decimals
    if (fetchedExpectedAmount) {
      // Use the decimals from the helper function
      console.log('0xHypr PAY_FORMAT', 'Formatting Amount:', fetchedExpectedAmount.toString(), 'Decimals:', decimals);
      displayAmount = formatAmountLocal(fetchedExpectedAmount.toString(), decimals);
    } else {
      // Fallback if expectedAmount is somehow missing from fetched data
      // Use decimals from helper, even for prop amount fallback
      displayAmount = formatAmountLocal(amount || '0', decimals); 
    }

    buttonText = `Pay ${displayAmount} ${displaySymbol}`;
    isDisabled = false;
  } else if (usingDatabaseFallback) {
    // If RN fetch failed but we have DB fallback, use prop amount/currency
    const fallbackDecimals = getCurrencyDecimals(undefined); // Use default for fallback
    displayAmount = formatAmountLocal(amount || '0', fallbackDecimals); 
    displaySymbol = currency || '';
    buttonText = `Pay ${displayAmount} ${displaySymbol}`; 
    isDisabled = false; // Allow attempting payment, handlePayment will check requestData
  } else {
     // Still loading or error during fetch and no fallback
     buttonText = 'Loading payment details...';
     isDisabled = true;
  }
  // --- END: Calculate button text and formatted amount here ---

  return (
    <div className="mt-8">
      <button
        onClick={checkAndHandlePayment}
        disabled={isDisabled}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${
          isDisabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {buttonText}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
} 