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

  const formatAmount = (amount: string | RequestLogicTypes.Amount, decimals?: number) => {
    if (!amount) return '0';
    
    // Use provided decimals or default to 2 (for fiat)
    const d = decimals ?? 2; 
    
    // Ensure amount is BigInt
    const value = BigInt(amount.toString());
    
    // Helper for BigInt power
    const pow = (base: bigint, exp: bigint): bigint => {
        let res = BigInt(1);
        while (exp > BigInt(0)) {
            if (exp % BigInt(2) === BigInt(1)) res *= base;
            base *= base;
            exp /= BigInt(2);
        }
        return res;
    };
    const divisor = pow(BigInt(10), BigInt(d));
    const beforeDecimal = value / divisor;
    const afterDecimal = value % divisor;
    
    // Pad the decimal part with leading zeros if necessary
    const decimalString = afterDecimal.toString().padStart(d, '0');
    
    return `${beforeDecimal}.${decimalString}`;
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

        // Removed exchange rate logic
        setExchangeRate(null);
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

  // Determine currency symbol and decimals
  const currencyInfo = requestData.currencyInfo;
  let currencySymbol = '';
  let currencyDecimals = 2; // Default for fiat

  if (currencyInfo.type === RequestLogicTypes.CURRENCY.ISO4217) {
    currencySymbol = currencyInfo.value; // EUR, USD, GBP
    currencyDecimals = 2;
  } else if (currencyInfo.type === RequestLogicTypes.CURRENCY.ERC20 && currencyInfo.value === '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913') { // Base USDC
    currencySymbol = 'USDC';
    currencyDecimals = 6;
  } else if (currencyInfo.type === RequestLogicTypes.CURRENCY.ETH && currencyInfo.network === 'base') { // Base ETH
    currencySymbol = 'ETH';
    currencyDecimals = 18;
  }

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
              onPaymentComplete={() => window.location.reload()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { InvoiceContainer as InvoiceDetails };
