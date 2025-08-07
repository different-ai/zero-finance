'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDFTemplate } from '@/components/invoice/invoice-pdf-template';
import type { InvoiceDisplayData } from '@/components/invoice/invoice-display';
import { toast } from 'sonner';

export function useInvoicePDFExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async (invoiceData: InvoiceDisplayData) => {
    setIsExporting(true);
    try {
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
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to export invoice as PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return { exportPDF, isExporting };
}
