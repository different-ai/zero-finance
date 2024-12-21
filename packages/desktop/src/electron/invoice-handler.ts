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
        // Implementation for processing invoice through RequestNetwork
        // This is where we'll add the actual invoice processing logic
        return { success: true };
      } catch (error) {
        console.error('Error processing invoice:', error);
        return { success: false, error: error.message };
      }
    });
  }
}

export const invoiceHandler = new InvoiceHandler(); 