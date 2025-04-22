'use client';
import React, { useState, useEffect } from 'react';
import { RequestNetwork } from '@requestnetwork/request-client.js';
import { Types } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { ethers, Wallet } from 'ethers';
import { ExtensionTypes } from '@requestnetwork/types';
import { PayButton } from '@/components/payment';
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
import { trpc } from '@/utils/trpc';
// import { UserRequest } from '@/db/schema';
// import { invoiceDataSchema } from '@/server/routers/invoice-router';
// import { z } from 'zod';

// Define type for nested invoice data MANUALLY
// Replicate the structure previously inferred from invoiceDataSchema
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
        'country-name'?: string 
    };
  };
  buyerInfo?: {
    businessName?: string;
    email?: string;
    address?: { 
        'street-address'?: string; 
        locality?: string; 
        'postal-code'?: string; 
        'country-name'?: string 
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
  currency?: string; // Top-level currency
  network?: string; // Top-level network
  bankDetails?: { 
      accountHolder?: string; 
      iban?: string; 
      bic?: string; 
      bankName?: string 
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
  status: 'pending' | 'paid' | 'db_pending' | 'committing' | 'failed' | 'canceled' | null;
  client: string | null;
  invoiceData: any; // Keep as 'any' or infer from Zod schema if needed client-side
  shareToken: string | null;
  createdAt: string | Date | null; 
  updatedAt: string | Date | null;
}

interface InvoiceContainerProps {
  requestId: string; // DB primary key
  requestNetworkId?: string; // Request Network ID (optional)
  decryptionKey: string;
  dbInvoiceData?: ClientDbInvoiceData | null; // Use client-side type
  isExternalView?: boolean; // Added prop
}
export function InvoiceContainer({
  requestId, // Renamed from dbId for clarity
  requestNetworkId,
  decryptionKey,
  dbInvoiceData,
  isExternalView = false // Added prop with default
}: InvoiceContainerProps) {
  const [invoice, setInvoice] = useState<Types.IRequestData | any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [usingDatabaseFallback, setUsingDatabaseFallback] = useState(false);
  // Remove the tRPC query hook - data is passed via props
  // const { data } = trpc.invoice.getById.useQuery({ id: requestId });
  // const effectiveRNId = data?.requestId;
  // console.log('0xHypr INVOICE DATA (trpc):', JSON.stringify(data, null, 2));
  console.log('0xHypr Container Props:', { requestId, requestNetworkId, dbInvoiceData });
  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      setUsingDatabaseFallback(false);
      setError(null);
      
      let fetchedInvoiceData: any = null;
      let fetchError: any = null;

      // Step 1: Attempt to fetch from Request Network if requestNetworkId is available
      if (requestNetworkId && decryptionKey) {
        console.log('0xHypr KEY-DEBUG', '=== DECRYPTING INVOICE FROM RN ===');
        console.log('0xHypr KEY-DEBUG', 'RN Request ID:', requestNetworkId);
        console.log('0xHypr KEY-DEBUG', 'Decryption Key:', decryptionKey);

        try {
          let cleanKey = decryptionKey.trim();
          if (cleanKey.startsWith('0x')) {
            cleanKey = cleanKey.substring(2);
          }
          
          const cipherProvider = new EthereumPrivateKeyCipherProvider({
            key: cleanKey,
            method: Types.Encryption.METHOD.ECIES,
          });
          const signatureProvider = new EthereumPrivateKeySignatureProvider({
            privateKey: cleanKey,
            method: Types.Signature.METHOD.ECDSA,
          });

          const requestClient = new RequestNetwork({
            nodeConnectionConfig: {
              baseURL: 'https://gnosis.gateway.request.network/', // Corrected endpoint for Gnosis
            },
            cipherProvider,
            signatureProvider,
            useMockStorage: false,
          });

          console.log('0xHypr KEY-DEBUG', 'Fetching RN request...');
          const request = await requestClient.fromRequestId(requestNetworkId);
          console.log('0xHypr KEY-DEBUG', 'Raw RN request type:', typeof request);
          console.log('0xHypr KEY-DEBUG', 'Getting RN request data...');
          fetchedInvoiceData = request.getData();
          console.log('0xHypr KEY-DEBUG', 'RN Invoice data:', fetchedInvoiceData);
          setError(null);

        } catch (rnError) {
          console.error('0xHypr KEY-DEBUG', 'Error fetching/decrypting from RN:', rnError);
          fetchError = rnError; // Store error to decide fallback later
        }
      }

      // Step 2: Fallback to Database Data if RN fetch failed or wasn't attempted
      if (!fetchedInvoiceData && dbInvoiceData) {
        console.log(
          '0xHypr KEY-DEBUG',
          fetchError 
            ? 'RN fetch failed, using database fallback data' 
            : 'No RN ID provided or decryption key missing, using database data'
        );
        // Format database invoice data to match expected structure
        const nestedInvoiceData: InvoiceDetailsType | {} = dbInvoiceData.invoiceData || {}; // Use defined type
        
        // REMOVED Zod parsing - trust the shape or handle potential runtime errors
        // const parseResult = invoiceDataSchema.safeParse(nestedInvoiceData);
        // if (!parseResult.success) { ... } else { ... }

        // Assume nestedInvoiceData matches InvoiceDetailsType for formatting
        const validatedDbInvoiceData = nestedInvoiceData as InvoiceDetailsType;

        const formattedData: any = {
           // Essential fields expected by the UI
           contentData: validatedDbInvoiceData, // Use potentially partial data
           expectedAmount: dbInvoiceData.amount 
             ? (parseFloat(dbInvoiceData.amount) * 100).toString() 
             : '0',
           currencyInfo: { // Mimic structure
              type: validatedDbInvoiceData.paymentType === 'fiat' ? Types.RequestLogic.CURRENCY.ISO4217 : Types.RequestLogic.CURRENCY.ERC20,
              value: dbInvoiceData.currency || ''
           },
           currency: dbInvoiceData.currency || '', 
           paymentNetwork: { /* ... need paymentNetwork details ... */ }, // Placeholder
           extensionsData: [], 
           state: dbInvoiceData.status === 'paid' 
             ? Types.RequestLogic.STATE.ACCEPTED 
             : Types.RequestLogic.STATE.CREATED, // Map status
           timestamp: Math.floor(new Date(dbInvoiceData.createdAt || Date.now()).getTime() / 1000),
           payee: { type: Types.Identity.TYPE.ETHEREUM_ADDRESS, value: dbInvoiceData.walletAddress || '' },
           requestId: dbInvoiceData.requestId || undefined,
           // Include other necessary fields from dbInvoiceData? Check IRequestData type
           // ...dbInvoiceData // Avoid spreading raw DB data directly
        };
          
        console.log('0xHypr KEY-DEBUG', 'Formatted DB data:', formattedData);
          
        fetchedInvoiceData = formattedData;
        setUsingDatabaseFallback(true);
        setError(null); // Clear any previous RN error if we have DB fallback
      }

      // Step 3: Handle final state
      if (fetchedInvoiceData) {
        setInvoice(fetchedInvoiceData);
      } else {
        // Only set error if both RN and DB failed/unavailable
        console.error('0xHypr', 'Failed to load invoice from both RN and DB');
        setError(
          fetchError instanceof Error 
            ? `Failed to load invoice: ${fetchError.message}`
            : 'Failed to load invoice details. No data available.'
        );
      }
      
      setIsLoading(false);
    };

    // Trigger fetch only if we have necessary props
    if (requestId && decryptionKey) { // We need at least the dbId and a key
      fetchInvoice();
    } else {
      setError('Missing required data (requestId or decryptionKey) to load invoice.');
      setIsLoading(false);
    }
  }, [requestId, requestNetworkId, decryptionKey, dbInvoiceData]); // Add requestNetworkId dependency

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  const handlePaymentError = (error: Error) => {
    setError(`Payment failed: ${error.message}`);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-4 text-sm text-gray-500">
              Loading invoice details...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-3xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!invoice) {
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

  // Extract invoice data
  const invoiceData: InvoiceDetailsType | {} = invoice?.contentData || {};
  const {
    creationDate,
    invoiceNumber,
    invoiceItems = [],
    paymentTerms,
    note,
  } = invoiceData as InvoiceDetailsType;

  // Extract or calculate values for totals
  console.log('0xHypr INVOICE DATA:', JSON.stringify(invoiceData, null, 2));

  // Initialize values
  let subtotal = '0';
  let taxAmount = '0';
  let total = '0';

  // Try to calculate totals from invoice items if they exist
  if (invoiceItems && invoiceItems.length > 0) {
    // Calculate subtotal from items - always convert unitPrice from cents to euros
    const calculatedSubtotal = invoiceItems.reduce((sum: number, item: any) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      // Unit price is in cents, convert to euros before summing
      return sum + quantity * (unitPrice / 100);
    }, 0);

    // Calculate tax
    const calculatedTax = invoiceItems.reduce((sum: number, item: any) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const taxRate = item.tax?.amount ? Number(item.tax.amount) / 100 : 0;
      // Unit price is in cents, convert to euros before calculating tax
      return sum + quantity * (unitPrice / 100) * taxRate;
    }, 0);

    // Set values - keeping the values in euros (not cents)
    subtotal = calculatedSubtotal.toFixed(2);
    taxAmount = calculatedTax.toFixed(2);
    total = (calculatedSubtotal + calculatedTax).toFixed(2);

    console.log('0xHypr Calculated values:', { subtotal, taxAmount, total });
  } else {
    // If no items, rely on expectedAmount from the main invoice object
    subtotal = '0.00'; // Cannot calculate subtotal without items
    taxAmount = '0.00'; // Cannot calculate tax without items
    if (invoice?.expectedAmount) {
      // Assume expectedAmount is in smallest unit (e.g., cents)
      // We need decimals to format correctly
      const decimals = getCurrencyDecimals(invoice.currencyInfo);
      total = formatAmountLocal(invoice.expectedAmount, decimals);
    } else {
      total = '0.00';
    }
    console.log('0xHypr Using expectedAmount:', { subtotal, taxAmount, total });
  }

  // Format date
  const formattedDate = creationDate
    ? new Date(creationDate).toLocaleDateString()
    : 'Not specified';

  // Extract currency using type information
  let currencySymbol = 'USDC'; // Default
  let networkName = '';
  let isFiat = false;

  // Use the utility function from request-network.ts (or similar logic)
  if (invoice?.currencyInfo) { // Use currencyInfo if available from RN data
    currencySymbol = invoice.currencyInfo.value || currencySymbol;
    networkName = (invoice.currencyInfo as any).network || ''; // Add network if available
    isFiat = invoice.currencyInfo.type === Types.RequestLogic.CURRENCY.ISO4217;
  } else if (invoice?.currency) { // Fallback for formatted DB data
    currencySymbol = invoice.currency;
    // Network might not be available in the simplified fallback structure
    isFiat = (invoiceData as InvoiceDetailsType).paymentType === 'fiat'; // Infer from paymentType
  }

  // Check if this is a fiat payment with ANY_DECLARATIVE payment network
  if (
    invoice?.paymentNetwork?.id ===
    ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE
  ) {
    isFiat = true;
  }

  // Use the currency symbol for display
  const currency = currencySymbol;

  // Example of using isExternalView (needs implementing properly)
  const showPayButton = isExternalView && invoice && !paymentSuccess;
  // Commit button logic might not belong in Container as it requires wallet key, not just decryption key
  // const showCommitButton = !isExternalView && invoice && !invoice.requestId && !usingDatabaseFallback;

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

  // In the UI rendering code, add a notice if using database fallback
  if (invoice && usingDatabaseFallback) {
    // Add this somewhere in the rendered UI to indicate we're using DB data
    // For example, after the invoice information
    return (
      <div>
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
                            {(Number(item.unitPrice) / 100).toFixed(2)}{' '}
                            {currency}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.amount
                              ? (Number(item.amount) / 100).toFixed(2)
                              : (
                                  (Number(item.quantity || 0) *
                                    Number(item.unitPrice || 0)) /
                                  100
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
                {taxAmount && Number(taxAmount) > 0 && (
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
                  {paymentTerms && (
                    <div className="py-1">
                      <span className="font-medium">Payment Terms: </span>
                      {/* <span>{paymentTerms}</span> */}
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
            {/* Payment Information */}
            {isFiat && invoice?.contentData?.bankDetails && (
              <div className="w-full bg-gray-50 border rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium">Account Holder:</span>{' '}
                    {invoice.contentData.bankDetails.accountHolder}
                  </div>
                  <div>
                    <span className="font-medium">IBAN:</span>{' '}
                    {invoice.contentData.bankDetails.iban}
                  </div>
                  <div>
                    <span className="font-medium">BIC/SWIFT:</span>{' '}
                    {invoice.contentData.bankDetails.bic}
                  </div>
                  {invoice.contentData.bankDetails.bankName && (
                    <div>
                      <span className="font-medium">Bank:</span>{' '}
                      {invoice.contentData.bankDetails.bankName}
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

            {/* For crypto payments - show the pay button only if not using database fallback */}
            {!isFiat && !usingDatabaseFallback && requestNetworkId && (
              <PayButton
                requestId={requestNetworkId}
                decryptionKey={decryptionKey}
                amount={total}
                currency={currency}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </CardFooter>
        </Card>

        {/* Add this somewhere appropriate in your UI */}
        {usingDatabaseFallback && (
          <div className="mt-4">
            <Alert className="mb-4" variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Not Committed to Blockchain</AlertTitle>
              <AlertDescription>
                This invoice hasn&apos;t been committed to the Request Network
                blockchain yet. Payment processing is not available until the
                invoice is committed.
              </AlertDescription>
            </Alert>

          </div>
        )}
      </div>
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
                        {(Number(item.unitPrice) / 100).toFixed(2)} {currency}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.amount
                          ? (Number(item.amount) / 100).toFixed(2)
                          : (
                              (Number(item.quantity || 0) *
                                Number(item.unitPrice || 0)) /
                              100
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
            {taxAmount && Number(taxAmount) > 0 && (
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
              {paymentTerms && (
                <div className="py-1">
                  <span className="font-medium">Payment Terms: </span>
                  {/* <span>{paymentTerms}</span> */}
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
        {/* Payment Information */}
        {isFiat && invoice?.contentData?.bankDetails && (
          <div className="w-full bg-gray-50 border rounded-md p-4 mb-4">
            <h4 className="font-medium mb-2">Bank Transfer Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="font-medium">Account Holder:</span>{' '}
                {invoice.contentData.bankDetails.accountHolder}
              </div>
              <div>
                <span className="font-medium">IBAN:</span>{' '}
                {invoice.contentData.bankDetails.iban}
              </div>
              <div>
                <span className="font-medium">BIC/SWIFT:</span>{' '}
                {invoice.contentData.bankDetails.bic}
              </div>
              {invoice.contentData.bankDetails.bankName && (
                <div>
                  <span className="font-medium">Bank:</span>{' '}
                  {invoice.contentData.bankDetails.bankName}
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

        {/* For crypto payments - show the pay button only if not using database fallback */}
        {!isFiat && !usingDatabaseFallback && requestNetworkId && (
          <PayButton
            requestId={requestNetworkId}
            decryptionKey={decryptionKey}
            amount={total}
            currency={currency}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
      </CardFooter>
    </Card>
  );
}

// Helper function to reliably get decimals (consider moving to utils)
const getCurrencyDecimals = (currencyInfo: Types.RequestLogic.ICurrency | undefined | null): number => {
  if (!currencyInfo) return 2; // Default if no info
  // Add checks for different currency types if needed
  // Example for ERC20 / ETH:
  if (currencyInfo.type === Types.RequestLogic.CURRENCY.ERC20 || currencyInfo.type === Types.RequestLogic.CURRENCY.ETH) {
     return (currencyInfo as any)?.decimals || (currencyInfo.type === Types.RequestLogic.CURRENCY.ETH ? 18 : 6);
  }
  return 2; // Default for ISO4217 or unknown
};

// Local formatter (consider moving to utils)
const formatAmountLocal = (amount: string | bigint, decimals: number): string => {
  try {
    const value = BigInt(amount.toString());
    // Simple BigInt power function
    const pow = (base: bigint, exp: bigint): bigint => { 
       let res = BigInt(1); // Use BigInt constructor
       let b = BigInt(base); 
       let e = BigInt(exp);   
       if (e < BigInt(0)) return BigInt(0); // Use BigInt constructor
       while (e > BigInt(0)) { // Use BigInt constructor
          if (e % BigInt(2) === BigInt(1)) res *= b; // Use BigInt constructor
          b *= b;
          e /= BigInt(2); // Use BigInt constructor
       }
       return res;
    };
    const divisor = pow(BigInt(10), BigInt(decimals)); // Use BigInt constructor
    if (divisor === BigInt(0)) { // Use BigInt constructor
       console.warn('formatAmountLocal: divisor is zero, likely invalid decimals');
       return '0.00'; 
    }
    const beforeDecimal = value / divisor;
    const afterDecimal = value % divisor;
    const decimalString = afterDecimal.toString().padStart(decimals, '0');
    return `${beforeDecimal}.${decimalString}`;
  } catch (e) {
    console.error("formatAmountLocal error:", e);
    return '0.00';
  }
};
