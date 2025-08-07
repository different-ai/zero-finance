import React from 'react';
import { notFound } from 'next/navigation';
import { appRouter } from '@/server/routers/_app'; // Import the main router
// import { createContext } from '@/server/context'; // Remove manual context import
import { userProfileService } from '@/lib/user-profile-service';
import { getUserId } from '@/lib/auth'; // Need getUserId here now
import InvoiceClient from '@/components/invoice/invoice-client';
import { ShareInvoiceLink } from '@/components/invoice/share-invoice-link';
import { PaymentDetailsDisplay } from '@/components/invoice/payment-details-display';
import { ExportInvoicePDFButton } from '@/components/invoice/export-invoice-pdf-button';
import { FileText, CreditCard } from 'lucide-react';
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
  sellerInfo?: {
    /* ... */
  };
  buyerInfo?: {
    /* ... */
  };
  invoiceItems?: Array<{
    /* ... */
  }>;
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
type Params = Promise<{ invoiceId: string }>;

// Define the simple logger interface matching context.ts
interface Logger {
  info: (payload: any, message: string) => void;
  error: (payload: any, message: string) => void;
  warn: (payload: any, message: string) => void;
}

// This is now a Server Component
// Update signature to accept props object
export default async function InternalInvoicePage({
  params: paramsProp, // Rename incoming prop to avoid conflict
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
    info: (payload, message) =>
      console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
    error: (payload, message) =>
      console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
    warn: (payload, message) =>
      console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
  };

  try {
    // 1. Get the current user ID first
    const currentUserId = await getUserId();
    if (!currentUserId) {
      // If no user is logged in, they can't access this internal page
      console.log(
        `InternalInvoicePage: No authenticated user for invoice ${invoiceId}`,
      );
      // This case should ideally be caught by layout/middleware, but good safety check
      return notFound();
    }
    console.log(
      `InternalInvoicePage: Authenticated user ${currentUserId} accessing invoice ${invoiceId}`,
    );

    // 2. Create the tRPC caller, explicitly passing the userId AND logger into the context
    // AND THE DB INSTANCE
    const { db } = await import('@/db'); // Import db instance
    const serverClient = appRouter.createCaller({
      userId: currentUserId,
      log,
      db,
    });

    // 3. Fetch invoice data - getById will use the ctx.userId we provided for auth
    rawInvoiceData = await serverClient.invoice.getById({ id: invoiceId });

    // If the fetch succeeded without throwing FORBIDDEN/UNAUTHORIZED, the user is authorized.
    console.log(
      `InternalInvoicePage: Successfully fetched invoice ${invoiceId} for user ${currentUserId}`,
    );

    // 4. Fetch user wallet key (since user is authorized)
    const wallet = await userProfileService.getOrCreateWallet(currentUserId);
    userWalletKey = wallet.privateKey;

    if (!userWalletKey) {
      // Handle specific case of wallet retrieval failure
      throw new Error(
        'Failed to retrieve user wallet key after successful auth.',
      );
    }
  } catch (error: any) {
    // Log the specific error that occurred during the try block
    console.error(`Error loading invoice ${invoiceId} for user:`, error);
    fetchError = error.message || 'Failed to load invoice data.';

    // Handle specific TRPC errors
    if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN') {
      // This *shouldn't* happen now if getUserId worked, but handle defensively
      console.log(
        `Authorization failed (${error.code}) unexpectedly for invoice ${invoiceId}`,
      );
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
    console.error(
      'InternalInvoicePage: Data or wallet key missing unexpectedly just before render.',
    );
    return notFound();
  }

  // Directly cast the nested data - Server fetch should already be validated by router
  const invoiceDetails =
    rawInvoiceData.invoiceData as InvoiceDetailsType | null;

  // Check if invoiceDetails exist (could be null/empty from DB)
  if (!invoiceDetails) {
    return (
      <div className="container mx-auto px-4 py-8 text-orange-500 text-center">
        Invoice data is missing or empty.
      </div>
    );
  }

  // Debug log to see what data we have
  console.log(
    'InternalInvoicePage: Invoice details:',
    JSON.stringify(invoiceDetails, null, 2),
  );

  // Extract payment details from invoice data
  const paymentDetails = invoiceDetails?.bankDetails || null;
  // Get the payment method from invoice data - fix the logic
  const paymentMethod =
    invoiceDetails?.paymentMethod ||
    (invoiceDetails?.paymentType === 'crypto' ? 'crypto' : 'ach');
  const isCrypto = paymentMethod === 'crypto' || invoiceDetails?.paymentType === 'crypto';
  const paymentAddress = invoiceDetails?.paymentAddress || null;
  
  // Fix crypto network - if it's crypto and network is 'mainnet', try to infer from currency
  let cryptoNetwork = invoiceDetails?.network || null;
  if (isCrypto && cryptoNetwork === 'mainnet') {
    // Default to base for USDC if network is incorrectly set to mainnet
    cryptoNetwork = invoiceDetails?.currency === 'USDC' ? 'base' : 'ethereum';
  }
  
  const currency = invoiceDetails?.currency || rawInvoiceData.currency || 'USD';

  console.log('InternalInvoicePage: Payment info:', {
    paymentMethod,
    paymentAddress,
    paymentDetails,
    isCrypto,
    cryptoNetwork,
    currency,
  });

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Two-column layout: invoice on left, payment on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 w-full">
          {/* Simple container; inner card handles min height to feel paper-like */}
          <div className="w-full max-w-[900px] mx-auto">
            {/* Header constrained to invoice width */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Invoice
                </h1>
                <p className="text-sm text-gray-600 mt-1">Official tax invoice and legal document</p>
              </div>
              <div className="flex gap-2">
                <ExportInvoicePDFButton invoiceId={invoiceId} invoiceData={rawInvoiceData} />
                <ShareInvoiceLink invoiceId={invoiceId} />
              </div>
            </div>
            <InvoiceClient
              requestId={(rawInvoiceData as UserRequest).id}
              requestNetworkId={(rawInvoiceData as UserRequest).requestId || undefined}
              walletPrivateKey={userWalletKey}
              dbInvoiceData={rawInvoiceData as Omit<UserRequest, 'shareToken'>}
              isExternalView={false}
            />
          </div>
        </div>

        {(() => {
          const hasFiatInfo = !isCrypto && paymentDetails && Object.values(paymentDetails).some(Boolean);
          const hasCryptoInfo = isCrypto && (Boolean(paymentAddress) || Boolean(cryptoNetwork) || Boolean(currency));
          return (hasFiatInfo || hasCryptoInfo);
        })() && (
          <div className="lg:col-span-4 w-full">
            <div className="space-y-3 h-[56px]">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Payment & Actions
                </h2>
                <p className="text-sm text-gray-600 mt-1">Payment instructions and transaction options</p>
              </div>
              <div className="sticky top-24 space-y-3">
                <PaymentDetailsDisplay
                  paymentMethod={paymentMethod}
                  paymentDetails={paymentDetails}
                  paymentAddress={paymentAddress || (isCrypto ? 'Payment address not provided' : null)}
                  currency={currency}
                  cryptoNetwork={cryptoNetwork}
                  invoiceNumber={invoiceDetails?.invoiceNumber}
                />
            
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
