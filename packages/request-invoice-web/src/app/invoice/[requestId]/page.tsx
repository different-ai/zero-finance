
import React from 'react';
import { notFound } from 'next/navigation';
import { InvoiceDetails } from '@hypr/shared/src/components/invoice-details';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';
interface PageProps {
  params: {
    requestId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}
const URL = process.env.NODE_ENV === 'production' ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3050';

export default async function InvoicePage({ params, searchParams }: PageProps) {
  const { requestId } = await params;
  const { token } = await searchParams;

  if (!requestId || !token) {
    return notFound();
  }

  console.log('0xHypr', 'token', token)
  // Get the decryption key using the token
  const decryptionKey = await ephemeralKeyService.getPrivateKey(token as string);
  console.log('0xHypr', 'decryptionKey', decryptionKey)
  if (!decryptionKey) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <InvoiceDetails requestId={requestId} decryptionKey={decryptionKey} />
    </main>
  );
}
