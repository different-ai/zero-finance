import React from 'react';
import { notFound } from 'next/navigation';
import { getRequestClient } from '@/lib/request-network';
import InvoiceDetails from '@/components/InvoiceDetails';

interface PageProps {
  params: {
    requestId: string;
  };
}

export default async function InvoicePage({ params }: PageProps) {
  const { requestId } = params;

  try {
    // Initialize Request client
    const requestClient = getRequestClient();

    // Fetch request data
    const request = await requestClient.fromRequestId(requestId);
    const requestData = request.getData();

    if (!requestData) {
      return notFound();
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <InvoiceDetails 
          requestData={requestData}
          requestId={requestId}
        />
      </main>
    );
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return notFound();
  }
}
