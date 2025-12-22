import { db } from '../packages/web/src/db';
import {
  users,
  workspaces,
  workspaceMembers,
  userSafes,
  userFundingSources,
} from '../packages/web/src/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Diagnostic script to investigate why a workspace doesn't have virtual accounts.
 *
 * Prerequisites for virtual account creation:
 * 1. Workspace must have kycStatus = 'approved'
 * 2. Workspace must have alignCustomerId
 * 3. Workspace must have a primary safe (userSafes with safeType = 'primary')
 * 4. No existing full-tier funding sources for the workspace
 */

async function diagnoseVirtualAccountIssue(
  workspaceId: string,
  userId?: string,
  privyDid?: string,
) {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 VIRTUAL ACCOUNT DIAGNOSTIC REPORT');
  console.log('='.repeat(80));

  console.log(`\n📋 Input Parameters:`);
  console.log(`  Workspace ID: ${workspaceId}`);
  if (userId) console.log(`  User ID: ${userId}`);
  if (privyDid) console.log(`  Privy DID: ${privyDid}`);

  // 1. Check workspace exists
  console.log('\n' + '-'.repeat(80));
  console.log('1️⃣  WORKSPACE CHECK');
  console.log('-'.repeat(80));

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });

  if (!workspace) {
    console.log('❌ WORKSPACE NOT FOUND');
    process.exit(1);
  }

  console.log('✅ Workspace found:');
  console.log(`  Name: ${workspace.name}`);
  console.log(`  Company Name: ${workspace.companyName || 'N/A'}`);
  console.log(`  Created By: ${workspace.createdBy}`);
  console.log(`  Created At: ${workspace.createdAt}`);
  console.log(`  KYC Status: ${workspace.kycStatus || 'none'}`);
  console.log(`  KYC Sub-Status: ${workspace.kycSubStatus || 'N/A'}`);
  console.log(
    `  Align Customer ID: ${workspace.alignCustomerId || 'MISSING ⚠️'}`,
  );
  console.log(
    `  Align Virtual Account ID: ${workspace.alignVirtualAccountId || 'MISSING'}`,
  );
  console.log(`  Beneficiary Type: ${workspace.beneficiaryType || 'N/A'}`);
  console.log(`  Workspace Type: ${workspace.workspaceType || 'N/A'}`);

  // Track issues
  const issues: string[] = [];

  // Check KYC status
  if (workspace.kycStatus !== 'approved') {
    issues.push(`KYC Status is '${workspace.kycStatus}' - must be 'approved'`);
  }

  // Check alignCustomerId
  if (!workspace.alignCustomerId) {
    issues.push(
      'Missing alignCustomerId - required to create virtual accounts',
    );
  }

  // 2. Check user and membership
  console.log('\n' + '-'.repeat(80));
  console.log('2️⃣  USER & MEMBERSHIP CHECK');
  console.log('-'.repeat(80));

  // Get all members of this workspace
  const members = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspaceId),
  });

  console.log(`\n👥 Workspace Members (${members.length}):`);
  for (const member of members) {
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, member.userId),
    });

    const isPrimaryMark = member.isPrimary ? ' 🔹 PRIMARY' : '';
    const isCreatorMark =
      member.userId === workspace.createdBy ? ' 👤 CREATOR' : '';
    console.log(`  - ${member.userId}`);
    console.log(`    Role: ${member.role}${isPrimaryMark}${isCreatorMark}`);
    console.log(`    Joined: ${member.joinedAt}`);
    if (user) {
      console.log(
        `    User Primary Workspace: ${user.primaryWorkspaceId || 'N/A'}`,
      );
    }
  }

  // If privyDid provided, check if they're a member
  if (privyDid) {
    const isMember = members.find((m) => m.userId === privyDid);
    if (!isMember) {
      console.log(
        `\n⚠️  Provided Privy DID ${privyDid} is NOT a member of this workspace`,
      );
    }
  }

  // 3. Check for primary safe
  console.log('\n' + '-'.repeat(80));
  console.log('3️⃣  SAFE CHECK');
  console.log('-'.repeat(80));

  // Get all safes for this workspace
  const workspaceSafes = await db.query.userSafes.findMany({
    where: eq(userSafes.workspaceId, workspaceId),
  });

  console.log(`\n💼 Workspace Safes (${workspaceSafes.length}):`);
  if (workspaceSafes.length === 0) {
    console.log('  ❌ No safes found for this workspace');
    issues.push(
      'No safes found for workspace - required for virtual account destination',
    );
  } else {
    for (const safe of workspaceSafes) {
      const isPrimary = safe.safeType === 'primary' ? ' ⭐' : '';
      console.log(`  - ${safe.safeType.toUpperCase()}${isPrimary}`);
      console.log(`    Address: ${safe.safeAddress}`);
      console.log(`    User: ${safe.userDid}`);
      console.log(`    Chain ID: ${safe.chainId}`);
      console.log(`    ID: ${safe.id}`);
    }
  }

  // Check for primary safe belonging to workspace creator
  const creatorPrimarySafe = workspaceSafes.find(
    (s) => s.safeType === 'primary' && s.userDid === workspace.createdBy,
  );

  if (!creatorPrimarySafe) {
    console.log(
      `\n⚠️  No PRIMARY safe found for workspace creator (${workspace.createdBy})`,
    );
    issues.push(
      `No primary safe for workspace creator - virtual account sync requires this`,
    );

    // Check if creator has any safes at all (might be legacy/unassigned)
    const creatorAnySafes = await db.query.userSafes.findMany({
      where: eq(userSafes.userDid, workspace.createdBy),
    });

    if (creatorAnySafes.length > 0) {
      console.log(
        `\n  Creator has ${creatorAnySafes.length} safe(s) in total (not all may be assigned to this workspace):`,
      );
      for (const safe of creatorAnySafes) {
        console.log(
          `    - ${safe.safeType}: ${safe.safeAddress} (Workspace: ${safe.workspaceId || 'UNASSIGNED'})`,
        );
      }
    }
  }

  // 4. Check existing funding sources
  console.log('\n' + '-'.repeat(80));
  console.log('4️⃣  FUNDING SOURCES CHECK');
  console.log('-'.repeat(80));

  // Get all funding sources for this workspace
  const fundingSources = await db.query.userFundingSources.findMany({
    where: eq(userFundingSources.workspaceId, workspaceId),
  });

  console.log(`\n💳 Workspace Funding Sources (${fundingSources.length}):`);
  if (fundingSources.length === 0) {
    console.log(
      '  No funding sources found (this is expected if virtual accounts not created)',
    );
  } else {
    for (const source of fundingSources) {
      console.log(
        `  - ${source.sourceCurrency?.toUpperCase()} (${source.sourceAccountType})`,
      );
      console.log(`    Tier: ${source.accountTier}`);
      console.log(`    Provider: ${source.sourceProvider}`);
      console.log(
        `    Align VA ID: ${source.alignVirtualAccountIdRef || 'N/A'}`,
      );
      console.log(`    Bank: ${source.sourceBankName || 'N/A'}`);
      console.log(`    User: ${source.userPrivyDid}`);
    }
  }

  // Check for legacy funding sources (workspace = null)
  const legacyFundingSources = await db.query.userFundingSources.findMany({
    where: and(
      eq(userFundingSources.userPrivyDid, workspace.createdBy),
      eq(userFundingSources.workspaceId, null as any), // null workspace = legacy
    ),
  });

  if (legacyFundingSources.length > 0) {
    console.log(
      `\n⚠️  Legacy Funding Sources (no workspace assigned): ${legacyFundingSources.length}`,
    );
    for (const source of legacyFundingSources) {
      console.log(
        `  - ${source.sourceCurrency?.toUpperCase()} (${source.sourceAccountType})`,
      );
      console.log(
        `    Align VA ID: ${source.alignVirtualAccountIdRef || 'N/A'}`,
      );
    }
    issues.push(
      `Found ${legacyFundingSources.length} legacy funding sources without workspace assignment - may need migration`,
    );
  }

  // 5. Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 DIAGNOSIS SUMMARY');
  console.log('='.repeat(80));

  const prerequisites = [
    {
      name: 'KYC Approved',
      check: workspace.kycStatus === 'approved',
      value: workspace.kycStatus,
    },
    {
      name: 'Align Customer ID',
      check: !!workspace.alignCustomerId,
      value: workspace.alignCustomerId || 'MISSING',
    },
    {
      name: 'Primary Safe (for creator)',
      check: !!creatorPrimarySafe,
      value: creatorPrimarySafe?.safeAddress || 'MISSING',
    },
    {
      name: 'No existing full-tier accounts',
      check: !fundingSources.some((f) => f.accountTier === 'full'),
      value:
        fundingSources.filter((f) => f.accountTier === 'full').length === 0
          ? 'None (good)'
          : `${fundingSources.filter((f) => f.accountTier === 'full').length} exist`,
    },
  ];

  console.log('\n📋 Prerequisites for Virtual Account Creation:');
  let allPassed = true;
  for (const prereq of prerequisites) {
    const status = prereq.check ? '✅' : '❌';
    console.log(`  ${status} ${prereq.name}: ${prereq.value}`);
    if (!prereq.check) allPassed = false;
  }

  if (issues.length > 0) {
    console.log('\n🚨 Issues Found:');
    issues.forEach((issue, i) => {
      console.log(`  ${i + 1}. ${issue}`);
    });
  }

  if (allPassed && fundingSources.length === 0) {
    console.log('\n✅ All prerequisites met but no funding sources exist.');
    console.log(
      '   This workspace should be picked up by the virtual-account-sync cron job.',
    );
    console.log('   Or you can manually trigger account creation.');
  } else if (fundingSources.length > 0) {
    console.log('\n✅ Funding sources already exist for this workspace.');
  } else {
    console.log(
      '\n❌ Prerequisites not met - virtual accounts cannot be created until issues are resolved.',
    );
  }

  console.log('\n' + '='.repeat(80));
  process.exit(0);
}

// Parse arguments
const workspaceId = process.argv[2];
const userId = process.argv[3];
const privyDid = process.argv[4];

if (!workspaceId) {
  console.error(
    'Usage: npx tsx scripts/diagnose-virtual-account-issue.ts <workspace-id> [user-id] [privy-did]',
  );
  console.error('');
  console.error('Example:');
  console.error(
    '  npx tsx scripts/diagnose-virtual-account-issue.ts e4ed82c6-03b7-4d2f-be1b-6deea6832b09 68c46f1f-5a5b-4e0f-baf8-d4261ed72c05 did:privy:cmgcrf5nv00fwjg0bkowpqesk',
  );
  process.exit(1);
}

diagnoseVirtualAccountIssue(workspaceId, userId, privyDid).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
