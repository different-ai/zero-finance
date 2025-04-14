'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { InvoiceContainer } from './invoice-container';
import { Button } from '@/components/ui/button';
import { UserRequest } from '@/db/schema';
import { invoiceDataSchema } from '@/server/routers/invoice-router';
import { z } from 'zod';

// Define the type for the nested invoice data
type InvoiceDetailsType = z.infer<typeof invoiceDataSchema>;

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
  dbInvoiceData?: UserRequest | null; // Use UserRequest type
  isExternalView?: boolean; // New prop to indicate external context
}

// Sub-component for external payment info display
const ExternalPaymentInfo: React.FC<{ 
    staticInvoiceData: InvoiceDetailsType | {}; // Use inferred type or empty object
    dbInvoiceData: UserRequest | null; // Use UserRequest type
    requestNetworkId?: string 
}> = ({ staticInvoiceData, dbInvoiceData, requestNetworkId }) => {
    const paymentType = (staticInvoiceData as InvoiceDetailsType).paymentType || 'crypto'; 
    const currency = dbInvoiceData?.currency || (staticInvoiceData as InvoiceDetailsType).currency || ''
    const network = (staticInvoiceData as InvoiceDetailsType).network || 'base'; 
    const isOnChain = !!requestNetworkId;
    const bankDetails = (staticInvoiceData as InvoiceDetailsType).bankDetails;
    const invoiceNumber = (staticInvoiceData as InvoiceDetailsType).invoiceNumber;

    if (paymentType === 'fiat') {
      if (bankDetails?.accountHolder && bankDetails?.iban) {
        return (
          <div className="text-left bg-gray-50 p-4 rounded border text-sm">
             <h4 className="font-medium mb-2 text-gray-800">Bank Transfer Details:</h4>
             <p><strong>Account Holder:</strong> {bankDetails.accountHolder}</p>
             <p><strong>IBAN:</strong> {bankDetails.iban}</p>
             {bankDetails.bic && <p><strong>BIC/SWIFT:</strong> {bankDetails.bic}</p>}
             {bankDetails.bankName && <p><strong>Bank:</strong> {bankDetails.bankName}</p>}
             <p className="mt-2 text-xs text-gray-600">
                Please include Invoice #{invoiceNumber} in your payment reference.
             </p>
           </div>
        );
      } else {
        return <p className="text-sm text-gray-500">Bank details not provided.</p>;
      }
    } else { // Crypto
      if (isOnChain) {
        return (
           <Button disabled>Pay with Crypto (On-Chain - Not Implemented)</Button>
        );
      } else {
        return (
          <div className="text-left bg-gray-50 p-4 rounded border text-sm">
             <h4 className="font-medium mb-2 text-gray-800">Crypto Payment (Off-Chain):</h4>
             <p>Please send {dbInvoiceData?.amount || 'the total amount'} {currency} on the {network} network.</p>
             <p className="mt-1"><strong>Address:</strong> [Seller Payment Address Not Available Yet]</p>
              <p className="mt-2 text-xs text-gray-600">
                 Ensure you are sending on the correct network. Confirm the address with the seller if unsure.
              </p>
           </div>
        );
      }
    }
};
ExternalPaymentInfo.displayName = 'ExternalPaymentInfo'; // Add display name

// Sub-component for static display when only DB data is available
const StaticInvoiceDisplay: React.FC<{
  dbInvoiceData: UserRequest; // Expect non-null here
  isExternalView: boolean;
  requestNetworkId?: string;
}> = ({ dbInvoiceData, isExternalView, requestNetworkId }) => {
  // Parse the invoiceData with the Zod schema
  const parseResult = invoiceDataSchema.safeParse(dbInvoiceData.invoiceData);
  
  if (!parseResult.success) {
    // Handle parsing error for the static display
    console.error('StaticInvoiceDisplay: Failed to parse invoiceData:', parseResult.error);
    return (
       <div className="bg-white shadow rounded-lg p-8 text-red-600">
          Error displaying invoice: Invalid data format.
       </div>
    );
  }
  
  const staticInvoiceData: InvoiceDetailsType = parseResult.data;
  const staticInvoiceItems = staticInvoiceData.invoiceItems || [];
  const sellerName = staticInvoiceData.sellerInfo?.businessName || 'Seller';
  const sellerEmail = staticInvoiceData.sellerInfo?.email;
  const buyerName = staticInvoiceData.buyerInfo?.businessName || 'Client';
  const buyerEmail = staticInvoiceData.buyerInfo?.email;
  
  return (
      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoice {staticInvoiceData.invoiceNumber ? `#${staticInvoiceData.invoiceNumber}` : `ID: ...${dbInvoiceData.id.slice(-6)}`}</h1>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${dbInvoiceData.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {dbInvoiceData.status === 'paid' ? 'Paid' : 'Pending'}
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
                {staticInvoiceItems.map((item: InvoiceDetailsType['invoiceItems'][number], index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{item.name || 'Item'}</td>
                    <td className="px-4 py-3 text-right">
                      {/* Recalculate total item price - Use parsed unitPrice */}
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

        {/* Conditional Pay Button / Payment Info for External View */}
        {isExternalView && (
          <div className="mt-8 border-t border-gray-200 pt-6 text-right">
             <ExternalPaymentInfo 
                 staticInvoiceData={staticInvoiceData}
                 dbInvoiceData={dbInvoiceData}
                 requestNetworkId={requestNetworkId}
             />
          </div>
        )}

        {/* Processing Message if not external (and maybe if not paid?) */}
        {!isExternalView && dbInvoiceData.status !== 'paid' && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-700">
                 This invoice is being processed or requires action. Full details and payment options may update.
              </p>
            </div>
          </div>
        )}
      </div>
  );
};
StaticInvoiceDisplay.displayName = 'StaticInvoiceDisplay'; // Add display name

// Sub-component for fallback error display
const InvoiceErrorFallback: React.FC = () => {
   return (
      <div className="flex justify-center items-center min-h-[200px]">
         <p>Error: Could not load invoice details.</p>
      </div>
   );
};
InvoiceErrorFallback.displayName = 'InvoiceErrorFallback'; // Add display name

export function InvoiceWrapper({ 
  requestId, 
  requestNetworkId,
  decryptionKey, 
  walletPrivateKey,
  dbInvoiceData, // Prop type updated earlier
  isExternalView = false
}: InvoiceWrapperProps) {

  // --- Render appropriate component based on access method ---
  let InvoiceComponent: React.ComponentType<any>; // Use a more general type temporarily
  let componentProps: any = { 
    requestId,
    requestNetworkId,
    dbInvoiceData, // Pass typed prop down
    isExternalView 
  };

  if (decryptionKey) {
    InvoiceComponent = InvoiceContainer;
    componentProps.decryptionKey = decryptionKey;
  } else if (walletPrivateKey) {
    InvoiceComponent = InvoiceClient; 
    componentProps.walletPrivateKey = walletPrivateKey;
  } else if (dbInvoiceData) {
    // Use the new StaticInvoiceDisplay component
    return (
       <StaticInvoiceDisplay 
         dbInvoiceData={dbInvoiceData} // Pass the non-null data
         isExternalView={isExternalView} 
         requestNetworkId={requestNetworkId}
       />
    );
  } else {
     InvoiceComponent = InvoiceErrorFallback; 
     componentProps = {}; 
  }

  // Render the chosen component
  return <InvoiceComponent {...componentProps} />;
}

InvoiceWrapper.displayName = 'InvoiceWrapper';