'use client';

import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvoicePDFExport } from '@/hooks/use-invoice-pdf-export';
import { trpc } from '@/utils/trpc';
import type { InvoiceDisplayData } from './invoice-display';

interface ExportInvoicePDFButtonProps {
  invoiceId: string;
  invoiceData?: any; // Optional pre-fetched data to avoid refetch on server page
}

export function ExportInvoicePDFButton({ invoiceId, invoiceData }: ExportInvoicePDFButtonProps) {
  const { exportPDF, isExporting } = useInvoicePDFExport();
  const utils = trpc.useUtils();

  const handleExport = async () => {
    try {
      const fullInvoice = invoiceData || await utils.invoice.getById.fetch({ id: invoiceId });
      if (!fullInvoice || !fullInvoice.invoiceData) {
        throw new Error('Failed to fetch invoice details');
      }

      const details = fullInvoice.invoiceData as any;

      const displayData: InvoiceDisplayData = {
        invoiceNumber: details.invoiceNumber || `INV-${invoiceId.slice(0, 8).toUpperCase()}`,
        creationDate: fullInvoice.createdAt,
        status: fullInvoice.status === 'paid' ? 'Paid' : fullInvoice.status === 'db_pending' ? 'Draft' : 'Pending',
        paidAt: fullInvoice.status === 'paid' ? fullInvoice.updatedAt : undefined,
        sellerInfo: details.sellerInfo || { businessName: 'N/A', email: 'N/A' },
        buyerInfo: details.buyerInfo || { businessName: 'N/A', email: 'N/A' },
        invoiceItems: details.invoiceItems || [{
          name: fullInvoice.description,
          quantity: 1,
          unitPrice: fullInvoice.amount,
          currency: fullInvoice.currency,
          total: fullInvoice.amount,
        }],
        paymentTerms: details.paymentTerms,
        note: details.note,
        terms: details.terms,
        paymentType: details.paymentType,
        currency: fullInvoice.currency,
        network: details.network,
        amount: fullInvoice.amount,
        bankDetails: details.bankDetails,
        isOnChain: !!fullInvoice.requestId,
        invoiceId: fullInvoice.id,
      };

      await exportPDF(displayData);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-60"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Export PDF
        </>
      )}
    </button>
  );
}
