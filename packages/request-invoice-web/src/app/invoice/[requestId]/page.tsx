import React from 'react';
import { notFound } from 'next/navigation';
import InvoiceDetails from '@/components/invoice-details';

interface PageProps {
  params: {
    requestId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function InvoicePage({ params, searchParams }: PageProps) {
  const { requestId } = params;
  const { token } = searchParams;

  if (!requestId || !token) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <InvoiceDetails requestId={requestId} token={token} />
    </main>
  );
}
