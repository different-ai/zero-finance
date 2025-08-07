import React from 'react';
import { notFound } from 'next/navigation';
import { appRouter } from '@/server/routers/_app'; // Import the main router
// import { createContext } from '@/server/context'; // Remove manual context import
import { userProfileService } from '@/lib/user-profile-service';
import { getUserId } from '@/lib/auth'; // Need getUserId here now
import InvoiceClient from '@/components/invoice/invoice-client';
import { ShareInvoiceLink } from '@/components/invoice/share-invoice-link';
import { PaymentDetailsDisplay } from '@/components/invoice/payment-details-display';
// import { UserRequest } from '@/db/schema'; // Remove DB import
// import { invoiceDataSchema } from '@/server/routers/invoice-router'; // REMOVE Zod schema import
// import { z } from 'zod'; // REMOVE zod import
import type { InvoiceStatus } from '@/db/schema'; // Import InvoiceStatus type

// Define the type for the nested invoice data MANUALLY
// (Copied from invoice-container.tsx)
interface InvoiceDetailsType {
  meta?: { format?: string; version?: string };
  creationDate?: string;
  invoiceNumber?: string;
  sellerInfo?: { /* ... */ };
  buyerInfo?: { /* ... */ };
  invoiceItems?: Array<{ /* ... */ }>;
  paymentTerms?: { dueDate?: string };
  note?: string;
  terms?: string;
  paymentType?: 'crypto' | 'fiat';
  paymentMethod?: string;
  currency?: string;
  network?: string;
  paymentAddress?: string;
  bankDetails?: { 
    accountHolder?: string;
    accountNumber?: string;
    routingNumber?: string;
    iban?: string;
    bic?: string;
    swiftCode?: string;
    bankName?: string;
    bankAddress?: string;
  } | null;
}

// Define client-safe UserRequest structure MANUALLY
interface UserRequest {
  id: string;
  requestId: string | null;
  userId: string;
  walletAddress: string | null;
  role: 'seller' | 'buyer' | null;
  description: string | null;
  amount: string | null;
  currency: string | null;
  status: InvoiceStatus | null; // Use the imported type here
  client: string | null;
  invoiceData: any; // Keep as any for now, structure defined in InvoiceDetailsType
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  senderCompanyId: string | null;
  recipientCompanyId: string | null;
}

// Define Params as a Promise
type Params = Promise<{ invoiceId: string }> ;

// Define the simple logger interface matching context.ts
interface Logger {
  info: (payload: any, message: string) => void;
  error: (payload: any, message: string) => void;
  warn: (payload: any, message: string) => void;
}

// This is now a Server Component
// Update signature to accept props object
export default async function InternalInvoicePage({ 
  params: paramsProp // Rename incoming prop to avoid conflict 
}: {
  params: Params; // Use the Promise type
}) {
  // Await the params promise
  const params = await paramsProp;
  const { invoiceId } = params; // Now destructure from the awaited object

  if (!invoiceId) {
    return notFound();
  }
  
  // --- Server-Side Data Fetching & Auth --- 
  let rawInvoiceData: UserRequest | null = null; 
  let userWalletKey: string | null = null;
  let fetchError: string | null = null;

  // Simple console logger implementation matching context.ts
  const log: Logger = {
    info: (payload, message) => console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
    error: (payload, message) => console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
    warn: (payload, message) => console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
  };

  try {
    // 1. Get the current user ID first
    const currentUserId = await getUserId();
    if (!currentUserId) {
      // If no user is logged in, they can't access this internal page
      console.log(`InternalInvoicePage: No authenticated user for invoice ${invoiceId}`);
      // This case should ideally be caught by layout/middleware, but good safety check
      return notFound(); 
    }
    console.log(`InternalInvoicePage: Authenticated user ${currentUserId} accessing invoice ${invoiceId}`);

    // 2. Create the tRPC caller, explicitly passing the userId AND logger into the context
    // AND THE DB INSTANCE
    const { db } = await import('@/db'); // Import db instance
    const serverClient = appRouter.createCaller({ userId: currentUserId, log, db }); 

    // 3. Fetch invoice data - getById will use the ctx.userId we provided for auth
    rawInvoiceData = await serverClient.invoice.getById({ id: invoiceId });
    
    // If the fetch succeeded without throwing FORBIDDEN/UNAUTHORIZED, the user is authorized.
    console.log(`InternalInvoicePage: Successfully fetched invoice ${invoiceId} for user ${currentUserId}`);

    // 4. Fetch user wallet key (since user is authorized)
    const wallet = await userProfileService.getOrCreateWallet(currentUserId);
    userWalletKey = wallet.privateKey;

    if (!userWalletKey) {
       // Handle specific case of wallet retrieval failure
       throw new Error('Failed to retrieve user wallet key after successful auth.');
    }

  } catch (error: any) {
    // Log the specific error that occurred during the try block
    console.error(`Error loading invoice ${invoiceId} for user:`, error);
    fetchError = error.message || 'Failed to load invoice data.';

    // Handle specific TRPC errors 
    if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN') {
       // This *shouldn't* happen now if getUserId worked, but handle defensively
       console.log(`Authorization failed (${error.code}) unexpectedly for invoice ${invoiceId}`);
       return notFound(); 
    }
    if (error.code === 'NOT_FOUND') {
       console.log(`Invoice ${invoiceId} not found in database via getById.`);
       return notFound();
    }
    
    // Handle other errors (e.g., wallet fetch fail, internal server error)
    return (
       <div className="container mx-auto px-4 py-8 text-red-500 text-center">
          Error loading invoice: {fetchError}
       </div>
    );
  }

  // If we got here, we are authorized and have data + wallet key
  // Minor redundant check for safety
  if (!rawInvoiceData || !userWalletKey) {
     console.error('InternalInvoicePage: Data or wallet key missing unexpectedly just before render.');
     return notFound(); 
  }
  
  // Directly cast the nested data - Server fetch should already be validated by router
  const invoiceDetails = rawInvoiceData.invoiceData as InvoiceDetailsType | null;

  // Check if invoiceDetails exist (could be null/empty from DB)
  if (!invoiceDetails) {
    return <div className="container mx-auto px-4 py-8 text-orange-500 text-center">Invoice data is missing or empty.</div>;
  }

  // Debug log to see what data we have
  console.log('InternalInvoicePage: Invoice details:', JSON.stringify(invoiceDetails, null, 2));

  // Extract payment details from invoice data
  const paymentDetails = invoiceDetails?.bankDetails || null;
  // Get the payment method from invoice data
  const paymentMethod = invoiceDetails?.paymentMethod || (invoiceDetails?.paymentType === 'fiat' ? 'ach' : 'crypto');
  const isCrypto = paymentMethod === 'crypto';
  const paymentAddress = invoiceDetails?.paymentAddress || null;
  const cryptoNetwork = invoiceDetails?.network || null;
  const currency = invoiceDetails?.currency || rawInvoiceData.currency || 'USD';
  
  console.log('InternalInvoicePage: Payment info:', { 
    paymentMethod, 
    paymentAddress, 
    paymentDetails, 
    isCrypto,
    cryptoNetwork,
    currency 
  });

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Header with Share Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Invoice Details</h1>
        <ShareInvoiceLink invoiceId={invoiceId} />
      </div>

      {/* Payment Details Section */}
      {(paymentAddress || paymentDetails) && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 overflow-hidden">
          <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                paymentMethod === 'crypto' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {paymentMethod === 'crypto' ? '🔗 Cryptocurrency' : '🏦 Bank Transfer'}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {paymentMethod === 'crypto' && paymentAddress ? (
              <div className="space-y-4">
                {/* Crypto Network & Currency Display */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    {currency === 'USDC' && (
                      <img 
                        src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029" 
                        alt="USDC" 
                        className="h-10 w-10"
                      />
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Currency</p>
                      <p className="font-semibold text-lg">{currency}</p>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-gray-200" />
                  <div className="flex items-center gap-3">
                    {cryptoNetwork === 'solana' && (
                      <img 
                        src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=029" 
                        alt="Solana" 
                        className="h-8 w-8"
                      />
                    )}
                    {cryptoNetwork === 'base' && (
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">B</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Network</p>
                      <p className="font-semibold text-lg capitalize">{cryptoNetwork || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Wallet Address */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Wallet Address</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(paymentAddress)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-xs font-mono text-gray-800 break-all">
                      {paymentAddress}
                    </code>
                  </div>
                </div>
                
                {/* Warning */}
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-amber-600 mt-0.5">⚠️</span>
                  <p className="text-xs text-amber-800">
                    Please ensure you're sending {currency} on the {cryptoNetwork} network. 
                    Sending funds on the wrong network may result in permanent loss.
                  </p>
                </div>
              </div>
            ) : paymentMethod !== 'crypto' && paymentDetails ? (
              <div className="space-y-4">
                {/* Bank Transfer Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentDetails.accountHolder && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Holder</p>
                        <p className="font-medium text-gray-900">{paymentDetails.accountHolder}</p>
                      </div>
                    )}
                    {paymentDetails.bankName && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</p>
                        <p className="font-medium text-gray-900">{paymentDetails.bankName}</p>
                      </div>
                    )}
                    {paymentDetails.accountNumber && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</p>
                        <p className="font-mono text-gray-900">{paymentDetails.accountNumber}</p>
                      </div>
                    )}
                    {paymentDetails.routingNumber && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Routing Number</p>
                        <p className="font-mono text-gray-900">{paymentDetails.routingNumber}</p>
                      </div>
                    )}
                    {paymentDetails.iban && (
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">IBAN</p>
                        <p className="font-mono text-gray-900">{paymentDetails.iban}</p>
                      </div>
                    )}
                    {paymentDetails.bic && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">BIC/SWIFT</p>
                        <p className="font-mono text-gray-900">{paymentDetails.bic}</p>
                      </div>
                    )}
                  </div>
                  {paymentDetails.bankAddress && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Bank Address</p>
                      <p className="text-gray-900">{paymentDetails.bankAddress}</p>
                    </div>
                  )}
                </div>
                
                {/* Reference Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <span className="font-medium">Reference:</span> Please include invoice number #{invoiceDetails?.invoiceNumber || 'N/A'} in your payment reference.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No payment details available for this invoice.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Render the actual InvoiceClient component with server-fetched data */}
      <InvoiceClient
        requestId={(rawInvoiceData as UserRequest).id} 
        requestNetworkId={(rawInvoiceData as UserRequest).requestId || undefined} 
        walletPrivateKey={userWalletKey} 
        dbInvoiceData={rawInvoiceData as Omit<UserRequest, 'shareToken'>} 
        isExternalView={false} 
      />
    </main>
  );
} 