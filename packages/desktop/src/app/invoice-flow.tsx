import { useEffect, useState } from 'react';
import { InvoiceAgent } from '../agents/invoice-agent';
import { RequestService } from '../services/request-service';
import { InvoicePreparation } from '../components/invoice-preparation';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';

interface InvoiceFlowProps {
  invoiceData: {
    recipient: {
      name: string;
      address?: string;
      email?: string;
    };
    amount: number;
    currency: string;
    description: string;
    dueDate?: string;
  };
  onProcessed?: () => void;
}

export function InvoiceFlow({ invoiceData, onProcessed }: InvoiceFlowProps) {
  const [showDialog, setShowDialog] = useState(false);
  const requestService = new RequestService();

  const handleConfirmInvoice = async () => {
    const requestId = await requestService.createInvoiceRequest(invoiceData);
    onProcessed?.();
    setShowDialog(false);
    return requestId;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDialog(true)}
      >
        <Receipt className="h-4 w-4 mr-2" />
        Create Invoice
      </Button>

      {showDialog && (
        <InvoicePreparation 
          invoiceData={invoiceData}
          onConfirm={handleConfirmInvoice}
        />
      )}
    </>
  );
} 