'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';

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
      toast.success('Link copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Share Invoice</h2>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={publicLink}
          readOnly
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-[#0040FF] text-white rounded-md hover:bg-[#0040FF]/90 transition-colors text-sm font-medium flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Share this link with your client to allow them to view and pay this invoice
      </p>
    </div>
  );
}