import { randomBytes } from 'crypto';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { Types } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { Wallet } from 'ethers';
interface StoredKey {
  privateKey: string;
  publicKey: string;
  createdAt: number;
}

class EphemeralKeyService {
  private keys: Map<string, StoredKey> = new Map();
  private readonly KEY_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

  generateKey() {
    // Generate a random private key (32 bytes)
    const privateKey = randomBytes(32).toString('hex');
    const signatureProvider = new EthereumPrivateKeySignatureProvider({
      privateKey,
      method: Types.Signature.METHOD.ECDSA
    });
    const wallet = new Wallet(privateKey)
    const publicKey = wallet.publicKey
    console.log('publicKey', publicKey)

    
    
    // Create cipher provider
    const cipherProvider = new EthereumPrivateKeyCipherProvider({
      key: privateKey,
      method: Types.Encryption.METHOD.ECIES,
    });

    // Get the encryption data which contains the public key
    const encryptionData = cipherProvider.getAllRegisteredIdentities();
    console.log('encryptionData', encryptionData)
    console.log('publicKey', publicKey)

    // Generate a random token
    const token = randomBytes(32).toString('hex');

    // Store the key with timestamp
    this.keys.set(token, {
      privateKey,
      publicKey,
      createdAt: Date.now(),
    });

    return { token,  publicKey };
  }

  getPrivateKey(token: string): string | null {
    const key = this.keys.get(token);
    if (!key) return null;

    // Check if key has expired
    if (Date.now() - key.createdAt > this.KEY_EXPIRY_MS) {
      this.keys.delete(token);
      return null;
    }

    return key.privateKey;
  }

  // Clean up expired keys periodically
  private cleanupExpiredKeys() {
    const now = Date.now();
    for (const [token, key] of this.keys.entries()) {
      if (now - key.createdAt > this.KEY_EXPIRY_MS) {
        this.keys.delete(token);
      }
    }
  }

  constructor() {
    // Run cleanup every hour
    setInterval(() => this.cleanupExpiredKeys(), 60 * 60 * 1000);
  }
}

// Export singleton instance
export const ephemeralKeyService = new EphemeralKeyService(); 