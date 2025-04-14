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
import { CommitButton } from './commit-button';

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
  status: 'pending' | 'paid' | 'db_pending' | 'committing' | 'failed' | 'canceled' | null;
  client: string | null;
  invoiceData: any; // Keep as 'any' or infer Zod schema client-side
  shareToken: string | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
}

interface InvoiceClientProps {
  requestId: string; // DB primary key
  requestNetworkId?: string; // Request Network ID (optional)
  walletPrivateKey?: string;
  decryptionKey?: string;
  dbInvoiceData?: ClientDbInvoiceData | null; // Use client-side type
  isExternalView?: boolean;
}

export default function InvoiceClient(props: InvoiceClientProps) {
  // If we have a decryption key, use the standard InvoiceContainer
  if (props.decryptionKey) {
    return (
      <InvoiceContainer 
        requestId={props.requestId} 
        requestNetworkId={props.requestNetworkId} // Pass down
        decryptionKey={props.decryptionKey} 
        dbInvoiceData={props.dbInvoiceData}
        isExternalView={props.isExternalView}
      />
    );
  }
  
  // Otherwise render the client invoice with wallet key
  return <WalletKeyInvoiceClient {...props} />;
}

// Separate component to avoid conditional hooks
function WalletKeyInvoiceClient({ 
  requestId, 
  requestNetworkId, // Accept the prop
  walletPrivateKey, 
  dbInvoiceData,
  isExternalView = false
}: InvoiceClientProps) {
  // Define states at the top level
  const [invoice, setInvoice] = useState<Types.IRequestData | any | null>(null);
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
        // Use requestNetworkId if available, otherwise fallback to requestId (which should be the RN ID in this path)
        const effectiveRequestId = requestNetworkId || requestId;
        console.log('0xHypr WALLET-DEBUG', 'Effective Request ID:', effectiveRequestId);
        
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
          
          // Get the request using the effective request ID
          console.log('0xHypr WALLET-DEBUG', 'Fetching request...');
          const request = await requestClient.fromRequestId(effectiveRequestId);
          
          // Try to get the data
          console.log('0xHypr WALLET-DEBUG', 'Getting request data...');
          const requestData = request.getData();
          console.log('0xHypr WALLET-DEBUG', 'Invoice data retrieved successfully');
          
          setInvoice(requestData);
          setError(null);
          setUsingDatabaseFallback(false);
        } catch (innerErr) {
          console.error('0xHypr WALLET-DEBUG', 'Error fetching/decrypting from Request Network:', innerErr);
          // Log specific error details if available
          if (innerErr instanceof Error) {
            console.error('0xHypr WALLET-DEBUG', 'RN Fetch Error Name:', innerErr.name);
            console.error('0xHypr WALLET-DEBUG', 'RN Fetch Error Message:', innerErr.message);
            console.error('0xHypr WALLET-DEBUG', 'RN Fetch Error Stack:', innerErr.stack);
          } else {
            console.error('0xHypr WALLET-DEBUG', 'RN Fetch Error (non-Error object):', String(innerErr));
          }
          
          // If we have database data, use it as fallback
          if (dbInvoiceData) {
            console.log('0xHypr WALLET-DEBUG', 'Using database fallback data');
            const nestedInvoiceData = dbInvoiceData.invoiceData || {}; // Ensure it's an object
            const formattedData: any = {
              contentData: nestedInvoiceData,
              expectedAmount: dbInvoiceData.amount ? 
                 (parseFloat(dbInvoiceData.amount) * 100).toString() : '0',
              currencyInfo: { 
                 // Safely access paymentType from nestedInvoiceData
                 type: (nestedInvoiceData as any)?.paymentType === 'fiat' ? Types.RequestLogic.CURRENCY.ISO4217 : Types.RequestLogic.CURRENCY.ERC20,
                 value: dbInvoiceData.currency || ''
              },
              currency: dbInvoiceData.currency || '', 
              // Add other fields potentially needed by UI rendering based on IRequestData
              state: dbInvoiceData.status === 'paid' ? Types.RequestLogic.STATE.ACCEPTED : Types.RequestLogic.STATE.CREATED,
              timestamp: Math.floor(new Date(dbInvoiceData.createdAt || Date.now()).getTime() / 1000),
              // May need payee/payer info if UI uses it
              payee: { type: Types.Identity.TYPE.ETHEREUM_ADDRESS, value: dbInvoiceData.walletAddress || '' },
              requestId: dbInvoiceData.requestId || undefined // Pass RN ID if available
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
          const nestedInvoiceData = dbInvoiceData.invoiceData || {}; // Ensure it's an object
          const formattedData: any = { 
             contentData: nestedInvoiceData,
             expectedAmount: dbInvoiceData.amount ? (parseFloat(dbInvoiceData.amount) * 100).toString() : '0',
             currencyInfo: { 
                // Safely access paymentType from nestedInvoiceData
                type: (nestedInvoiceData as any)?.paymentType === 'fiat' ? Types.RequestLogic.CURRENCY.ISO4217 : Types.RequestLogic.CURRENCY.ERC20,
                value: dbInvoiceData.currency || ''
             },
             currency: dbInvoiceData.currency || '',
             state: dbInvoiceData.status === 'paid' ? Types.RequestLogic.STATE.ACCEPTED : Types.RequestLogic.STATE.CREATED,
             timestamp: Math.floor(new Date(dbInvoiceData.createdAt || Date.now()).getTime() / 1000),
             payee: { type: Types.Identity.TYPE.ETHEREUM_ADDRESS, value: dbInvoiceData.walletAddress || '' },
             requestId: dbInvoiceData.requestId || undefined
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

    // We need the effective ID and the wallet key
    const effectiveRequestId = requestNetworkId || requestId;
    if (effectiveRequestId && walletPrivateKey) {
      fetchInvoice();
    }
  }, [requestId, requestNetworkId, walletPrivateKey, dbInvoiceData]); // Add requestNetworkId dependency

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

  // Extract currency using type information
  let currency = 'USDC'; // Default 
  if (invoice?.currencyInfo) { // Use currencyInfo if available from RN data
      currency = invoice.currencyInfo.value || currency;
  } else if (invoice?.currency) { // Fallback to top-level currency (from DB format)
      currency = invoice.currency;
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

  // Example of using isExternalView (needs implementing properly)
  const showPayButton = isExternalView && invoice && !paymentSuccess;
  const showCommitButton = !isExternalView && invoice && !invoice.requestId && !usingDatabaseFallback; // Only on internal view, if not on chain and not fallback

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
        {/* Commit Button Logic */}
        {showCommitButton && (
           <CommitButton 
             invoiceId={requestId} // Pass the DB ID
             // onSuccess callback is optional, add if needed
             onSuccess={() => {
                console.log('Commit successful, maybe refetch data or show message');
                // Example: Trigger a refetch or update UI state if necessary
                // Consider using a mutation hook if this becomes complex
             }}
           /> 
        )}

        {/* Pay Button Logic - Needs props from the fetched 'invoice' state */}
        {showPayButton && (
          <div className="mt-8 border-t border-gray-200 pt-6 text-right">
             {/* Revert to using props PayButton expects for now 
                 TODO: Refactor PayButton to accept requestData directly? 
                 We need the RN request ID here if available, otherwise maybe disable pay?
             */}
             {requestNetworkId && walletPrivateKey && (
               <PayButton 
                  requestId={requestNetworkId} // Use RN ID
                  decryptionKey={walletPrivateKey} // Needs owner wallet key for RN payment flow?
                  amount={invoice?.expectedAmount || '0'} // Get amount from fetched data
                  currency={invoice?.currencyInfo?.symbol || invoice?.currency || ''} // Get currency from fetched data
                  onError={handlePaymentError}
                  usingDatabaseFallback={usingDatabaseFallback} // Pass fallback status
               />
             )} 
             {!requestNetworkId && (
               <span className="text-sm text-gray-500">Payment unavailable (Invoice not on chain)</span>
             )}
          </div>
        )}

        {/* Processing/Fallback Message */}
        {usingDatabaseFallback && (
          <Alert variant="default" className="mt-6 border-yellow-400 bg-yellow-50 text-yellow-800"> {/* Use default variant + custom classes */}
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Using Local Data</AlertTitle>
            <AlertDescription>
              Could not retrieve live data from Request Network. Displaying saved invoice details.
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}