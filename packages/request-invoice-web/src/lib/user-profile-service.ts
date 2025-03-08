import { ethers } from 'ethers';
import { db } from '@/db';
import { userProfilesTable, userWalletsTable, UserProfile, UserWallet } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Service for managing user profiles and wallets
 */
export class UserProfileService {
  /**
   * Gets user profile by clerk ID, creates it if it doesn't exist
   */
  async getOrCreateProfile(clerkId: string, email: string): Promise<UserProfile> {
    // Try to find existing user profile
    const existingProfiles = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.clerkId, clerkId))
      .limit(1);

    if (existingProfiles.length > 0) {
      return existingProfiles[0];
    }

    // User doesn't exist, let's create a new profile with wallet
    const wallet = await this.createWallet(clerkId);

    // Create the profile
    const newProfile = await db
      .insert(userProfilesTable)
      .values({
        clerkId,
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
    const existingWallets = await db
      .select()
      .from(userWalletsTable)
      .where(and(eq(userWalletsTable.userId, userId), eq(userWalletsTable.isDefault, true)))
      .limit(1);

    if (existingWallets.length > 0) {
      return existingWallets[0];
    }

    // No wallet found, create one
    return await this.createWallet(userId);
  }

  /**
   * Updates a user's payment address
   */
  async updatePaymentAddress(clerkId: string, paymentAddress: string): Promise<UserProfile> {
    const result = await db
      .update(userProfilesTable)
      .set({ paymentAddress, updatedAt: new Date() })
      .where(eq(userProfilesTable.clerkId, clerkId))
      .returning();

    if (result.length === 0) {
      throw new Error('Failed to update payment address');
    }

    return result[0];
  }

  /**
   * Gets the payment address for a user
   * Returns the user's default payment address, or the default wallet address if not set
   */
  async getPaymentAddress(clerkId: string): Promise<string> {
    const profiles = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.clerkId, clerkId))
      .limit(1);

    if (profiles.length === 0) {
      throw new Error('User profile not found');
    }

    const profile = profiles[0];

    // If the user has a payment address set, return it
    if (profile.paymentAddress) {
      return profile.paymentAddress;
    }

    // Otherwise, get the default wallet address
    if (profile.defaultWalletId) {
      const wallets = await db
        .select()
        .from(userWalletsTable)
        .where(eq(userWalletsTable.id, profile.defaultWalletId))
        .limit(1);

      if (wallets.length > 0) {
        return wallets[0].address;
      }
    }

    // If no wallet is found, create one
    const wallet = await this.getOrCreateWallet(clerkId);
    
    // Update the profile with the new wallet
    await db
      .update(userProfilesTable)
      .set({ defaultWalletId: wallet.id, updatedAt: new Date() })
      .where(eq(userProfilesTable.clerkId, clerkId));

    return wallet.address;
  }
}

export const userProfileService = new UserProfileService();