import { contextBridge, ipcRenderer } from 'electron';
import type { InvoiceData } from '@/agents/base-agent';

// Validate channels for security
const validChannels = [
  'get-vault-config',
  'read-markdown-file',
  'write-markdown-file',
  'add-to-calendar',
  'process-invoice',
  'get-api-key',
  'set-api-key',
  'process-with-openai',
] as const;

type ValidChannel = typeof validChannels[number];

// Type guard for channels
function isValidChannel(channel: string): channel is ValidChannel {
  return validChannels.includes(channel as ValidChannel);
}

export const api = {
  // Vault operations
  getVaultConfig: () => {
    return ipcRenderer.invoke('get-vault-config');
  },
  readMarkdownFile: (path: string) => {
    return ipcRenderer.invoke('read-markdown-file', path);
  },
  writeMarkdownFile: (path: string, content: string) => {
    return ipcRenderer.invoke('write-markdown-file', { path, content });
  },

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
  }) => {
    return ipcRenderer.invoke('add-to-calendar', params);
  },

  // Invoice operations
  processInvoice: (invoice: {
    recipient: {
      name: string;
      address?: string;
      email?: string;
    };
    amount: number;
    currency: string;
    description: string;
    dueDate?: string;
  }) => {
    console.log('0xHypr', 'Processing invoice in preload:', invoice);
    return ipcRenderer.invoke('process-invoice', invoice);
  },

  // API Key operations
  getApiKey: () => {
    return ipcRenderer.invoke('get-api-key');
  },
  setApiKey: (apiKey: string) => {
    return ipcRenderer.invoke('set-api-key', apiKey);
  },
  processWithOpenAI: (params: { model: string; prompt: string; schema: any }) => {
    return ipcRenderer.invoke('process-with-openai', params);
  },
} as const;

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('api', api);

// Export types
export type API = typeof api; 