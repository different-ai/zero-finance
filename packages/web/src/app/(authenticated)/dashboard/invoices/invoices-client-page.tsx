'use client';

import React from 'react';
import Link from 'next/link';
import { InvoiceListContainer } from '@/components/invoice/invoice-list-container';
import { ContractorInvoicesPage } from './contractor-invoices-page';

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
              CONTRACTOR PAYMENTS
            </p>
            <h1 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Invoices
            </h1>
            <p className="mt-2 text-[14px] text-[#101010]/70">
              Create, receive and track contractor invoices.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/create-invoice"
              className="inline-flex items-center px-6 py-3 text-[15px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
            >
              Create Invoice →
            </Link>
            <Link
              href="/dashboard/create-invoice"
              className="inline-flex items-center px-6 py-3 text-[15px] font-medium text-[#101010] bg-white hover:bg-[#F7F7F2] border border-[#101010]/10 rounded-md transition-colors"
            >
              Pay Contractor
            </Link>
            <Link
              href="/dashboard/settings/company?tab=contractors"
              className="inline-flex items-center text-[15px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
            >
              Invite Contractor
            </Link>
          </div>
        </div>
      </div>

      <InvoiceListContainer />
    </div>
  );
}
