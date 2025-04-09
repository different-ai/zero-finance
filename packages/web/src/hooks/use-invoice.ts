import { useState } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';
import { invoiceDataSchema } from '@/server/routers/invoice-router';
import { trpc } from '@/utils/trpc';
import { DefaultErrorShape } from '@trpc/server/dist/unstable-core-do-not-import';

type InvoiceData = z.infer<typeof invoiceDataSchema>;

export function useInvoice() {
  const [isLoading, setIsLoading] = useState(false);
  const createMutation = trpc.invoice.create.useMutation({
    onSuccess: () => {
      toast.success('Invoice created successfully');
    },
    onError: (error: TRPCClientErrorLike<DefaultErrorShape>) => {
      toast.error(`Failed to create invoice: ${error.message}`);
    },
  });

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

  return {
    createInvoice,
    invoices: invoicesQuery.data?.items || [],
    isLoading: isLoading || createMutation.isPending || invoicesQuery.isLoading,
    isError: invoicesQuery.isError,
    error: invoicesQuery.error,
    refetchInvoices: invoicesQuery.refetch,
  };
} 