'use client';
import React, { useState } from 'react';
import { Types } from '@requestnetwork/request-client.js';
import { providers } from 'ethers';
import {
  payRequest,
  hasSufficientFunds,
  hasErc20Approval,
  approveErc20,
} from '@requestnetwork/payment-processor';

// Add ethereum type to window
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface PayButtonProps {
  requestData: Types.IRequestData;
  expectedAmount: string;
  currencySymbol: string;
  formatAmount: (amount: string) => string;
  onPaymentComplete?: () => void;
}

export function PayButton({
  requestData,
  expectedAmount,
  currencySymbol,
  formatAmount,
  onPaymentComplete,
}: PayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      console.log('0xHypr', 'handlePayment');
      setIsLoading(true);
      setError(null);

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

      onPaymentComplete?.();
    } catch (err) {
      console.log('0xHypr', 'err', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${
          isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading
          ? 'Processing...'
          : `Pay ${currencySymbol}${formatAmount(expectedAmount)} EURe`}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
} 