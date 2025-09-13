import React from 'react';
import { InvoicesClientPage } from './invoices-client-page';

export const metadata = {
  title: 'Invoices & Payments | zero finance',
  description: 'Manage invoices, invite contractors, or pay a contractor',
};

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <div className="max-w-[1200px] mx-auto">
        <InvoicesClientPage />
      </div>
    </div>
  );
}
