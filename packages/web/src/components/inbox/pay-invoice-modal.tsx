'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { trpc } from '@/utils/trpc';
import { Loader2 } from 'lucide-react';
import type { InboxCard } from '@/types/inbox';

interface PayInvoiceModalProps {
  card: InboxCard;
  isOpen: boolean;
  onClose: () => void;
}

export function PayInvoiceModal({ card, isOpen, onClose }: PayInvoiceModalProps) {
  const { data: fundingSources, isLoading: isLoadingFundingSources } = 
    trpc.user.getFundingSources.useQuery();

  // Extract payment information from the card
  const extractPaymentInfo = () => {
    const amount = card.amount;
    const currency = card.currency;
    const vendorName = card.from || (card.sourceDetails as any)?.fromAddress?.split('@')[0] || 'Unknown Vendor';
    const description = card.subtitle || card.title;

    // Try to extract additional info from parsed invoice data
    let extractedAmount = amount;
    let extractedCurrency = currency;
    let extractedVendor = vendorName;
    let extractedDescription = description;

    if (card.parsedInvoiceData) {
      const invoiceData = card.parsedInvoiceData as any;
      
      // Extract amount from invoice data
      if (invoiceData.totalAmount && !extractedAmount) {
        extractedAmount = invoiceData.totalAmount.toString();
      }
      
      // Extract currency from invoice data
      if (invoiceData.currency && !extractedCurrency) {
        extractedCurrency = invoiceData.currency;
      }
      
      // Extract vendor from invoice data
      if (invoiceData.vendor?.name && extractedVendor === 'Unknown Vendor') {
        extractedVendor = invoiceData.vendor.name;
      } else if (invoiceData.from?.name && extractedVendor === 'Unknown Vendor') {
        extractedVendor = invoiceData.from.name;
      }
      
      // Extract description from invoice data
      if (invoiceData.description && !extractedDescription) {
        extractedDescription = invoiceData.description;
      } else if (invoiceData.items && invoiceData.items.length > 0) {
        extractedDescription = invoiceData.items.map((item: any) => item.description || item.name).join(', ');
      }
    }

    return {
      amount: extractedAmount,
      currency: extractedCurrency,
      vendorName: extractedVendor,
      description: extractedDescription,
    };
  };

  const paymentInfo = extractPaymentInfo();

  if (isLoadingFundingSources) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pay Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pay Invoice</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SimplifiedOffRamp
            fundingSources={fundingSources || []}
            prefillFromInvoice={paymentInfo}
            defaultValues={{
              amount: paymentInfo.amount,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 