import { RequestNetwork } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { Types } from '@requestnetwork/request-client.js';

const requestClient = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: process.env.NEXT_PUBLIC_REQUEST_NODE_URL,
  },
});

export async function generateEphemeralKey() {
  const response = await fetch('/api/ephemeral-keys/generate', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to generate ephemeral key');
  }

  return response.json();
}

export async function getEphemeralKey(token: string,) {
  const response = await fetch(`/api/ephemeral-keys?token=${token}`);

  if (!response.ok) {
    throw new Error('Failed to retrieve ephemeral key');
  }

  const { privateKey } = await response.json();
  return privateKey;
}

export async function getRequestClient(privateKey?: string) {
  if (!privateKey) {
    return requestClient;
  }

  const cipherProvider = new EthereumPrivateKeyCipherProvider({
    key: privateKey,
    // key: '0xab15f4c57017deeecd71f3877d0d82300721e9752f40cf48b7c50f5323f406a0',
    method: Types.Encryption.METHOD.ECIES,
  });
  // Check if encryption is available
  const canEncrypt = cipherProvider.isEncryptionAvailable();
  // Check if decryption is available
  const canDecrypt = cipherProvider.isDecryptionAvailable();
  console.log('0xHypr', 'canEncrypt', canEncrypt);
  console.log('0xHypr', 'canDecrypt', canDecrypt);

  return new RequestNetwork({
    nodeConnectionConfig: {
      baseURL:
        process.env.REQUEST_NODE_URL || 'https://xdai.gateway.request.network/',
    },
    cipherProvider: cipherProvider,
  });
}

export default requestClient;
