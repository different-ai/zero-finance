'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

interface MarkAsPaidButtonProps {
  invoiceId: string;
  disabled?: boolean;
}

export function MarkAsPaidButton({ invoiceId, disabled }: MarkAsPaidButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatusMutation = api.invoice.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Invoice marked as paid');
      setIsUpdating(false);
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
      setIsUpdating(false);
    },
  });

  const handleMarkAsPaid = () => {
    if (!invoiceId) return;
    setIsUpdating(true);
    updateStatusMutation.mutate({ id: invoiceId, status: 'paid' });
  };

  return (
    <Button onClick={handleMarkAsPaid} disabled={disabled || isUpdating} className="gap-2">
      {isUpdating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4" />
          Mark as Paid
        </>
      )}
    </Button>
  );
}
