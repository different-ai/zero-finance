import React from 'react';
import { notFound } from 'next/navigation';
import InvoiceDetails from '@/components/InvoiceDetails';

interface PageProps {
  params: {
    requestId: string;
  };
}

export default function InvoicePage({ params }: PageProps) {
  const { requestId } = params;

  if (!requestId) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <InvoiceDetails requestId={requestId} />
    </main>
  );
}
