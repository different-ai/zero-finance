'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Share2, Check } from 'lucide-react';

interface ShareInvoiceLinkProps {
  invoiceId: string;
}

export function ShareInvoiceLink({ invoiceId }: ShareInvoiceLinkProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate the public link for this invoice
  const publicLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://app.hypr.finance'}/invoice/${invoiceId}`;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
      toast.success('Invoice link copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };
  
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share Invoice
        </>
      )}
    </button>
  );
}