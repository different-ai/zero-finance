import { ipcMain } from 'electron';
import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';

const requestClient = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: process.env.REQUEST_NETWORK_URL || 'https://goerli.gateway.request.network/api/v2',
  },
});

ipcMain.handle('create-invoice-request', async (_, args: {
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
  try {
    if (!process.env.PAYER_PRIVATE_KEY) {
      throw new Error('Missing PAYER_PRIVATE_KEY environment variable');
    }

    const requestData = {
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC20,
        value: args.currency,
        network: 'goerli',
      },
      expectedAmount: args.amount.toString(),
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: args.recipient.address || '',
      },
      timestamp: Date.now(),
      contentData: {
        reason: args.description,
        dueDate: args.dueDate,
        invoiceNumber: `INV-${Date.now()}`,
      },
    };

    const signer = new EthereumPrivateKeySignatureProvider({
      method: Types.Signature.METHOD.ECDSA,
      privateKey: process.env.PAYER_PRIVATE_KEY,
    });

    const request = await requestClient.createRequest({
      requestInfo: requestData,
      signer,
    });

    await request.waitForConfirmation();

    return request.requestId;
  } catch (error) {
    console.error('Failed to create invoice:', error);
    throw error;
  }
}); 