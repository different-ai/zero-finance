'use client';

import React from 'react';
import { SimpleInvoiceForm } from '@/components/invoice/simple-invoice-form';
import { Toaster } from 'sonner';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function CreateInvoicePage() {
  return (
    <AuthGuard>
      <div className="w-full min-h-screen bg-gray-50">
        <Toaster richColors />
        
        <div className="container mx-auto max-w-5xl p-6">
         
          <SimpleInvoiceForm />
        </div>
      </div>
    </AuthGuard>
  );
}