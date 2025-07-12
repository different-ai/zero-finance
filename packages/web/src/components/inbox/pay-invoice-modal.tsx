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

  // Bank lookup mutation
  const { 
    mutate: lookupBank 
  } = trpc.cardActions.lookupBankFromRoutingNumber.useMutation({
    onSuccess: (data) => {
      if (data.bankName && extractedPaymentData) {
        // Update the extracted data with the bank name
        extractedPaymentData.suggestedBankName = data.bankName;
      }
    }
  });

  // Trigger extraction when modal opens
  useEffect(() => {
    if (isOpen && card.id) {
      extractPaymentData({ cardId: card.id });
    }
  }, [isOpen, card.id, extractPaymentData]);

  // Look up bank name when routing number is extracted
  useEffect(() => {
    if (extractedPaymentData?.suggestedRoutingNumber && !extractedPaymentData.suggestedBankName) {
      lookupBank({ routingNumber: extractedPaymentData.suggestedRoutingNumber });
    }
  }, [extractedPaymentData?.suggestedRoutingNumber, extractedPaymentData?.suggestedBankName, lookupBank]);

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

    // Add bank account details if available
    if (extractedPaymentData.suggestedAccountNumber) {
      defaultValues.accountNumber = extractedPaymentData.suggestedAccountNumber;
    }
    if (extractedPaymentData.suggestedRoutingNumber) {
      defaultValues.routingNumber = extractedPaymentData.suggestedRoutingNumber;
      // Default to ACH if we have a routing number
      defaultValues.destinationType = 'ach';
    }
    if (extractedPaymentData.suggestedIban) {
      defaultValues.iban = extractedPaymentData.suggestedIban;
      defaultValues.destinationType = 'iban';
    }
    if (extractedPaymentData.suggestedBicSwift) {
      defaultValues.bic = extractedPaymentData.suggestedBicSwift;
    }

    return defaultValues;
  };

  // Don't block the UI - show the form immediately with loading states inline

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pay Invoice</DialogTitle>
        </DialogHeader>
        
        {/* Extraction status banner */}
        {(isExtractingData || extractedPaymentData) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            {isExtractingData && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Analyzing invoice for smart prefill...
                </span>
              </div>
            )}
            {!isExtractingData && extractedPaymentData && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-green-800">
                    Smart prefill completed ({extractedPaymentData.confidence}% confidence)
                  </span>
                </div>
                <div className="ml-6 space-y-1">
                  <div className="text-xs text-gray-700">
                    <strong>Vendor:</strong> {extractedPaymentData.vendorName} ({extractedPaymentData.suggestedAccountHolderType})
                  </div>
                  {extractedPaymentData.suggestedBankName && (
                    <div className="text-xs text-gray-700">
                      <strong>Bank:</strong> {extractedPaymentData.suggestedBankName}
                    </div>
                  )}
                  {(extractedPaymentData.suggestedAccountNumber || extractedPaymentData.suggestedRoutingNumber) && (
                    <div className="text-xs text-gray-700">
                      <strong>Account:</strong> 
                      {extractedPaymentData.suggestedAccountNumber && ` ****${extractedPaymentData.suggestedAccountNumber.slice(-4)}`}
                      {extractedPaymentData.suggestedRoutingNumber && ` (Routing: ${extractedPaymentData.suggestedRoutingNumber})`}
                    </div>
                  )}
                  {extractedPaymentData.suggestedCountry && (
                    <div className="text-xs text-gray-700">
                      <strong>Location:</strong> {[
                        extractedPaymentData.suggestedCity,
                        extractedPaymentData.suggestedCountry
                      ].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Debug section - only shown with ?debug=1 query parameter */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1' && extractedPaymentData && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <details>
              <summary className="text-xs font-medium text-gray-700 cursor-pointer">
                Debug: Extracted Payment Data (Confidence: {extractedPaymentData.confidence}%)
              </summary>
              <div className="mt-2 space-y-2">
                <div className="text-xs">
                  <strong>Raw Extraction:</strong>
                  <pre className="mt-1 p-2 bg-white border rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(extractedPaymentData, null, 2)}
                  </pre>
                </div>
                {extractedPaymentData.extractionReason && (
                  <div className="text-xs">
                    <strong>Extraction Logic:</strong> {extractedPaymentData.extractionReason}
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
        
        <div className="mt-4">
          {isLoadingFundingSources ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <SimplifiedOffRamp
              fundingSources={fundingSources || []}
              prefillFromInvoice={paymentInfo}
              defaultValues={getDefaultValues()}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 