import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import QRCode from 'react-qr-code';

interface InvoicePreparationProps {
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
  onConfirm: () => Promise<string>;
}

export function InvoicePreparation({ invoiceData, onConfirm }: InvoicePreparationProps) {
  const [showQR, setShowQR] = useState(false);
  const [txHash, setTxHash] = useState<string>();

  const handleCreateInvoice = async () => {
    try {
      const hash = await onConfirm();
      setTxHash(hash);
      setShowQR(true);
    } catch (err) {
      console.error('Failed to create invoice:', err);
    }
  };

  return (
    <Dialog>
      <DialogContent className="space-y-4 p-4">
        <h2 className="text-xl font-bold">New Invoice Detected</h2>
        
        <div className="space-y-2">
          <p>Recipient: {invoiceData.recipient.name}</p>
          <p>Amount: {invoiceData.amount} {invoiceData.currency}</p>
          <p>Description: {invoiceData.description}</p>
          {invoiceData.dueDate && <p>Due: {invoiceData.dueDate}</p>}
        </div>

        {!showQR ? (
          <Button onClick={handleCreateInvoice}>
            Create Invoice
          </Button>
        ) : (
          <div className="flex flex-col items-center">
            <QRCode value={txHash || ''} />
            <p className="mt-2 text-sm text-gray-500">
              Scan to sign transaction
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 