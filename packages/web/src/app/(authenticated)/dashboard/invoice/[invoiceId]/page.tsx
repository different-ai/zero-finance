import React from 'react';
import { notFound } from 'next/navigation';
import { appRouter } from '@/server/routers/_app'; // Import the main router
// import { createContext } from '@/server/context'; // Remove manual context import
import { userProfileService } from '@/lib/user-profile-service';
import { getUserId } from '@/lib/auth'; // Need getUserId here now
import InvoiceClient from '@/components/invoice/invoice-client';
import InternalInvoiceActions from '@/app/(authenticated)/dashboard/invoice/[invoiceId]/internal-invoice-actions';
// import { UserRequest } from '@/db/schema'; // Remove DB import
// import { invoiceDataSchema } from '@/server/routers/invoice-router'; // REMOVE Zod schema import
// import { z } from 'zod'; // REMOVE zod import

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
  currency?: string;
  network?: string;
  bankDetails?: { /* ... */ } | null;
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
  status: 'pending' | 'paid' | 'db_pending' | 'committing' | 'failed' | 'canceled' | null;
  client: string | null;
  invoiceData: any; // Keep as any for now, structure defined in InvoiceDetailsType
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
}


// This is now a Server Component
export default async function InternalInvoicePage({ 
  params 
}: {
  params: { invoiceId: string };
}) {
  const invoiceId = params?.invoiceId;

  if (!invoiceId) {
    return notFound();
  }
  
  // --- Server-Side Data Fetching & Auth --- 
  let rawInvoiceData: UserRequest | null = null; 
  let userWalletKey: string | null = null;
  let fetchError: string | null = null;

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

    // 2. Create the tRPC caller, explicitly passing the userId into the context
    const serverClient = appRouter.createCaller({ userId: currentUserId }); 

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

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <InternalInvoiceActions 
         invoiceId={(rawInvoiceData as UserRequest).id} 
         invoiceNumber={invoiceDetails.invoiceNumber}
         isCrypto={invoiceDetails.paymentType === 'crypto'}
         isOnChain={!!(rawInvoiceData as UserRequest).requestId} 
      />

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