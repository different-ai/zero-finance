'use client';

import React from 'react';

interface InvoiceHeaderProps {
  invoiceNumber?: string;
  invoiceId: string;
  status?: string | null;
  issueDate?: string;
  dueDate?: string;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoiceNumber,
  invoiceId,
  status,
  issueDate,
  dueDate,
}) => {
  return (
    <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 px-8 py-6 border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Invoice {invoiceNumber ? `#${invoiceNumber}` : ''}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            ID: {invoiceId.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="text-right">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              status === 'paid'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                status === 'paid' ? 'bg-green-600' : 'bg-yellow-600'
              }`}
            />
            {status === 'paid' ? 'Paid' : 'Pending Payment'}
          </div>
          {issueDate && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Issued: {new Date(issueDate).toLocaleDateString()}
            </p>
          )}
          {dueDate && (
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Due: {new Date(dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

InvoiceHeader.displayName = 'InvoiceHeader';
