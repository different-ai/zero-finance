import type { InvoiceData } from '@/agents/base-agent';

declare global {
  interface Window {
    api: {
      // Vault operations
      getVaultConfig: () => Promise<{ path: string } | null>;
      readMarkdownFile: (path: string) => Promise<{ content: string }>;
      writeMarkdownFile: (path: string, content: string) => Promise<void>;
      
      // Calendar operations
      addToCalendar: (params: {
        icsPath: string;
        content: string;
        event: {
          title: string;
          startTime: string;
          endTime: string;
          location?: string;
          description?: string;
          attendees?: string[];
        };
      }) => Promise<void>;
      
      // Invoice operations
      processInvoice: (invoice: InvoiceData) => Promise<{
        success: boolean;
        error?: string;
      }>;

      // API Key operations
      getApiKey: () => Promise<string | null>;
      setApiKey: (apiKey: string) => Promise<boolean>;
    };
  }
}

export {}; 