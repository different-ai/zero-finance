'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Share2,
  UploadCloud,
  Check,
  Share,
  Download,
  Loader2,
  Copy,
  ChevronDown,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { api } from '@/trpc/react'; // Use client-side tRPC for mutations
import type { InvoiceStatus } from '@/db/schema'; // Import the type

import Image from 'next/image';

interface InternalInvoiceActionsProps {
  invoiceId: string;
  invoiceNumber?: string;
  isCrypto: boolean;
  isOnChain: boolean;
  requestId?: string;
  currentStatus: InvoiceStatus; // Prop uses the type
}

// Manually define the allowed status values as strings (must match InvoiceStatus type)
const allowedStatuses: InvoiceStatus[] = [
  'pending', 
  'paid', 
  'canceled',
  // Do not include internal/transient states like db_pending, committing, failed here
  // unless you specifically want users to be able to manually set them.
];

export default function InternalInvoiceActions({
  invoiceId,
  invoiceNumber,
  isCrypto,
  isOnChain,
  requestId,
  currentStatus,
}: InternalInvoiceActionsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const utils = api.useUtils();

  const updateStatusMutation = api.invoice.updateStatus.useMutation({
    onSuccess: (data) => {
      const newStatus = data.status as InvoiceStatus;
      toast.success(`Invoice status updated to ${formatStatusName(newStatus)}`);
      setSelectedStatus(newStatus);
      utils.invoice.getById.invalidate({ id: invoiceId });
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
      setSelectedStatus(currentStatus);
      console.error('Status Update Error:', error);
    },
  });

  const handleShare = async () => {
    try {
      setIsCopied(true);
      const shareUrl = `${window.location.origin}/invoice/${invoiceId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Invoice link copied to clipboard!');
      console.log('0xHypr DEBUG: Copied share URL:', shareUrl);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('0xHypr', 'Error sharing invoice:', error);
      toast.error('Failed to copy sharing link. Please try again.');
      setIsCopied(false);
    }
  };

  const handleStatusChange = (newStatusValue: string) => {
    // Cast the incoming string to the type
    const newStatus = newStatusValue as InvoiceStatus;
    // Check if the string value is in our manually defined list
    if ((allowedStatuses as string[]).includes(newStatus)) {
      setSelectedStatus(newStatus);
      updateStatusMutation.mutate({ id: invoiceId, status: newStatus });
    } else {
      console.error("Invalid status value selected:", newStatusValue);
      toast.error("Invalid status selected.");
      setSelectedStatus(currentStatus);
    }
  };

  const isUpdatingStatus = updateStatusMutation.isPending;

  // Helper uses the type
  const formatStatusName = (status: InvoiceStatus): string => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'canceled': return 'Canceled';
      case 'db_pending': return 'DB Pending';
      case 'committing': return 'Committing';
      case 'failed': return 'Failed';
      default:
        const exhaustiveCheck: never = status;
        return status;
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 border-b pb-4">
      <div className="flex items-center space-x-2">
        {/* Status Update Dropdown */}
        <Select
          value={selectedStatus} // Bind to state (typed)
          onValueChange={handleStatusChange}
          disabled={isUpdatingStatus}
        >
          <SelectTrigger className="w-[180px]" disabled={isUpdatingStatus}>
            {isUpdatingStatus && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <SelectValue placeholder="Change Status">
              {/* Display formatted name based on state (typed) */}
              {formatStatusName(selectedStatus)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {/* Iterate over the manually defined allowedStatuses array */}
            {allowedStatuses.map((status: InvoiceStatus) => ( // Explicitly type status here
              <SelectItem key={status} value={status}>
                {/* Pass typed status to formatter */}
                {formatStatusName(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex ml-auto gap-2">
        {/* Simplified Share Button */}
        <Button variant="outline" onClick={handleShare} disabled={isCopied}>
          {isCopied ? (
            <><Check className="h-4 w-4 mr-2" /> Copied!</>
          ) : (
            <><Copy className="h-4 w-4 mr-2" /> Copy Share Link</>
          )}
        </Button>
      </div>
    </div>
  );
}
