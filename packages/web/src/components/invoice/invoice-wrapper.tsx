'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { InvoiceContainer } from './invoice-container';
import { Button } from '@/components/ui/button';
import { UserFundingSource } from '@/db/schema'; // Added
import { FiatPaymentDetails } from './fiat-payment-details';
import { CryptoManualPaymentDetails } from './crypto-manual-payment-details';
import { RequestNetworkPayButton } from './request-network-pay-button';
import { usePrivy } from '@privy-io/react-auth'; // Import Privy hook
import { Wallet } from 'lucide-react'; // Import Wallet icon
import Image from 'next/image'; // Import Image for logo
import { formatDisplayCurrency } from '@/lib/utils'; // Import the new utility

// --- Define necessary types locally or import from a SAFE shared location ---
// Basic structure based on invoiceDataSchema fields used in this component
// Adjust as needed if more fields are used or if a shared type exists
type ParsedInvoiceItem = {
  name?: string;
  unitPrice?: string;
  quantity?: number;
  // Add other item fields if used by static display
};

type ParsedInvoiceDetails = {
  paymentType?: 'crypto' | 'fiat';
  currency?: string;
  network?: string;
  bankDetails?: {
    accountHolder?: string;
    iban?: string;
    bic?: string;
    bankName?: string;
  } | null;
  invoiceNumber?: string;
  invoiceItems?: Array<ParsedInvoiceItem>; // Use the defined item type
  sellerInfo?: {
    businessName?: string;
    email?: string;
    // Add other seller fields if used
  };
  buyerInfo?: {
    businessName?: string;
    email?: string;
    // Add other buyer fields if used
  };
  // Add other top-level fields from schema if used
};

// Minimal UserRequest type needed for props (can be refined)
type BasicUserRequest = {
  id: string;
  requestId?: string | null;
  invoiceData: any; // Keep as any for now, parsing happens on server
  currency?: string | null;
  amount?: string | null;
  status?: string | null; // Assuming status is a string now
  // Add other fields from UserRequest used directly by this component
};
// --- End Type Definitions ---

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
  walletPrivateKey?: string;
  dbInvoiceData?: BasicUserRequest | null; 
  parsedInvoiceDetails: ParsedInvoiceDetails | null;
  parsingError: boolean;
  isExternalView?: boolean; 
  sellerCryptoAddress?: string | null;
  sellerFundingSource?: UserFundingSource | null;
}

// Sub-component for external payment info display
const ExternalPaymentInfo: React.FC<{
    staticInvoiceData: ParsedInvoiceDetails | {};
    dbInvoiceData: BasicUserRequest | null;
    requestNetworkId?: string;
    sellerCryptoAddress?: string | null;
    sellerFundingSource?: UserFundingSource | null;
}> = ({
    staticInvoiceData,
    dbInvoiceData,
    requestNetworkId,
    sellerCryptoAddress,
    sellerFundingSource
}) => {
    // Use Privy hook
    const { ready, authenticated, login } = usePrivy();

    const paymentType = (staticInvoiceData as ParsedInvoiceDetails).paymentType || 'crypto';
    const currency = dbInvoiceData?.currency || (staticInvoiceData as ParsedInvoiceDetails).currency || ''
    const network = (staticInvoiceData as ParsedInvoiceDetails).network || 'base';
    const isOnChain = !!requestNetworkId;
    const invoiceNumber = (staticInvoiceData as ParsedInvoiceDetails).invoiceNumber;
    const amount = dbInvoiceData?.amount || null;

    // Disable button logic until Privy is ready
    const isLoginDisabled = !ready;

    // Scenario 1 & 2: On-chain Payments (Crypto OR Fiat - Button handles logic)
    if (isOnChain) {
      // Check if user is authenticated
      if (authenticated) {
        // User is logged in, show the pay/declare button
        // The button component will determine whether to pay or declare
        return <RequestNetworkPayButton requestNetworkId={requestNetworkId} />;
      } else {
        // User is not logged in, show connect button
        return (
          <Button onClick={login} disabled={isLoginDisabled}>
            <Wallet className="mr-2 h-4 w-4" />
            {isLoginDisabled ? 'Loading...' : 'Connect Wallet to Pay/Declare'}
          </Button>
        );
      }
    }

    // Scenario 3a: Off-chain Crypto Payment (Show Seller Crypto Address)
    if (!isOnChain && paymentType === 'crypto') {
       return (
           <CryptoManualPaymentDetails
               address={sellerCryptoAddress ?? null}
               currency={currency}
               network={network}
               amount={amount ?? null}
            />
        );
    }
    
    // Scenario 3b: Off-chain Fiat Payment (Show Seller Bank Details)
    if (!isOnChain && paymentType === 'fiat') {
      return (
          <FiatPaymentDetails 
              fundingSource={sellerFundingSource ?? null}
              invoiceNumber={invoiceNumber} 
          />
      );
    }

    // Fallback or should not happen if paymentType is always crypto/fiat
    return <p className="text-sm text-gray-500">Payment details configuration error.</p>;
};
ExternalPaymentInfo.displayName = 'ExternalPaymentInfo'; // Add display name

// Sub-component for static display when only DB data is available
const StaticInvoiceDisplay: React.FC<{
  dbInvoiceData: BasicUserRequest;
  parsedInvoiceDetails: ParsedInvoiceDetails | null;
  parsingError: boolean;
  isExternalView: boolean;
  requestNetworkId?: string;
  sellerCryptoAddress?: string | null;
  sellerFundingSource?: UserFundingSource | null;
}> = ({ 
  dbInvoiceData, 
  parsedInvoiceDetails, 
  parsingError, 
  isExternalView, 
  requestNetworkId, 
  sellerCryptoAddress,
  sellerFundingSource
}) => {
  // Handle parsing error passed from parent
  if (parsingError || !parsedInvoiceDetails) {
    console.error('StaticInvoiceDisplay: Parsing failed on server or data is null.');
    return (
       <div className="bg-white shadow rounded-lg p-8 text-red-600">
          Error displaying invoice: Invalid or missing invoice details.
       </div>
    );
  }
  
  // Use the pre-parsed data directly
  const staticInvoiceData = parsedInvoiceDetails; 
  
  const staticInvoiceItems = staticInvoiceData.invoiceItems || [];
  const sellerName = staticInvoiceData.sellerInfo?.businessName || 'Seller';
  const sellerEmail = staticInvoiceData.sellerInfo?.email;
  const buyerName = staticInvoiceData.buyerInfo?.businessName || 'Client';
  const buyerEmail = staticInvoiceData.buyerInfo?.email;
  
  // Extract network for currency formatting
  const network = staticInvoiceData.network || 'base'; // Default to base if not specified

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
                {staticInvoiceItems.map((item: ParsedInvoiceItem, index: number) => (
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
                {/* Use main dbInvoiceData fields for total and format it */}
                {formatDisplayCurrency(
                  dbInvoiceData.amount, 
                  dbInvoiceData.currency, 
                  network // Pass the network for proper config lookup
                )}
              </span>
            </div>
            {/* Add Subtotal/Tax later if needed */}
          </div>
        </div>

        {/* Payment Info Section (External View Only) */}
        {isExternalView && (
            <div className="mt-8 pt-6 border-t border-gray-200">
                 <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                 <ExternalPaymentInfo 
                     staticInvoiceData={staticInvoiceData}
                     dbInvoiceData={dbInvoiceData}
                     requestNetworkId={requestNetworkId}
                     sellerCryptoAddress={sellerCryptoAddress}
                     sellerFundingSource={sellerFundingSource}
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
  walletPrivateKey,
  dbInvoiceData, 
  parsedInvoiceDetails,
  parsingError,
  isExternalView = false,
  sellerCryptoAddress,
  sellerFundingSource
}: InvoiceWrapperProps) {

  console.log('0xHypr', 'InvoiceWrapper (Simplified) - Rendering:', { 
    requestId,
    requestNetworkId,
    walletPrivateKey,
    dbInvoiceData,
    parsedInvoiceDetails,
    parsingError,
    isExternalView
  });

  let InvoiceComponent: React.ComponentType<any>;
  let componentProps: any = { 
    requestId,
    requestNetworkId,
    dbInvoiceData,
    parsedInvoiceDetails,
    parsingError,
    isExternalView 
  };

  if (walletPrivateKey) { // Logged-in user view
    InvoiceComponent = InvoiceClient; 
    componentProps.walletPrivateKey = walletPrivateKey;
  } else if (dbInvoiceData) { // External view (now simplified)
    // For external view, we now directly render the static display
    // as there's no token/decryption key to handle.
    console.log('0xHypr', 'InvoiceWrapper - Rendering StaticInvoiceDisplay (External/Simplified)');
    return (
       <StaticInvoiceDisplay 
         dbInvoiceData={dbInvoiceData} 
         parsedInvoiceDetails={parsedInvoiceDetails}
         parsingError={parsingError}
         isExternalView={true} // Explicitly set for static display
         requestNetworkId={requestNetworkId} 
         sellerCryptoAddress={sellerCryptoAddress}
         sellerFundingSource={sellerFundingSource}
       />
    );
  } else {
    // If no wallet key and no DB data, it's an error
    console.log('0xHypr', 'InvoiceWrapper - No data available, rendering error fallback');
    return <InvoiceErrorFallback />;
  }

  // Render the chosen component (InvoiceClient for logged-in view)
  return <InvoiceComponent {...componentProps} />;
}

InvoiceWrapper.displayName = 'InvoiceWrapper';