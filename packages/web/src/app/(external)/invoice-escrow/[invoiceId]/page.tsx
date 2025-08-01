'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/trpc/react';
import { formatEther } from 'viem';
import { format } from 'date-fns';
import { 
  FileText, 
  CheckCircle, 
  Clock,
  Building,
  Mail,
  Calendar,
  DollarSign,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function ExternalInvoiceEscrowPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  const { data: invoice, isLoading } = api.invoiceEscrow.getPublicInvoice.useQuery({ 
    invoiceId 
  });

  const payInvoice = api.invoiceEscrow.payInvoice.useMutation({
    onSuccess: () => {
      toast.success('Payment successful!', {
        description: 'The invoice has been paid and funds released.',
      });
    },
    onError: (error: any) => {
      toast.error('Payment failed', {
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">Invoice Not Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The invoice you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid = invoice.status === 'paid';
  const isCancelled = invoice.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Invoice</h1>
          <p className="text-muted-foreground mt-2">Secure payment with escrow protection</p>
        </div>

        {/* Invoice Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{invoice.invoiceNumber}</CardTitle>
                <CardDescription>
                  Created on {format(new Date(invoice.createdAt), 'MMMM dd, yyyy')}
                </CardDescription>
              </div>
              <Badge 
                variant={isPaid ? 'default' : isCancelled ? 'destructive' : 'secondary'}
                className="text-sm"
              >
                {invoice.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* From/To Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  From
                </h3>
                <p className="text-sm">{invoice.senderName}</p>
                <p className="text-sm text-muted-foreground">{invoice.senderEmail}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  To
                </h3>
                <p className="text-sm">{invoice.recipientName}</p>
                <p className="text-sm text-muted-foreground">{invoice.recipientEmail}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {invoice.description}
              </p>
            </div>

            {/* Amount and Due Date */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Amount Due</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatEther(BigInt(invoice.amount))} {invoice.currency}
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Due Date</span>
                </div>
                <p className="text-2xl font-bold">
                  {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {/* Escrow Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    Escrow Protected
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    This invoice is protected by escrow. The funds have been locked and will be 
                    automatically released upon payment confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isPaid && !isCancelled && (
              <div className="pt-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => payInvoice.mutate({ invoiceId })}
                  disabled={payInvoice.isPending}
                >
                  {payInvoice.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Pay {formatEther(BigInt(invoice.amount))} {invoice.currency}
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Payment will be processed securely through our escrow system
                </p>
              </div>
            )}

            {isPaid && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100">
                      Payment Complete
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      This invoice has been paid and the funds have been released.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <h4 className="font-semibold text-red-900 dark:text-red-100">
                      Invoice Cancelled
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      This invoice has been cancelled and is no longer valid.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by ZeroFinance Escrow</p>
        </div>
      </div>
    </div>
  );
}