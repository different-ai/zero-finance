'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { InvoiceContainer } from './invoice-container';

// Dynamically import the InvoiceClient component
const InvoiceClient = dynamic(() => import('./invoice-client'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  )
});

interface InvoiceWrapperProps {
  requestId: string; // DB primary key
  requestNetworkId?: string; // Request Network ID (optional)
  decryptionKey?: string;
  walletPrivateKey?: string;
  dbInvoiceData?: any; // Database invoice data if available
}

export function InvoiceWrapper({ 
  requestId, 
  requestNetworkId,
  decryptionKey, 
  walletPrivateKey,
  dbInvoiceData 
}: InvoiceWrapperProps) {
  // Case 1: We have a decryption key (token-based access)
  if (decryptionKey) {
    return (
      <InvoiceContainer 
        requestId={requestId} 
        requestNetworkId={requestNetworkId}
        decryptionKey={decryptionKey} 
        dbInvoiceData={dbInvoiceData}
      />
    );
  }
  
  // Case 2: We have a wallet private key (account-based access)
  if (walletPrivateKey) {
    return (
      <InvoiceClient 
        requestId={requestId} 
        requestNetworkId={requestNetworkId}
        walletPrivateKey={walletPrivateKey} 
        dbInvoiceData={dbInvoiceData}
      />
    );
  }
  
  // Case 3: We have only database data (blockchain data not available yet)
  if (dbInvoiceData && !decryptionKey && !walletPrivateKey) {
    return (
      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoice #{dbInvoiceData.requestId.slice(-6)}</h1>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
            Processing
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-gray-500 text-sm">From</h3>
              <p className="font-medium">{dbInvoiceData.invoiceData?.sellerInfo?.businessName || 'Seller'}</p>
              <p>{dbInvoiceData.invoiceData?.sellerInfo?.email}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">To</h3>
              <p className="font-medium">{dbInvoiceData.invoiceData?.buyerInfo?.businessName || 'Client'}</p>
              <p>{dbInvoiceData.invoiceData?.buyerInfo?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Invoice Details</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dbInvoiceData.invoiceData?.invoiceItems?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-right">
                      {item.currency} {(parseFloat(item.unitPrice) / 100 * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold">
                {dbInvoiceData.currency} {dbInvoiceData.amount}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This invoice is being processed on the blockchain. Full details and payment options will be available shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Fallback (should not happen due to server-side checks)
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <p>Invalid invoice access configuration.</p>
    </div>
  );
}