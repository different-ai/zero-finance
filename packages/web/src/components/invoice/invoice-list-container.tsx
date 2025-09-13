'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  Download,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDFTemplate } from './invoice-pdf-template';
import type { InvoiceDisplayData } from './invoice-display';

interface Invoice {
  id: string;
  requestId: string | null;
  creationDate?: string;
  description: string;
  client: string;
  amount: string;
  currency: string;
  status: string;
  url?: string;
  role?: 'seller' | 'buyer';
  direction?: 'sent' | 'received';
}

export function InvoiceListContainer() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>(
    'all',
  );
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [directionFilter, setDirectionFilter] = useState<
    'all' | 'sent' | 'received'
  >('all');
  const [exportingInvoiceId, setExportingInvoiceId] = useState<string | null>(
    null,
  );

  const {
    data: invoiceQueryResult,
    isLoading,
    error,
    refetch,
  } = trpc.invoice.list.useQuery(
    {
      limit: 50,
      sortBy: sortBy,
      sortDirection: sortDirection,
      filter: directionFilter,
    },
    {
      staleTime: 5 * 60 * 1000,
    },
  );

  useEffect(() => {
    if (invoiceQueryResult && Array.isArray(invoiceQueryResult.items)) {
      const mappedInvoices = invoiceQueryResult.items.map((item: any) => ({
        ...item,
        url: `/dashboard/invoices/${item.id}`,
      }));
      setInvoices(mappedInvoices);
      console.log(
        '0xHypr',
        `Successfully loaded ${mappedInvoices.length} invoices via tRPC with sorting: ${sortBy} ${sortDirection}`,
      );
    } else if (invoiceQueryResult) {
      console.error(
        '0xHypr',
        'Invalid invoice data format from tRPC:',
        invoiceQueryResult,
      );
      setInvoices([]);
    } else if (error) {
      console.error('0xHypr', 'Error loading invoices via tRPC:', error);
      setInvoices([]);
    }
  }, [invoiceQueryResult, error, sortBy, sortDirection, directionFilter]);

  const loadInvoices = () => {
    refetch();
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter !== 'all' && invoice.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        invoice.description.toLowerCase().includes(q) ||
        invoice.client.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSortToggle = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const utils = trpc.useUtils();

  const handleExportPDF = async (e: React.MouseEvent, invoice: Invoice) => {
    e.stopPropagation();
    if (!invoice.id) return;
    setExportingInvoiceId(invoice.id);
    try {
      const fullInvoice = await utils.invoice.getById.fetch({ id: invoice.id });
      if (!fullInvoice || !fullInvoice.invoiceData)
        throw new Error('Failed to fetch invoice details');

      const invoiceDetails = fullInvoice.invoiceData as any;
      const invoiceData: InvoiceDisplayData = {
        invoiceNumber:
          invoiceDetails.invoiceNumber ||
          `INV-${invoice.id.slice(0, 8).toUpperCase()}`,
        creationDate: fullInvoice.createdAt || invoice.creationDate,
        status:
          fullInvoice.status === 'paid'
            ? 'Paid'
            : fullInvoice.status === 'db_pending'
              ? 'Draft'
              : 'Pending',
        sellerInfo: invoiceDetails.sellerInfo || {
          businessName: 'N/A',
          email: 'N/A',
        },
        buyerInfo: invoiceDetails.buyerInfo || {
          businessName: 'N/A',
          email: 'N/A',
        },
        invoiceItems: invoiceDetails.invoiceItems || [
          {
            name: fullInvoice.description || invoice.description,
            quantity: 1,
            unitPrice: fullInvoice.amount || invoice.amount,
            currency: fullInvoice.currency || invoice.currency,
            total: fullInvoice.amount || invoice.amount,
          },
        ],
        paymentTerms: invoiceDetails.paymentTerms,
        note: invoiceDetails.note,
        terms: invoiceDetails.terms,
        paymentType: invoiceDetails.paymentType,
        currency: fullInvoice.currency || invoice.currency,
        network: invoiceDetails.network,
        amount: fullInvoice.amount || invoice.amount,
        bankDetails: invoiceDetails.bankDetails,
        isOnChain: !!fullInvoice.requestId,
        invoiceId: fullInvoice.id,
        paidAt:
          fullInvoice.status === 'paid'
            ? (fullInvoice.updatedAt ?? undefined)
            : undefined,
      };

      const doc = <InvoicePDFTemplate invoiceData={invoiceData} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceData.invoiceNumber || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Invoice exported successfully');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Failed to export invoice as PDF');
    } finally {
      setExportingInvoiceId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B29FF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium">
            Failed to load invoices (tRPC)
          </h3>
        </div>
        <p className="text-[#101010]/70 mb-4">
          There was a problem loading your invoices. Please try again later.
        </p>
        <button
          onClick={loadInvoices}
          className="px-4 py-2 bg-[#1B29FF] text-white rounded-md hover:bg-[#1420CC] transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#101010]/10">
        <div className="bg-white p-4">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            Open
          </p>
          <p className="mt-1 font-serif text-[28px] sm:text-[32px] leading-[1] tracking-[-0.01em] text-[#101010] tabular-nums">
            {invoices.filter((i) => i.status !== 'paid').length}
          </p>
        </div>
        <div className="bg-white p-4">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            Paid
          </p>
          <p className="mt-1 font-serif text-[28px] sm:text-[32px] leading-[1] tracking-[-0.01em] text-[#101010] tabular-nums">
            {invoices.filter((i) => i.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white p-4">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            Drafts
          </p>
          <p className="mt-1 font-serif text-[28px] sm:text-[32px] leading-[1] tracking-[-0.01em] text-[#101010] tabular-nums">
            {invoices.filter((i) => i.status === 'db_pending').length}
          </p>
        </div>
      </div>

      {/* Direction filter - segmented */}
      <div className="flex items-center">
        <div className="inline-flex items-center rounded-md border border-[#101010]/20 bg-white p-0.5">
          <button
            onClick={() => setDirectionFilter('all')}
            className={`${directionFilter === 'all' ? 'bg-[#F6F5EF] text-[#101010]' : 'text-[#101010]/60 hover:text-[#101010]'} px-3 py-1.5 text-[13px] rounded-md`}
          >
            All
          </button>
          <button
            onClick={() => setDirectionFilter('sent')}
            className={`${directionFilter === 'sent' ? 'bg-[#F6F5EF] text-[#101010]' : 'text-[#101010]/60 hover:text-[#101010]'} px-3 py-1.5 text-[13px] rounded-md inline-flex items-center`}
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Outgoing
          </button>
          <button
            onClick={() => setDirectionFilter('received')}
            className={`${directionFilter === 'received' ? 'bg-[#F6F5EF] text-[#101010]' : 'text-[#101010]/60 hover:text-[#101010]'} px-3 py-1.5 text-[13px] rounded-md inline-flex items-center`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Incoming
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:gap-4 md:justify-between">
        <div className="flex flex-1 items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-[#101010]/40" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#101010]/20 rounded-md text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#101010]/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-grow sm:flex-grow-0">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-[#101010]/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 border border-[#101010]/20 rounded-md appearance-none bg-white text-[#101010]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
            <button
              onClick={loadInvoices}
              className="p-2 border border-[#101010]/20 rounded-md hover:bg-[#F6F5EF] transition-colors"
              title="Refresh invoices"
            >
              <svg
                className="h-5 w-5 text-[#101010]/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white border border-[#101010]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#101010]/10 text-[13px]">
            <thead className="bg-[#F7F7F2]">
              <tr>
                <th
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#101010]/60 uppercase tracking-[0.14em] cursor-pointer"
                  onClick={() => handleSortToggle('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortBy === 'date' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                  Direction
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                  Description
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                  Client
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-[#101010]/60 uppercase tracking-[0.14em] cursor-pointer"
                  onClick={() => handleSortToggle('amount')}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    {sortBy === 'amount' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#101010]/10">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-[#F6F5EF] cursor-pointer transition-colors"
                    onClick={() => {
                      if (invoice.url) {
                        window.location.href = invoice.url;
                      }
                    }}
                  >
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-[#101010]">
                      {invoice.creationDate
                        ? format(new Date(invoice.creationDate), 'MMM d, yyyy')
                        : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {invoice.direction === 'received' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#101010]/5 text-[#101010]">
                          <ArrowLeft className="h-3 w-3 mr-1" /> Incoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#101010]/5 text-[#101010]">
                          <ArrowRight className="h-3 w-3 mr-1" /> Outgoing
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-[#101010]/70 max-w-[120px] sm:max-w-[200px] truncate">
                      {invoice.description}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-[#101010]/70 max-w-[100px] sm:max-w-[150px] truncate">
                      {invoice.client}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm text-[#101010] tabular-nums">
                      {invoice.amount} {invoice.currency}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-[#1B29FF]/10 text-[#1B29FF]' : invoice.status === 'db_pending' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#101010]/10 text-[#101010]/80'}`}
                      >
                        {invoice.status === 'db_pending'
                          ? 'Pending'
                          : invoice.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {invoice.url && (
                          <Link
                            href={invoice.url}
                            className="text-[#1B29FF] hover:text-[#1420CC]"
                            title="View invoice"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <button
                          onClick={(e) => handleExportPDF(e, invoice)}
                          className="text-[#101010]/70 hover:text-[#101010]"
                          title="Export as PDF"
                          disabled={exportingInvoiceId === invoice.id}
                        >
                          {exportingInvoiceId === invoice.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 sm:px-6 py-10 text-center text-sm text-[#101010]/70"
                  >
                    No invoices found. Create your first invoice to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
