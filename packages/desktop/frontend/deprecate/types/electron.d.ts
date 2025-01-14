interface Window {
  electron: {
    ipcRenderer: {
      invoke(channel: 'create-invoice-request', args: {
        recipient: {
          name: string;
          address?: string;
          email?: string;
        };
        amount: number;
        currency: string;
        description: string;
        dueDate?: string;
      }): Promise<string>;
    };
  };
} 