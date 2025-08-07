'use client';

import React, { useState } from 'react';
import { Copy, Check, AlertCircle, CreditCard, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentDetailsDisplayProps {
  paymentMethod: string;
  paymentDetails?: any;
  paymentAddress?: string | null;
  currency?: string;
  cryptoNetwork?: string | null;
  invoiceNumber?: string;
}

export function PaymentDetailsDisplay({
  paymentMethod,
  paymentDetails,
  paymentAddress,
  currency = 'USD',
  cryptoNetwork,
  invoiceNumber,
}: PaymentDetailsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCryptoLogo = (
    currency: string,
    network: string | null | undefined,
  ) => {
    if (currency === 'USDC') {
      return '/logos/_circle-logo.svg';
    } else if (currency === 'ETH') {
      return '/logos/_ethereum-logo.svg';
    }
    return null;
  };

  const getNetworkLogo = (network: string | null | undefined) => {
    if (network === 'solana') {
      return '/logos/_solana-logo-small.svg';
    } else if (network === 'base') {
      // Base logo as inline SVG data URI
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDUyRkYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTIiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==';
    } else if (network === 'ethereum') {
      return '/logos/_ethereum-logo.svg';
    }
    return null;
  };

  const isCrypto = paymentMethod === 'crypto';
  const isFiat =
    paymentMethod === 'ach' ||
    paymentMethod === 'sepa' ||
    paymentMethod === 'fiat';

  // Don't show anything if there's no payment information at all
  if (!paymentAddress && !paymentDetails && !isCrypto && !isFiat) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">
          No payment details available for this invoice.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCrypto ? (
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wallet className="h-5 w-5 text-purple-600" />
              </div>
            ) : (
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">
                Payment Information
              </h3>
              <p className="text-sm text-gray-600">
                {isCrypto ? 'Cryptocurrency Payment' : 'Bank Transfer Details'}
              </p>
            </div>
          </div>
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              isCrypto
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700',
            )}
          >
            {isCrypto
              ? 'On-chain'
              : paymentMethod === 'ach'
                ? 'ACH Transfer'
                : paymentMethod === 'sepa'
                  ? 'SEPA Transfer'
                  : 'Bank Transfer'}
          </span>
        </div>
        {/* Optional QR toggle */}
      </div>
      {/* Content */}
      <div className="p-6">
        {isCrypto ? (
          <div className="space-y-4">
            {/* Network and Currency */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  {getCryptoLogo(currency, cryptoNetwork) && (
                    <img
                      src={getCryptoLogo(currency, cryptoNetwork)!}
                      alt={currency}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Currency
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {currency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  {getNetworkLogo(cryptoNetwork) && (
                    <img
                      src={getNetworkLogo(cryptoNetwork)!}
                      alt={cryptoNetwork || 'Network'}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Network
                    </p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {cryptoNetwork || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Wallet Address */}
            {paymentAddress &&
            paymentAddress !== 'Payment address not provided' ? (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Receiving Address
                  </label>
                  <button
                    onClick={() => handleCopy(paymentAddress)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300',
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy Address
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-white rounded-md p-4 border border-purple-100 min-h-[64px] space-y-2">
                  <code className="text-sm font-mono text-gray-800 break-all block">
                    {paymentAddress}
                  </code>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    No wallet address provided. Please contact the sender for
                    payment details.
                  </p>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900">
                    Important
                  </p>
                  <p className="text-xs text-amber-800">
                    Please ensure you're sending <strong>{currency}</strong> on
                    the <strong>{cryptoNetwork}</strong> network. Sending funds
                    on the wrong network may result in permanent loss.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isFiat && paymentDetails ? (
          <div className="space-y-4">
            {/* Bank Details Grid */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentDetails.accountHolder && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Account Holder
                    </p>
                    <p className="font-medium text-gray-900">
                      {paymentDetails.accountHolder}
                    </p>
                  </div>
                )}
                {paymentDetails.bankName && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Bank Name
                    </p>
                    <p className="font-medium text-gray-900">
                      {paymentDetails.bankName}
                    </p>
                  </div>
                )}
                {paymentDetails.accountNumber && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Account Number
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-gray-900">
                        {paymentDetails.accountNumber}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentDetails.accountNumber)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
                {paymentDetails.routingNumber && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Routing Number
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-gray-900">
                        {paymentDetails.routingNumber}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentDetails.routingNumber)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
                {paymentDetails.iban && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      IBAN
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-gray-900">
                        {paymentDetails.iban}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentDetails.iban)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
                {paymentDetails.bic && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      BIC/SWIFT
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-gray-900">
                        {paymentDetails.bic}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentDetails.bic)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {paymentDetails.bankAddress && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Bank Address
                  </p>
                  <p className="text-gray-900">{paymentDetails.bankAddress}</p>
                </div>
              )}
            </div>

            {/* Payment Reference */}
            {invoiceNumber && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Payment Reference
                    </p>
                    <p className="text-xs text-blue-800 mt-1">
                      Please include invoice number{' '}
                      <strong>#{invoiceNumber}</strong> in your payment
                      reference.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
