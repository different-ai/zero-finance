'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/utils/trpc'; // Use client-side tRPC for mutations

interface InternalInvoiceActionsProps {
  invoiceId: string;
  invoiceNumber?: string;
  isCrypto: boolean;
  isOnChain: boolean;
  shareToken?: string;
}

export default function InternalInvoiceActions({ 
  invoiceId, 
  invoiceNumber,
  isCrypto,
  isOnChain,
  shareToken 
}: InternalInvoiceActionsProps) {

  const commitMutation = trpc.invoice.commitToRequestNetwork.useMutation({
    onSuccess: (data) => {
      toast.success(`Invoice committed to Request Network (ID: ${data.requestId})`);
      // Refreshing the page to show updated status
      window.location.reload(); 
    },
    onError: (error) => {
      toast.error(`Failed to commit invoice: ${error.message}`);
      console.error('Commit Error:', error);
    }
  });

  const handleShare = async () => {
    if (shareToken) {
      const shareUrl = `${window.location.origin}/invoice/${invoiceId}?token=${shareToken}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Shareable link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link.');
        console.error('Failed to copy share link:', err);
      }
    } else {
      toast.error('Could not generate share link (token missing).');
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
        <h1 className="text-2xl font-semibold">Invoice {invoiceNumber ? `#${invoiceNumber}` : 'Details'}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare} disabled={!shareToken}>
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          {canCommit && (
             <Button 
               variant="outline" 
               onClick={handleCommitToChain} 
               disabled={commitMutation.isPending}
             >
                {commitMutation.isPending ? (
                    <>
                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Committing...
                    </>
                 ) : (
                    <><UploadCloud className="mr-2 h-4 w-4" /> Commit to Chain</>
                 )}
             </Button>
          )}
        </div>
      </div>
  );
} 