'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRequestClient, getEphemeralKey } from '@/lib/request-network';
import { Invoice } from '@/types/invoice';

export default function InvoiceDetails({ requestId, token }: { requestId: string, token: string }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchRequestData() {
      try {
        console.log('0xHypr', 'token', token);
        if (!token) {
          throw new Error('No decryption token provided');
        }

        // Get the ephemeral private key using the token
        const privateKey = await getEphemeralKey(token);
        console.log('0xHypr', 'privateKey', privateKey);
        if (!privateKey) {
          throw new Error('Failed to retrieve decryption key');
        }

        // Initialize request client with the ephemeral key
        const requestClient = await getRequestClient(privateKey);
        console.log('0xHypr', 'requestClient', requestClient);
        // Fetch and decrypt the request
        const request = await requestClient.fromRequestId(requestId);
        console.log('0xHypr', 'request', request);
        const data = request.getData();
        console.log('0xHypr', 'data', data);  
        
        if (!data) {
          throw new Error('No data found for this request');
        }

        setInvoice(data.contentData as Invoice);
      } catch (err) {
        console.error('Error fetching request:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    }

    fetchRequestData();
  }, [requestId, searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!invoice) {
    return <div>No invoice data found</div>;
  }

  return (
    <div>
      <h1>Invoice Details</h1>
      <pre>{JSON.stringify(invoice, null, 2)}</pre>
    </div>
  );
} 