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
  requestId: string;
  decryptionKey?: string;
  walletPrivateKey?: string;
}

export function InvoiceWrapper({ requestId, decryptionKey, walletPrivateKey }: InvoiceWrapperProps) {
  // Case 1: We have a decryption key (token-based access)
  if (decryptionKey) {
    return <InvoiceContainer requestId={requestId} decryptionKey={decryptionKey} />;
  }
  
  // Case 2: We have a wallet private key (account-based access)
  if (walletPrivateKey) {
    return <InvoiceClient requestId={requestId} walletPrivateKey={walletPrivateKey} />;
  }
  
  // Fallback (should not happen due to server-side checks)
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <p>Invalid invoice access configuration.</p>
    </div>
  );
}