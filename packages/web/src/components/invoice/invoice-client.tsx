'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { InvoiceDisplay, InvoiceDisplayData } from './invoice-display';
import { getCurrencyConfig } from '@/lib/currencies';

// Define client-side type matching UserRequest structure
interface ClientDbInvoiceData {
  id: string;
  requestId: string | null;
  userId: string;
  walletAddress: string | null;
  role: 'seller' | 'buyer' | null;
  description: string | null;
  amount: string | null;
  currency: string | null;
  status:
    | 'pending'
    | 'paid'
    | 'db_pending'
    | 'committing'
    | 'failed'
    | 'canceled'
    | null;
  client: string | null;
  invoiceData: any;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  recipientCompanyId?: string | null;
  senderCompanyId?: string | null;
}

interface InvoiceClientProps {
  requestId: string; // DB primary key
  dbInvoiceData?: ClientDbInvoiceData | null;
  isExternalView?: boolean;
}

// Helper function to map DB data to InvoiceDisplayData format
function mapToDisplayData(
  dbData: ClientDbInvoiceData | null,
): InvoiceDisplayData | null {
  if (!dbData) return null;

  const nestedInvoiceData = dbData.invoiceData || {};

  const displayData: InvoiceDisplayData = {
    invoiceNumber: nestedInvoiceData.invoiceNumber,
    creationDate: dbData.createdAt ?? undefined,
    status:
      dbData.status === 'paid'
        ? 'Paid'
        : dbData.status === 'db_pending'
          ? 'Draft'
          : 'Pending',
    sellerInfo: nestedInvoiceData.sellerInfo,
    buyerInfo: nestedInvoiceData.buyerInfo,
    invoiceItems: nestedInvoiceData.invoiceItems?.map((item: any) => {
      const unitPriceStr = String(item.unitPrice);
      const correctedUnitPrice = unitPriceStr.startsWith('0x')
        ? '0'
        : unitPriceStr;
      return { ...item, unitPrice: correctedUnitPrice };
    }),
    paymentTerms: nestedInvoiceData.paymentTerms,
    note: nestedInvoiceData.note,
    terms: nestedInvoiceData.terms,
    paymentType: nestedInvoiceData.paymentType,
    currency: dbData.currency || nestedInvoiceData.currency,
    network: nestedInvoiceData.network,
    amount: dbData.amount || '0.00',
    bankDetails: nestedInvoiceData.bankDetails,
    isOnChain: !!dbData.requestId,
    paidAt:
      dbData.status === 'paid' ? (dbData.updatedAt ?? undefined) : undefined,
  };

  return displayData;
}

export default function InvoiceClient({
  requestId,
  dbInvoiceData,
  isExternalView = false,
}: InvoiceClientProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle case where no data is provided
  if (!dbInvoiceData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Could not load invoice data.</AlertDescription>
      </Alert>
    );
  }

  const displayData = mapToDisplayData(dbInvoiceData);

  if (!displayData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Could not process invoice data.</AlertDescription>
      </Alert>
    );
  }

  const isSeller = !isExternalView && dbInvoiceData?.role === 'seller';

  // Prepare props for child components
  const invoiceDisplayProps = {
    invoiceData: {
      ...displayData,
      invoiceId: requestId,
      recipientCompanyId: dbInvoiceData?.recipientCompanyId ?? undefined,
    },
    isExternalView,
    canUpdateStatus: !isExternalView,
    hideBankDetails: !isExternalView,
  };

  return (
    <div>
      <div>
        {paymentSuccess && (
          <Alert variant="default">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Payment Successful</AlertTitle>
            <AlertDescription>
              Your payment has been processed.
            </AlertDescription>
          </Alert>
        )}

        <div className="w-full relative">
          <InvoiceDisplay {...invoiceDisplayProps}></InvoiceDisplay>
        </div>
      </div>
      <div>
        <CardFooter className="flex justify-between items-center">
          {/* Placeholder for potential future footer content */}
        </CardFooter>
      </div>
    </div>
  );
}
