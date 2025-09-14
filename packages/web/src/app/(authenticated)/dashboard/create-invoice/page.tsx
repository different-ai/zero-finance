'use client';

import React from 'react';
import { SimpleInvoiceForm } from '@/components/invoice/simple-invoice-form';
import { Toaster } from 'sonner';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function CreateInvoicePage() {
  return (
    <AuthGuard>
      <div className="w-full min-h-screen bg-[#F7F7F2]">
        <Toaster richColors />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-6">
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
              INVOICES
            </p>
            <h1 className="mt-2 font-serif text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Create Invoice
            </h1>
          </div>

          <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-6">
            <SimpleInvoiceForm />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
