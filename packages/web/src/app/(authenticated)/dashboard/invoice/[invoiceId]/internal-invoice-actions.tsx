'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Download, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface InternalInvoiceActionsProps {
  invoiceId: string;
  invoiceNumber?: string;
  isCrypto: boolean;
  isOnChain: boolean;
  requestId?: string;
}

export default function InternalInvoiceActions({ 
  invoiceId, 
  invoiceNumber,
  isCrypto,
  isOnChain,
  requestId
}: InternalInvoiceActionsProps) {

  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async () => {
    try {
      setIsCopied(true);
      
      // Generate the simplified, permanent shareable link
      const shareUrl = `${window.location.origin}/invoice/${invoiceId}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      // Notify success
      toast.success('Invoice link copied to clipboard!');
      console.log('0xHypr DEBUG: Copied share URL:', shareUrl);

      // Reset copy state after a delay
      setTimeout(() => setIsCopied(false), 2000);

    } catch (error) {
      console.error('0xHypr', 'Error sharing invoice:', error);
      toast.error('Failed to copy sharing link. Please try again.');
      setIsCopied(false); // Reset copy state on error
    }
  };

  const handleDownload = () => {
    // Download function would go here
    setIsDownloading(true);
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      toast.success('Invoice downloaded!');
    }, 1000);
  };

  return (
    <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex ml-auto gap-2">
          {/* Simplified Share Button */}
          <Button 
            variant="outline" 
            onClick={handleShare} 
            disabled={isCopied}
          >
            {isCopied ? (
              <><Check className="h-4 w-4 mr-2" /> Copied!</>
            ) : (
              <><Copy className="h-4 w-4 mr-2" /> Copy Share Link</>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Downloading...</>
            ) : (
              <><Download className="h-4 w-4 mr-2" /> Download</>
            )}
          </Button>
        </div>
      </div>
  );
} 