import { ethers } from 'ethers';
import { db } from '@/db';
import { userProfilesTable, userWalletsTable, UserProfile, UserWallet, userSafes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Service for managing user profiles and wallets
 */
export class UserProfileService {
  /**
   * Gets user profile by clerk ID, creates it if it doesn't exist
   */
  async getOrCreateProfile(privyDid: string, email: string): Promise<UserProfile> {
    // Try to find existing user profile
    const existingProfiles = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.privyDid, privyDid))
      .limit(1);

    if (existingProfiles.length > 0) {
      return existingProfiles[0];
    }

    // User doesn't exist, let's create a new profile with wallet
    const wallet = await this.createWallet(privyDid);

    // Create the profile
    const newProfile = await db
      .insert(userProfilesTable)
      .values({
        privyDid,
        email,
        defaultWalletId: wallet.id,
        paymentAddress: wallet.address, // Use the wallet address as the default payment address
      })
      .returning();

    if (newProfile.length === 0) {
      throw new Error('Failed to create user profile');
    }

    return newProfile[0];
  }

  /**
   * Creates a new wallet for a user
   */
  async createWallet(userId: string): Promise<UserWallet> {
    // Generate a random wallet using ethers
    const wallet = ethers.Wallet.createRandom();

    // Save wallet to database
    const result = await db
      .insert(userWalletsTable)
      .values({
        userId,
        address: wallet.address,
        privateKey: wallet.privateKey, // Note: In production, consider encrypting this
        publicKey: wallet.publicKey,
        network: 'gnosis', // Default to Gnosis Chain
        isDefault: true,
      })
      .returning();

    if (result.length === 0) {
      throw new Error('Failed to create wallet');
    }

    console.log('0xHypr', `Created new wallet for user ${userId}:`, wallet.address);
    return result[0];
  }

  /**
   * Gets the default wallet for a user
   * Creates a wallet if the user doesn't have one
   */
  async getOrCreateWallet(userId: string): Promise<UserWallet> {
    // Try to find existing wallet
    try {
      console.log('0xHypr', 'Looking for existing wallet for user:', userId);
      const existingWallets = await db
        .select()
        .from(userWalletsTable)
        .where(and(eq(userWalletsTable.userId, userId), eq(userWalletsTable.isDefault, true)))
        .limit(1);

      if (existingWallets.length > 0) {
        console.log('0xHypr', 'Found existing wallet:', existingWallets[0].address);
        return existingWallets[0];
      }

      console.log('0xHypr', 'No wallet found, creating new one');
      // No wallet found, create one
      return await this.createWallet(userId);
    } catch (error) {
      console.error('0xHypr', 'Error in getOrCreateWallet:', error);
      // Create a new wallet anyway to avoid returning null
      return await this.createWallet(userId);
    }
  }

  /**
   * Updates a user's payment address
   */
  async updatePaymentAddress(privyDid: string, paymentAddress: string): Promise<UserProfile> {
    const result = await db
      .update(userProfilesTable)
      .set({ paymentAddress, updatedAt: new Date() })
      .where(eq(userProfilesTable.privyDid, privyDid))
      .returning();

    if (result.length === 0) {
      throw new Error('Failed to update payment address');
    }

    return result[0];
  }

  /**
   * Checks if a user has completed onboarding
   */
  async hasCompletedOnboarding(privyDid: string): Promise<boolean> {
    const profiles = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.privyDid, privyDid))
      .limit(1);

    if (profiles.length === 0) {
      return false;
    }

    return !!profiles[0].hasCompletedOnboarding;
  }

  /**
   * Marks a user as having completed onboarding
   */
  async completeOnboarding(privyDid: string): Promise<UserProfile> {
    const result = await db
      .update(userProfilesTable)
      .set({ 
        hasCompletedOnboarding: true, 
        updatedAt: new Date() 
      })
      .where(eq(userProfilesTable.privyDid, privyDid))
      .returning();

    if (result.length === 0) {
      throw new Error('Failed to update onboarding status');
    }

    return result[0];
  }

  /**
   * Gets the primary payment address for a user.
   * Prefers the explicitly set `paymentAddress` on the profile.
   * Falls back to the `primarySafeAddress` stored on the profile.
   * Throws an error if neither is found.
   *
   * @param privyDid The Privy DID of the user.
   * @returns The user's primary payment address (either explicit or primary Safe).
   * @throws Error if the user profile is not found or no suitable payment address is configured.
   */
  async getPaymentAddress(privyDid: string): Promise<string> {
    const profiles = await db
      .select({
          paymentAddress: userProfilesTable.paymentAddress, // Select specific fields
          primarySafeAddress: userProfilesTable.primarySafeAddress
      })
      .from(userProfilesTable)
      .where(eq(userProfilesTable.privyDid, privyDid))
      .limit(1);

    if (profiles.length === 0) {
      throw new Error('User profile not found');
    }

    const profile = profiles[0];

    // 1. Prefer the explicitly set payment address
    if (profile.paymentAddress) {
      console.log('0xHypr', `Using explicit paymentAddress for user ${privyDid}: ${profile.paymentAddress}`);
      return profile.paymentAddress;
    }

    // 2. Fallback to the primary Safe address stored on the profile
    if (profile.primarySafeAddress) {
       console.log('0xHypr', `Falling back to primarySafeAddress for user ${privyDid}: ${profile.primarySafeAddress}`);
       return profile.primarySafeAddress;
    }

    // 3. If neither is found, throw an error
    console.error('0xHypr', `No suitable payment address found for user ${privyDid}. Neither paymentAddress nor primarySafeAddress is set.`);
    throw new Error('No primary payment address configured for the user.');
  }
}

export const userProfileService = new UserProfileService();