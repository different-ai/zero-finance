import { Agent, RecognizedContext, AgentType } from './base-agent';
import * as React from 'react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import requestLogo from '@/assets/request-req-logo.png';
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
import { useAsyncInvoice } from './async-invoice-agent';
import { Loader2 } from 'lucide-react';
import { Invoice, ActorInfo, PaymentTerms } from '@requestnetwork/data-format';
import { AgentStepsView } from '@/components/agent-steps-view';
import { createScreenpipeSearch } from './tools/screenpipe-search';

interface BusinessInfo extends Omit<ActorInfo, 'miscellaneous'> {
  miscellaneous?: Record<string, unknown>;
}

interface ExtendedInvoice extends Omit<Invoice, 'sellerInfo' | 'buyerInfo'> {
  sellerInfo: BusinessInfo;
  buyerInfo?: BusinessInfo;
}

interface ExtendedPaymentTerms extends Omit<PaymentTerms, 'miscellaneous'> {
  miscellaneous?: Record<string, unknown>;
}

interface InvoiceAgentUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

const RequestLogo = ({ className }: { className?: string }) => (
  <img
    src={requestLogo}
    alt="Request Network"
    width={20}
    height={20}
    className={className}
  />
);

const InvoiceAgentUI: React.FC<InvoiceAgentUIProps> = ({
  context,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const { result, processInvoice, isProcessing } = useAsyncInvoice(context.id);

  // Start processing only when modal opens
  useEffect(() => {
    if (open && !result && !isProcessing) {
      console.log('0xHypr', 'Modal opened, starting invoice processing', {
        contextId: context.id,
        vitalInfo: context.vitalInformation,
      });
      processInvoice(context.vitalInformation);
    }
  }, [open, context, processInvoice, result, isProcessing]);

  // Transform the invoice data to match the InvoiceForm's expected format
  const formDefaultValues = React.useMemo(() => {
    console.log('0xHypr', 'Computing form default values from result:', result);

    if (!result?.data?.invoice) {
      console.log('0xHypr', 'No invoice data available yet');
      return undefined;
    }

    const invoice = result.data.invoice as ExtendedInvoice;
    console.log('0xHypr', 'Transforming invoice data:', invoice);

    // Transform buyerInfo to ensure miscellaneous is a Record<string, unknown>
    const transformedBuyerInfo: BusinessInfo | undefined = invoice.buyerInfo
      ? {
          businessName: invoice.buyerInfo.businessName || '',
          email: invoice.buyerInfo.email,
          firstName: invoice.buyerInfo.firstName,
          lastName: invoice.buyerInfo.lastName,
          phone: invoice.buyerInfo.phone,
          address: invoice.buyerInfo.address,
          taxRegistration: invoice.buyerInfo.taxRegistration,
          miscellaneous: {},
        }
      : undefined;

    const transformedValues: Partial<ExtendedInvoice> = {
      sellerInfo: {
        businessName: invoice.sellerInfo?.businessName || '',
        email: invoice.sellerInfo?.email || '',
        firstName: invoice.sellerInfo?.firstName || '',
        lastName: invoice.sellerInfo?.lastName || '',
        phone: invoice.sellerInfo?.phone || '',
        address: invoice.sellerInfo?.address || {},
        taxRegistration: invoice.sellerInfo?.taxRegistration || '',
        miscellaneous: invoice.sellerInfo?.miscellaneous || {},
      },
      buyerInfo: transformedBuyerInfo,
      invoiceItems:
        invoice.invoiceItems?.map((item) => ({
          name: item.name || 'Untitled Item',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || '0',
          currency: item.currency || 'ETH',
          tax: {
            type: item.tax?.type || 'percentage',
            amount: item.tax?.amount || '0',
          },
          reference: item.reference || '',
          deliveryDate: item.deliveryDate || new Date().toISOString(),
          deliveryPeriod: item.deliveryPeriod || '',
        })) || [],
      paymentTerms: invoice.paymentTerms
        ? ({
            dueDate: invoice.paymentTerms.dueDate,
            lateFeesPercent: invoice.paymentTerms.lateFeesPercent,
            lateFeesFix: invoice.paymentTerms.lateFeesFix,
            miscellaneous: {},
          } as ExtendedPaymentTerms)
        : undefined,
      note: invoice.note || '',
      terms: invoice.terms || '',
      purchaseOrderId: invoice.purchaseOrderId,
    };

    console.log('0xHypr', 'Transformed form values:', transformedValues);
    return transformedValues;
  }, [result?.data?.invoice]);

  const handleOpenChange = (newOpen: boolean) => {
    console.log('0xHypr', 'Dialog open state changing:', {
      from: open,
      to: newOpen,
      hasResult: !!result,
      isProcessing,
    });
    setOpen(newOpen);
  };

  const handleSubmit = async () => {
    console.log('0xHypr', 'Invoice form submitted, closing dialog');
    setOpen(false);
    onSuccess?.();
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Invoice Request</h3>
          <RequestLogo className="opacity-80" />
        </div>
        <p className="text-sm text-muted-foreground">{context.title}</p>
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : result?.success ? (
              'Open Invoice'
            ) : (
              'Prepare Invoice'
            )}
          </Button>
        </DialogTrigger>
        {open && (
          <DialogContent className="max-w-[80vw] h-[90vh] p-0">
            <div className="flex h-full">
              <div className="flex-1 min-w-0">
                <InvoiceForm
                  defaultValues={formDefaultValues}
                  onSubmit={handleSubmit}
                  isLoading={isProcessing}
                />
              </div>
              <div className="w-[350px] border-l">
                <AgentStepsView
                  recognizedItemId={context.id}
                  className="h-full"
                />
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

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
              <TableCell>{request.payer?.value || 'No recipient'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const InvoiceAgent: Agent = {
  id: 'invoice-agent',
  name: 'Invoice Manager',
  displayName: () => (
    <div className="flex items-center gap-2">
      <RequestLogo />
      Invoice Manager
    </div>
  ),
  description:
    'Automatically processes and creates invoices from detected content',
  type: 'invoice' as AgentType,
  isActive: true,
  isReady: true,
  detectorPrompt: 'Search invoice data starting with "Invoice" and recent and expanding to include all relevant data',
  miniApp: () => <RequestsView />,

  eventAction(
    context: RecognizedContext,
    onSuccess?: () => void
  ): React.ReactNode {
    return <InvoiceAgentUI context={context} onSuccess={onSuccess} />;
  },
};
