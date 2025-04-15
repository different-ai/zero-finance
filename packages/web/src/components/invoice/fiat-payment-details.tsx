import React from 'react';
import { UserFundingSource } from '@/db/schema'; // Changed import

interface FiatPaymentDetailsProps {
  fundingSource: UserFundingSource | null;
  invoiceNumber?: string | null;
}

export const FiatPaymentDetails: React.FC<FiatPaymentDetailsProps> = ({ fundingSource, invoiceNumber }) => {
  if (!fundingSource) {
    return <p className="text-sm text-gray-500">Bank details not provided by seller.</p>;
  }

  // Use fields from UserFundingSource
  const accountHolder = fundingSource.sourceBankBeneficiaryName || 'N/A';
  const iban = fundingSource.sourceIban || 'N/A';
  const bic = fundingSource.sourceBicSwift || 'N/A';
  const bankName = fundingSource.sourceBankName || 'N/A';
  const accountNumber = fundingSource.sourceAccountNumber || 'N/A';
  const routingNumber = fundingSource.sourceRoutingNumber || 'N/A';
  const sortCode = fundingSource.sourceSortCode || 'N/A';

  // Conditionally display details based on what's available
  const hasIban = iban && iban !== 'N/A';
  // Adjust logic based on available fields in UserFundingSource
  const hasUsDetails = accountNumber !== 'N/A' || routingNumber !== 'N/A';
  const hasUkDetails = sortCode !== 'N/A' || accountNumber !== 'N/A';

  return (
    <div className="text-left bg-gray-50 p-4 rounded border text-sm space-y-1">
      <h4 className="font-medium mb-2 text-gray-800">Bank Transfer Details:</h4>
      <p><strong>Account Holder:</strong> {accountHolder}</p>
      {bankName !== 'N/A' && <p><strong>Bank:</strong> {bankName}</p>}

      {hasIban && (
        <>
          <p><strong>IBAN:</strong> {iban}</p>
          {bic !== 'N/A' && <p><strong>BIC/SWIFT:</strong> {bic}</p>}
        </>
      )}

      {hasUsDetails && !hasIban && ( // Show US details if available and IBAN isn't
         <>
           {accountNumber !== 'N/A' && <p><strong>Account Number:</strong> {accountNumber}</p>}
           {routingNumber !== 'N/A' && <p><strong>Routing Number:</strong> {routingNumber}</p>}
         </>
      )}

       {hasUkDetails && !hasIban && !hasUsDetails && ( // Show UK details if available and others aren't
         <>
           {accountNumber !== 'N/A' && <p><strong>Account Number:</strong> {accountNumber}</p>}
           {sortCode !== 'N/A' && <p><strong>Sort Code:</strong> {sortCode}</p>}
         </>
      )}

      {!hasIban && !hasUsDetails && !hasUkDetails && (
           <p className="text-orange-600">Specific account details (IBAN/Account Number) are missing.</p>
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