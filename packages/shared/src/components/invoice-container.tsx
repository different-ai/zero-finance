'use client';
import React, { useState, useEffect } from 'react';
import { Types } from '@requestnetwork/request-client.js';
import { getRequestClient } from '../lib/request-network';
import { InvoiceDetailsView } from './invoice-details';
import { PayButton } from './pay-button';
import { RequestLogicTypes } from '@requestnetwork/types';

interface InvoiceContainerProps {
  requestId: string;
  decryptionKey: string;
  onClose?: () => void;
}

export function InvoiceContainer({
  requestId,
  decryptionKey,
  onClose,
}: InvoiceContainerProps) {
  console.log('0xHypr', 'InvoiceContainer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<Types.IRequestData | null>(
    null
  );
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        if (!decryptionKey) {
          throw new Error('No decryption key available');
        }

        // Initialize request client with the private key
        const requestClient = await getRequestClient(decryptionKey);
        const request = await requestClient.fromRequestId(requestId);
        const data = request.getData();
        console.log('0xHypr', 'requestData', data);
        setRequestData(data);

        // Fetch exchange rate if denominated currency is different from payment currency
        if (data.contentData?.currency !== 'EUR') {
          // TODO: Implement exchange rate fetching
          // For now using a mock rate
          setExchangeRate(1.1); // 1 EUR = 1.1 USD
        }
      } catch (err) {
        console.error('Error fetching request:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invoice');
      }
    };

    fetchRequestData();
  }, [requestId, decryptionKey]);

  if (!requestData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{error || 'Loading invoice...'}</p>
        </div>
      </div>
    );
  }

  const balance = requestData.balance?.balance;
  const expectedAmount = requestData.expectedAmount;
  const isPaid = balance
    ? BigInt(balance.toString() || '0') >=
      BigInt(expectedAmount?.toString() || '0')
    : false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <InvoiceDetailsView
          requestData={requestData}
          exchangeRate={exchangeRate}
          onClose={onClose}
        />
        {!isPaid && (
          <div className="max-w-4xl mx-auto">
            <PayButton
              requestData={requestData}
              expectedAmount={expectedAmount.toString()}
              currencySymbol="€"
              formatAmount={formatAmount}
              onPaymentComplete={() => window.location.reload()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { InvoiceContainer as InvoiceDetails };
