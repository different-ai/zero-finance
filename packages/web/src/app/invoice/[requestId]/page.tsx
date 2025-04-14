import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';
import { getUserId, getUser } from '@/lib/auth';
import { userProfileService } from '@/lib/user-profile-service';
import { userRequestService } from '@/lib/user-request-service';
import { RequestNetwork } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { Types } from '@requestnetwork/request-client.js';
import { InvoiceWrapper } from '@/components/invoice/invoice-wrapper';
import { addresses } from '@/app/api/wallet/addresses-store';

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: { requestId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const requestId = params?.requestId;
  const token = searchParams?.token as string | undefined;
  console.log('0xHypr', 'requestId', requestId);

  if (!requestId) {
    return notFound();
  }

  // First, always try to get the invoice data from our database
  // regardless of authentication status or token
  try {
    // First try to get by Request Network ID (stored as requestId in DB)
    let dbRequest = await userRequestService.getRequestById(requestId);
    
    // If not found, try to get by primary key (UUID) - handles DB-only invoices without RN IDs
    if (!dbRequest) {
      dbRequest = await userRequestService.getRequestByPrimaryKey(requestId);
    }
    
    if (dbRequest) {
      console.log('0xHypr', 'Found request in database:', requestId);
      
      // CASE 1: We have a token - use the ephemeral key for client-side decryption
      if (token) {
        console.log('0xHypr', 'token provided, trying to get decryption key');
        const decryptionKey = await ephemeralKeyService.getPrivateKey(token);
        console.log('0xHypr', 'token', token, 'decryptionKey', decryptionKey);
        
        if (decryptionKey) {
          return (
            <main className="container mx-auto px-4 py-8">
              <InvoiceWrapper 
                requestId={dbRequest.id}
                requestNetworkId={dbRequest.requestId || undefined}
                decryptionKey={decryptionKey}
                dbInvoiceData={dbRequest}
              />
            </main>
          );
        }
      }
      
      // CASE 2: No token or invalid token, check if user is authenticated
      console.log('0xHypr', 'No valid token, checking user authentication');
      const userId = await getUserId();
      
      if (!userId) {
        console.log('0xHypr', 'User not authenticated, showing not found');
        // No auth, no token - show not found
        return notFound();
      }
      
      // CASE 3: User is authenticated, check if they have access to this invoice
      if (dbRequest.userId === userId) {
        console.log('0xHypr', 'User owns this invoice, displaying from database');
        
        // Get user wallet to access the request
        const wallet = await userProfileService.getOrCreateWallet(userId);
        const privateKey = wallet.privateKey;
        
        // Render with wallet key and DB data
        return (
          <main className="container mx-auto px-4 py-8">
            <InvoiceWrapper 
              requestId={dbRequest.id}
              requestNetworkId={dbRequest.requestId || undefined}
              walletPrivateKey={privateKey}
              dbInvoiceData={dbRequest}
            />
          </main>
        );
      }
    }
  } catch (dbError) {
    console.error('0xHypr', 'Error fetching request from database:', dbError);
    // Continue to blockchain lookup if database fetch fails
  }

  // If we reach here, database lookup either failed or request wasn't in DB
  // Fall back to blockchain lookup
  
  // CASE 4: Try token-based access via blockchain (DB fallback not available here)
  if (token) {
    console.log('0xHypr', 'Trying blockchain access with token');
    const decryptionKey = await ephemeralKeyService.getPrivateKey(token);
    
    if (decryptionKey) {
      // IMPORTANT: If DB fetch failed, we don't have dbInvoiceData here.
      // We also don't know the DB ID (passed as requestId) vs RN ID.
      // This case assumes the original `requestId` param IS the RN ID.
      try {
        return (
          <main className="container mx-auto px-4 py-8">
            <InvoiceWrapper 
              requestId={requestId} // Assume this is the RN ID if DB fetch failed
              requestNetworkId={requestId} // Pass it as RN ID as well
              decryptionKey={decryptionKey}
              // No dbInvoiceData here
            />
          </main>
        );
      } catch (error) {
        console.error('0xHypr', 'Error rendering invoice with token (blockchain only):', error);
      }
    }
  }

  // CASE 5: Try authenticated user blockchain access (DB fallback not available here)
  console.log('0xHypr', 'Trying blockchain access with user wallet');
  const userId = await getUserId();

  if (!userId) {
    console.log('0xHypr', 'User not authenticated, showing not found');
    return notFound();
  }

  // Try to access via user wallet
  try {
    const wallet = await userProfileService.getOrCreateWallet(userId);
    const privateKey = wallet.privateKey;
    
    // Verify access server-side first (using the original requestId param)
    // Assume original requestId param IS the RN ID if DB fetch failed
    try {
      const cipherProvider = new EthereumPrivateKeyCipherProvider({
        key: privateKey,
        method: Types.Encryption.METHOD.ECIES,
      });
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: { baseURL: 'https://gnosis.gateway.request.network/' }, // Adjust endpoint if needed
        cipherProvider,
      });
      const request = await requestClient.fromRequestId(requestId);
      await request.getData(); // Verify decryption works
      
      console.log('0xHypr', 'User can decrypt this request with their wallet (blockchain only)');
      
      // Render using wallet key, assuming original param is RN ID
      return (
        <main className="container mx-auto px-4 py-8">
          <InvoiceWrapper 
            requestId={requestId} // Assume this is the RN ID
            requestNetworkId={requestId} // Pass it as RN ID
            walletPrivateKey={privateKey} 
            // No dbInvoiceData here
          />
        </main>
      );
    } catch (error) {
      console.error('0xHypr', 'Error verifying user access to request (blockchain only):', error);
      return notFound(); // User wallet can't decrypt the RN request
    }
  } catch (error) {
    console.error('0xHypr', 'Error checking user ownership (blockchain only):', error);
  }

  // CASE 6: No matches - show not found
  console.log('0xHypr', 'No valid access path found for invoice:', requestId);
  return notFound();
}
