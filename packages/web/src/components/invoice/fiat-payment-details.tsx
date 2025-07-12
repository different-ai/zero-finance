import React from 'react';
import { UserFundingSource } from '@/db/schema'; // Changed import

interface FiatPaymentDetailsProps {
  fundingSource: UserFundingSource | null;
  invoiceNumber?: string | null;
  invoiceBankDetails?: {
    accountHolder?: string;
    iban?: string;
    bic?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
  } | null;
}

export const FiatPaymentDetails: React.FC<FiatPaymentDetailsProps> = ({ fundingSource, invoiceNumber, invoiceBankDetails }) => {
  console.log('🏦 FiatPaymentDetails - Invoice bank details:', invoiceBankDetails);
  console.log('🏦 FiatPaymentDetails - Funding source:', fundingSource);
  
  // Use invoice bank details if available, otherwise fall back to funding source
  let accountHolder, iban, bic, bankName, accountNumber, routingNumber, sortCode;

  if (invoiceBankDetails) {
    // Use bank details from invoice
    accountHolder = invoiceBankDetails.accountHolder || 'N/A';
    iban = invoiceBankDetails.iban || 'N/A';
    bic = invoiceBankDetails.bic || 'N/A';
    bankName = invoiceBankDetails.bankName || 'N/A';
    accountNumber = invoiceBankDetails.accountNumber || 'N/A';
    routingNumber = invoiceBankDetails.routingNumber || 'N/A';
    sortCode = 'N/A'; // Not typically in invoice data
    
    console.log('🏦 Using invoice bank details:', { accountHolder, iban, bic, bankName, accountNumber, routingNumber });
  } else if (fundingSource) {
    // Fallback to funding source
    accountHolder = fundingSource.sourceBankBeneficiaryName || 'N/A';
    iban = fundingSource.sourceIban || 'N/A';
    bic = fundingSource.sourceBicSwift || 'N/A';
    bankName = fundingSource.sourceBankName || 'N/A';
    accountNumber = fundingSource.sourceAccountNumber || 'N/A';
    routingNumber = fundingSource.sourceRoutingNumber || 'N/A';
    sortCode = fundingSource.sourceSortCode || 'N/A';
    console.log('🏦 Using funding source:', { accountHolder, iban, bic, bankName, accountNumber, routingNumber });
  } else {
    console.log('🏦 No bank details available');
    return <p className="text-sm text-gray-500">Bank details not provided by seller.</p>;
  }

  // Conditionally display details based on what's available
  const hasIban = iban && iban !== 'N/A' && iban !== '';
  const hasUsDetails = (accountNumber && accountNumber !== 'N/A' && accountNumber !== '') || 
                       (routingNumber && routingNumber !== 'N/A' && routingNumber !== '');
  const hasUkDetails = (sortCode && sortCode !== 'N/A' && sortCode !== '') || 
                       (accountNumber && accountNumber !== 'N/A' && accountNumber !== '');
  
  console.log('🏦 Validation results:', { hasIban, hasUsDetails, hasUkDetails, accountNumber, routingNumber, iban });

  return (
    <div className="text-left bg-gray-50 p-4 rounded border text-sm space-y-1">
      <h4 className="font-medium mb-2 text-gray-800">Bank Transfer Details:</h4>
      <p><strong>Account Holder:</strong> {accountHolder}</p>
      {bankName !== 'N/A' && <p><strong>Bank:</strong> {bankName}</p>}

      {/* Always show available bank details */}
      {hasIban && (
        <>
          <p><strong>IBAN:</strong> {iban}</p>
          {bic !== 'N/A' && bic && <p><strong>BIC/SWIFT:</strong> {bic}</p>}
        </>
      )}

      {hasUsDetails && (
         <>
           {accountNumber !== 'N/A' && accountNumber && <p><strong>Account Number:</strong> {accountNumber}</p>}
           {routingNumber !== 'N/A' && routingNumber && <p><strong>Routing Number:</strong> {routingNumber}</p>}
         </>
      )}

      {hasUkDetails && (
         <>
           {accountNumber !== 'N/A' && accountNumber && <p><strong>Account Number:</strong> {accountNumber}</p>}
           {sortCode !== 'N/A' && sortCode && <p><strong>Sort Code:</strong> {sortCode}</p>}
         </>
      )}

      {/* Show BIC/SWIFT even if no IBAN when it's available */}
      {!hasIban && bic !== 'N/A' && bic && (
        <p><strong>BIC/SWIFT:</strong> {bic}</p>
      )}

      {/* Show warning only if critical payment details are missing */}
      {!hasIban && !hasUsDetails && !hasUkDetails && (
           <div className="text-orange-600 mt-2 pt-2 border-t">
             <p className="text-xs">⚠️ Complete payment details (IBAN or Account Number/Routing Number) are not available.</p>
             <p className="text-xs mt-1">Please contact the sender for complete banking information.</p>
           </div>
      )}


      {invoiceNumber && (
        <p className="mt-2 pt-2 border-t text-xs text-gray-600">
          Please include Invoice #{invoiceNumber} in your payment reference.
        </p>
      )}
    </div>
  );
};

FiatPaymentDetails.displayName = 'FiatPaymentDetails'; 