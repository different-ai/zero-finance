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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';

declare global {
  interface Window {
    api: {
      createInvoiceRequest: (
        data: InvoiceFormValues,
      ) => Promise<{ success: boolean; requestId?: string }>;
    };
  }
}

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

  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      recipient: {
        name: '',
        address: '',
        email: '',
      },
      amount: 0,
      currency: 'ETH',
      description: '',
      dueDate: '',
    },
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
      } catch (error) {
        console.error('0xHypr', 'Error auto-loading recipient:', error);
      } finally {
        setIsLoadingRecipient(false);
      }
    };

    loadRecipientInfo();
  }, [context]); // Re-run when context changes

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

      // Update form with parsed data
      form.reset({
        recipient: {
          name: result.invoice.recipient.firstAndLastName,
          address: result.invoice.recipient.ethereumAddress || '',
          email: result.invoice.recipient.email || '',
        },
        amount: result.invoice.amount,
        currency: result.invoice.currency,
        description: result.invoice.description,
        dueDate: result.invoice.dueDate || '',
      });

      setOpen(true);
    } catch (error) {
      console.error('0xHypr', 'Error parsing invoice data:', error);
      toast.error('Failed to parse invoice data');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof invoiceFormSchema>) => {
    try {
      const result = await window.api.createInvoiceRequest(values);
      if (result.success) {
        toast.success('Invoice created successfully');
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('0xHypr', 'Failed to create invoice:', error);
      toast.error('Failed to create invoice');
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="recipient.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter recipient name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipient.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ethereum Address (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage id="recipient.address" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipient.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage id="recipient.email" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage id="amount" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage id="currency" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage id="description" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage id="dueDate" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Invoice
              </Button>
            </form>
          </Form>
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

  render(context: RecognizedContext, onSuccess?: () => void): React.ReactNode {
    return <InvoiceAgentUI context={context} onSuccess={onSuccess} />;
  },
};
