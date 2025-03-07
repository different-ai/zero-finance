'use client';
import React, { useState, useEffect } from 'react';
import { RequestNetwork } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { Types } from '@requestnetwork/request-client.js';
import { providers, ethers } from 'ethers';
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

interface PayButtonProps {
  requestId: string;
  decryptionKey: string;
  amount?: string;
  currency?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const formatAmount = (amount: string | RequestLogicTypes.Amount) => {
  if (!amount) return '0';

  let value: bigint;
  if (typeof amount === 'string') {
    value = BigInt(amount);
  } else {
    value = BigInt(amount.toString());
  }

  const baseAmount = Number(value) / 1e18;
  return baseAmount.toFixed(2);
};

export function PayButton({
  requestId,
  decryptionKey,
  amount = '0',
  currency = 'EURe',
  onSuccess,
  onError,
}: PayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<Types.IRequestData | null>(null);
  
  // Always use EURe as the currency symbol
  const displayCurrency = 'EURe';

  // Fetch request data on mount
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        console.log('0xHypr FETCH', 'Fetching request data for payment');
        
        // Clean the key
        let cleanKey = decryptionKey.trim();
        if (cleanKey.startsWith('0x')) {
          cleanKey = cleanKey.substring(2);
        }
        
        // Create wallet from key
        const wallet = new ethers.Wallet(`0x${cleanKey}`);
        
        // Create cipher provider
        const cipherProvider = new EthereumPrivateKeyCipherProvider({
          key: `0x${cleanKey}`,
          method: Types.Encryption.METHOD.ECIES,
        });
        
        // Create a request client with the cipher provider
        const requestClient = new RequestNetwork({
          nodeConnectionConfig: {
            baseURL: 'https://xdai.gateway.request.network/',
          },
          cipherProvider,
        });
        
        // Get the request
        const request = await requestClient.fromRequestId(requestId);
        let data = request.getData();
        console.log('0xHypr FETCH', 'Request data fetched successfully', data);
        
        // If we have an expected amount, convert it from wei (or cents) to a more reasonable display format
        if (data && data.expectedAmount) {
          // Log the original expected amount
          console.log('0xHypr FETCH', 'Original expected amount:', data.expectedAmount);
          
          // Ensure the expected amount is positive
          if (Number(data.expectedAmount) <= 0) {
            console.warn('0xHypr FETCH', 'Expected amount is not positive, fixing it');
            // Create a fixed copy of data with a positive amount
            data = {
              ...data,
              expectedAmount: '100' // Set to minimum of 1 EUR (100 cents)
            };
          }
          
          // Convert to a displayable amount in euros (from cents)
          const displayAmount = (Number(data.expectedAmount) / 100).toFixed(2);
          console.log('0xHypr FETCH', 'Display amount:', displayAmount);
        } else if (data) {
          console.warn('0xHypr FETCH', 'No expected amount in data, this will cause payment issues');
          // Assign a default positive amount
          data = {
            ...data,
            expectedAmount: '100' // Set to minimum of 1 EUR (100 cents)
          };
        }
        
        setRequestData(data);
      } catch (err) {
        console.error('0xHypr FETCH', 'Error fetching request data', err);
        setError('Failed to load payment details. Please try again.');
        if (onError) {
          onError(err instanceof Error ? err : new Error('Failed to load payment details'));
        }
      }
    };
    
    if (requestId && decryptionKey) {
      fetchRequest();
    }
  }, [requestId, decryptionKey, onError]);

  const handlePayment = async () => {
    try {
      console.log('0xHypr', 'handlePayment');
      setIsLoading(true);
      setError(null);

      if (!requestData) {
        throw new Error('Payment data not loaded yet. Please try again.');
      }
      
      // Validate the request data
      console.log('0xHypr PAYMENT', 'Full request data:', JSON.stringify(requestData, null, 2));
      
      // Check if expectedAmount is valid, and fix it if it's not
      let expectedAmount = requestData.expectedAmount;
      let newRequestData = requestData;
      if (!expectedAmount || Number(expectedAmount) <= 0) {
        console.error('0xHypr PAYMENT', 'Invalid expected amount:', expectedAmount);
        console.log('0xHypr PAYMENT', 'Setting to default minimum amount of 100 cents');
        // Update the requestData with a valid amount
        expectedAmount = '100';
        newRequestData = {
          ...requestData,
          expectedAmount: expectedAmount
        };
      }
      
      console.log('0xHypr PAYMENT', 'Expected amount:', expectedAmount);
      console.log('0xHypr PAYMENT', 'Expected amount in EUR:', (Number(expectedAmount) / 100).toFixed(2));

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to make payments');
      }

      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Verify we're on Gnosis Chain
      const network = await provider.getNetwork();
      if (network.chainId !== 100) {
        // Gnosis Chain ID
        throw new Error('Please switch to Gnosis Chain to make payments');
      }

      console.log('0xHypr', 'address', address);
      const hasFunds = await hasSufficientFunds({
        request: requestData,
        address,
        providerOptions: { provider },
      });

      if (!hasFunds) {
        throw new Error('Insufficient EURe balance');
      }
      console.log('0xHypr', 'hasFunds', hasFunds);

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
            : `Pay ${amount} ${displayCurrency}`}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
} 