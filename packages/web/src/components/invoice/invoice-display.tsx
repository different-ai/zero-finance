import React from 'react';
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
import { formatUnits } from 'viem';

// Simplified type for display purposes, focusing on what's rendered.
// This should mirror the relevant parts of the data structure fetched
// by both getById and getByPublicIdAndToken after processing.
export interface InvoiceDisplayData {
  invoiceNumber?: string;
  creationDate?: string | Date;
  status?: string; // e.g., 'pending', 'paid', 'Draft', 'On-Chain' derived status?
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
  bankDetails?: any | null;
  isOnChain?: boolean; // Indicator if it exists on Request Network
}

interface InvoiceDisplayProps {
  invoiceData: InvoiceDisplayData | null;
  isExternalView?: boolean;
  paymentSuccess?: boolean; // Optional: To show success message
  error?: string | null; // Optional: To show error message
  isLoading?: boolean; // Optional: To show loading state
}

export function InvoiceDisplay({ 
  invoiceData,
  isExternalView = false,
  paymentSuccess = false,
  error = null,
  isLoading = false
}: InvoiceDisplayProps) {

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
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Payment Successful</AlertTitle>
            <AlertDescription className="text-green-600">
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
      return `${currencySymbol}${num.toFixed(decimals)}`;
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
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gray-50 p-6 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Invoice</CardTitle>
            <CardDescription className="text-gray-500">
              #{invoiceData.invoiceNumber || 'N/A'} 
              {invoiceData.isOnChain && <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">On-Chain</span>}
            </CardDescription>
          </div>
          <div className="text-right">
             <p className="text-sm font-semibold text-gray-700">Status: 
               <span className={`ml-1 font-bold ${invoiceData.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}> 
                  {invoiceData.status || 'Unknown'}
               </span>
            </p>
            <p className="text-sm text-gray-500">Issued: {formatDate(invoiceData.creationDate)}</p>
             {invoiceData.paymentTerms?.dueDate && (
               <p className="text-sm text-gray-500">Due: {formatDate(invoiceData.paymentTerms.dueDate)}</p>
             )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Seller and Buyer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">From</h3>
            <p className="font-medium text-gray-800">{invoiceData.sellerInfo?.businessName || 'N/A'}</p>
            <p className="text-sm text-gray-600">{invoiceData.sellerInfo?.email || 'N/A'}</p>
            <p className="text-sm text-gray-600">{formatAddress(invoiceData.sellerInfo?.address)}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">To</h3>
            <p className="font-medium text-gray-800">{invoiceData.buyerInfo?.businessName || 'N/A'}</p>
            <p className="text-sm text-gray-600">{invoiceData.buyerInfo?.email || 'N/A'}</p>
            <p className="text-sm text-gray-600">{formatAddress(invoiceData.buyerInfo?.address)}</p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div>
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[50%] text-gray-600">Description</TableHead>
                <TableHead className="text-right text-gray-600">Qty</TableHead>
                <TableHead className="text-right text-gray-600">Unit Price</TableHead>
                <TableHead className="text-right text-gray-600">Tax (%)</TableHead>
                <TableHead className="text-right text-gray-600">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.invoiceItems && invoiceData.invoiceItems.length > 0 ? (
                invoiceData.invoiceItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-gray-800">{item.name || 'N/A'}</TableCell>
                    <TableCell className="text-right text-gray-600">{item.quantity || 'N/A'}</TableCell>
                    <TableCell className="text-right text-gray-600">{formatCurrency(item.unitPrice, currencySymbol)}</TableCell>
                    <TableCell className="text-right text-gray-600">{item.tax?.amount || '0'}%</TableCell>
                    <TableCell className="text-right font-medium text-gray-800">{formatCurrency(calculateItemTotal(item), currencySymbol)}</TableCell>
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
             <div className="flex justify-between font-semibold text-lg">
               <span>Total Amount</span>
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
          {invoiceData.paymentType === 'fiat' && invoiceData.bankDetails && (
            <div>
              <h4 className="font-semibold mb-1">Bank Details:</h4>
              <p>Account Holder: {invoiceData.bankDetails.accountHolder || 'N/A'}</p>
              <p>IBAN: {invoiceData.bankDetails.iban || 'N/A'}</p>
              <p>BIC: {invoiceData.bankDetails.bic || 'N/A'}</p>
              <p>Bank Name: {invoiceData.bankDetails.bankName || 'N/A'}</p>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}