/**
 * CSV utility functions for exporting data
 */

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
 * Generates a dated filename for CSV exports.
 */
export function generateExportFilename(prefix: string): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  return `${prefix}-${dateStr}.csv`;
}
