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
      const result = await window.api.processInvoice({
        recipient,
        amount,
        currency,
        description,
        dueDate,
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create invoice request');
      }
      
      return result.requestId;
    } catch (error) {
      console.error('0xHypr', 'Failed to create invoice:', error);
      throw error;
    }
  }
} 