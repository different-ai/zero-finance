import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
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
import { format } from 'date-fns';

// Simplified type for display purposes, focusing on what's rendered.
// This should mirror the relevant parts of the data structure fetched
// by both getById and getByPublicIdAndToken after processing.
export interface InvoiceDisplayData {
  invoiceNumber?: string;
  creationDate?: string | Date;
  status?: string; // e.g., 'pending', 'paid', 'Draft', 'On-Chain' derived status?
  paidAt?: string | Date; // When the invoice was marked as paid
  sellerInfo?: { businessName?: string; email?: string; address?: any };
  buyerInfo?: { businessName?: string; email?: string; address?: any };
  invoiceItems?: Array<{ name?: string; quantity?: number; unitPrice?: string; currency?: string; tax?: any; total?: string; }>;
  paymentTerms?: { dueDate?: string };
  note?: string;
  terms?: string;
  paymentType?: 'crypto' | 'fiat';
  currency?: string;
  network?: string;
  amount?: string; // Total amount
  bankDetails?: {
    accountHolder?: string;
    accountNumber?: string;
    routingNumber?: string;
    iban?: string;
    bic?: string;
    swiftCode?: string;
    bankName?: string;
    bankAddress?: string;
  } | null;
  isOnChain?: boolean; // Indicator if it exists on Request Network
  invoiceId?: string; // Add invoice ID for status updates
  recipientCompanyId?: string; // Add recipient company ID to check ownership
}

interface InvoiceDisplayProps {
  invoiceData: InvoiceDisplayData | null;
  isExternalView?: boolean;
  paymentSuccess?: boolean; // Optional: To show success message
  canUpdateStatus?: boolean; // Whether user can update status
  error?: string | null;
  isLoading?: boolean;
  hideBankDetails?: boolean; // Hide bank details section in invoice
}

interface InvoiceDisplayProps {
  invoiceData: InvoiceDisplayData | null;
  isExternalView?: boolean;
  paymentSuccess?: boolean; // Optional: To show success message
  error?: string | null; // Optional: To show error message
  isLoading?: boolean; // Optional: To show loading state
  hideBankDetails?: boolean; // Hide bank details section in invoice
}

export function InvoiceDisplay({ 
  invoiceData,
  isExternalView = false,
  paymentSuccess = false,
  error = null,
  isLoading = false,
  canUpdateStatus = false,
  hideBankDetails = false
}: InvoiceDisplayProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  // Normalize status to lowercase for consistent comparisons
  const normalizedStatus = typeof invoiceData?.status === 'string' 
    ? invoiceData.status.toLowerCase() 
    : 'pending';
  const [currentStatus, setCurrentStatus] = useState(normalizedStatus);

  // Show button if: user can update status, status is not paid, and invoice ID exists
  // Removed owner check as requested - any user with update permission can mark as paid
  const showMarkAsPaid = canUpdateStatus && currentStatus !== 'paid' && invoiceData?.invoiceId;

  // Update status mutation
  const updateStatusMutation = api.invoice.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Invoice marked as paid');
      setCurrentStatus('paid');
      setIsUpdating(false);
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
      setIsUpdating(false);
    },
  });

  const handleMarkAsPaid = () => {
    if (!invoiceData?.invoiceId) return;
    setIsUpdating(true);
    updateStatusMutation.mutate({
      id: invoiceData.invoiceId,
      status: 'paid',
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-4 text-sm text-gray-500">Loading invoice details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="default" className="bg-emerald-50 border-emerald-200 text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-700">Payment Successful</AlertTitle>
            <AlertDescription className="text-emerald-600">
              Your payment has been processed successfully. Thank you!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!invoiceData) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Invoice data not found.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // --- Helper Functions for Formatting ---
  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP'); // e.g., Jun 21, 2024
    } catch (e) { // Catch specific error
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: string | number | undefined, currencySymbol: string = '', decimals: number = 2): string => {
    if (amount === undefined || amount === null) return 'N/A';

    const amountStr = amount.toString();

    // Check if the amount looks like a hex address. If so, return an error string.
    if (amountStr.startsWith('0x')) {
        console.warn(`Invalid numeric value passed to formatCurrency: ${amountStr}`); // Optional: keep for debugging
        return 'Invalid Price'; 
    }

    try {
      // Attempt to parse the string as a float.
      const num = parseFloat(amountStr);
      // Check if parsing resulted in NaN (Not-a-Number).
      if (isNaN(num)) {
        console.warn(`Invalid numeric value passed to formatCurrency (parsed as NaN): ${amountStr}`); // Optional: keep for debugging
        return 'Invalid Price'; // Return error string for other non-numeric values too
      }
      // Format the valid number with the currency symbol and fixed decimal places.
      return `${currencySymbol} ${num.toFixed(decimals)}`;
    } catch (e) {
       console.error('formatCurrency formatting error:', e); // Log any unexpected errors during formatting.
      return 'Formatting Error';
    }
  };

  // Simple address formatter
  const formatAddress = (address: any): string => {
    if (!address) return 'N/A';
    const parts = [
      address['street-address'], 
      address.locality, 
      address['postal-code'], 
      address['country-name']
    ].filter(Boolean); // Remove empty parts
    return parts.join(', ') || 'N/A';
  };

  // Calculate item total (handle string unitPrice)
  const calculateItemTotal = (item: any): string => {
    const quantity = item.quantity || 0;
    const unitPrice = parseFloat(item.unitPrice || '0');
    // Simple percentage tax for now
    const taxRate = parseFloat(item.tax?.amount || '0') / 100;
    // Add NaN check after parsing
    if (isNaN(unitPrice) || isNaN(taxRate)) {
        return 'Error'; // Indicate calculation error
    }
    const subtotal = quantity * unitPrice;
    const taxAmount = subtotal * taxRate;
    const total = (subtotal + taxAmount).toFixed(2);
    return total;
  };
  
  // Calculate overall total
  const overallTotal = invoiceData.invoiceItems?.reduce((sum, item) => {
    const itemTotalStr = calculateItemTotal(item);
    const itemTotal = parseFloat(itemTotalStr);
    // Add NaN check here too
    if (isNaN(itemTotal)) {
        return sum; // Skip this item if its total couldn't be calculated
    }
    return sum + itemTotal; 
  }, 0).toFixed(2) || '0.00';
  
  const currencySymbol = invoiceData.currency === 'USD' ? '$' : invoiceData.currency === 'EUR' ? '€' : invoiceData.currency === 'GBP' ? '£' : (invoiceData.currency || '');

  return (
    <Card className="w-full max-w-[900px] mx-auto bg-white ring-1 ring-gray-200 rounded-xl shadow-lg min-h-[calc(100vh-280px)]">
      <CardHeader className="p-6 rounded-t-lg" style={{ backgroundColor: '#FFFEF9' }}>
           <div className="flex justify-between items-center">
            {/* Left: Title & Number */}
            <div>              <CardTitle className="text-2xl font-bold text-gray-800">Invoice</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-600 font-medium">#{invoiceData.invoiceNumber || 'N/A'}</span>
                {invoiceData.isOnChain && (
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">On-Chain</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : currentStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                {currentStatus ? currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1) : 'Unknown'}
              </span>
              {showMarkAsPaid && currentStatus !== 'paid' && (
                <button
                  type="button"
                  onClick={handleMarkAsPaid}
                  className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
                  disabled={isUpdating}
                >
                  Mark as Paid
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600">Issued: {formatDate(invoiceData.creationDate)}</p>
            {invoiceData.paymentTerms?.dueDate && (
              <p className="text-sm text-gray-600">Due: {formatDate(invoiceData.paymentTerms.dueDate)}</p>
            )}
            {currentStatus === 'paid' && invoiceData.paidAt && (
              <p className="text-sm text-gray-600">Paid on: {formatDate(invoiceData.paidAt)}</p>
            )}
          </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Seller and Buyer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">From</h3>
            <p className="font-medium text-gray-800 leading-relaxed">{invoiceData.sellerInfo?.businessName || 'N/A'}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{invoiceData.sellerInfo?.email || 'N/A'}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{formatAddress(invoiceData.sellerInfo?.address)}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">To</h3>
            <p className="font-medium text-gray-800 leading-relaxed">{invoiceData.buyerInfo?.businessName || 'N/A'}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{invoiceData.buyerInfo?.email || 'N/A'}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{formatAddress(invoiceData.buyerInfo?.address)}</p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div>
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[50%] text-gray-600 px-3 py-3">Description</TableHead>
                <TableHead className="text-right text-gray-600 px-3 py-3">Qty</TableHead>
                <TableHead className="text-right text-gray-600 px-3 py-3">Unit Price</TableHead>
                <TableHead className="text-right text-gray-600 px-3 py-3">Tax (%)</TableHead>
                <TableHead className="text-right text-gray-600 px-3 py-3">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.invoiceItems && invoiceData.invoiceItems.length > 0 ? (
                invoiceData.invoiceItems.map((item, index) => (
                  <TableRow key={index} className="odd:bg-gray-50">
                    <TableCell className="font-medium text-gray-800 px-3 py-3">{item.name || 'N/A'}</TableCell>
                    <TableCell className="text-right text-gray-600 px-3 py-3">{item.quantity || 'N/A'}</TableCell>
                    <TableCell className="text-right text-gray-600 px-3 py-3">{formatCurrency(item.unitPrice, currencySymbol)}</TableCell>
                    <TableCell className="text-right text-gray-600 px-3 py-3">{item.tax?.amount || '0'}%</TableCell>
                    <TableCell className="text-right font-medium text-gray-800 px-3 py-3">{formatCurrency(calculateItemTotal(item), currencySymbol)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-4">No items listed</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
             {/* Could add Subtotal, Tax Total rows here if needed */}
             <div className="flex justify-between text-2xl font-bold">
               <span>Total</span>
               <span>{formatCurrency(overallTotal, currencySymbol)}</span>
             </div>
          </div>
        </div>

        {/* Notes, Terms, Bank Details */}
        <div className="space-y-4 text-sm text-gray-600 border-t pt-4">
          {invoiceData.note && (
            <div>
              <h4 className="font-semibold mb-1">Notes:</h4>
              <p>{invoiceData.note}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div>
              <h4 className="font-semibold mb-1">Terms:</h4>
              <p>{invoiceData.terms}</p>
            </div>
          )}
          {invoiceData.paymentType === 'fiat' && invoiceData.bankDetails && !hideBankDetails && (
            <div>
              <h4 className="font-semibold mb-1">Bank Details:</h4>
              <p>Account Holder: {invoiceData.bankDetails.accountHolder || 'N/A'}</p>
              {invoiceData.bankDetails.iban && <p>IBAN: {invoiceData.bankDetails.iban}</p>}
              {invoiceData.bankDetails.accountNumber && <p>Account Number: {invoiceData.bankDetails.accountNumber}</p>}
              {invoiceData.bankDetails.routingNumber && <p>Routing Number: {invoiceData.bankDetails.routingNumber}</p>}
              {invoiceData.bankDetails.bic && <p>BIC/SWIFT: {invoiceData.bankDetails.bic}</p>}
              <p>Bank Name: {invoiceData.bankDetails.bankName || 'N/A'}</p>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}