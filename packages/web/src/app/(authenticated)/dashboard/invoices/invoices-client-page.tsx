'use client';

import React from 'react';
import Link from 'next/link';
import { InvoiceListContainer } from '@/components/invoice/invoice-list-container';
import { ContractorInvoicesPage } from './contractor-invoices-page';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function InvoicesClientPage() {
  // For now, check if URL has contractor parameter (we'll implement proper role checking later)
  const isContractor =
    typeof window !== 'undefined' &&
    window.location.search.includes('contractor=true');

  // Show contractor view if user is a contractor
  if (isContractor) {
    return <ContractorInvoicesPage />;
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
              BILLING & PAYMENTS
            </p>
            <h1 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Invoices
            </h1>
            <p className="mt-2 text-[14px] text-[#101010]/70">
              Create, send, and track invoices for your business.
            </p>
          </div>
          <div>
            <Button
              asChild
              className="bg-[#1B29FF] hover:bg-[#1420CC] text-white"
            >
              <Link href="/dashboard/create-invoice">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <InvoiceListContainer />
    </div>
  );
}
