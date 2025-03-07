import { ethers } from 'ethers';
import { EthereumPrivateKeyCipherProvider } from '@requestnetwork/epk-cipher';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { Types } from '@requestnetwork/request-client.js';
import { randomBytes } from 'crypto';

/**
 * Service for generating ephemeral wallets
 * This will be replaced later with a per-user wallet system
 */
export class EphemeralWalletService {
  /**
   * Generate a new Ethereum wallet
   * @returns A new Ethereum wallet
   */
  static generateWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
    };
  }

  /**
   * Generate an ephemeral key for viewing
   * @returns A new ephemeral key with token
   */
  static generateEphemeralKey() {
    // Generate a random private key
    const wallet = ethers.Wallet.createRandom();
    const token = randomBytes(16).toString('hex');

    return {
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      token
    };
  }

  /**
   * Create a cipher provider for encryption
   * @param privateKey The private key to use for encryption
   * @returns An EthereumPrivateKeyCipherProvider
   */
  static createCipherProvider(privateKey: string) {
    return new EthereumPrivateKeyCipherProvider({
      key: privateKey,
      method: Types.Encryption.METHOD.ECIES,
    });
  }

  /**
   * Create a signature provider for signing requests
   * @param privateKey The private key to use for signing
   * @returns An EthereumPrivateKeySignatureProvider
   */
  static createSignatureProvider(privateKey: string) {
    return new EthereumPrivateKeySignatureProvider({
      privateKey: privateKey,
      method: Types.Signature.METHOD.ECDSA,
    });
  }
}