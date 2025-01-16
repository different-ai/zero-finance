'use client';
import React, { useState, useEffect } from 'react';
import { Types } from '@requestnetwork/request-client.js';
import { RequestLogicTypes } from '@requestnetwork/types';
import { providers } from 'ethers';
import {
  payRequest,
  hasSufficientFunds,
  hasErc20Approval,
  approveErc20,
} from '@requestnetwork/payment-processor';
import { getRequestClient } from '../lib/request-network';

// Add ethereum type to window
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Currency configuration
const PAYMENT_CURRENCY = {
  type: 'ERC20',
  value: '0x420CA0f9B9b604cE0fd9C18EF134C705e5Fa3430', // EURe on Gnosis Chain
  network: 'gnosis',
};

const CURRENCY_SYMBOLS = {
  EUR: '€',
};

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: string;
  currency: string;
  tax?: {
    type: 'percentage' | 'fixed';
    amount: string;
  };
  reference?: string;
  deliveryDate?: string;
  deliveryPeriod?: string;
}

interface InvoiceDetailsContainerProps {
  requestId: string;
  decryptionKey: string;
  onClose?: () => void;
}

export function InvoiceDetailsContainer({
  requestId,
  decryptionKey,
  onClose,
}: InvoiceDetailsContainerProps) {
  console.log('0xHypr', 'InvoiceDetailsContainer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<Types.IRequestData | null>(
    null
  );
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

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

  return (
    <InvoiceDetailsView
      requestData={requestData}
      exchangeRate={exchangeRate}
      onClose={onClose}
    />
  );
}

interface InvoiceDetailsProps {
  requestData: Types.IRequestData;
  exchangeRate: number | null;
  onClose?: () => void;
}

function InvoiceDetailsView({
  requestData,
  exchangeRate,
  onClose,
}: InvoiceDetailsProps) {
  console.log('0xHypr', 'InvoiceDetails');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

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

      window.location.reload();
    } catch (err) {
      console.log('0xHypr', 'err', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

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

  const getInvoiceData = () => {
    if (requestData.contentData) {
      return requestData.contentData;
    }

    const contentDataExt = requestData.extensions?.['content-data'];
    if (contentDataExt?.values?.content) {
      return contentDataExt.values.content;
    }

    const contentDataExtData = requestData.extensionsData?.find(
      (ext) => ext.id === 'content-data'
    );
    if (contentDataExtData?.parameters?.content) {
      return contentDataExtData.parameters.content;
    }

    return null;
  };

  const invoice = getInvoiceData();
  const balance = requestData.balance?.balance;
  const expectedAmount = requestData.expectedAmount;

  const isPaid = balance
    ? BigInt(balance.toString() || '0') >=
      BigInt(expectedAmount?.toString() || '0')
    : false;

  const getDenominatedCurrency = () => {
    return 'EUR';
  };

  const getPaymentCurrency = () => {
    return 'EUR'; // Always EURe for payments
  };

  const getCurrencySymbol = (currency: string) => {
    return (
      CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || currency
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold">
            Invoice #{invoice?.invoiceNumber}
          </h2>
          <p className="text-gray-600">
            Created on {new Date(invoice?.creationDate).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            {getCurrencySymbol(getDenominatedCurrency())}
            {formatAmount(expectedAmount)}
          </div>
          <div className="text-sm text-gray-600">
            {isPaid ? 'Paid' : 'Pending Payment'}
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">From</h3>
          <div className="text-gray-600 space-y-2">
            {/* Business Details */}
            <div>
              {invoice?.sellerInfo?.businessName && (
                <p className="font-medium text-lg">
                  {invoice.sellerInfo.businessName}
                </p>
              )}
              {(invoice?.sellerInfo?.firstName ||
                invoice?.sellerInfo?.lastName) && (
                <p>
                  Contact:{' '}
                  {[invoice.sellerInfo.firstName, invoice.sellerInfo.lastName]
                    .filter(Boolean)
                    .join(' ')}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div>
              {invoice?.sellerInfo?.email && (
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">Email:</span>
                  <span>{invoice.sellerInfo.email}</span>
                </p>
              )}
              {invoice?.sellerInfo?.phone && (
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">Phone:</span>
                  <span>{invoice.sellerInfo.phone}</span>
                </p>
              )}
            </div>

            {/* Registration Numbers */}
            <div>
              {invoice?.sellerInfo?.taxRegistration && (
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">Tax ID:</span>
                  <span>{invoice.sellerInfo.taxRegistration}</span>
                </p>
              )}
            </div>

            {/* Address */}
            {invoice?.sellerInfo?.address && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="text-gray-500 mb-1">Address:</p>
                <div className="pl-2">
                  {invoice.sellerInfo.address['street-address'] && (
                    <p>{invoice.sellerInfo.address['street-address']}</p>
                  )}
                  <p>
                    {[
                      invoice.sellerInfo.address.locality,
                      invoice.sellerInfo.address.region,
                      invoice.sellerInfo.address['postal-code'],
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {invoice.sellerInfo.address['country-name'] && (
                    <p>{invoice.sellerInfo.address['country-name']}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">To</h3>
          <div className="text-gray-600 space-y-2">
            {/* Business Details */}
            <div>
              {invoice?.buyerInfo?.businessName && (
                <p className="font-medium text-lg">
                  {invoice.buyerInfo.businessName}
                </p>
              )}
              {(invoice?.buyerInfo?.firstName ||
                invoice?.buyerInfo?.lastName) && (
                <p>
                  Contact:{' '}
                  {[invoice.buyerInfo.firstName, invoice.buyerInfo.lastName]
                    .filter(Boolean)
                    .join(' ')}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div>
              {invoice?.buyerInfo?.email && (
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">Email:</span>
                  <span>{invoice.buyerInfo.email}</span>
                </p>
              )}
              {invoice?.buyerInfo?.phone && (
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">Phone:</span>
                  <span>{invoice.buyerInfo.phone}</span>
                </p>
              )}
            </div>

            {/* Registration Numbers */}
            <div>
              {invoice?.buyerInfo?.taxRegistration && (
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">Tax ID:</span>
                  <span>{invoice.buyerInfo.taxRegistration}</span>
                </p>
              )}
            </div>

            {/* Address */}
            {invoice?.buyerInfo?.address && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="text-gray-500 mb-1">Address:</p>
                <div className="pl-2">
                  {invoice.buyerInfo.address['street-address'] && (
                    <p>{invoice.buyerInfo.address['street-address']}</p>
                  )}
                  <p>
                    {[
                      invoice.buyerInfo.address.locality,
                      invoice.buyerInfo.address.region,
                      invoice.buyerInfo.address['postal-code'],
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {invoice.buyerInfo.address['country-name'] && (
                    <p>{invoice.buyerInfo.address['country-name']}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      {invoice?.paymentTerms && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Payment Terms</h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p>
                Due Date:{' '}
                {new Date(invoice.paymentTerms.dueDate).toLocaleDateString()}
              </p>
              {invoice.paymentTerms.lateFeesPercent > 0 && (
                <p>Late Fees: {invoice.paymentTerms.lateFeesPercent}%</p>
              )}
              {Number(invoice.paymentTerms.lateFeesFix) > 0 && (
                <p>
                  Late Fees (Fixed):{' '}
                  {getCurrencySymbol(getDenominatedCurrency())}
                  {invoice.paymentTerms.lateFeesFix}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invoice Items */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price ({getCurrencySymbol(getDenominatedCurrency())})
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount ({getCurrencySymbol(getDenominatedCurrency())})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice?.invoiceItems?.map(
                (item: InvoiceItem, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {getCurrencySymbol(getDenominatedCurrency())}
                      {(Number(item.unitPrice) / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {getCurrencySymbol(getDenominatedCurrency())}
                      {(
                        (Number(item.unitPrice) * Number(item.quantity)) /
                        100
                      ).toFixed(2)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      {invoice?.note && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{invoice.note}</p>
        </div>
      )}

      {/* Terms */}
      {invoice?.terms && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Terms and Conditions</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{invoice.terms}</p>
        </div>
      )}

      {/* Payment Information */}
      <div className="border-t border-gray-200 pt-4 mt-8">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount ({getDenominatedCurrency()})</span>
            <span>
              {getCurrencySymbol(getDenominatedCurrency())}
              {formatAmount(expectedAmount)}
            </span>
          </div>

          <div className="flex justify-between text-base text-gray-600">
            <span>Payment Amount (EURe)</span>
            <span>
              {getCurrencySymbol('EUR')}
              {formatAmount(expectedAmount)}
            </span>
          </div>

          {balance && (
            <div className="flex justify-between text-base text-gray-600">
              <span>Paid Amount (EURe)</span>
              <span>
                {getCurrencySymbol('EUR')}
                {formatAmount(balance)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Actions */}
      {!isPaid && (
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
              : `Pay ${getCurrencySymbol('EUR')}${formatAmount(
                  expectedAmount
                )} EURe`}
          </button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}

      {/* Technical Details */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowTechnicalDetails(true)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          View Technical Details
        </button>
      </div>

      {showTechnicalDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Technical Details</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(requestData, null, 2)}
            </pre>
            <button
              onClick={() => setShowTechnicalDetails(false)}
              className="mt-4 w-full py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { InvoiceDetailsContainer as InvoiceDetails, InvoiceDetailsView };
