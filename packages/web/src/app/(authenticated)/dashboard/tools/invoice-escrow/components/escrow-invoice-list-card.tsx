'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/trpc/react';
import { formatEther } from 'viem';
import { format } from 'date-fns';
import { 
  FileText, 
  Send, 
  Lock, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Copy,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

type InvoiceStatus = 'draft' | 'locked' | 'sent' | 'paid' | 'cancelled';

interface EscrowInvoice {
  id: string;
  invoiceNumber: string;
  recipientName: string;
  recipientEmail: string;
  amount: string;
  currency: string;
  description: string;
  status: InvoiceStatus;
  createdAt: string;
  dueDate: string;
  escrowTxHash?: string;
  shareableLink?: string;
}

export function EscrowInvoiceListCard() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  
  // Mock data for now - will be replaced with actual API call
  const { data: invoices = [], isLoading } = api.invoiceEscrow.listEscrowInvoices.useQuery();
  
  const sendInvoice = api.invoiceEscrow.sendInvoice.useMutation({
    onSuccess: (data: any) => {
      toast.success('Invoice sent successfully!', {
        description: 'Funds have been released from escrow.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to send invoice', {
        description: error.message,
      });
    },
  });

  const cancelInvoice = api.invoiceEscrow.cancelInvoice.useMutation({
    onSuccess: () => {
      toast.success('Invoice cancelled', {
        description: 'Funds have been returned to your wallet.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to cancel invoice', {
        description: error.message,
      });
    },
  });

  const copyShareableLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      locked: { label: 'Locked', variant: 'default' as const },
      sent: { label: 'Sent', variant: 'outline' as const },
      paid: { label: 'Paid', variant: 'default' as const },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Escrow Invoices</CardTitle>
        <CardDescription>
          Manage your invoices with locked funds
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No invoices yet. Create your first escrow invoice to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{invoice.invoiceNumber}</h4>
                    {getStatusBadge(invoice.status as InvoiceStatus)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    To: {invoice.recipientName} ({invoice.recipientEmail})
                  </p>
                  <p className="text-sm">
                    {formatEther(BigInt(invoice.amount))} {invoice.currency} • Due {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {invoice.status === 'locked' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyShareableLink(invoice.shareableLink || '')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Link
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => sendInvoice.mutate({ invoiceId: invoice.id })}
                        disabled={sendInvoice.isPending}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => cancelInvoice.mutate({ invoiceId: invoice.id })}
                        disabled={cancelInvoice.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  
                  {invoice.status === 'sent' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => invoice.shareableLink && window.open(invoice.shareableLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                  
                  {invoice.status === 'paid' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Paid</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}