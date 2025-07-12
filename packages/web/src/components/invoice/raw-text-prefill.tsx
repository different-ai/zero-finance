import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api as trpc } from '@/trpc/react';
import { useInvoiceStore } from '@/lib/store/invoice-store';

interface RawTextPrefillProps {
  onExtractedData?: (data: any) => void;
}

/**
 * RawTextPrefill – allows user to paste unstructured invoice text and pre-fill the
 * existing InvoiceForm via the AI endpoint.
 */
export function RawTextPrefill({ onExtractedData }: RawTextPrefillProps) {
  const [rawText, setRawText] = useState('');
  const setDetectedInvoiceData = useInvoiceStore((s) => s.setDetectedInvoiceData);
  const applyDataToForm = useInvoiceStore((s) => s.applyDataToForm);

  const mutation = trpc.invoice.prefillFromRaw.useMutation({
    onSuccess: async (data) => {
      console.log('[RawTextPrefill] AI response received:', data);
      
      if (onExtractedData) {
        // For simplified form - pass data directly via callback
        onExtractedData(data);
        toast.success('Invoice data extracted – review & edit as needed!');
      } else {
        // For legacy store-based form
        setDetectedInvoiceData(data as any);
        console.log('[RawTextPrefill] Data set in store, applying to form...');
        
        await applyDataToForm();
        console.log('[RawTextPrefill] Data applied to form successfully');
        
        toast.success('Invoice form pre-filled – review & edit as needed!');
      }
    },
    onError: (err) => {
      console.error('[RawTextPrefill] Error:', err);
      toast.error(err.message || 'Failed to parse invoice text');
    },
  });

  const isBusy = (mutation as any).isLoading ?? (mutation as any).isPending ?? false;

  const handlePrefill = () => {
    console.log('[RawTextPrefill] Starting prefill with text:', rawText);
    mutation.mutate({ rawText });
  };

  return (
    <div className="flex flex-col h-full w-full gap-3 p-4 border rounded-md bg-white">
      <h2 className="font-semibold text-lg">Paste invoice description</h2>
      <Textarea
        className="flex-1 resize-none min-h-[200px]"
        placeholder="e.g. Invoice for 10 hours of design at $100/hr to Acme Corp, due in 30 days…"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <Button
        disabled={isBusy || rawText.trim().length < 10}
        onClick={handlePrefill}
      >
        {isBusy ? 'Parsing…' : 'AI Fill Invoice'}
      </Button>
    </div>
  );
}