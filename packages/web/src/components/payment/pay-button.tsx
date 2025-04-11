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

interface PayButtonProps {
  requestId: string;
  decryptionKey: string;
  amount: string;
  currency: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PayButton({
  requestId,
  decryptionKey,
  amount,
  currency,
  onSuccess,
  onError,
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
    
    fetchRequestData();
  }, [requestId, decryptionKey]);
  
  // Extract currency info and amount when requestData is available
  const currencyInfo = requestData?.currencyInfo;
  const expectedAmount = requestData?.expectedAmount;
  
  let displayCurrencySymbol = currency || '';
  let displayDecimals = 2;
  let requiredChainId = 1; // Default to mainnet for fiat?
  
  if (currencyInfo) {
     if (currencyInfo.type === RequestLogicTypes.CURRENCY.ISO4217) {
       displayCurrencySymbol = currencyInfo.value; // EUR, USD, GBP
       displayDecimals = 2;
       // Fiat payments are declarative, no specific chain needed for payment itself
       // But approval/funds check might still need a provider on a default chain?
       requiredChainId = 1; // Or handle differently?
     } else if (currencyInfo.type === RequestLogicTypes.CURRENCY.ERC20 && currencyInfo.network === 'base') { // Base USDC
       displayCurrencySymbol = 'USDC';
       displayDecimals = 6;
       requiredChainId = 8453; // Base Mainnet Chain ID
     } else if (currencyInfo.type === RequestLogicTypes.CURRENCY.ETH && currencyInfo.network === 'base') { // Base ETH
       displayCurrencySymbol = 'ETH';
       displayDecimals = 18;
       requiredChainId = 8453; // Base Mainnet Chain ID
     }
  }
  
  // Use provided amount if requestData is not available yet
  const formattedDisplayAmount = expectedAmount 
    ? formatAmountLocal(expectedAmount.toString(), displayDecimals) 
    : amount || '0.00';

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
        throw new Error(`Please switch to ${requiredNetworkName} in your wallet to make this payment.`);
      }

      console.log('0xHypr', 'address', address);
      const hasFunds = await hasSufficientFunds({
        request: requestData,
        address,
        providerOptions: { provider },
      });

      if (!hasFunds) {
        throw new Error(`Insufficient ${displayCurrencySymbol} balance`);
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

  return (
    <div className="mt-8">
      <button
        onClick={handlePayment}
        disabled={isLoading || !requestData}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${
          isLoading || !requestData ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading
          ? 'Processing...'
          : !requestData
            ? 'Loading payment details...'
            : `Pay ${formattedDisplayAmount} ${displayCurrencySymbol}`}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
} 