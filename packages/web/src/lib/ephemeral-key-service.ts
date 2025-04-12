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
    // Generate a random private key with proper 0x prefix
    const wallet = Wallet.createRandom();
    const privateKey = wallet.privateKey.substring(2); // Remove 0x prefix for storage
    const publicKey = wallet.publicKey;

    console.log('0xHypr KEY-DEBUG', 'Generated new ephemeral key:');
    console.log('0xHypr KEY-DEBUG', 'Private key (with 0x):', `0x${privateKey}`);
    console.log('0xHypr KEY-DEBUG', 'Private key (stored):', privateKey);
    console.log('0xHypr KEY-DEBUG', 'Address:', wallet.address);
    console.log('0xHypr KEY-DEBUG', 'Public key:', publicKey);

    // Make sure we can create a cipher provider with this key
    const signatureProvider = new EthereumPrivateKeySignatureProvider({
      privateKey: `0x${privateKey}`,
      method: Types.Signature.METHOD.ECDSA,
    });

    // Create cipher provider
    const cipherProvider = new EthereumPrivateKeyCipherProvider({
      key: `0x${privateKey}`,
      method: Types.Encryption.METHOD.ECIES,
    });

    // Get the encryption data which contains the public key
    const encryptionData = cipherProvider.getAllRegisteredIdentities();
    console.log('0xHypr KEY-DEBUG', 'Encryption identities:', encryptionData);
    
    // Check if decryption is available with this key
    const canDecrypt = cipherProvider.isDecryptionAvailable();
    console.log('0xHypr KEY-DEBUG', 'Can decrypt with this key?', canDecrypt);

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

  async getKeyFromToken(token: string): Promise<{ privateKey: string; publicKey: string; token: string } | null> {
    // Get the key from the database
    const [key] = await db
      .select()
      .from(ephemeralKeysTable)
      .where(eq(ephemeralKeysTable.token, token))
      .limit(1);

    if (!key) {
      console.log('0xHypr KEY-DEBUG', 'No key found for token:', token);
      return null;
    }

    // Check if key has expired
    if (new Date() > key.expiresAt) {
      console.log('0xHypr KEY-DEBUG', 'Key expired for token:', token);
      // Delete expired key
      await db
        .delete(ephemeralKeysTable)
        .where(eq(ephemeralKeysTable.token, token));
      return null;
    }
    
    // Ensure key has proper 0x prefix for ethers
    const formattedKey = key.privateKey.startsWith('0x') 
      ? key.privateKey 
      : `0x${key.privateKey}`;
    
    console.log('0xHypr KEY-DEBUG', 'Retrieved complete key data for token:', token);
    
    // Return the formatted key with 0x prefix and the public key
    return { 
      privateKey: formattedKey,
      publicKey: key.publicKey,
      token: token
    };
  }

  async getPrivateKey(token: string): Promise<string | null> {
    // Get the key from the database
    const [key] = await db
      .select()
      .from(ephemeralKeysTable)
      .where(eq(ephemeralKeysTable.token, token))
      .limit(1);

    if (!key) {
      console.log('0xHypr KEY-DEBUG', 'No key found for token:', token);
      return null;
    }

    // Check if key has expired
    if (new Date() > key.expiresAt) {
      console.log('0xHypr KEY-DEBUG', 'Key expired for token:', token);
      // Delete expired key
      await db
        .delete(ephemeralKeysTable)
        .where(eq(ephemeralKeysTable.token, token));
      return null;
    }

    console.log('0xHypr KEY-DEBUG', 'Retrieved private key for token:', token);
    console.log('0xHypr KEY-DEBUG', 'Private key (from DB):', key.privateKey);
    
    // Ensure key has proper 0x prefix for ethers
    const formattedKey = key.privateKey.startsWith('0x') 
      ? key.privateKey 
      : `0x${key.privateKey}`;
    
    console.log('0xHypr KEY-DEBUG', 'Private key (formatted):', formattedKey);
    
    // Create wallet from key to verify it's valid
    try {
      const wallet = new Wallet(formattedKey);
      console.log('0xHypr KEY-DEBUG', 'Wallet address from retrieved key:', wallet.address);
      console.log('0xHypr KEY-DEBUG', 'Public key from retrieved key:', wallet.publicKey);
      
      // Test if we can create a cipher provider with this key
      const cipherProvider = new EthereumPrivateKeyCipherProvider({
        key: formattedKey,
        method: Types.Encryption.METHOD.ECIES,
      });
      const canDecrypt = cipherProvider.isDecryptionAvailable();
      console.log('0xHypr KEY-DEBUG', 'Can decrypt with retrieved key?', canDecrypt);
      
      // Return the formatted key with 0x prefix
      return formattedKey;
    } catch (error) {
      console.error('0xHypr KEY-DEBUG', 'Error validating retrieved key:', error);
      // In case of validation failure, still return the key but with warning
      console.warn('0xHypr KEY-DEBUG', 'Returning possibly invalid key:', formattedKey);
      return formattedKey;
    }
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
