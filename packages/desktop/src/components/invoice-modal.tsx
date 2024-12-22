import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RecognizedInvoiceItem } from '@/agents/base-agent';
import { useToast } from '@/hooks/use-toast';
import { InvoicePreparation } from './invoice-preparation';

interface InvoiceModalProps {
  invoice: RecognizedInvoiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function InvoiceModal({ invoice, isOpen, onClose, onConfirm }: InvoiceModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [requestId, setRequestId] = useState<string>();

  if (!invoice) return null;

  const invoiceData = {
    recipient: {
      name: invoice.data.paymentDetails?.recipient || 'Unknown Recipient',
      address: invoice.data.paymentDetails?.bankDetails,
      email: invoice.data.paymentDetails?.accountNumber,
    },
    amount: invoice.data.amount,
    currency: invoice.data.currency,
    description: invoice.data.title,
    dueDate: invoice.data.dueDate,
  };

  const handleCreateInvoice = async () => {
    try {
      setIsLoading(true);
      const result = await window.api.processInvoice(invoiceData);
      console.log('0xHypr', 'Created invoice request:', result);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create invoice request');
      }
      return result.requestId;
    } catch (error) {
      console.error('0xHypr', 'Error creating invoice request:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invoice request',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (id: string) => {
    setRequestId(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{invoice.data.title}</DialogTitle>
          <DialogDescription>
            Review and confirm the invoice details before processing
          </DialogDescription>
        </DialogHeader>

        {!requestId ? (
          <InvoicePreparation
            invoice={invoiceData}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="p-4 text-center">
            <h3 className="font-medium mb-2">Request Created!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your invoice request has been created with ID:
            </p>
            <code className="bg-muted p-2 rounded block text-sm">
              {requestId}
            </code>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 