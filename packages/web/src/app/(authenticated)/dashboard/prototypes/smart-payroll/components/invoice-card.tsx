'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Mail, 
  DollarSign, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { Invoice } from '../mock-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface InvoiceCardProps {
  invoice: Invoice;
  onPay: (id: string) => void;
}

export function InvoiceCard({ invoice, onPay }: InvoiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (invoice.firstTimeRecipient) {
      const confirmed = confirm(
        `⚠️ FIRST TIME RECIPIENT\n\n${invoice.invoice.recipientName}\n${invoice.invoice.recipientAddress}\n\nThis is the first time paying this address. Continue?`
      );
      
      if (!confirmed) {
        setPaying(false);
        return;
      }
    }
    
    onPay(invoice.id);
    toast.success('Payment sent successfully!', {
      description: `${invoice.invoice.amount} ${invoice.invoice.currency} sent to ${invoice.invoice.recipientName}`,
    });
    setPaying(false);
  };

  const getStatusIcon = () => {
    switch (invoice.status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getChainColor = (chain: string) => {
    switch (chain) {
      case 'ethereum':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'base':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'solana':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className={cn(
      "transition-all",
      invoice.status === 'paid' && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Main Content */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {/* Email Header */}
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{invoice.from}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {format(new Date(invoice.detectedAt), 'MMM dd, h:mm a')}
                </span>
                {invoice.firstTimeRecipient && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    New Recipient
                  </Badge>
                )}
                {invoice.autoPayEligible && invoice.status === 'pending' && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <Zap className="h-3 w-3 mr-1" />
                    Auto-Pay
                  </Badge>
                )}
              </div>
              
              {/* Invoice Details */}
              <div>
                <h3 className="font-semibold text-lg">{invoice.invoice.recipientName}</h3>
                <p className="text-sm text-muted-foreground">{invoice.invoice.description}</p>
              </div>
              
              {/* Amount and Details */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-semibold">
                    {invoice.invoice.amount} {invoice.invoice.currency}
                  </span>
                </div>
                <Badge className={cn("text-xs", getChainColor(invoice.invoice.chain))}>
                  {invoice.invoice.chain}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due {format(new Date(invoice.invoice.dueDate), 'MMM dd, yyyy')}
                </div>
                {invoice.lastPaidDate && (
                  <span className="text-xs text-muted-foreground">
                    Last paid: {format(new Date(invoice.lastPaidDate), 'MMM dd')}
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {invoice.status === 'pending' ? (
                <Button 
                  onClick={handlePay}
                  disabled={paying}
                  size="sm"
                >
                  {paying ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>
              ) : invoice.status === 'scheduled' ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Scheduled
                </Badge>
              ) : (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Paid
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Expanded Details */}
          {expanded && (
            <div className="pt-3 border-t space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Invoice Number</p>
                  <p className="font-medium">{invoice.invoice.number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Address</p>
                  <p className="font-medium font-mono text-xs">
                    {invoice.invoice.recipientAddress}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">Email Subject</p>
                <p className="text-muted-foreground">{invoice.subject}</p>
              </div>
              
              {invoice.autoPayEligible && invoice.status === 'pending' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Auto-Pay Eligible
                    </p>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    This invoice matches your auto-pay rules and will be paid automatically in 24 hours
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}