import { useState } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod/v4';
import { invoiceDataSchema } from '@/server/routers/invoice-router';
import { trpc } from '@/utils/trpc';

type InvoiceData = z.infer<typeof invoiceDataSchema>;

export function useInvoice() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  
  const createMutation = trpc.invoice.create.useMutation({
    onSuccess: () => {
      toast.success('Invoice created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create invoice: ${error.message}`);
    },
  });
  
  // const commitMutation = trpc.invoice.commitToRequestNetwork.useMutation({
  //   onSuccess: (data) => {
  //     if (data.alreadyCommitted) {
  //       toast.info('This invoice is already on the blockchain');
  //     } else {
  //       toast.success('Invoice committed to the blockchain successfully');
  //     }
  //   },
  //   onError: (error: any) => {
  //     toast.error(`Failed to commit invoice to blockchain: ${error.message}`);
  //   },
  // });

  const invoicesQuery = trpc.invoice.list.useQuery({
    limit: 100,
  });

  const createInvoice = async (data: InvoiceData) => {
    setIsLoading(true);
    try {
      const result = await createMutation.mutateAsync(data);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };
  
  // const commitToRequestNetwork = async (invoiceId: string) => {
  //   setIsCommitting(true);
  //   try {
  //     const result = await commitMutation.mutateAsync({ invoiceId });
  //     setIsCommitting(false);
  //     return result;
  //   } catch (error) {
  //     setIsCommitting(false);
  //     throw error;
  //   }
  // };
  
  const isInvoiceCommitted = (invoice: any) => {
    // Check if invoice has been committed to Request Network
    return Boolean(invoice?.requestId);
  };

  return {
    createInvoice,
    isInvoiceCommitted,
    invoices: invoicesQuery.data?.items || [],
    isLoading: isLoading || createMutation.isPending || invoicesQuery.isLoading,
    isCommitting,
    isError: invoicesQuery.isError,
    error: invoicesQuery.error,
    refetchInvoices: invoicesQuery.refetch,
  };
}
