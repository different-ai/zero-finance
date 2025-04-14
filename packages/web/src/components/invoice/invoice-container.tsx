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
import { CommitButton } from './commit-button';
import { trpc } from '@/utils/trpc';

interface InvoiceContainerProps {
  requestId: string; // DB primary key
  requestNetworkId?: string; // Request Network ID (optional)
  decryptionKey: string;
  dbInvoiceData?: any; // Database invoice data
}
export function InvoiceContainer({
  requestId, // Renamed from dbId for clarity
  requestNetworkId,
  decryptionKey,
  dbInvoiceData,
}: InvoiceContainerProps) {
  const [invoice, setInvoice] = useState<any | null>(null);
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
        const formattedData = {
          // Essential fields expected by the UI
          contentData: dbInvoiceData.invoiceData || {},
          expectedAmount: dbInvoiceData.amount 
            ? (parseFloat(dbInvoiceData.amount) * 100).toString() // Convert to cents
            : '0',
          currency: dbInvoiceData.currencyInfo?.value || 'USDC', // Assuming currency is nested
          paymentNetwork: dbInvoiceData.paymentNetwork, // Pass payment network info
          extensionsData: [], // Placeholder if needed
          state: dbInvoiceData.status === 'paid' 
            ? Types.RequestLogic.STATE.ACCEPTED 
            : Types.RequestLogic.STATE.CREATED, // Map status
          timestamp: Math.floor(new Date(dbInvoiceData.creationDate || Date.now()).getTime() / 1000), // Add timestamp
          // Include other necessary fields from dbInvoiceData
          ...dbInvoiceData 
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
  const invoiceData = invoice?.contentData || {};
  const {
    creationDate,
    invoiceNumber,
    invoiceItems = [],
    paymentTerms,
    note,
  } = invoiceData;

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
    // If no items, try to use totals from the invoice data directly
    // Convert from cents to euros if needed
    if (invoiceData.subtotal) {
      subtotal = (Number(invoiceData.subtotal) / 100).toFixed(2);
    }
    if (invoiceData.tax) {
      taxAmount = (Number(invoiceData.tax) / 100).toFixed(2);
    }
    if (invoiceData.total) {
      total = (Number(invoiceData.total) / 100).toFixed(2);
    } else if (invoice?.expectedAmount) {
      total = (Number(invoice.expectedAmount) / 100).toFixed(2);
    } else {
      total = '0.00';
    }
    console.log('0xHypr Direct values:', { subtotal, taxAmount, total });
  }

  // Format date
  const formattedDate = creationDate
    ? new Date(creationDate).toLocaleDateString()
    : 'Not specified';

  // Extract currency from invoice data
  let currencySymbol = dbInvoiceData?.currency || 'USDC'; // Default to USDC, prefer dbInvoiceData if available
  let networkName = '';
  let isFiat = false;

  // Use the utility function from request-network.ts to get currency info if available
  if (invoice?.currency) {
    try {
      // Check if it's a known ERC20 token
      if (invoice.currency.type === Types.RequestLogic.CURRENCY.ERC20) {
        // Known ERC20 tokens
        if (
          invoice.currency.value ===
          '0xcB444e90D8198415266c6a2724b7900fb12FC56E'
        ) {
          currencySymbol = 'EURe';
          networkName = 'Gnosis Chain';
        } else if (
          invoice.currency.value ===
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        ) {
          currencySymbol = 'USDC';
          networkName = 'Ethereum Mainnet';
        } else {
          // For other ERC20 tokens, use what we have in the database
          currencySymbol = dbInvoiceData?.currency || currencySymbol;
        }
      } else if (
        invoice.currency.type === Types.RequestLogic.CURRENCY.ISO4217
      ) {
        // Fiat currency
        currencySymbol = invoice.currency.value;
        isFiat = true;
      }
    } catch (error) {
      console.error('Error extracting currency info:', error);
      // Fallback to database value
      currencySymbol = dbInvoiceData?.currency || currencySymbol;
    }
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
            {!isFiat && !usingDatabaseFallback && (
              <PayButton
                requestId={requestId}
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

            {dbInvoiceData && dbInvoiceData.id && (
              <CommitButton
                invoiceId={dbInvoiceData.id}
                onSuccess={() => window.location.reload()}
              />
            )}
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
        {!isFiat && !usingDatabaseFallback && (
          <PayButton
            requestId={requestId}
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
