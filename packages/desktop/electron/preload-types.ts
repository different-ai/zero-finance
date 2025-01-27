export interface ElectronAPI {
  // Mercury API
  mercuryApi: {
    createPayment: (params: {
      accountId: string;
      amount: number;
      currency: string;
      recipientName: string;
      routingNumber?: string;
      accountNumber?: string;
      reference?: string;
    }) => Promise<{
      success: boolean;
      data?: any;
      error?: string;
    }>;
    getApiKey: () => Promise<string | null>;
    setApiKey: (key: string) => Promise<void>;
    deleteApiKey: () => Promise<boolean>;
  };
} 