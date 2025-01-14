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
 * Get the base URL for the web API
 */
export function getWebApiBaseUrl(): string {
  if (!app.isPackaged) {
    return 'http://localhost:3050/api';
  }
  return 'https://invoices.hyprsqrl.com/api';
}

/**
 * Generate a complete invoice URL for a given request ID and token
 */
export function generateInvoiceUrl(requestId: string, token: string): string {
  return `${getInvoiceBaseUrl()}/${requestId}?token=${token}`;
}
