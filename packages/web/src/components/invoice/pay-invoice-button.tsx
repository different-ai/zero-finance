'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { api } from '@/trpc/react';
import { Banknote, Loader2 } from 'lucide-react';

interface PayInvoiceButtonProps {
  invoiceId: string;
  amount?: string;
  currency?: string;
  vendorName?: string | null;
  description?: string | null;
  disabled?: boolean;
  className?: string;
}

/**
 * PayInvoiceButton - Opens an offramp dialog to pay an invoice
 *
 * When the user completes the payment:
 * 1. An offramp transfer is created with linkedInvoiceId
 * 2. Any attachments on the invoice are automatically copied to the payment
 * 3. The payment appears in transaction history with the invoice's documents
 */
export function PayInvoiceButton({
  invoiceId,
  amount,
  currency,
  vendorName,
  description,
  disabled = false,
  className,
}: PayInvoiceButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch funding sources (virtual account details) for the offramp component
  const { data: accountData, isLoading: isLoadingAccountData } =
    api.align.getVirtualAccountDetails.useQuery(undefined, {
      enabled: isOpen,
    });

  // Fetch balance info
  const { data: positions } = api.earn.getMultiChainPositions.useQuery(
    undefined,
    {
      enabled: isOpen,
    },
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const fundingSources = accountData?.fundingSources || [];

  // Calculate total balance from positions
  const totalBalance = positions?.totalBalance
    ? parseFloat(positions.totalBalance)
    : 0;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={className}
        variant="default"
      >
        <Banknote className="h-4 w-4 mr-2" />
        Pay Invoice
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Pay Invoice
            </DialogTitle>
            <DialogDescription>
              Send payment for this invoice. Any attached documents will be
              linked to the payment transaction.
            </DialogDescription>
          </DialogHeader>

          {isLoadingAccountData ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <SimplifiedOffRamp
              fundingSources={fundingSources}
              prefillFromInvoice={{
                amount,
                currency,
                vendorName,
                description,
              }}
              linkedInvoiceId={invoiceId}
              spendableBalance={totalBalance}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
