'use client';
import React, { useState } from 'react';
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
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { CurrencyType } from '@/lib/currencies';

// Define type for nested invoice data
interface InvoiceDetailsType {
  meta?: { format?: string; version?: string };
  creationDate?: string;
  invoiceNumber?: string;
  sellerInfo?: {
    businessName?: string;
    email?: string;
    address?: {
      'street-address'?: string;
      locality?: string;
      'postal-code'?: string;
      'country-name'?: string;
    };
  };
  buyerInfo?: {
    businessName?: string;
    email?: string;
    address?: {
      'street-address'?: string;
      locality?: string;
      'postal-code'?: string;
      'country-name'?: string;
    };
  };
  invoiceItems?: Array<{
    name?: string;
    quantity?: number;
    unitPrice?: string;
    currency?: string;
    tax?: { type?: 'percentage'; amount?: string };
  }>;
  paymentTerms?: { dueDate?: string };
  note?: string;
  terms?: string;
  paymentType?: 'crypto' | 'fiat';
  currency?: string;
  network?: string;
  bankDetails?: {
    accountHolder?: string;
    iban?: string;
    bic?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
  } | null;
}

// Client-side interface mirroring the structure of UserRequest passed as prop
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
  shareToken: string | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
}

interface InvoiceContainerProps {
  requestId: string; // DB primary key
  dbInvoiceData?: ClientDbInvoiceData | null;
  isExternalView?: boolean;
}

export function InvoiceContainer({
  requestId,
  dbInvoiceData,
  isExternalView = false,
}: InvoiceContainerProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  console.log('0xHypr Container Props:', { requestId, dbInvoiceData });

  if (!dbInvoiceData) {
    return (
      <Alert variant="destructive" className="w-full max-w-3xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Invoice Not Found</AlertTitle>
        <AlertDescription>
          The requested invoice could not be found.
        </AlertDescription>
      </Alert>
    );
  }

  // Extract invoice data from DB
  const invoiceData: InvoiceDetailsType = dbInvoiceData.invoiceData || {};
  const {
    creationDate,
    invoiceNumber,
    invoiceItems = [],
    paymentTerms,
    note,
    bankDetails,
  } = invoiceData;

  // Calculate totals from invoice items
  let subtotal = '0.00';
  let taxAmount = '0.00';
  let total = '0.00';

  if (invoiceItems && invoiceItems.length > 0) {
    const calculatedSubtotal = invoiceItems.reduce((sum: number, item: any) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);

    const calculatedTax = invoiceItems.reduce((sum: number, item: any) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const taxRate = item.tax?.amount ? Number(item.tax.amount) / 100 : 0;
      return sum + quantity * unitPrice * taxRate;
    }, 0);

    subtotal = calculatedSubtotal.toFixed(2);
    taxAmount = calculatedTax.toFixed(2);
    total = (calculatedSubtotal + calculatedTax).toFixed(2);
  } else if (dbInvoiceData.amount) {
    total = dbInvoiceData.amount;
  }

  // Format date
  const formattedDate = creationDate
    ? new Date(creationDate).toLocaleDateString()
    : dbInvoiceData.createdAt
      ? new Date(dbInvoiceData.createdAt).toLocaleDateString()
      : 'Not specified';

  // Extract currency
  const currency = dbInvoiceData.currency || invoiceData.currency || 'USD';
  const isFiat = invoiceData.paymentType === 'fiat';
  const networkName = invoiceData.network || '';

  if (paymentSuccess) {
    return (
      <Alert className="w-full max-w-3xl mx-auto bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle>Payment Successful</AlertTitle>
        <AlertDescription>
          Your payment has been processed successfully.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Invoice #{invoiceNumber || 'N/A'}</CardTitle>
        <CardDescription>
          Created on {formattedDate}
          {networkName ? ` • ${networkName}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Invoice Items */}
          <div>
            <h3 className="text-lg font-medium mb-2">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.length > 0 ? (
                  invoiceItems.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.unitPrice).toFixed(2)} {currency}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          Number(item.quantity || 0) *
                          Number(item.unitPrice || 0)
                        ).toFixed(2)}{' '}
                        {currency}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Invoice Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>
                {subtotal} {currency}
              </span>
            </div>
            {Number(taxAmount) > 0 && (
              <div className="flex justify-between py-1">
                <span>Tax:</span>
                <span>
                  {taxAmount} {currency}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1 font-bold">
              <span>Total:</span>
              <span>
                {total} {currency}
              </span>
            </div>
          </div>

          {/* Additional Info */}
          {(paymentTerms || note) && (
            <div className="border-t pt-4">
              {paymentTerms?.dueDate && (
                <div className="py-1">
                  <span className="font-medium">Due Date: </span>
                  <span>
                    {new Date(paymentTerms.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {note && (
                <div className="py-1">
                  <span className="font-medium">Note: </span>
                  <span>{note}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        {/* Bank Transfer Details for fiat payments */}
        {isFiat && bankDetails && (
          <div className="w-full bg-gray-50 border rounded-md p-4 mb-4">
            <h4 className="font-medium mb-2">Bank Transfer Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {bankDetails.accountHolder && (
                <div>
                  <span className="font-medium">Account Holder:</span>{' '}
                  {bankDetails.accountHolder}
                </div>
              )}
              {bankDetails.iban && (
                <div>
                  <span className="font-medium">IBAN:</span> {bankDetails.iban}
                </div>
              )}
              {bankDetails.bic && (
                <div>
                  <span className="font-medium">BIC/SWIFT:</span>{' '}
                  {bankDetails.bic}
                </div>
              )}
              {bankDetails.accountNumber && (
                <div>
                  <span className="font-medium">Account Number:</span>{' '}
                  {bankDetails.accountNumber}
                </div>
              )}
              {bankDetails.routingNumber && (
                <div>
                  <span className="font-medium">Routing Number:</span>{' '}
                  {bankDetails.routingNumber}
                </div>
              )}
              {bankDetails.bankName && (
                <div>
                  <span className="font-medium">Bank:</span>{' '}
                  {bankDetails.bankName}
                </div>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                Please include the invoice number ({invoiceNumber}) in your
                payment reference.
              </p>
            </div>
          </div>
        )}

        {/* Status indicator */}
        {dbInvoiceData.status && (
          <div className="w-full text-center text-sm text-gray-500">
            Status: {dbInvoiceData.status}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
