'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useInvoice } from '@/hooks/use-invoice';
import { toast } from 'sonner';

interface CommitButtonProps {
  invoiceId: string;
  onSuccess?: () => void;
}

export function CommitButton({ invoiceId, onSuccess }: CommitButtonProps) {
  const [isCommitting, setIsCommitting] = useState(false);
  const { commitToRequestNetwork } = useInvoice();

  const handleCommit = async () => {
    try {
      setIsCommitting(true);
      await commitToRequestNetwork(invoiceId);
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
      className="w-full"
    >
      {isCommitting ? 'Processing...' : 'Commit to Request Network'}
    </Button>
  );
} 