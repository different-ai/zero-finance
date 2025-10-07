'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

interface PDFExportButtonProps {
  flyerId: string;
  flyerName: string;
  pageSize: 'letter' | 'postcard';
}

export function PDFExportButton({
  flyerId,
  flyerName,
  pageSize,
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;

      const element = document.querySelector('.flyer-container') as HTMLElement;
      if (!element) {
        alert('Flyer not found');
        return;
      }

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        width: element.offsetWidth,
        height: element.offsetHeight,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      let pdf;
      if (pageSize === 'letter') {
        // Letter size: 8.5" x 11"
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'in',
          format: 'letter',
        });

        // Fill the page width completely
        const pdfWidth = 8.5;
        const pdfHeight = 11;

        // Calculate height based on canvas aspect ratio
        const canvasRatio = canvas.height / canvas.width;
        const imgHeight = pdfWidth * canvasRatio;

        if (imgHeight <= pdfHeight) {
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight, '', 'SLOW');
        } else {
          const imgWidth = pdfHeight / canvasRatio;
          const x = (pdfWidth - imgWidth) / 2;
          pdf.addImage(imgData, 'PNG', x, 0, imgWidth, pdfHeight, '', 'SLOW');
        }
      } else {
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'in',
          format: [4.25, 5.5],
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;

        let width = pdfWidth;
        let height = width / ratio;

        if (height > pdfHeight) {
          height = pdfHeight;
          width = height * ratio;
        }

        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;

        pdf.addImage(imgData, 'PNG', x, y, width, height, '', 'SLOW');
      }

      pdf.save(
        `${flyerId}_${flyerName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      );
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className="no-print fixed top-4 right-4 bg-[#1B29FF] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#0050ff] transition-all flex items-center gap-2 z-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      <span className="text-sm font-medium">
        {isExporting ? 'Generating PDF...' : 'Download PDF'}
      </span>
    </button>
  );
}
