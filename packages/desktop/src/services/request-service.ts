export class RequestService {
  async createInvoiceRequest({
    recipient,
    amount,
    currency,
    description,
    dueDate,
  }: {
    recipient: {
      name: string;
      address?: string;
      email?: string;
    };
    amount: number;
    currency: string;
    description: string;
    dueDate?: string;
  }) {
    try {
      const requestId = await window.electron.ipcRenderer.invoke('create-invoice-request', {
        recipient,
        amount,
        currency,
        description,
        dueDate,
      });
      return requestId;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  }
} 