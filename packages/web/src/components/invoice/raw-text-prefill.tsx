import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api as trpc } from '@/trpc/react';
import { useInvoiceStore } from '@/lib/store/invoice-store';

/**
 * RawTextPrefill – allows user to paste unstructured invoice text and pre-fill the
 * existing InvoiceForm via the AI endpoint.
 */
export function RawTextPrefill() {
  const [rawText, setRawText] = useState('');
  const setDetectedInvoiceData = useInvoiceStore((s) => s.setDetectedInvoiceData);
  const applyDataToForm = useInvoiceStore((s) => s.applyDataToForm);

  const mutation = trpc.invoice.prefillFromRaw.useMutation({
    onSuccess: async (data) => {
      setDetectedInvoiceData(data as any);
      await applyDataToForm();
      toast.success('Invoice form pre-filled – review & edit as needed!');
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || 'Failed to parse invoice text');
    },
  });

  return (
    <div className="flex flex-col h-full w-full gap-3 p-4 border rounded-md bg-muted/40">
      <h2 className="font-semibold text-lg">Paste invoice description</h2>
      <Textarea
        className="flex-1 resize-none min-h-[200px]"
        placeholder="e.g. Invoice for 10 hours of design at $100/hr to Acme Corp, due in 30 days…"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <Button
        disabled={mutation.isLoading || rawText.trim().length < 10}
        onClick={() => mutation.mutate({ rawText })}
      >
        {mutation.isLoading ? 'Parsing…' : 'AI Fill Invoice'}
      </Button>
    </div>
  );
}