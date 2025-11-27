'use client';

import React from 'react';

interface InvoiceProcessingMessageProps {
  isExternalView: boolean;
  status?: string | null;
}

export const InvoiceProcessingMessage: React.FC<
  InvoiceProcessingMessageProps
> = ({ isExternalView, status }) => {
  // Only show for internal view when invoice is not paid
  if (isExternalView || status === 'paid') {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          This invoice is being processed. Full details and payment options will
          be available once processing is complete.
        </p>
      </div>
    </div>
  );
};

InvoiceProcessingMessage.displayName = 'InvoiceProcessingMessage';
