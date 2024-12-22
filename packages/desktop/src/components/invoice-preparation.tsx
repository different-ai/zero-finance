import { useRequestNetwork } from '../hooks/use-request-network';
import { useToast } from '../hooks/use-toast';

export const InvoicePreparation = ({
  invoice,
  onSuccess,
}: {
  invoice: {
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
  onSuccess: (requestId: string) => void;
}) => {
  const { createInvoiceRequest } = useRequestNetwork();
  const { toast } = useToast();

  const handleCreateInvoice = async () => {
    try {
      console.log('0xHypr', 'Creating invoice request', invoice);
      const requestId = await createInvoiceRequest(invoice);
      console.log('0xHypr', 'Invoice request created', requestId);
      
      toast({
        title: 'Invoice Created',
        description: `Request ID: ${requestId}`,
      });
      
      onSuccess(requestId);
    } catch (error) {
      console.error('0xHypr', 'Failed to create invoice:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <button onClick={handleCreateInvoice}>
        Create Invoice
      </button>
    </div>
  );
}; 