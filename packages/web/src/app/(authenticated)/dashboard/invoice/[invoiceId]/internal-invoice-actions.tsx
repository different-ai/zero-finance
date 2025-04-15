'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Share2,
  UploadCloud,
  Check,
  Share,
  Download,
  Loader2,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/utils/trpc'; // Use client-side tRPC for mutations

import Image from 'next/image';
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
  requestId,
}: InternalInvoiceActionsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const commitMutation = trpc.invoice.commitToRequestNetwork.useMutation({
    onSuccess: (data) => {
      toast.success(
        `Invoice committed to Request Network (ID: ${data.requestId})`,
      );
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Failed to commit invoice: ${error.message}`);
      console.error('Commit Error:', error);
    },
  });

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

  const handleCommitToChain = () => {
    if (!isOnChain && isCrypto) {
      commitMutation.mutate({ invoiceId });
    } else {
      toast.info('Invoice is already on-chain or not a crypto invoice.');
    }
  };

  const canCommit = isCrypto && !isOnChain;

  return (
    <div className="flex justify-between items-center mb-6 border-b pb-4">
      <div className="flex ml-auto gap-2">
        {/* Simplified Share Button */}
        <Button variant="outline" onClick={handleShare} disabled={isCopied}>
          {isCopied ? (
            <>
              <Check className="h-4 w-4 mr-2" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" /> Copy Share Link
            </>
          )}
        </Button>
        {canCommit && (
          <Button
            variant="outline"
            className="flex items-center bg-black text-white"
            onClick={handleCommitToChain}
            disabled={commitMutation.isPending}
          >
            {commitMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Committing...
                <Image
                  src="/request-req-logo.png" // Correct logo path
                  alt="Request Network Logo"
                  width={14} // Slightly smaller to fit padding
                  height={14}
                  style={{ objectFit: 'contain' }} // Ensure logo scales nicely
                />
              </>
            ) : (
              <>
              Use
                <Image
                  src="/request-req-logo.png" // Correct logo path
                  alt="Request Network Logo"
                  width={14} // Slightly smaller to fit padding
                  height={14}
                  style={{ objectFit: 'contain' }} // Ensure logo scales nicely
                />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
