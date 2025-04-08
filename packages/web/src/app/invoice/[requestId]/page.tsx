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
  const { requestId } = params;
  const token = searchParams.token as string | undefined;
  console.log('0xHypr', 'requestId', requestId);

  if (!requestId) {
    return notFound();
  }

  // CASE 1: We have a token - use the ephemeral key for client-side decryption
  if (token) {
    console.log('0xHypr', 'token provided, trying to get decryption key');
    const decryptionKey = await ephemeralKeyService.getPrivateKey(token);
    console.log('0xHypr', 'token', token, 'decryptionKey', decryptionKey);
    
    if (decryptionKey) {
      return (
        <main className="container mx-auto px-4 py-8">
          <InvoiceWrapper requestId={requestId} decryptionKey={decryptionKey} />
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

  // CASE 3: User is authenticated, check if they have a wallet for this request
  console.log('0xHypr', 'User authenticated, checking if they own this request');

  // First, check if they have this request in our database
  try {
    const dbRequest = await userRequestService.getRequestById(requestId);
    if (dbRequest && dbRequest.userId === userId) {
      console.log('0xHypr', 'Found request in database for this user');
      
      // Get user wallet to access the request
      const wallet = await userProfileService.getOrCreateWallet(userId);
      const privateKey = wallet.privateKey;
      
      // Try server-side decryption to verify it works
      try {
        // Create cipher provider for verification
        const cipherProvider = new EthereumPrivateKeyCipherProvider({
          key: privateKey,
          method: Types.Encryption.METHOD.ECIES,
        });
        
        // Create request client 
        const requestClient = new RequestNetwork({
          nodeConnectionConfig: {
            baseURL: 'https://sigma-ethereum-api.request.network/api/v1',
          },
          cipherProvider,
        });
        
        // Try to fetch the request to verify access
        const request = await requestClient.fromRequestId(requestId);
        request.getData(); // This will throw if decryption fails
        
        console.log('0xHypr', 'User can decrypt this request with their wallet');
        
        // User can access this request, render it with the private key
        return (
          <main className="container mx-auto px-4 py-8">
            <InvoiceWrapper requestId={requestId} walletPrivateKey={privateKey} />
          </main>
        );
      } catch (error) {
        console.error('0xHypr', 'Error verifying user access to request:', error);
        // User wallet can't decrypt the request - show not found
        return notFound();
      }
    }
  } catch (error) {
    console.error('0xHypr', 'Error checking user ownership of request:', error);
  }

  // CASE 4: No matches - show not found
  return notFound();
}
