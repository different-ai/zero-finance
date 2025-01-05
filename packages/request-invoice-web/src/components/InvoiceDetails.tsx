'use client';

import React, { useState, useEffect } from 'react';
import { Types } from '@requestnetwork/request-client.js';
import { RequestLogicTypes } from '@requestnetwork/types';
import { providers } from 'ethers';
import { 
  payRequest,
  hasSufficientFunds,
  hasErc20Approval,
  approveErc20
} from '@requestnetwork/payment-processor';
import { getRequestClient } from '@/lib/request-network';

interface InvoiceDetailsProps {
  requestId: string;
}

export default function InvoiceDetails({ requestId }: InvoiceDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [requestData, setRequestData] = useState<Types.IRequestData | null>(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const requestClient = getRequestClient();
        const request = await requestClient.fromRequestId(requestId);
        const data = request.getData();
        console.log('0xHypr', 'requestData', data);
        setRequestData(data);
      } catch (err) {
        console.error('Error fetching request:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invoice');
      }
    };

    fetchRequestData();
  }, [requestId]);

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

  const formatAmount = (amount: string | RequestLogicTypes.Amount) => {
    if (!amount) return '0';
    if (typeof amount === 'string') {
      return (BigInt(amount) / BigInt(1e18)).toString();
    }
    return (BigInt(amount.toString()) / BigInt(1e18)).toString();
  };

  // Get the correct invoice data from the nested structure
  const getInvoiceData = () => {
    // Try to get invoice data from different possible locations in the request data structure
    if (requestData.contentData) {
      return requestData.contentData;
    }
    
    // Check in extensions
    const contentDataExt = requestData.extensions?.['content-data'];
    if (contentDataExt?.values?.content) {
      return contentDataExt.values.content;
    }
    
    // Check in extensionsData
    const contentDataExtData = requestData.extensionsData?.find(ext => ext.id === 'content-data');
    if (contentDataExtData?.parameters?.content) {
      return contentDataExtData.parameters.content;
    }

    return null;
  };

  const invoice = getInvoiceData();
  const balance = requestData.balance?.balance;
  const expectedAmount = requestData.expectedAmount;
  
  const isPaid = balance ? 
    BigInt(balance.toString() || '0') >= BigInt(expectedAmount?.toString() || '0') :
    false;

  const getCurrencyDisplay = () => {
    // Use the currency from the invoice items if available, otherwise fall back to currencyInfo
    const invoiceCurrency = invoice?.invoiceItems?.[0]?.currency;
    const currency = invoiceCurrency || requestData.currencyInfo?.type || 'ETH';
    return currency;
  };

  const calculateItemTotal = (item: any) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const taxAmount = item.tax?.type === 'percentage' 
      ? (quantity * unitPrice * Number(item.tax.amount)) / 100
      : Number(item.tax?.amount || 0);
    
    return quantity * unitPrice + taxAmount;
  };

  const TechnicalDetailsModal = () => {
    if (!showTechnicalDetails) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Technical Details</h2>
            <button 
              onClick={() => setShowTechnicalDetails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Request Network Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Format</p>
                  <p className="font-mono">{invoice?.meta?.format}</p>
                </div>
                <div>
                  <p className="text-gray-500">Version</p>
                  <p className="font-mono">{invoice?.meta?.version}</p>
                </div>
                <div>
                  <p className="text-gray-500">Request ID</p>
                  <p className="font-mono break-all">{requestData.requestId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Network</p>
                  <p className="font-mono">{requestData.currencyInfo?.network}</p>
                </div>
                <div>
                  <p className="text-gray-500">Currency</p>
                  <p className="font-mono">{requestData.currency}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expected Amount (Wei)</p>
                  <p className="font-mono">{requestData.expectedAmount}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Payee Address</p>
                  <p className="font-mono break-all">{requestData.payee?.value}</p>
                </div>
                {requestData.payer?.value && (
                  <div>
                    <p className="text-gray-500">Payer Address</p>
                    <p className="font-mono break-all">{requestData.payer.value}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">State</p>
                  <p className="font-mono">{requestData.state}</p>
                </div>
                <div>
                  <p className="text-gray-500">Creation Time</p>
                  <p className="font-mono">{new Date(requestData.timestamp * 1000).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {requestData.extensions?.['pn-eth-fee-proxy-contract'] && (
              <div>
                <h3 className="font-semibold mb-2">Payment Network Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Fee Address</p>
                    <p className="font-mono break-all">
                      {requestData.extensions['pn-eth-fee-proxy-contract'].values.feeAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fee Amount</p>
                    <p className="font-mono">
                      {formatAmount(requestData.extensions['pn-eth-fee-proxy-contract'].values.feeAmount)} {getCurrencyDisplay()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Network Name</p>
                    <p className="font-mono">
                      {requestData.extensionsData?.find(ext => ext.id === 'pn-eth-fee-proxy-contract')?.parameters?.paymentNetworkName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Salt</p>
                    <p className="font-mono">
                      {requestData.extensions['pn-eth-fee-proxy-contract'].values.salt}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {requestData.balance?.error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <h3 className="font-semibold mb-2 text-red-700">Balance Error</h3>
                <p className="text-sm text-red-600">
                  {requestData.balance.error.message}
                  {requestData.balance.error.code !== undefined && ` (Code: ${requestData.balance.error.code})`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-500 mt-1">#{invoice?.invoiceNumber}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
               style={{
                 backgroundColor: isPaid ? 'rgb(220 252 231)' : 'rgb(254 242 242)',
                 color: isPaid ? 'rgb(22 101 52)' : 'rgb(153 27 27)'
               }}>
            {isPaid ? 'Paid' : 'Pending'}
          </div>
          <button
            onClick={() => setShowTechnicalDetails(true)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Technical Details
          </button>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-sm font-medium text-gray-500">Creation Date</h2>
          <p className="text-gray-900">{invoice?.creationDate ? new Date(invoice.creationDate).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-500">Due Date</h2>
          <p className="text-gray-900">
            {invoice?.paymentTerms?.dueDate ? new Date(invoice.paymentTerms.dueDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Company Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">From</h2>
          <div className="text-gray-600">
            <p className="font-medium">{invoice?.sellerInfo?.businessName || requestData.payee?.value || 'Seller'}</p>
            {invoice?.sellerInfo?.email && (
              <p className="text-sm">{invoice.sellerInfo.email}</p>
            )}
            {invoice?.sellerInfo?.address && Object.keys(invoice.sellerInfo.address).length > 0 && (
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
            <p className="font-medium">{invoice?.buyerInfo?.businessName || requestData.payer?.value || 'Buyer'}</p>
            {invoice?.buyerInfo?.email && (
              <p className="text-sm">{invoice.buyerInfo.email}</p>
            )}
            {invoice?.buyerInfo?.address && Object.keys(invoice.buyerInfo.address).length > 0 && (
              <>
                <p>{invoice.buyerInfo.address['street-address']}</p>
                <p>{invoice.buyerInfo.address.city}, {invoice.buyerInfo.address.region} {invoice.buyerInfo.address.postcode}</p>
                <p>{invoice.buyerInfo.address.country}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      {invoice?.invoiceItems && invoice.invoiceItems.length > 0 && (
        <div className="mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3">Tax</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.invoiceItems.map((item: any, index: number) => {
                const itemTotal = calculateItemTotal(item);
                return (
                  <tr key={index} className="text-gray-600">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                        {item.reference && <p className="text-sm text-gray-500">Ref: {item.reference}</p>}
                        {item.deliveryDate && (
                          <p className="text-sm text-gray-500">
                            Delivery: {new Date(item.deliveryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">{item.quantity}</td>
                    <td className="px-4 py-4">{item.unitPrice} {item.currency}</td>
                    <td className="px-4 py-4">
                      {item.tax?.type === 'percentage' 
                        ? `${item.tax.amount}%`
                        : `${item.tax?.amount || 0} ${item.currency}`}
                    </td>
                    <td className="px-4 py-4 text-right">{itemTotal} {item.currency}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Total Amount */}
      <div className="border-t border-gray-200 pt-4 mb-8">
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total Amount</span>
          <span>{formatAmount(expectedAmount)} {getCurrencyDisplay()}</span>
        </div>
        {balance && (
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Paid Amount</span>
            <span>{formatAmount(balance)} {getCurrencyDisplay()}</span>
          </div>
        )}
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
      {!isPaid && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ready to Pay?</h2>
              <p className="text-gray-600">Connect your wallet to process the payment</p>
              {requestData.balance?.error && (
                <p className="text-sm text-red-600 mt-1">{requestData.balance.error.message}</p>
              )}
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

      <TechnicalDetailsModal />
    </div>
  );
}
