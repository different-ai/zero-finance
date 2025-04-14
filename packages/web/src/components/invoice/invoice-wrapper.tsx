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
  isExternalView?: boolean; // New prop to indicate external context
}

export function InvoiceWrapper({ 
  requestId, 
  requestNetworkId,
  decryptionKey, 
  walletPrivateKey,
  dbInvoiceData,
  isExternalView = false // Default to false (internal view)
}: InvoiceWrapperProps) {

  // --- Render appropriate component based on access method ---
  let InvoiceComponent;
  let componentProps: any = { // Use 'any' for flexibility, refine if needed
    requestId,
    requestNetworkId,
    dbInvoiceData,
    // Pass isExternalView down to the client/container
    isExternalView 
  };

  if (decryptionKey) {
    InvoiceComponent = InvoiceContainer; // Use Container for token/decryption key
    componentProps.decryptionKey = decryptionKey;
  } else if (walletPrivateKey) {
    InvoiceComponent = InvoiceClient; // Use Client for wallet key
    componentProps.walletPrivateKey = walletPrivateKey;
  } else if (dbInvoiceData) {
    // If only DB data, render a static placeholder (as was previously Case 3)
    // This might need adjustment based on whether external view should show static data
    // For now, let's keep the previous static rendering logic for this case.
    // TODO: Integrate static display better with InvoiceClient/Container if possible.
    
    // --- Previous Static Rendering Logic (Case 3) ---
    const staticInvoiceData = dbInvoiceData.invoiceData || {}; // Handle missing nested data
    const staticInvoiceItems = staticInvoiceData.invoiceItems || [];
    const sellerName = staticInvoiceData.sellerInfo?.businessName || 'Seller';
    const sellerEmail = staticInvoiceData.sellerInfo?.email;
    const buyerName = staticInvoiceData.buyerInfo?.businessName || 'Client';
    const buyerEmail = staticInvoiceData.buyerInfo?.email;
    
    return (
      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoice {staticInvoiceData.invoiceNumber ? `#${staticInvoiceData.invoiceNumber}` : `ID: ...${dbInvoiceData.id.slice(-6)}`}</h1>
          {/* Status Badge - Needs refinement based on actual dbInvoiceData.status */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${dbInvoiceData.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {dbInvoiceData.status === 'paid' ? 'Paid' : 'Pending'} {/* Adjust text based on status */}
          </div>
        </div>
        
        {/* Seller/Buyer Info */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-gray-500 text-sm">From</h3>
              <p className="font-medium">{sellerName}</p>
              {sellerEmail && <p className="text-sm text-gray-600">{sellerEmail}</p>}
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">To</h3>
              <p className="font-medium">{buyerName}</p>
              {buyerEmail && <p className="text-sm text-gray-600">{buyerEmail}</p>}
            </div>
          </div>
        </div>
        
        {/* Items Table */}
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
                {staticInvoiceItems.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{item.name || 'Item'}</td>
                    {/* TODO: Add Quantity, Unit Price columns if needed */}
                    <td className="px-4 py-3 text-right">
                      {/* Recalculate total item price - Assuming unitPrice is total, needs fixing */}
                      {staticInvoiceData.currency || ''} {(parseFloat(item.unitPrice || '0') * (item.quantity || 1)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold">
                {/* Use main dbInvoiceData fields for total */}
                {dbInvoiceData.currency || ''} {dbInvoiceData.amount || '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Conditional Pay Button for External View */}
        {isExternalView && (
          <div className="mt-8 border-t border-gray-200 pt-6 text-right">
            {/* TODO: Implement Pay Button Logic */}
            {/* 
              IF fiat: Show Bank Details button/modal 
              IF crypto & !onChain: Show Wallet Address & Network 
              IF crypto & onChain: Show Request Network Pay Button/Widget 
            */}
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Pay Invoice (Placeholder)
            </button>
          </div>
        )}

        {/* Processing Message if not external (and maybe if not paid?) */}
        {!isExternalView && (
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
        )}

      </div>
    );
  } else {
    // Fallback if no valid access method provided
    console.error('InvoiceWrapper: No valid key or DB data provided.');
    InvoiceComponent = () => (
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Error: Could not load invoice details.</p>
        </div>
    );
  }

  // Render the chosen component (InvoiceClient or InvoiceContainer)
  return <InvoiceComponent {...componentProps} />;
}