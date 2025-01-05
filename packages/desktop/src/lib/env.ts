import { app } from 'electron';

/**
 * Environment-aware helper function to generate invoice URLs
 * Returns localhost URL for development and production URL for production
 * Uses Electron's app.isPackaged to determine environment
 */
export function getInvoiceBaseUrl(): string {
  // app.isPackaged is false during development and true in production
  if (!app.isPackaged) {
    return 'http://localhost:3050/invoice';
  }
  // Production environment
  return 'https://invoices.hyprsqrl.com/invoice';
}

/**
 * Generate a complete invoice URL for a given request ID
 * @param requestId The Request Network request ID
 * @returns Complete shareable URL for the invoice
 */
export function generateInvoiceUrl(requestId: string): string {
  return `${getInvoiceBaseUrl()}/${requestId}`;
}
