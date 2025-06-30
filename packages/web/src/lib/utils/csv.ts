/**
 * CSV utility functions for exporting data
 */

import type { InboxCardDB } from '@/db/schema';

/**
 * Escapes CSV values to handle commas, quotes, and newlines
 */
function escapeCSVValue(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Converts an array of objects to CSV string
 */
export function objectsToCSV<T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) return '';
  
  // Create header row
  const headers = columns.map(col => escapeCSVValue(col.label)).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return columns
      .map(col => {
        const value = item[col.key];
        return escapeCSVValue(value);
      })
      .join(',');
  });
  
  return [headers, ...rows].join('\n');
}

/**
 * Formats an inbox card for CSV export
 */
export function formatInboxCardForCSV(card: InboxCardDB): Record<string, any> {
  const sourceDetails = card.sourceDetails as any || {};
  const impact = card.impact as any || {};
  
  return {
    date: card.timestamp ? new Date(card.timestamp).toISOString().split('T')[0] : '',
    time: card.timestamp ? new Date(card.timestamp).toISOString().split('T')[1].split('.')[0] : '',
    subject: card.title,
    vendor: sourceDetails.name || sourceDetails.from || '',
    amount: card.amount || '',
    currency: card.currency || '',
    status: card.status,
    confidence: card.confidence,
    type: card.sourceType,
    notes: Array.isArray(card.comments) && (card.comments as any[]).length > 0 
      ? (card.comments as any[]).map((c: any) => c.text || '').join('; ') 
      : '',
    rationale: card.rationale,
    fromEntity: card.fromEntity || '',
    toEntity: card.toEntity || '',
    // Add financial impact data
    impactType: impact.type || '',
    impactAmount: impact.amount || '',
  };
}

/**
 * Converts inbox cards to CSV string with predefined columns
 */
export function inboxCardsToCSV(cards: InboxCardDB[]): string {
  const columns = [
    { key: 'date' as const, label: 'Date' },
    { key: 'time' as const, label: 'Time' },
    { key: 'subject' as const, label: 'Subject' },
    { key: 'vendor' as const, label: 'Vendor' },
    { key: 'amount' as const, label: 'Amount' },
    { key: 'currency' as const, label: 'Currency' },
    { key: 'status' as const, label: 'Status' },
    { key: 'confidence' as const, label: 'Confidence' },
    { key: 'type' as const, label: 'Type' },
    { key: 'notes' as const, label: 'Notes' },
    { key: 'fromEntity' as const, label: 'From' },
    { key: 'toEntity' as const, label: 'To' },
  ];
  
  const formattedCards = cards.map(formatInboxCardForCSV);
  return objectsToCSV(formattedCards, columns);
}

/**
 * Triggers a CSV file download in the browser
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Generates a filename for inbox export with current date
 */
export function generateInboxExportFilename(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  return `inbox-export-${dateStr}.csv`;
} 