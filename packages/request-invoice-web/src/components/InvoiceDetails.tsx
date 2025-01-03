'use client';

import React, { useState } from 'react';
import { Types } from '@requestnetwork/request-client.js';
import { RequestLogicTypes } from '@requestnetwork/types';
// Import required dependencies
import { providers } from 'ethers';
import { 
  payRequest,
  hasSufficientFunds,
  hasErc20Approval,
  approveErc20
} from '@requestnetwork/payment-processor';

interface InvoiceDetailsProps {
  requestData: Types.IRequestData;
  requestId: string;
}

export default function InvoiceDetails({ requestData, requestId }: InvoiceDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Connect to wallet
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to make payments');
      }

      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Check funds
      const hasFunds = await hasSufficientFunds({
        request: requestData,
        address,
        providerOptions: {
          provider
        }
      });

      if (!hasFunds) {
        throw new Error('Insufficient funds');
      }

      // Check and handle ERC20 approval if needed
      const hasApproval = await hasErc20Approval(
        requestData,
        address,
        provider
      );

      if (!hasApproval) {
        const approvalTx = await approveErc20(
          requestData,
          signer
        );
        await approvalTx.wait(2);
      }

      // Process payment
      const paymentTx = await payRequest(
        requestData,
        signer
      );
      await paymentTx.wait(2);

      // Refresh page after payment
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: RequestLogicTypes.Amount) => {
    if (!amount) return '0';
    // Convert amount to string and handle decimals
    return (BigInt(amount.toString()) / BigInt(1e18)).toString();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Invoice Details</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Request ID</h2>
          <p className="text-gray-600">{requestId}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Amount</h2>
          <p className="text-gray-600">
            {formatAmount(requestData.expectedAmount)} {requestData.currencyInfo?.type || 'Unknown'}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Status</h2>
          <p className="text-gray-600">
            {BigInt(requestData.balance?.balance?.toString() || '0') >= BigInt(requestData.expectedAmount?.toString() || '0')
              ? 'Paid'
              : 'Pending'}
          </p>
        </div>

        {requestData.contentData && (
          <div>
            <h2 className="text-lg font-semibold">Details</h2>
            <pre className="text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(requestData.contentData, null, 2)}
            </pre>
          </div>
        )}


        {Number(requestData.balance?.balance || '0') < Number(requestData.expectedAmount) && (
          <div className="mt-8">
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : 'Pay Invoice'}
            </button>
            {error && (
              <p className="mt-2 text-red-600 text-sm">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
