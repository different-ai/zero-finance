'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { InvoiceCreationContainer } from '@/components/invoice/invoice-creation-container';
import { AuthGuard } from '@/components/auth/auth-guard';

export const metadata = {
  title: 'Create Invoice',
  description: 'Create an invoice using Request Network',
};

export default function CreateInvoicePage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  // If not authenticated, AuthGuard will handle redirection
  return (
    <AuthGuard>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
        <InvoiceCreationContainer />
      </main>
    </AuthGuard>
  );
}