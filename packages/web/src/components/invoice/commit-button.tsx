'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useInvoice } from '@/hooks/use-invoice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
      className="w-full flex items-center justify-center gap-2"
    >
      {isCommitting && <Loader2 className="h-4 w-4 animate-spin" />}
      {isCommitting ? 'Processing...' : 'Commit to Request Network'}
    </Button>
  );
} 