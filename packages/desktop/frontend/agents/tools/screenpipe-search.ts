import { z } from 'zod';
import { tool } from 'ai';

export interface ScreenpipeSearchResult {
  type: string;
  content: {
    text: string;
    timestamp: string;
    frame_id?: number;
    file_path?: string;
    offset_index?: number;
    app_name?: string;
    window_name?: string;
    tags?: string[];
    mime_type?: string;
  };
}

export interface ScreenpipeSearchConfig {
  description?: string;
}

export function createScreenpipeSearch(config?: ScreenpipeSearchConfig) {
  return tool({
    description: config?.description || `
      Search Screenpipe's local database (OCR, audio, UI captures).
      Provide a query or keywords, optional appName, startTime, endTime, etc.
      For PDF detection, use window_name and mime_type filters.
    `,
    parameters: z.object({
      query: z.string().optional(),
      contentType: z.enum(['ocr', 'audio', 'ui']).optional(),
      appName: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      windowName: z.string().optional(),
      mimeType: z.string().optional(),
      minConfidence: z.number().optional(),
    }),
    execute: async ({ 
      query, 
      contentType, 
      appName, 
      startTime, 
      endTime,
      windowName,
      mimeType,
      minConfidence = 0.7
    }) => {
      try {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (contentType) params.set('content_type', contentType);
        // Allow PDF viewers and browsers
        params.set('app_name', appName || 'Arc,Preview,Adobe Acrobat');
        if (startTime) params.set('start_time', startTime);
        if (endTime) params.set('end_time', endTime);
        if (windowName) params.set('window_name', windowName);
        if (mimeType) params.set('mime_type', mimeType);
        params.set('min_confidence', minConfidence.toString());
        params.set('limit', '50');
        params.set('min_length', '10');

        const response = await fetch(`http://localhost:3030/search?${params}`);
        if (!response.ok) {
          console.error('0xHypr', 'Screenpipe search failed:', await response.text());
          return { error: `Screenpipe search failed: ${response.statusText}` };
        }

        const data = await response.json();
        
        // Post-process results to improve PDF detection
        const results = data.data as ScreenpipeSearchResult[];
        return results.map(result => {
          // Add PDF detection confidence
          const isPdfContext = 
            result.content.window_name?.toLowerCase().includes('.pdf') ||
            result.content.mime_type?.includes('pdf') ||
            result.content.app_name?.toLowerCase().includes('pdf');

          // Look for invoice-related patterns
          const hasInvoiceNumber = /invoice\s*#?\d+/i.test(result.content.text);
          const hasAmount = /\$?\d+(\.\d{2})?/.test(result.content.text);
          const hasDate = /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(result.content.text);

          // Calculate confidence score
          const patterns = [hasInvoiceNumber, hasAmount, hasDate];
          const patternScore = patterns.filter(Boolean).length / patterns.length;
          const confidence = isPdfContext ? Math.max(0.8, patternScore) : patternScore;

          return {
            ...result,
            confidence,
            isPdfContext,
          };
        }).filter(result => result.confidence >= minConfidence);
      } catch (error) {
        console.error('0xHypr', 'Error in screenpipe search:', error);
        return { error: 'Failed to search Screenpipe' };
      }
    },
  });
}

// Export the default instance for backward compatibility
export const screenpipeSearch = createScreenpipeSearch();
