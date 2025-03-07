import React from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';
import { InvoiceContainer } from '@/components/invoice/invoice-container';

// Use dynamic import with SSR disabled to avoid server-side React hooks errors
;

type PageProps = {
  params: {
    requestId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function InvoicePage({ params, searchParams }: PageProps) {
  const { requestId } = params;
  const token = searchParams.token as string | undefined;
  console.log('0xHypr', 'requestId', requestId);

  if (!requestId || !token) {
    return notFound();
  }

  console.log('0xHypr', 'token', token);
  // Get the decryption key using the token
  const decryptionKey = await ephemeralKeyService.getPrivateKey(token);
  console.log('0xHypr', 'token', token, 'decryptionKey', decryptionKey);
  
  if (!decryptionKey) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <InvoiceContainer requestId={requestId} decryptionKey={decryptionKey} />
    </main>
  );
}
