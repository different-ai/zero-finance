'use client';

import React from 'react';
import { formatDisplayCurrency } from '@/lib/utils';
import { ParsedInvoiceItem, calculateItemTotal } from './types';

interface InvoiceItemsTableProps {
  items: ParsedInvoiceItem[];
  currency?: string | null;
  network?: string;
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
  items,
  currency,
  network = 'base',
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
        Invoice Details
      </h3>
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Tax
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            {items.map((item: ParsedInvoiceItem, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">
                  {item.name || 'Item'}
                </td>
                <td className="px-6 py-4 text-sm text-right text-neutral-600 dark:text-neutral-400">
                  {item.quantity || 1}
                </td>
                <td className="px-6 py-4 text-sm text-right text-neutral-600 dark:text-neutral-400">
                  {formatDisplayCurrency(
                    item.unitPrice || '0',
                    currency,
                    network,
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-right text-neutral-600 dark:text-neutral-400">
                  {item.tax && typeof item.tax === 'object'
                    ? item.tax.amount
                    : item.tax
                      ? item.tax + '%'
                      : '0%'}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-neutral-900 dark:text-neutral-100">
                  {formatDisplayCurrency(
                    calculateItemTotal(item).toFixed(2),
                    currency,
                    network,
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

InvoiceItemsTable.displayName = 'InvoiceItemsTable';
