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
import * as dataFormat from '@requestnetwork/data-format';

const invoiceParserSchema = z.object({
  invoice: z.object({
    buyerInfo: z.object({
      businessName: z.string().optional(),
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      address: z.object({
        'country-name': z.string().optional(),
        'extended-address': z.string().optional(),
        locality: z.string().optional(),
        'post-office-box': z.string().optional(),
        'postal-code': z.string().optional(),
        region: z.string().optional(),
        'street-address': z.string().optional(),
      }).optional(),
      taxRegistration: z.string().optional(),
    }).optional(),
    defaultCurrency: z.string().optional(),
    invoiceItems: z.array(z.object({
      name: z.string().optional(),
      quantity: z.number().optional(),
      unitPrice: z.string().optional(),
      currency: z.string().optional(),
      tax: z.object({
        type: z.enum(['percentage', 'fixed']).optional(),
        amount: z.string().optional(),
      }).optional(),
      reference: z.string().optional(),
      deliveryDate: z.string().optional(),
      deliveryPeriod: z.string().optional(),
    })).optional().default([{
      name: 'Default Item',
      quantity: 1,
      unitPrice: '0',
      currency: 'ETH',
      tax: { type: 'percentage', amount: '0' }
    }]),
    paymentTerms: z.object({
      dueDate: z.string().optional(),
      lateFeesPercent: z.number().optional(),
      lateFeesFix: z.string().optional(),
    }).optional(),
    note: z.string().optional(),
    terms: z.string().optional(),
    purchaseOrderId: z.string().optional(),
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

interface InvoiceAgentUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

const InvoiceAgentUI: React.FC<InvoiceAgentUIProps> = ({
  context,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Partial<dataFormat.Invoice>>();

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
          
          Parse this into a well-formatted invoice following the Request Network Format (RNF).
          - Extract buyer information (business name, email, address if available)
          - Parse amounts into proper decimal string format
          - Include all relevant metadata (tax info, delivery dates, etc.)
          - Format dates in YYYY-MM-DD format
          - If multiple items are mentioned, separate them into distinct invoice items
          - Make sure each invoice item includes the currency
        `.trim(),
      });

      const result = invoiceParserSchema.parse(object);
      
      // Transform the parsed data into the correct Invoice format
      const parsedValues: Partial<dataFormat.Invoice> = {
        buyerInfo: result.invoice.buyerInfo || {},
        invoiceItems: (result.invoice.invoiceItems || []).map(item => ({
          name: item.name || 'Untitled Item',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || '0',
          currency: item.currency || result.invoice.defaultCurrency || 'ETH',
          tax: {
            type: item.tax?.type || 'percentage',
            amount: item.tax?.amount || '0'
          },
          reference: item.reference || '',
          deliveryDate: item.deliveryDate || new Date().toISOString(),
          deliveryPeriod: item.deliveryPeriod || '',
        })),
        paymentTerms: result.invoice.paymentTerms,
        note: result.invoice.note || '',
        terms: result.invoice.terms || '',
        purchaseOrderId: result.invoice.purchaseOrderId,
      };

      setDefaultValues(parsedValues);
      setTimeout(() => setOpen(true), 0);
    } catch (error) {
      console.error('0xHypr', 'Error parsing invoice data:', error);
      toast.error('Failed to parse invoice data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex flex-col">
        <h3 className="font-medium">Invoice Request</h3>
        <p className="text-sm text-muted-foreground">{context.title}</p>
      </div>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setDefaultValues(undefined);
        }
        setOpen(isOpen);
      }}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={parseContext}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Prepare Invoice'}
          </Button>
        </DialogTrigger>
        {open && defaultValues && (
          <DialogContent className="max-w-[60vw] h-[90vh] p-0">
            <InvoiceForm
              key={defaultValues.invoiceNumber}
              defaultValues={defaultValues}
              onSubmit={async () => {
                setOpen(false);
                onSuccess?.();
              }}
              isLoading={isLoading}
            />
          </DialogContent>
        )}
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
