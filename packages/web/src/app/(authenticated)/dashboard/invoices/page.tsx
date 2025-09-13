import React from 'react';
import Link from 'next/link';
import { InvoicesClientPage } from './invoices-client-page';

export const metadata = {
  title: 'Invoices & Payments | zero finance',
  description: 'Manage invoices, invite contractors, or pay a contractor',
};

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <div className="border-b border-[#101010]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex flex-col space-y-6">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                CONTRACTOR PAYMENTS
              </p>
              <h1 className="font-serif text-[36px] sm:text-[48px] leading-[0.96] tracking-[-0.01em] text-[#101010]">
                Invoices & Payments
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/create-invoice"
                className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              >
                Pay Contractor →
              </Link>
              <Link
                href="/dashboard/settings/company?tab=contractors"
                className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-medium text-[#101010] bg-white border border-[#101010]/10 hover:border-[#101010]/20 rounded-md transition-colors"
              >
                Invite Contractor
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#101010]/10 max-w-[600px]">
              <div className="bg-[#F7F7F2] p-4">
                <p className="text-[13px] font-medium text-[#101010] mb-1">
                  Direct Payment
                </p>
                <p className="text-[12px] text-[#101010]/70 leading-relaxed">
                  Create and send payments directly to contractors
                </p>
              </div>
              <div className="bg-[#F7F7F2] p-4">
                <p className="text-[13px] font-medium text-[#101010] mb-1">
                  Invoice Request
                </p>
                <p className="text-[12px] text-[#101010]/70 leading-relaxed">
                  Contractors submit invoices for your approval
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <InvoicesClientPage />
      </div>
    </div>
  );
}
