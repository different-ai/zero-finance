'use client';

import React from 'react';
import { formatDisplayCurrency } from '@/lib/utils';
import { getCurrencyConfig } from '@/lib/currencies';
import { ParsedInvoiceItem, getTaxPercent } from './types';

interface InvoiceTotalsProps {
  items: ParsedInvoiceItem[];
  currency?: string | null;
  network?: string;
}

export const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
  items,
  currency,
  network = 'base',
}) => {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const unitPrice = parseFloat(item.unitPrice || '0');
    return sum + quantity * unitPrice;
  }, 0);

  const totalTax = items.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const unitPrice = parseFloat(item.unitPrice || '0');
    const taxRate = getTaxPercent(item.tax) / 100;
    return sum + quantity * unitPrice * taxRate;
  }, 0);

  const totalAmount = subtotal + totalTax;

  // Convert calculated total to smallest unit for proper display
  const currencySymbol = currency || 'USD';
  const currencyConfig = getCurrencyConfig(currencySymbol, network);
  const decimals = currencyConfig?.decimals || 2;

  // Convert to smallest unit (e.g., cents for USD, wei for ETH)
  const totalAmountInSmallestUnit = Math.round(
    totalAmount * Math.pow(10, decimals),
  ).toString();

  return (
    <div className="flex justify-end mb-8">
      <div className="w-80 space-y-2">
        <div className="flex justify-between py-2 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            Subtotal
          </span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {formatDisplayCurrency(subtotal.toFixed(2), currency, network)}
          </span>
        </div>
        {totalTax > 0 && (
          <div className="flex justify-between py-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Tax</span>
            <span className="text-neutral-900 dark:text-neutral-100">
              {formatDisplayCurrency(totalTax.toFixed(2), currency, network)}
            </span>
          </div>
        )}
        <div className="flex justify-between py-3 text-lg font-semibold border-t border-neutral-200 dark:border-neutral-700">
          <span className="text-neutral-900 dark:text-neutral-100">
            Total Amount
          </span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {formatDisplayCurrency(
              totalAmountInSmallestUnit,
              currency,
              network,
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

InvoiceTotals.displayName = 'InvoiceTotals';
