import React from 'react';
import { Types } from '@requestnetwork/request-client.js';

interface TechnicalDetailsModalProps {
  requestData: Types.IRequestData;
  invoice: any;
  onClose: () => void;
  formatAmount: (amount: string) => string;
  getCurrencyDisplay: () => string;
}

export default function TechnicalDetailsModal({
  requestData,
  invoice,
  onClose,
  formatAmount,
  getCurrencyDisplay,
}: TechnicalDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Request Blockchain Data</h2>
            <a
              href={`https://scan.request.network/request/${requestData.requestId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View in Explorer
            </a>
          </div>
          <button 
            onClick={onClose}
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
} 