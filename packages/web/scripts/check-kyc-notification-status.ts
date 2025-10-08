/**
 * Script to validate KYC notification status for users
 * Checks if approved users have received notifications
 *
 * Usage: tsx scripts/check-kyc-notification-status.ts [userId]
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { db } from '../src/db';
import { users, userProfilesTable, userFundingSources } from '../src/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

// Load production environment variables
config({ path: resolve(__dirname, '../.env.prod.local') });

interface UserCheck {
  privyDid: string;
  email: string | null;
  kycStatus: string | null;
  kycSubStatus: string | null;
  alignCustomerId: string | null;
  alignVirtualAccountId: string | null;
  kycNotificationSent: Date | null;
  kycNotificationStatus: string | null;
  createdAt: Date;
  fundingSources: {
    id: string;
    sourceCurrency: string | null;
    alignVirtualAccountIdRef: string | null;
    sourceAccountType: string | null;
  }[];
}

async function getUserEmail(privyDid: string): Promise<string | null> {
  const profile = await db.query.userProfilesTable.findFirst({
    where: eq(userProfilesTable.privyDid, privyDid),
  });
  return profile?.email || null;
}

async function getUserFundingSources(privyDid: string) {
  const sources = await db.query.userFundingSources.findMany({
    where: eq(userFundingSources.userPrivyDid, privyDid),
  });
  return sources.map((s) => ({
    id: s.id,
    sourceCurrency: s.sourceCurrency,
    alignVirtualAccountIdRef: s.alignVirtualAccountIdRef,
    sourceAccountType: s.sourceAccountType,
  }));
}

async function checkSpecificUser(userId: string): Promise<void> {
  console.log('\n=== Checking Specific User ===');
  console.log(`User ID: ${userId}\n`);

  const user = await db.query.users.findFirst({
    where: eq(users.privyDid, userId),
  });

  if (!user) {
    console.log('❌ User not found in database');
    return;
  }

  const email = await getUserEmail(userId);
  const fundingSources = await getUserFundingSources(userId);

  const result: UserCheck = {
    privyDid: user.privyDid,
    email,
    kycStatus: user.kycStatus,
    kycSubStatus: user.kycSubStatus,
    alignCustomerId: user.alignCustomerId,
    alignVirtualAccountId: user.alignVirtualAccountId,
    kycNotificationSent: user.kycNotificationSent,
    kycNotificationStatus: user.kycNotificationStatus,
    createdAt: user.createdAt,
    fundingSources,
  };

  console.log('📋 User Details:');
  console.log('─'.repeat(60));
  console.log(`Email:                     ${result.email || 'N/A'}`);
  console.log(`Created At:                ${result.createdAt.toISOString()}`);
  console.log(`\n🔐 KYC Status:`);
  console.log(`Status:                    ${result.kycStatus || 'N/A'}`);
  console.log(`Sub Status:                ${result.kycSubStatus || 'N/A'}`);
  console.log(`Align Customer ID:         ${result.alignCustomerId || 'N/A'}`);
  console.log(`\n💰 Banking:`);
  console.log(
    `Virtual Account ID (user):  ${result.alignVirtualAccountId || 'NOT SET'}`,
  );
  console.log(
    `Funding Sources:            ${result.fundingSources.length} found`,
  );
  if (result.fundingSources.length > 0) {
    result.fundingSources.forEach((source, idx) => {
      console.log(
        `  ${idx + 1}. ${source.sourceCurrency?.toUpperCase() || 'N/A'} (${source.sourceAccountType || 'N/A'})`,
      );
      console.log(
        `     Align VA ID: ${source.alignVirtualAccountIdRef || 'N/A'}`,
      );
    });
  }
  console.log(`\n📧 Notification Status:`);
  console.log(
    `Notification Sent:         ${result.kycNotificationSent ? result.kycNotificationSent.toISOString() : 'NO'}`,
  );
  console.log(
    `Notification Status:       ${result.kycNotificationStatus || 'N/A'}`,
  );
  console.log('─'.repeat(60));

  // Analysis
  console.log('\n🔍 Analysis:');
  if (result.kycStatus === 'approved') {
    console.log('✅ KYC Status: APPROVED');

    if (result.kycNotificationSent) {
      console.log(
        `✅ Notification sent at: ${result.kycNotificationSent.toISOString()}`,
      );
    } else {
      console.log('❌ ISSUE: Notification NOT sent despite approved status');
      console.log('   → This user should have been notified');
    }

    const hasVirtualAccounts =
      result.fundingSources.length > 0 &&
      result.fundingSources.some((s) => s.alignVirtualAccountIdRef);

    if (hasVirtualAccounts) {
      console.log(
        `✅ Virtual accounts created: ${result.fundingSources.length} funding source(s)`,
      );
      if (result.alignVirtualAccountId) {
        console.log(`   User record shows: ${result.alignVirtualAccountId}`);
      } else {
        console.log(
          '   ⚠️  Warning: Funding sources exist but user.alignVirtualAccountId not set',
        );
      }
    } else {
      console.log('❌ ISSUE: Virtual accounts NOT created');
      console.log(
        '   → User needs virtual account creation via createAllVirtualAccounts',
      );
      console.log(
        '   → Expected: USD (ACH) and EUR (SEPA) accounts in userFundingSources table',
      );
    }
  } else {
    console.log(
      `ℹ️  KYC Status: ${result.kycStatus || 'none'} (not approved yet)`,
    );
  }
}

async function checkAllApprovedUsers(): Promise<void> {
  console.log('\n=== Checking All Approved Users ===\n');

  const approvedUsers = await db.query.users.findMany({
    where: eq(users.kycStatus, 'approved'),
  });

  console.log(`Found ${approvedUsers.length} approved users\n`);

  const usersWithoutNotification = [];
  const usersWithoutVirtualAccount = [];
  const usersOk = [];

  for (const user of approvedUsers) {
    const email = await getUserEmail(user.privyDid);
    const fundingSources = await getUserFundingSources(user.privyDid);
    const hasNotification = !!user.kycNotificationSent;
    const hasVirtualAccount =
      fundingSources.length > 0 &&
      fundingSources.some((s) => s.alignVirtualAccountIdRef);

    const status = {
      privyDid: user.privyDid,
      email,
      kycNotificationSent: hasNotification,
      alignVirtualAccountId: hasVirtualAccount,
      fundingSourceCount: fundingSources.length,
    };

    if (!hasNotification) {
      usersWithoutNotification.push(status);
    }
    if (!hasVirtualAccount) {
      usersWithoutVirtualAccount.push(status);
    }
    if (hasNotification && hasVirtualAccount) {
      usersOk.push(status);
    }
  }

  console.log('📊 Summary:');
  console.log('─'.repeat(60));
  console.log(`Total Approved Users:              ${approvedUsers.length}`);
  console.log(
    `✅ Users with notifications sent:   ${approvedUsers.length - usersWithoutNotification.length}`,
  );
  console.log(
    `❌ Users WITHOUT notifications:     ${usersWithoutNotification.length}`,
  );
  console.log(
    `✅ Users with virtual accounts:     ${approvedUsers.length - usersWithoutVirtualAccount.length}`,
  );
  console.log(
    `❌ Users WITHOUT virtual accounts:  ${usersWithoutVirtualAccount.length}`,
  );
  console.log(`✅ Users fully set up:              ${usersOk.length}`);
  console.log('─'.repeat(60));

  if (usersWithoutNotification.length > 0) {
    console.log('\n❌ Users Missing Notifications:');
    console.log('─'.repeat(60));
    usersWithoutNotification.forEach((user: any, idx: number) => {
      console.log(
        `${idx + 1}. ${user.email || 'No email'} (${user.privyDid.substring(0, 20)}...)`,
      );
    });
  }

  if (usersWithoutVirtualAccount.length > 0) {
    console.log('\n❌ Users Missing Virtual Accounts:');
    console.log('─'.repeat(60));
    usersWithoutVirtualAccount.forEach((user: any, idx: number) => {
      console.log(
        `${idx + 1}. ${user.email || 'No email'} (${user.privyDid.substring(0, 20)}...)`,
      );
      console.log(`   Funding sources: ${user.fundingSourceCount}`);
    });
  }
}

async function main() {
  const userId = process.argv[2];

  console.log('🔍 KYC Notification Status Validator');
  console.log('=====================================');
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Database: ${process.env.POSTGRES_DATABASE || 'unknown'}`);
  console.log('=====================================');

  try {
    if (userId) {
      await checkSpecificUser(userId);
    } else {
      await checkAllApprovedUsers();
    }

    console.log('\n✅ Validation complete\n');
  } catch (error) {
    console.error('\n❌ Error during validation:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
