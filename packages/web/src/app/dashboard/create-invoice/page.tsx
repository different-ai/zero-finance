'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { InvoiceCreationContainer } from '@/components/invoice/invoice-creation-container';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function CreateInvoicePage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  // Since this is now within the dashboard layout, no need for additional layout containers
  return (
    <AuthGuard>
      <div>
        {/* <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1> */}
        <InvoiceCreationContainer />
      </div>
    </AuthGuard>
  );
} 