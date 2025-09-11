import React from 'react';
import Link from 'next/link';
import { InvoicesClientPage } from './invoices-client-page';

export const metadata = {
  title: 'Invoices & Payments | zero finance',
  description: 'Manage invoices, invite contractors, or pay a contractor',
};

export default function InvoicesPage() {
  return (
    <>
      <div className="w-full px-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link
              href="/dashboard/create-invoice"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Pay a contractor
            </Link>
            <Link
              href="/dashboard/settings/company?tab=contractors"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-50"
            >
              Invite a contractor
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pay: create a payer-originated invoice. Invite: contractors send you
            invoices.
          </p>
        </div>
      </div>
      <InvoicesClientPage />
    </>
  );
}
