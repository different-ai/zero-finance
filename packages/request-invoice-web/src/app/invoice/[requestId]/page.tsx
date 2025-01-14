import React from 'react';
import { notFound } from 'next/navigation';
import { InvoiceDetails } from '@hypr/shared/src/components/invoice-details';
import { getEphemeralKey } from '@/lib/request-network';

interface PageProps {
  params: {
    requestId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function InvoicePage({ params, searchParams }: PageProps) {
  const { requestId } = params;
  const token = searchParams.token as string;

  if (!requestId || !token) {
    return notFound();
  }

  // Get the decryption key using the token
  const decryptionKey = await getEphemeralKey(token);
  if (!decryptionKey) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <InvoiceDetails requestId={requestId} decryptionKey={decryptionKey} />
    </main>
  );
}
