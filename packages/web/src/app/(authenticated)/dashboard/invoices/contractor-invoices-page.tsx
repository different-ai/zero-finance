'use client';

import React from 'react';
import Link from 'next/link';
import { InvoiceListContainer } from '@/components/invoice/invoice-list-container';
import { Plus, Send, DollarSign, Clock } from 'lucide-react';

export function ContractorInvoicesPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="border-b border-[#101010]/10 bg-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                CONTRACTOR PORTAL
              </p>
              <h1 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                My Invoices
              </h1>
              <p className="mt-2 text-[14px] text-[#101010]/70">
                Submit and track your invoices for payment.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/create-invoice"
                className="inline-flex items-center px-6 py-3 text-[15px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Invoice
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats for Contractors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                PENDING
              </p>
              <p className="mt-2 font-serif text-[24px] leading-[1.1] text-[#101010]">
                $12,500
              </p>
            </div>
            <Clock className="h-5 w-5 text-[#101010]/40" />
          </div>
        </div>

        <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                APPROVED
              </p>
              <p className="mt-2 font-serif text-[24px] leading-[1.1] text-green-600">
                $45,000
              </p>
            </div>
            <Send className="h-5 w-5 text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                TOTAL EARNED
              </p>
              <p className="mt-2 font-serif text-[24px] leading-[1.1] text-[#1B29FF]">
                $125,750
              </p>
            </div>
            <DollarSign className="h-5 w-5 text-[#1B29FF]" />
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <InvoiceListContainer />
    </div>
  );
}
