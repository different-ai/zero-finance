'use client';
import React, { useState, useEffect } from 'react';
import { RequestNetwork } from '@requestnetwork/request-client.js';
import { Types } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { ethers } from 'ethers';
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
import { PayButton } from '@/components/payment';
import { InvoiceContainer } from './invoice-container';

interface InvoiceClientProps {
  requestId: string;
  walletPrivateKey?: string;
  decryptionKey?: string;
  dbInvoiceData?: any;
}

export default function InvoiceClient(props: InvoiceClientProps) {
  // If we have a decryption key, use the standard InvoiceContainer
  if (props.decryptionKey) {
    return (
      <InvoiceContainer 
        requestId={props.requestId} 
        decryptionKey={props.decryptionKey} 
        dbInvoiceData={props.dbInvoiceData}
      />
    );
  }
  
  // Otherwise render the client invoice with wallet key
  return <WalletKeyInvoiceClient {...props} />;
}

// Separate component to avoid conditional hooks
function WalletKeyInvoiceClient({ requestId, walletPrivateKey, dbInvoiceData }: InvoiceClientProps) {
  // Define states at the top level
  const [invoice, setInvoice] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [usingDatabaseFallback, setUsingDatabaseFallback] = useState(false);
  
  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        
        console.log('0xHypr WALLET-DEBUG', '=== DECRYPTING INVOICE WITH WALLET ===');
        console.log('0xHypr WALLET-DEBUG', 'Request ID:', requestId);
        
        if (!walletPrivateKey) {
          throw new Error('No wallet private key provided');
        }
        
        // Clean the key - remove any leading/trailing whitespace or add "0x" prefix if not present
        let cleanKey = walletPrivateKey.trim();
        if (!cleanKey.startsWith('0x')) {
          cleanKey = `0x${cleanKey}`;
        }
        
        try {
          // Import the wallet from the private key
          const wallet = new ethers.Wallet(cleanKey);
          console.log('0xHypr WALLET-DEBUG', 'Wallet address from key:', wallet.address);
          
          // Create a cipher provider using the wallet private key
          const cipherProvider = new EthereumPrivateKeyCipherProvider({
            key: wallet.privateKey,
            method: Types.Encryption.METHOD.ECIES,
          });
          
          // Create a signature provider as well
          const signatureProvider = new EthereumPrivateKeySignatureProvider({
            privateKey: wallet.privateKey,
            method: Types.Signature.METHOD.ECDSA,
          });
          
          // Check if decryption is available
          const canDecrypt = cipherProvider.isDecryptionAvailable();
          console.log('0xHypr WALLET-DEBUG', 'Can decrypt with this wallet?', canDecrypt);
          
          // Create a request client with both providers
          const requestClient = new RequestNetwork({
            nodeConnectionConfig: {
              baseURL: 'https://xdai.gateway.request.network/',
            },
            cipherProvider,
            signatureProvider,
          });
          
          // Get the request using the request ID
          console.log('0xHypr WALLET-DEBUG', 'Fetching request...');
          const request = await requestClient.fromRequestId(requestId);
          
          // Try to get the data
          console.log('0xHypr WALLET-DEBUG', 'Getting request data...');
          const requestData = request.getData();
          console.log('0xHypr WALLET-DEBUG', 'Invoice data retrieved successfully');
          
          setInvoice(requestData);
          setError(null);
          setUsingDatabaseFallback(false);
        } catch (innerErr) {
          console.error('0xHypr WALLET-DEBUG', 'Error decrypting with wallet:', innerErr);
          
          // If we have database data, use it as fallback
          if (dbInvoiceData) {
            console.log('0xHypr WALLET-DEBUG', 'Using database fallback data');
            // Format database invoice data to match expected structure
            const formattedData = {
              contentData: dbInvoiceData.invoiceData || {},
              expectedAmount: dbInvoiceData.amount ? 
                (parseFloat(dbInvoiceData.amount) * 100).toString() : '0', // Convert to cents
              currency: dbInvoiceData.currency || 'USDC'
            };
            
            setInvoice(formattedData);
            setUsingDatabaseFallback(true);
            setError(null);
          } else {
            throw innerErr;
          }
        }
      } catch (err) {
        console.error('0xHypr WALLET-DEBUG', 'Error fetching invoice', err);
        if (err instanceof Error) {
          console.error('0xHypr WALLET-DEBUG', 'Error message:', err.message);
        }
        
        // Last resort fallback to database
        if (dbInvoiceData) {
          console.log('0xHypr WALLET-DEBUG', 'Using database fallback data after error');
          // Format database invoice data to match expected structure
          const formattedData = {
            contentData: dbInvoiceData.invoiceData || {},
            expectedAmount: dbInvoiceData.amount ? 
              (parseFloat(dbInvoiceData.amount) * 100).toString() : '0', // Convert to cents
            currency: dbInvoiceData.currency || 'USDC'
          };
          
          setInvoice(formattedData);
          setUsingDatabaseFallback(true);
          setError(null);
        } else {
          setError('Failed to load invoice details. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (requestId && walletPrivateKey) {
      fetchInvoice();
    }
  }, [requestId, walletPrivateKey, dbInvoiceData]);

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
      total = (Number(invoice.expectedAmount) / 1e18).toFixed(2);
    } else {
      total = '0.00';
    }
  }

  // Format date
  const formattedDate = creationDate 
    ? new Date(creationDate).toLocaleDateString()
    : 'Not specified';

  // Extract currency from invoice data
  let currency = 'USDC'; // Default to USDC
  
  // Try to get the currency from the invoice data
  if (invoice?.currency) {
    // If we have currency value directly from Request Network API
    currency = invoice.currency.value || currency;
  } else if (dbInvoiceData?.currency) {
    // If we're using database fallback
    currency = dbInvoiceData.currency;
  } else if (invoiceItems && invoiceItems.length > 0 && invoiceItems[0].currency) {
    // Try to get from line items
    currency = invoiceItems[0].currency;
  }

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
        <CardDescription>Created on {formattedDate}</CardDescription>
        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit mt-2">
          Accessed with your account wallet
        </div>
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
              {paymentTerms?.dueDate && (
                <div className="py-1">
                  <span className="font-medium">Due Date: </span>
                  <span>{new Date(paymentTerms.dueDate).toLocaleDateString()}</span>
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
          decryptionKey={walletPrivateKey || ''}
          amount={total}
          currency={currency}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </CardFooter>
      
      {/* Add this if using database fallback */}
      {usingDatabaseFallback && (
        <div className="mt-4 px-6 pb-6">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Processing</AlertTitle>
            <AlertDescription>
              This invoice is still being processed on the blockchain. Some payment options may not be available yet.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}