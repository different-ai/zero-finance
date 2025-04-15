'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useInvoice } from '@/hooks/use-invoice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// TODO: Replace this with the actual Request Network SVG code
const RequestNetworkLogo = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Placeholder content - replace with actual SVG path data */}
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10"/> 
    <text x="50" y="50" textAnchor="middle" dy=".3em" fill="currentColor" fontSize="40">RN</text>
  </svg>
);

interface CommitButtonProps {
  invoiceId: string;
  onSuccess?: () => void;
}

export function CommitButton({ invoiceId, onSuccess }: CommitButtonProps) {
  const [isCommitting, setIsCommitting] = useState(false);
  const { commitToRequestNetwork } = useInvoice();

  const handleCommit = async () => {
    setIsCommitting(true);
    try {
      await commitToRequestNetwork(invoiceId);
      toast.success('Invoice committed to Request Network successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error committing to Request Network:', error);
      toast.error('Failed to commit invoice to blockchain');
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <Button
      onClick={handleCommit}
      disabled={isCommitting}
      variant="default"
      className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800"
    >
      {isCommitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Save to <RequestNetworkLogo />
        </>
      )}
    </Button>
  );
} 