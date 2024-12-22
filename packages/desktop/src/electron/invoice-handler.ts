import { RequestNetwork } from '@requestnetwork/request-client.js';
import { ipcMain } from 'electron';

class InvoiceHandler {
  private requestClient: RequestNetwork;

  constructor() {
    this.requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: process.env.REQUEST_NETWORK_URL || 'https://goerli.gateway.request.network/api/v2',
      },
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    ipcMain.handle('process-invoice', async (_, invoice) => {
      try {
        console.log('0xHypr', 'Processing invoice:', invoice);
        
        // For now, generate a mock request ID
        // TODO: Implement actual RequestNetwork integration
        const requestId = `REQ-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
        
        return { 
          success: true,
          requestId
        };
      } catch (error) {
        console.error('0xHypr', 'Error processing invoice:', error);
        return { 
          success: false, 
          error: error.message 
        };
      }
    });
  }
}

export const invoiceHandler = new InvoiceHandler(); 