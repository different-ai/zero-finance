import { randomBytes } from 'crypto';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { Types } from '@requestnetwork/request-client.js';
import { ethers } from 'ethers';

/**
 * Generates an ephemeral key directly for server-side use
 * This avoids making API calls within API handlers
 */
export function generateServerEphemeralKey() {
  // Generate a random private key (32 bytes)
  const privateKey = `0x${randomBytes(32).toString('hex')}`;
  
  // Create a wallet from the private key
  const wallet = new ethers.Wallet(privateKey);
  
  // Create cipher provider to get the proper format
  const cipherProvider = new EthereumPrivateKeyCipherProvider({
    key: privateKey,
    method: Types.Encryption.METHOD.ECIES,
  });

  // Generate a random token
  const token = randomBytes(32).toString('hex');

  return { 
    token, 
    privateKey,
    publicKey: wallet.publicKey
  };
}