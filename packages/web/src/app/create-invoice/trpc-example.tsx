'use client';

import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Simple invoice form component
export function CreateInvoiceWithTRPC() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Get the createInvoice mutation from tRPC
  const createInvoiceMutation = trpc.invoice.create.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setLoading(false);
    },
    onError: (error) => {
      console.error('Failed to create invoice:', error);
      setResult({ error: error.message });
      setLoading(false);
    }
  });

  // Example function to create a simple invoice
  const handleCreateInvoice = async () => {
    setLoading(true);
    setResult(null);

    // Create a sample invoice - in real app, this would be form data
    const invoiceData = {
      meta: {
        format: 'invoice',
        version: '2.0.0',
      },
      network: 'gnosis',
      creationDate: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}`,
      sellerInfo: {
        businessName: 'My Company',
        email: 'business@example.com',
      },
      buyerInfo: {
        businessName: 'Client Company',
        email: 'client@example.com',
      },
      invoiceItems: [
        {
          name: 'Web Development',
          quantity: 1,
          unitPrice: '1000',
          currency: 'EUR',
          tax: {
            type: 'percentage' as const,
            amount: '20',
          },
        },
      ],
      paymentType: 'crypto' as const,
      currency: 'EUR',
    };

    // Submit using tRPC mutation
    createInvoiceMutation.mutate(invoiceData);
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Create Invoice with tRPC</h3>
      
      <Button 
        onClick={handleCreateInvoice} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Creating...' : 'Create Sample Invoice'}
      </Button>

      {result && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Result:</h4>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 