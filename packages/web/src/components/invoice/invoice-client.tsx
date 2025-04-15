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
import { CommitButton } from './commit-button';
import { InvoiceDisplay, InvoiceDisplayData } from './invoice-display';
import { Loader2 } from 'lucide-react';

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
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
}

interface InvoiceClientProps {
  requestId: string; // DB primary key
  requestNetworkId?: string; // Request Network ID (optional)
  walletPrivateKey?: string;
  dbInvoiceData?: ClientDbInvoiceData | null; // Use client-side type
  isExternalView?: boolean;
}

// Helper function to map RN/DB data to InvoiceDisplayData format
// Similar to the one in PublicInvoicePage but adapts based on source (RN vs DB)
function mapToDisplayDataFromClient( 
    sourceData: Types.IRequestData | ClientDbInvoiceData | null, 
    isDbFallback: boolean 
): InvoiceDisplayData | null {
  if (!sourceData) return null;

  let displayData: Partial<InvoiceDisplayData> = {};
  let nestedInvoiceData: any = {};

  if (isDbFallback && sourceData) {
    const dbData = sourceData as ClientDbInvoiceData;
    nestedInvoiceData = dbData.invoiceData || {};
    displayData = {
        invoiceNumber: nestedInvoiceData.invoiceNumber,
        creationDate: dbData.createdAt ?? undefined,
        status: dbData.status === 'paid' ? 'Paid' : dbData.status === 'db_pending' ? 'Draft' : 'Pending', // Map status
        sellerInfo: nestedInvoiceData.sellerInfo,
        buyerInfo: nestedInvoiceData.buyerInfo,
        invoiceItems: nestedInvoiceData.invoiceItems?.map((item: any) => ({ ...item, unitPrice: String(item.unitPrice) })),
        paymentTerms: nestedInvoiceData.paymentTerms,
        note: nestedInvoiceData.note,
        terms: nestedInvoiceData.terms,
        paymentType: nestedInvoiceData.paymentType,
        currency: dbData.currency || nestedInvoiceData.currency,
        network: nestedInvoiceData.network,
        amount: dbData.amount || '0.00', // Use direct amount if available
        bankDetails: nestedInvoiceData.bankDetails,
        isOnChain: !!dbData.requestId,
    };
  } else if (!isDbFallback && sourceData) {
     const rnData = sourceData as Types.IRequestData;
     nestedInvoiceData = rnData.contentData || {};
     displayData = {
        invoiceNumber: nestedInvoiceData.invoiceNumber,
        creationDate: new Date(rnData.timestamp * 1000), // Convert RN timestamp
        status: rnData.state === Types.RequestLogic.STATE.ACCEPTED ? 'Paid' : 'Pending', // Map status
        sellerInfo: nestedInvoiceData.sellerInfo,
        buyerInfo: nestedInvoiceData.buyerInfo,
        invoiceItems: nestedInvoiceData.invoiceItems?.map((item: any) => ({ ...item, unitPrice: String(item.unitPrice) })),
        paymentTerms: nestedInvoiceData.paymentTerms,
        note: nestedInvoiceData.note,
        terms: nestedInvoiceData.terms,
        paymentType: nestedInvoiceData.paymentType,
        currency: rnData.currencyInfo?.value, // Use currencyInfo from RN
        network: nestedInvoiceData.network || rnData.currencyInfo?.network,
        amount: rnData.expectedAmount 
             ? ethers.utils.formatUnits(rnData.expectedAmount, (rnData.currencyInfo as any)?.decimals ?? 0) 
             : '0.00',
        bankDetails: nestedInvoiceData.bankDetails,
        isOnChain: true, // Assumed true if fetched from RN
     };
  }
  
  // Common calculations (can refine if needed)
  const calculatedTotal = displayData.invoiceItems?.reduce((sum: number, item: any) => {
    const quantity = item.quantity || 0;
    const unitPrice = parseFloat(item.unitPrice || '0');
    const taxRate = parseFloat(item.tax?.amount || '0') / 100;
    const subtotal = quantity * unitPrice;
    const taxAmount = subtotal * taxRate;
    return sum + subtotal + taxAmount;
  }, 0).toFixed(2);

  // Override amount with calculated total if it seems more accurate or direct one is missing
  displayData.amount = calculatedTotal || displayData.amount || '0.00'; 

  return displayData as InvoiceDisplayData;
}

export default function InvoiceClient({ 
  requestId, 
  requestNetworkId, 
  walletPrivateKey, 
  dbInvoiceData,
  isExternalView = false
}: InvoiceClientProps) {
  const [invoiceSourceData, setInvoiceSourceData] = useState<Types.IRequestData | ClientDbInvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [usingDatabaseFallback, setUsingDatabaseFallback] = useState(false);
  
  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        setUsingDatabaseFallback(false);
        setError(null);
        
        const effectiveRequestId = requestNetworkId; 
        console.log('InvoiceClient: Effective Request ID:', effectiveRequestId);
        
        if (!walletPrivateKey && !isExternalView) {
          throw new Error('No wallet private key provided for internal view');
        }
        
        if (!effectiveRequestId) {
           console.log('InvoiceClient: No RequestNetwork ID. Using DB data only.');
           if (dbInvoiceData) {
             setInvoiceSourceData(dbInvoiceData);
             setUsingDatabaseFallback(true);
           } else {
             throw new Error('No Request Network ID and no database data available.');
           }
        } else if (walletPrivateKey) { // Try RN fetch
             let cleanKey = walletPrivateKey.trim();
             if (!cleanKey.startsWith('0x')) cleanKey = `0x${cleanKey}`;
             
             try {
               const wallet = new ethers.Wallet(cleanKey);
               const cipherProvider = new EthereumPrivateKeyCipherProvider({ key: wallet.privateKey, method: Types.Encryption.METHOD.ECIES });
               const signatureProvider = new EthereumPrivateKeySignatureProvider({ privateKey: wallet.privateKey, method: Types.Signature.METHOD.ECDSA });
               
               const requestClient = new RequestNetwork({
                 nodeConnectionConfig: { baseURL: 'https://xdai.gateway.request.network/' },
                 cipherProvider, signatureProvider,
               });
               
               const request = await requestClient.fromRequestId(effectiveRequestId);
               const requestData = request.getData();
               console.log('InvoiceClient: Fetched from Request Network successfully');
               setInvoiceSourceData(requestData);
               setUsingDatabaseFallback(false);
             } catch (innerErr) {
               console.error('InvoiceClient: Error fetching/decrypting from Request Network:', innerErr);
               if (dbInvoiceData) {
                 console.log('InvoiceClient: Using database fallback data after RN error.');
                 setInvoiceSourceData(dbInvoiceData);
                 setUsingDatabaseFallback(true);
               } else {
                 throw innerErr; // Re-throw if no fallback
               }
             }
        } else { // External view without wallet key - should now rely solely on dbInvoiceData
            console.log('InvoiceClient: External view without wallet key. Using DB data if available.');
            if (dbInvoiceData) {
              setInvoiceSourceData(dbInvoiceData);
              setUsingDatabaseFallback(true);
            } else {
              throw new Error('External view requires database data when no wallet key is present.');
            }
        }
      } catch (err) {
        console.error('InvoiceClient: Top-level error fetching invoice', err);
        if (dbInvoiceData) {
          console.log('InvoiceClient: Using database fallback data after top-level error.');
          setInvoiceSourceData(dbInvoiceData);
          setUsingDatabaseFallback(true);
        } else {
           setError(err instanceof Error ? err.message : 'Failed to load invoice details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch logic condition adjusted slightly
    if (dbInvoiceData || (walletPrivateKey && requestNetworkId)) {
      fetchInvoice();
    } else if (!isExternalView && !walletPrivateKey) {
       setError('Wallet key missing for internal view.');
       setIsLoading(false);
    } else if (isExternalView && !dbInvoiceData) {
        setError('Invoice data not found.');
        setIsLoading(false);
    } else {
       // Fallback if conditions somehow missed
       setError('Unable to load invoice data.');
       setIsLoading(false);
    }

  }, [requestId, requestNetworkId, walletPrivateKey, dbInvoiceData, isExternalView]);

  const handlePaymentSuccess = () => setPaymentSuccess(true);
  const handlePaymentError = (error: Error) => setError(`Payment failed: ${error.message}`);

  const displayData = mapToDisplayDataFromClient(invoiceSourceData, usingDatabaseFallback);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  if (error) {
    return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }
  if (!displayData) { 
    return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>Could not load invoice data.</AlertDescription></Alert>;
  }
  
  const isSeller = !isExternalView && dbInvoiceData?.role === 'seller'; 

  // Prepare props for child components, ensuring correct types
  const invoiceDisplayProps = { 
      invoiceData: displayData, 
      isExternalView 
  }; // Matches InvoiceDisplayProps implicitly
  
  const payButtonProps = {
      // PayButton seems to expect requestNetworkId and decryptionKey which we no longer have reliably.
      // We might need to adjust PayButton or pass different props.
      // For now, let's pass what we have, but this might need revisiting.
      requestId: requestNetworkId || requestId, // Fallback to DB id?
      amount: displayData.amount || '0', 
      currency: displayData.currency || '',
      onSuccess: handlePaymentSuccess,
      onError: handlePaymentError,
      // Add any other required props for PayButton, potentially casting invoiceSourceData
      // decryptionKey: ??? // We removed this concept
  };

  const commitButtonProps = {
      invoiceId: requestId, 
      onSuccess: () => { /* Refetch or update state on commit */ },
      // Removed isCommitting - handle internally in CommitButton
  };

  return (
    <div>
      <div>
        {paymentSuccess && (
          // Fixed Alert variant for success
          <Alert variant="default"> 
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Payment Successful</AlertTitle>
            <AlertDescription>Your payment has been processed.</AlertDescription>
          </Alert>
        )}
        {/* Pass validated props to InvoiceDisplay */}
        <InvoiceDisplay {...invoiceDisplayProps} /> 
      </div>
      <div>
      <CardFooter className="flex justify-between items-center">
     
         <div className="flex gap-2">
     
           {isSeller && !displayData.isOnChain && (
             // Pass validated props to CommitButton
             <CommitButton {...commitButtonProps} />
           )}
         </div>
      </CardFooter>
      </div>
    </div>
  );
}