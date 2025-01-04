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

  const invoice = requestData.contentData as any;
  const isPaid = BigInt(requestData.balance?.balance?.toString() || '0') >= BigInt(requestData.expectedAmount?.toString() || '0');
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-500 mt-1">#{invoice?.invoiceNumber || requestId.slice(0, 8)}</p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2"
               style={{
                 backgroundColor: isPaid ? 'rgb(220 252 231)' : 'rgb(254 242 242)',
                 color: isPaid ? 'rgb(22 101 52)' : 'rgb(153 27 27)'
               }}>
            {isPaid ? 'Paid' : 'Pending'}
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">From</h2>
          <div className="text-gray-600">
            <p className="font-medium">{invoice?.sellerInfo?.businessName || 'Seller'}</p>
            {invoice?.sellerInfo?.address && (
              <>
                <p>{invoice.sellerInfo.address['street-address']}</p>
                <p>{invoice.sellerInfo.address.city}, {invoice.sellerInfo.address.region} {invoice.sellerInfo.address.postcode}</p>
                <p>{invoice.sellerInfo.address.country}</p>
              </>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Bill To</h2>
          <div className="text-gray-600">
            <p className="font-medium">{invoice?.buyerInfo?.businessName || 'Buyer'}</p>
            {invoice?.buyerInfo?.address && (
              <>
                <p>{invoice.buyerInfo.address['street-address']}</p>
                <p>{invoice.buyerInfo.address.city}, {invoice.buyerInfo.address.region} {invoice.buyerInfo.address.postcode}</p>
                <p>{invoice.buyerInfo.address.country}</p>
              </>
            )}
          </div>
        </div>
      </div>


      {/* Dates */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-sm font-medium text-gray-500">Creation Date</h2>
          <p className="text-gray-900">{new Date(invoice?.creationDate).toLocaleDateString()}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-500">Due Date</h2>
          <p className="text-gray-900">{invoice?.paymentTerms?.dueDate ? new Date(invoice.paymentTerms.dueDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      {/* Items Table */}
      {invoice?.invoiceItems && (
        <div className="mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.invoiceItems.map((item: any, index: number) => (
                <tr key={index} className="text-gray-600">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-4">{item.quantity}</td>
                  <td className="px-4 py-4">{item.unitPrice} {item.currency}</td>
                  <td className="px-4 py-4 text-right">{Number(item.unitPrice) * item.quantity} {item.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total Amount */}
      <div className="border-t border-gray-200 pt-4 mb-8">
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total Amount</span>
          <span>{formatAmount(requestData.expectedAmount)} {requestData.currencyInfo?.type || 'Unknown'}</span>
        </div>
      </div>

      {/* Notes */}
      {invoice?.note && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Notes</h2>
          <p className="text-gray-600">{invoice.note}</p>
        </div>
      )}

      {/* Terms */}
      {invoice?.terms && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Terms</h2>
          <p className="text-gray-600">{invoice.terms}</p>
        </div>
      )}


        {/* Payment Section */}
        {Number(requestData.balance?.balance || '0') < Number(requestData.expectedAmount) && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ready to Pay?</h2>
                <p className="text-gray-600">Connect your wallet to process the payment</p>
              </div>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Pay Invoice'
                )}
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
