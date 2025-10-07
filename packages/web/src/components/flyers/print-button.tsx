'use client';

import { Printer } from 'lucide-react';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="no-print fixed top-4 right-4 bg-[#1B29FF] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#0050ff] transition-all flex items-center gap-2 z-50"
    >
      <Printer className="w-4 h-4" />
      <span className="text-sm font-medium">Download PDF</span>
    </button>
  );
}
