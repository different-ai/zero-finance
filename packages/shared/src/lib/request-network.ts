import { RequestNetwork } from '@requestnetwork/request-client.js';
import { Types } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { Wallet } from 'ethers';

export async function getRequestClient(privateKey: string) {
  // Initialize the cipher provider with explicit ECIES method
  const cipherProvider = new EthereumPrivateKeyCipherProvider({
    key: privateKey,
    method: Types.Encryption.METHOD.ECIES,
  });
  console.log('0xHypr', 'cipherProvider', cipherProvider);

  const signatureProvider = new EthereumPrivateKeySignatureProvider({
    privateKey: privateKey,
    method: Types.Signature.METHOD.ECDSA,
  });
  console.log('0xHypr', 'signatureProvider', signatureProvider);
  // can decrypt?
  const canDecrypt = cipherProvider.isDecryptionAvailable();
  console.log('0xHypr', 'canDecrypt', canDecrypt);

  // get public key from private key
  const address = new Wallet(privateKey).address;
  console.log('0xHypr', 'address', address);

  // is registered?
  const isRegistered = await cipherProvider.isIdentityRegistered({
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: address,
  });
  console.log('0xHypr', 'isRegistered', isRegistered);

  // Initialize the request client with explicit encryption parameters
  return new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: 'https://xdai.gateway.request.network/',
    },
    cipherProvider: cipherProvider,
    signatureProvider: signatureProvider,
    useMockStorage: false,
  });
}
