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
import { InvoiceDisplay, InvoiceDisplayData } from './invoice-display';

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
        setUsingDatabaseFallback(false); // Reset fallback state
        setError(null);
        
        const effectiveRequestId = requestNetworkId; // Prefer RN ID if available
        console.log('WalletKeyInvoiceClient: Effective Request ID:', effectiveRequestId);
        
        if (!walletPrivateKey && !isExternalView) { // Wallet key needed unless external
          throw new Error('No wallet private key provided for internal view');
        }
        
        if (!effectiveRequestId) {
           console.log('WalletKeyInvoiceClient: No RequestNetwork ID. Using DB data only.');
           if (dbInvoiceData) {
             setInvoiceSourceData(dbInvoiceData);
             setUsingDatabaseFallback(true);
           } else {
             throw new Error('No Request Network ID and no database data available.');
           }
        } else if (walletPrivateKey) { // Try RN fetch only if key and ID are present
             let cleanKey = walletPrivateKey.trim();
             if (!cleanKey.startsWith('0x')) {
               cleanKey = `0x${cleanKey}`;
             }
             
             try {
               const wallet = new ethers.Wallet(cleanKey);
               const cipherProvider = new EthereumPrivateKeyCipherProvider({
                 key: wallet.privateKey,
                 method: Types.Encryption.METHOD.ECIES,
               });
               const signatureProvider = new EthereumPrivateKeySignatureProvider({
                 privateKey: wallet.privateKey,
                 method: Types.Signature.METHOD.ECDSA,
               });
               
               const requestClient = new RequestNetwork({
                 nodeConnectionConfig: {
                   baseURL: 'https://xdai.gateway.request.network/', // Use Gnosis for consistency?
                 },
                 cipherProvider,
                 signatureProvider,
               });
               
               const request = await requestClient.fromRequestId(effectiveRequestId);
               const requestData = request.getData();
               console.log('WalletKeyInvoiceClient: Fetched from Request Network successfully');
               setInvoiceSourceData(requestData);
               setUsingDatabaseFallback(false);
             } catch (innerErr) {
               console.error('WalletKeyInvoiceClient: Error fetching/decrypting from Request Network:', innerErr);
               if (dbInvoiceData) {
                 console.log('WalletKeyInvoiceClient: Using database fallback data after RN error.');
                 setInvoiceSourceData(dbInvoiceData);
                 setUsingDatabaseFallback(true);
               } else {
                 throw innerErr; // Re-throw if no fallback
               }
             }
        } else { 
           // Should not happen if logic is correct (needs effectiveRequestId AND key for RN)
           // Fallback to DB if possible
            console.log('WalletKeyInvoiceClient: Condition mismatch (key/ID). Using DB data if available.');
            if (dbInvoiceData) {
              setInvoiceSourceData(dbInvoiceData);
              setUsingDatabaseFallback(true);
            } else {
              throw new Error('Cannot fetch from Request Network (missing key or ID) and no database data.');
            }
        }
      } catch (err) {
        console.error('WalletKeyInvoiceClient: Top-level error fetching invoice', err);
        if (dbInvoiceData) {
          console.log('WalletKeyInvoiceClient: Using database fallback data after top-level error.');
          setInvoiceSourceData(dbInvoiceData);
          setUsingDatabaseFallback(true);
        } else {
           setError(err instanceof Error ? err.message : 'Failed to load invoice details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have necessary data (DB data or key+RN ID)
    if (dbInvoiceData || (walletPrivateKey && requestNetworkId)) {
       fetchInvoice();
    } else if (!isExternalView) { // If internal view and missing requirements
       setError('Missing required data to fetch invoice (DB or Wallet Key + RN ID).');
       setIsLoading(false);
    } else { // External view with no data? Should be handled by the page component
       setError('Invoice data not available.');
       setIsLoading(false);
    }

  }, [requestId, requestNetworkId, walletPrivateKey, dbInvoiceData, isExternalView]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Potentially trigger a refetch or update status locally?
  };

  const handlePaymentError = (error: Error) => {
    setError(`Payment failed: ${error.message}`);
  };

  // --- Format data for InvoiceDisplay ---
  const displayData = mapToDisplayDataFromClient(invoiceSourceData, usingDatabaseFallback);

  // --- Render InvoiceDisplay --- 
  return (
    <InvoiceDisplay 
      invoiceData={displayData} 
      isLoading={isLoading}
      error={error}
      paymentSuccess={paymentSuccess}
      isExternalView={isExternalView}
    />
    // Add PayButton or CommitButton conditionally based on view/status if needed
    // e.g., !isExternalView && displayData?.status !== 'Paid' && <PayButton ... />
    // e.g., !isExternalView && displayData?.status === 'Draft' && <CommitButton ... />
  );
}