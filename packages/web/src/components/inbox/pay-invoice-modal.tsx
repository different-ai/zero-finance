'use client';

import { useState, useEffect } from 'react';
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
    trpc.fundingSource.listFundingSources.useQuery();

  // Use LLM to extract payment information from the card
  const { 
    data: extractedPaymentData, 
    isPending: isExtractingData,
    mutate: extractPaymentData 
  } = trpc.cardActions.extractPaymentData.useMutation();

  // Trigger extraction when modal opens
  useEffect(() => {
    if (isOpen && card.id) {
      extractPaymentData({ cardId: card.id });
    }
  }, [isOpen, card.id, extractPaymentData]);

  // Fallback extraction method (original logic)
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

  // Use LLM data if available, otherwise fallback to basic extraction
  const paymentInfo = extractedPaymentData ? {
    amount: extractedPaymentData.amount,
    currency: extractedPaymentData.currency,
    vendorName: extractedPaymentData.vendorName,
    description: extractedPaymentData.description,
  } : extractPaymentInfo();

  // Prepare enhanced default values using LLM data
  const getDefaultValues = () => {
    if (!extractedPaymentData) {
      return {
        amount: paymentInfo.amount,
      };
    }

    const defaultValues: any = {
      amount: extractedPaymentData.amount,
      accountHolderType: extractedPaymentData.suggestedAccountHolderType,
    };

    // Add name fields based on account holder type
    if (extractedPaymentData.suggestedAccountHolderType === 'individual') {
      if (extractedPaymentData.suggestedFirstName) {
        defaultValues.accountHolderFirstName = extractedPaymentData.suggestedFirstName;
      }
      if (extractedPaymentData.suggestedLastName) {
        defaultValues.accountHolderLastName = extractedPaymentData.suggestedLastName;
      }
    } else if (extractedPaymentData.suggestedBusinessName) {
      defaultValues.accountHolderBusinessName = extractedPaymentData.suggestedBusinessName;
    }

    // Add address fields if available
    if (extractedPaymentData.suggestedCountry) {
      defaultValues.country = extractedPaymentData.suggestedCountry;
    }
    if (extractedPaymentData.suggestedCity) {
      defaultValues.city = extractedPaymentData.suggestedCity;
    }
    if (extractedPaymentData.suggestedBankName) {
      defaultValues.bankName = extractedPaymentData.suggestedBankName;
    }
    if (extractedPaymentData.suggestedStreetAddress) {
      defaultValues.streetLine1 = extractedPaymentData.suggestedStreetAddress;
    }
    if (extractedPaymentData.suggestedPostalCode) {
      defaultValues.postalCode = extractedPaymentData.suggestedPostalCode;
    }

    return defaultValues;
  };

  if (isLoadingFundingSources || isExtractingData) {
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
          {isExtractingData && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing invoice data for smart prefill...
            </div>
          )}
          {extractedPaymentData && (
            <div className="space-y-1">
              <div className="text-xs text-green-600 font-medium">
                ✓ Smart prefill completed ({extractedPaymentData.confidence}% confidence)
              </div>
              <div className="text-xs text-muted-foreground">
                Extracted: {extractedPaymentData.vendorName} • {extractedPaymentData.suggestedAccountHolderType} payment • {extractedPaymentData.extractionReason}
              </div>
              {(extractedPaymentData.suggestedBankName || extractedPaymentData.suggestedCountry) && (
                <div className="text-xs text-blue-600">
                  Suggested: {[
                    extractedPaymentData.suggestedBankName,
                    extractedPaymentData.suggestedCity,
                    extractedPaymentData.suggestedCountry
                  ].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          )}
        </DialogHeader>
        <div className="mt-4">
          <SimplifiedOffRamp
            fundingSources={fundingSources || []}
            prefillFromInvoice={paymentInfo}
            defaultValues={getDefaultValues()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 