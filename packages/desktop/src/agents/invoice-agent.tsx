import { Agent, RecognizedContext, AgentType } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import * as React from 'react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { InvoiceForm } from '@/components/invoice-form';


const invoiceFormSchema = z.object({
  recipient: z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().optional(),
    email: z.string().email().optional(),
  }),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceAgentUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

const invoiceParserSchema = z.object({
  invoice: z.object({
    recipient: z.object({
      firstAndLastName: z.string(),
      ethereumAddress: z.string().optional(),
      email: z.string().optional(),
    }),
    amount: z.number(),
    currency: z.string(),
    description: z.string(),
    dueDate: z.string().optional(),
  }),
});

const recipientParserSchema = z.object({
  recipient: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
  }),
});

interface RequestData {
  requestId: string;
  amount: string;
  currency: any;
  status: string;
  timestamp: number;
  description: string;
  payer?: {
    value: string;
  };
  payee: {
    value: string;
  };
}

const RequestsView: React.FC = () => {
  const { data: requests, isLoading } = useQuery<RequestData[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      // @ts-ignore
      return await window.api.getUserRequests();
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading requests...</div>;
  }

  if (!requests?.length) {
    return <div className="p-4">No requests found</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Your Requests</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recipient</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.requestId}>
              <TableCell>
                {format(request.timestamp * 1000, 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{request.description}</TableCell>
              <TableCell>
                {request.amount} {request.currency.value}
              </TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                {request.payer?.value || 'No recipient'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface FormData {
  items: Array<{
    description: string;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    amount: number;
  }>;
  billTo: string;
  billToAddress: string;
  currency: string;
  memo: string;
}

const InvoiceAgentUI: React.FC<InvoiceAgentUIProps> = ({
  context,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<{
    name?: string;
    email?: string;
  }>();
  const [isLoadingRecipient, setIsLoadingRecipient] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    items: [
      { description: 'Setup and install', quantity: 1, price: 1000, discount: 0, tax: 0, amount: 1000 }
    ],
    billTo: '',
    billToAddress: '',
    currency: 'ETH',
    memo: '',
  });

  const extractRecipient = async () => {
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key in settings');
      }

      const openai = createOpenAI({ apiKey });
      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: recipientParserSchema,
        prompt: `
          Extract the recipient's name and/or email from the following content:
          
          Vital Information:
          ${context.vitalInformation}
          
          Return only the most likely recipient information.
        `.trim(),
      });

      const result = recipientParserSchema.parse(object);
      setRecipientInfo(result.recipient);
      return result.recipient;
    } catch (error) {
      console.error('0xHypr', 'Error extracting recipient:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadRecipientInfo = async () => {
      try {
        setIsLoadingRecipient(true);
        const recipient = await extractRecipient();
        setRecipientInfo(recipient);
        if (recipient) {
          setFormData(prev => ({
            ...prev,
            billTo: recipient.name || '',
          }));
        }
      } catch (error) {
        console.error('0xHypr', 'Error auto-loading recipient:', error);
      } finally {
        setIsLoadingRecipient(false);
      }
    };

    loadRecipientInfo();
  }, [context]);

  const parseContext = async () => {
    try {
      setIsLoading(true);
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key in settings');
      }

      const openai = createOpenAI({ apiKey });
      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: invoiceParserSchema,
        prompt: `
          Extract invoice information from the following content and vital information:
          
          Vital Information:
          ${context.vitalInformation}
          
          Parse this into a well-formatted invoice with recipient details, amount, currency, and description.
          If amount is mentioned in any currency, convert numbers to decimal format.
          If email addresses or ethereum addresses are present, include them.
          Format dates in YYYY-MM-DD format.
        `.trim(),
      });

      const result = invoiceParserSchema.parse(object);

      // Update form data with parsed information
      setFormData({
        items: [
          {
            description: result.invoice.description,
            quantity: 1,
            price: result.invoice.amount,
            discount: 0,
            tax: 0,
            amount: result.invoice.amount
          }
        ],
        billTo: result.invoice.recipient.firstAndLastName,
        billToAddress: result.invoice.recipient.ethereumAddress || '',
        currency: result.invoice.currency,
        memo: result.invoice.description,
      });

      setOpen(true);
    } catch (error) {
      console.error('0xHypr', 'Error parsing invoice data:', error);
      toast.error('Failed to parse invoice data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formValues: any) => {
    try {
      setIsLoading(true);
      const totalAmount = formValues.items.reduce((sum: number, item: any) => 
        sum + (item.amount || 0), 0
      );

      const requestData = {
        recipient: {
          name: formValues.billTo,
          address: formValues.billToAddress,
          email: recipientInfo?.email || '',
        },
        amount: totalAmount,
        currency: formValues.currency || 'ETH',
        description: formValues.items[0]?.description || 'Invoice payment',
        dueDate: '',
      };

      // @ts-ignore
      const result = await window.api.createInvoiceRequest(requestData);
      if (result.success) {
        toast.success(`Invoice created successfully! ID: ${result.requestId}`);
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('0xHypr', 'Failed to create invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex flex-col">
        <h3 className="font-medium">Invoice Request</h3>
        {isLoadingRecipient ? (
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading recipient...
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{context.title}</p>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={parseContext}
            disabled={isLoading || isLoadingRecipient}
          >
            {isLoading ? 'Processing...' : 'Prepare Invoice'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm
            defaultValues={formData}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const InvoiceAgent: Agent = {
  id: 'request-network-agent',
  name: 'Automatically Create Request Network Invoice',
  description:
    'Automatically creates invoices for your workflow based on your screen content',
  type: 'invoice' as AgentType,
  isActive: true,
  view: () => <RequestsView />,

  render(context: RecognizedContext, onSuccess?: () => void): React.ReactNode {
    return <InvoiceAgentUI context={context} onSuccess={onSuccess} />;
  },
};
