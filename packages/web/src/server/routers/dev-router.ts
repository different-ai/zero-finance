import { router, publicProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import {
  users,
  workspaces,
  userDestinationBankAccounts,
  userSafes,
  userWalletsTable,
  userProfilesTable,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// Constants for demo data
const DEMO_USER_DID = 'did:privy:demo_user';
const DEMO_EMAIL = 'demo@0.finance';
const DEMO_WORKSPACE_NAME = 'Demo Workspace';
const MOCK_SAFE_ADDRESS = '0x954A329e1e59101DF529CC54A54666A0b36Cae22';

/**
 * Dev router - only accessible in development mode
 * Contains utilities for setting up demo data and testing
 */
export const devRouter = router({
  /**
   * Setup demo data for development/testing
   * Creates a demo user with workspace, wallet, profile, bank account, and safe
   */
  setupDemoData: publicProcedure.mutation(async () => {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'This endpoint is only available in development mode',
      });
    }

    const logs: string[] = [];
    const log = (msg: string) => {
      console.log(msg);
      logs.push(msg);
    };

    log('Seeding Demo Data...');

    // 1. Create/Update User
    log('1. Setting up User...');
    let user = await db.query.users.findFirst({
      where: eq(users.privyDid, DEMO_USER_DID),
    });

    if (!user) {
      // We need a workspace ID first
      const workspaceId = crypto.randomUUID();

      const [newUser] = await db
        .insert(users)
        .values({
          privyDid: DEMO_USER_DID,
          email: DEMO_EMAIL,
          primaryWorkspaceId: workspaceId,
        })
        .returning();
      user = newUser;
      log(`   Created user: ${DEMO_USER_DID}`);

      // Create the workspace linked to this user
      await db.insert(workspaces).values({
        id: workspaceId,
        name: DEMO_WORKSPACE_NAME,
        createdBy: DEMO_USER_DID,
        workspaceType: 'business',
        alignCustomerId: 'mock_customer_id', // Needed for some checks
      });
      log(`   Created workspace: ${workspaceId}`);
    } else {
      log(`   User exists: ${user.privyDid}`);
      // Ensure workspace exists
      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, user.primaryWorkspaceId),
      });
      if (!workspace) {
        await db.insert(workspaces).values({
          id: user.primaryWorkspaceId,
          name: DEMO_WORKSPACE_NAME,
          createdBy: DEMO_USER_DID,
          workspaceType: 'business',
          alignCustomerId: 'mock_customer_id',
        });
        log(`   Re-created missing workspace: ${user.primaryWorkspaceId}`);
      }
    }

    // 1.5 Create Wallet and Profile
    log('1.5 Setting up Wallet and Profile...');

    // Check if wallet exists
    let wallet = await db.query.userWalletsTable.findFirst({
      where: eq(userWalletsTable.userId, DEMO_USER_DID),
    });

    if (!wallet) {
      const [newWallet] = await db
        .insert(userWalletsTable)
        .values({
          userId: DEMO_USER_DID,
          address: '0x' + randomBytes(20).toString('hex'), // Random EOA
          privateKey: '0x' + randomBytes(32).toString('hex'),
          publicKey: '0x' + randomBytes(64).toString('hex'),
          network: 'base',
          isDefault: true,
        })
        .returning();
      wallet = newWallet;
      log(`   Created wallet: ${wallet.address}`);
    } else {
      log(`   Wallet exists: ${wallet.address}`);
    }

    // Check if profile exists
    const profile = await db.query.userProfilesTable.findFirst({
      where: eq(userProfilesTable.privyDid, DEMO_USER_DID),
    });

    if (!profile) {
      await db.insert(userProfilesTable).values({
        privyDid: DEMO_USER_DID,
        email: DEMO_EMAIL,
        defaultWalletId: wallet.id,
        paymentAddress: MOCK_SAFE_ADDRESS, // Use Safe as payment address
        primarySafeAddress: MOCK_SAFE_ADDRESS,
        skippedOrCompletedOnboardingStepper: true,
      });
      log('   Created user profile');
    } else {
      log('   Profile exists');
    }

    // 2. Create Saved Bank Account
    log('2. Setting up Bank Account...');
    const existingAccount =
      await db.query.userDestinationBankAccounts.findFirst({
        where: eq(userDestinationBankAccounts.userId, DEMO_USER_DID),
      });

    if (!existingAccount) {
      await db.insert(userDestinationBankAccounts).values({
        userId: DEMO_USER_DID,
        accountName: 'Studio Design LLC',
        bankName: 'Chase Bank',
        accountHolderType: 'business',
        accountHolderBusinessName: 'Studio Design LLC',
        country: 'US',
        city: 'Design City',
        streetLine1: '123 Creative Blvd',
        postalCode: '90210',
        accountType: 'us',
        accountNumber: '1234567890',
        routingNumber: '021000021',
        isDefault: true,
      });
      log('   Created bank account: Studio Design LLC');
    } else {
      log('   Bank account exists.');
    }

    // 3. Create Mock Safe
    log('3. Setting up Mock Safe...');
    const existingSafe = await db.query.userSafes.findFirst({
      where: eq(userSafes.userDid, DEMO_USER_DID),
    });

    if (!existingSafe) {
      await db.insert(userSafes).values({
        userDid: DEMO_USER_DID,
        safeAddress: MOCK_SAFE_ADDRESS,
        chainId: 8453, // Base
        safeType: 'primary',
      });
      log(`   Created Mock Safe on Base: ${MOCK_SAFE_ADDRESS}`);
    } else {
      log('   Safe exists.');
    }

    // 4. Magic API Key note
    log('4. Setting up Magic API Key...');
    log('   Magic Key logic is handled in code. Workspace is ready.');

    log('\nDemo Setup Complete!');

    return {
      success: true,
      userDid: DEMO_USER_DID,
      workspaceId: user!.primaryWorkspaceId,
      logs,
    };
  }),
});
