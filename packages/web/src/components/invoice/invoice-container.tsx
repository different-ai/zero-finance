'use client';
import React, { useState, useEffect } from 'react';
import { RequestNetwork } from '@requestnetwork/request-client.js';
import { Types } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { ethers, Wallet } from 'ethers';
import { PayButton } from '@/components/payment';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface InvoiceContainerProps {
  requestId: string;
  decryptionKey: string;
}
export function InvoiceContainer({ requestId, decryptionKey }: InvoiceContainerProps) {
  const [invoice, setInvoice] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        
        console.log('0xHypr KEY-DEBUG', '=== DECRYPTING INVOICE ===');
        console.log('0xHypr KEY-DEBUG', 'Request ID:', requestId);
        console.log('0xHypr KEY-DEBUG', 'Decryption Key:', decryptionKey);
        
        // Clean the key - remove any leading/trailing whitespace or "0x" prefix if present
        let cleanKey = decryptionKey.trim();
        if (cleanKey.startsWith('0x')) {
          cleanKey = cleanKey.substring(2);
        }
        console.log('0xHypr KEY-DEBUG', 'Cleaned key:', cleanKey);
        
        try {
          // Import the wallet from the private key
          const wallet = new ethers.Wallet(cleanKey);
          console.log('0xHypr KEY-DEBUG', 'Wallet address from key:', wallet.address);
          console.log('0xHypr KEY-DEBUG', 'Public key from wallet:', wallet.publicKey);
          
          // Try using the Request Network method directly
          console.log('0xHypr KEY-DEBUG', 'Testing with a direct basic client');

          console.log('0xHypr KEY-DEBUG', 'Attempting to create cipher provider');
          
          // Create a cipher provider using the decryption key with proper format
          const cipherProvider = new EthereumPrivateKeyCipherProvider({
            key: cleanKey,
            method: Types.Encryption.METHOD.ECIES,
          });
          
          // Create a signature provider as well
          const signatureProvider = new EthereumPrivateKeySignatureProvider({
            privateKey: cleanKey,
            method: Types.Signature.METHOD.ECDSA,
          });
          
          // Check if decryption is available
          const canDecrypt = cipherProvider.isDecryptionAvailable();
          console.log('0xHypr KEY-DEBUG', 'Can decrypt with this key?', canDecrypt);
          
          // Get all registered identities by this cipher provider
          const registeredIds = cipherProvider.getAllRegisteredIdentities();
          console.log('0xHypr KEY-DEBUG', 'Registered identities with this cipher:', registeredIds);
          
         
          // Check if the key is registered for this identity
          const isRegistered = await cipherProvider.isIdentityRegistered({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: wallet.address,
          });
          console.log('0xHypr KEY-DEBUG', 'Is identity registered for this address?', isRegistered);
          
          // Create a request client with both providers
          const requestClient = new RequestNetwork({
            nodeConnectionConfig: {
              baseURL: 'https://xdai.gateway.request.network/',
            },
            cipherProvider,
            signatureProvider,
            useMockStorage: false,
          });
          
          // Get the request using the request ID
          console.log('0xHypr KEY-DEBUG', 'Fetching request...');
          const request = await requestClient.fromRequestId(requestId);
          console.log('0xHypr KEY-DEBUG', 'Raw request type:', typeof request);
          
          // Try to get the data
          console.log('0xHypr KEY-DEBUG', 'Getting request data...');
          const requestData = request.getData();
          console.log('0xHypr KEY-DEBUG', 'Invoice data:', requestData);
          
          setInvoice(requestData);
          setError(null);
        } catch (innerErr) {
          console.error('0xHypr KEY-DEBUG', 'Inner error:', innerErr);
          throw innerErr;
        }
      } catch (err) {
        console.error('0xHypr KEY-DEBUG', 'Error fetching invoice', err);
        if (err instanceof Error) {
          console.error('0xHypr KEY-DEBUG', 'Error message:', err.message);
          console.error('0xHypr KEY-DEBUG', 'Error stack:', err.stack);
        }
        setError('Failed to load invoice details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (requestId && decryptionKey) {
      fetchInvoice();
    }
  }, [requestId, decryptionKey]);

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
            <p className="mt-4 text-sm text-gray-500">Loading invoice details...</p>
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
        <AlertDescription>The requested invoice could not be found.</AlertDescription>
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
      return sum + (quantity * (unitPrice / 100));
    }, 0);
    
    // Calculate tax
    const calculatedTax = invoiceItems.reduce((sum: number, item: any) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const taxRate = item.tax?.amount ? Number(item.tax.amount) / 100 : 0;
      // Unit price is in cents, convert to euros before calculating tax
      return sum + (quantity * (unitPrice / 100) * taxRate);
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
  let currencySymbol = 'EURe'; // Default fallback
  let networkName = '';
  
  // Use the utility function from request-network.ts to get currency info if available
  if (invoice?.currency) {
    try {
      // Check if it's a known ERC20 token
      if (invoice.currency.type === Types.RequestLogic.CURRENCY.ERC20) {
        // Known ERC20 tokens
        if (invoice.currency.value === '0xcB444e90D8198415266c6a2724b7900fb12FC56E') {
          currencySymbol = 'EURe';
          networkName = 'Gnosis Chain';
        } else if (invoice.currency.value === '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') {
          currencySymbol = 'USDC';
          networkName = 'Ethereum Mainnet';
        }
      }
    } catch (error) {
      console.error('Error extracting currency info:', error);
    }
  }
  
  // Use the currency symbol for display
  const currency = currencySymbol;

  if (paymentSuccess) {
    return (
      <Alert className="w-full max-w-3xl mx-auto bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle>Payment Successful</AlertTitle>
        <AlertDescription>Your payment has been processed successfully.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Invoice #{invoiceNumber || 'N/A'}</CardTitle>
        <CardDescription>
          Created on {formattedDate}{networkName ? ` • ${networkName}` : ''}
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
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {(Number(item.unitPrice) / 100).toFixed(2)} {currency}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.amount 
                          ? (Number(item.amount) / 100).toFixed(2)
                          : (Number(item.quantity || 0) * Number(item.unitPrice || 0) / 100).toFixed(2)} {currency}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No items found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Invoice Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>{subtotal} {currency}</span>
            </div>
            {taxAmount && Number(taxAmount) > 0 && (
              <div className="flex justify-between py-1">
                <span>Tax:</span>
                <span>{taxAmount} {currency}</span>
              </div>
            )}
            <div className="flex justify-between py-1 font-bold">
              <span>Total:</span>
              <span>{total} {currency}</span>
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
      <CardFooter>
        <PayButton
          requestId={requestId}
          decryptionKey={decryptionKey}
          amount={total}
          currency={currency}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </CardFooter>
    </Card>
  );
}
