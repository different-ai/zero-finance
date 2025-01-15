import { randomBytes } from 'crypto';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { Types } from '@requestnetwork/request-client.js';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { Wallet } from 'ethers';
import { db } from '../db';
import { ephemeralKeysTable, type EphemeralKey } from '../db/schema';
import { eq, lt } from 'drizzle-orm';

class EphemeralKeyService {
  private readonly KEY_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

  async generateKey() {
    // Generate a random private key (32 bytes)
    const privateKey = randomBytes(32).toString('hex');
    const signatureProvider = new EthereumPrivateKeySignatureProvider({
      privateKey,
      method: Types.Signature.METHOD.ECDSA,
    });
    const wallet = new Wallet(privateKey);
    const publicKey = wallet.publicKey;

    // Create cipher provider
    const cipherProvider = new EthereumPrivateKeyCipherProvider({
      key: privateKey,
      method: Types.Encryption.METHOD.ECIES,
    });

    // Get the encryption data which contains the public key
    const encryptionData = cipherProvider.getAllRegisteredIdentities();
    console.log('0xHypr', 'encryptionData', encryptionData);
    console.log('0xHypr', 'publicKey', publicKey);

    // Generate a random token
    const token = randomBytes(32).toString('hex');

    // Store the key in the database
    await db.insert(ephemeralKeysTable).values({
      token,
      privateKey,
      publicKey,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.KEY_EXPIRY_MS),
    });

    return { token, publicKey };
  }

  async getPrivateKey(token: string): Promise<string | null> {
    // Get the key from the database
    const [key] = await db
      .select()
      .from(ephemeralKeysTable)
      .where(eq(ephemeralKeysTable.token, token))
      .limit(1);

    if (!key) return null;

    // Check if key has expired
    if (new Date() > key.expiresAt) {
      // Delete expired key
      await db
        .delete(ephemeralKeysTable)
        .where(eq(ephemeralKeysTable.token, token));
      return null;
    }

    return key.privateKey;
  }

  // Clean up expired keys
  async cleanupExpiredKeys() {
    try {
      const now = new Date();
      console.log('0xHypr', 'Cleaning up keys expired before:', now.toISOString());

      // First get expired keys for logging
      const expiredKeys = await db
        .select()
        .from(ephemeralKeysTable)
        .where(lt(ephemeralKeysTable.expiresAt, now));

      console.log('0xHypr', 'Found expired keys:', expiredKeys.length);

      // Then delete them
      const deletedKeys = await db
        .delete(ephemeralKeysTable)
        .where(lt(ephemeralKeysTable.expiresAt, now))
        .returning();

      console.log('0xHypr', 'Successfully deleted keys:', deletedKeys.length);
      return deletedKeys;
    } catch (error) {
      console.error('0xHypr', 'Error cleaning up expired keys:', error);
      throw error;
    }
  }

  constructor() {
    // Run cleanup every hour
    setInterval(() => this.cleanupExpiredKeys(), 60 * 60 * 1000);
  }
}

// Export singleton instance
export const ephemeralKeyService = new EphemeralKeyService();
