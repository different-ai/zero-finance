#!/usr/bin/env tsx

import { db } from '../packages/web/src/db';
import {
  users,
  workspaces,
  workspaceMembers,
  userSafes,
  userFundingSources,
} from '../packages/web/src/db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';

const TARGET_USER_DID = 'did:privy:cmf62r60400pnjo0avjpa9pcj';

interface DiagnosticResult {
  userInfo: {
    exists: boolean;
    privyDid?: string;
    firstName?: string;
    lastName?: string;
  };
  workspaces: Array<{
    workspaceId: string;
    workspaceName: string;
    role: string;
    isOwner: boolean;
    workspaceDetails: {
      kycStatus: string | null;
      kycMarkedDone: boolean;
      alignCustomerId: string | null;
      alignVirtualAccountId: string | null;
      createdBy: string;
    };
  }>;
  safes: Array<{
    safeAddress: string;
    safeType: string;
    workspaceId: string | null;
  }>;
  fundingSources: Array<{
    id: string;
    workspaceId: string | null;
    sourceProvider: string | null;
    sourceAccountType: string | null;
    sourceCurrency: string | null;
    sourceAccountNumber: string | null;
    sourceIban: string | null;
    alignVirtualAccountIdRef: string | null;
  }>;
  routerAccessChecks: {
    getUserSafes: {
      description: string;
      queries: Array<{
        queryType: string;
        expectedResults: number;
        details: string;
      }>;
    };
    getVirtualAccountDetails: {
      description: string;
      queries: Array<{
        workspaceId: string;
        queryType: string;
        expectedResults: number;
        details: string;
      }>;
    };
  };
}

async function diagnoseUserWorkspaceAccess(
  userDid: string,
): Promise<DiagnosticResult> {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`DIAGNOSTIC REPORT FOR USER: ${userDid}`);
  console.log(`${'='.repeat(80)}\n`);

  const result: DiagnosticResult = {
    userInfo: { exists: false },
    workspaces: [],
    safes: [],
    fundingSources: [],
    routerAccessChecks: {
      getUserSafes: {
        description: 'Checks from user-router.ts getUserSafes',
        queries: [],
      },
      getVirtualAccountDetails: {
        description: 'Checks from align-router.ts getVirtualAccountDetails',
        queries: [],
      },
    },
  };

  const user = await db.query.users.findFirst({
    where: eq(users.privyDid, userDid),
  });

  if (!user) {
    console.log('❌ USER NOT FOUND IN DATABASE');
    return result;
  }

  result.userInfo = {
    exists: true,
    privyDid: user.privyDid,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
  };

  console.log('✅ USER FOUND');
  console.log(
    `   Name: ${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
  );
  console.log('');

  const membershipRecords = await db
    .select({
      workspaceId: workspaceMembers.workspaceId,
      role: workspaceMembers.role,
      workspace: {
        id: workspaces.id,
        name: workspaces.name,
        kycStatus: workspaces.kycStatus,
        kycMarkedDone: workspaces.kycMarkedDone,
        alignCustomerId: workspaces.alignCustomerId,
        alignVirtualAccountId: workspaces.alignVirtualAccountId,
        createdBy: workspaces.createdBy,
      },
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(eq(workspaceMembers.userId, userDid));

  console.log(`📁 WORKSPACE MEMBERSHIPS: ${membershipRecords.length}`);
  console.log('');

  for (const membership of membershipRecords) {
    const isOwner = membership.workspace.createdBy === userDid;

    result.workspaces.push({
      workspaceId: membership.workspaceId,
      workspaceName: membership.workspace.name,
      role: membership.role,
      isOwner,
      workspaceDetails: {
        kycStatus: membership.workspace.kycStatus,
        kycMarkedDone: membership.workspace.kycMarkedDone,
        alignCustomerId: membership.workspace.alignCustomerId,
        alignVirtualAccountId: membership.workspace.alignVirtualAccountId,
        createdBy: membership.workspace.createdBy,
      },
    });

    console.log(
      `   Workspace: ${membership.workspace.name} (${membership.workspaceId})`,
    );
    console.log(`   Role: ${membership.role} ${isOwner ? '(OWNER)' : ''}`);
    console.log(`   KYC Status: ${membership.workspace.kycStatus || 'N/A'}`);
    console.log(`   KYC Marked Done: ${membership.workspace.kycMarkedDone}`);
    console.log(
      `   Align Customer ID: ${membership.workspace.alignCustomerId || 'N/A'}`,
    );
    console.log(
      `   Align Virtual Account ID: ${membership.workspace.alignVirtualAccountId || 'N/A'}`,
    );
    console.log('');
  }

  const allSafes = await db.query.userSafes.findMany({
    where: eq(userSafes.userDid, userDid),
  });

  console.log(`🔐 USER SAFES: ${allSafes.length}`);
  console.log('');

  for (const safe of allSafes) {
    result.safes.push({
      safeAddress: safe.safeAddress,
      safeType: safe.safeType,
      workspaceId: safe.workspaceId,
    });

    console.log(`   Safe: ${safe.safeAddress}`);
    console.log(`   Type: ${safe.safeType}`);
    console.log(`   Workspace: ${safe.workspaceId || 'NULL (legacy)'}`);
    console.log('');
  }

  const allFundingSources = await db.query.userFundingSources.findMany({
    where: eq(userFundingSources.userPrivyDid, userDid),
  });

  console.log(`💳 FUNDING SOURCES: ${allFundingSources.length}`);
  console.log('');

  for (const source of allFundingSources) {
    result.fundingSources.push({
      id: source.id,
      workspaceId: source.workspaceId,
      sourceProvider: source.sourceProvider,
      sourceAccountType: source.sourceAccountType,
      sourceCurrency: source.sourceCurrency,
      sourceAccountNumber: source.sourceAccountNumber,
      sourceIban: source.sourceIban,
      alignVirtualAccountIdRef: source.alignVirtualAccountIdRef,
    });

    console.log(`   Source ID: ${source.id}`);
    console.log(`   Workspace: ${source.workspaceId || 'NULL (legacy)'}`);
    console.log(`   Provider: ${source.sourceProvider || 'N/A'}`);
    console.log(`   Type: ${source.sourceAccountType || 'N/A'}`);
    console.log(`   Currency: ${source.sourceCurrency || 'N/A'}`);
    console.log(
      `   Account: ${source.sourceAccountNumber || source.sourceIban || 'N/A'}`,
    );
    console.log(
      `   Align Virtual Account Ref: ${source.alignVirtualAccountIdRef || 'N/A'}`,
    );
    console.log('');
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('ROUTER ACCESS SIMULATION');
  console.log(`${'='.repeat(80)}\n`);

  console.log('📍 SIMULATING: user-router.ts -> getUserSafes');
  console.log(
    '   This query finds the primary safe for a user within a workspace context\n',
  );

  for (const workspace of result.workspaces) {
    const safesForWorkspaceQuery = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, userDid),
        eq(userSafes.safeType, 'primary'),
        or(
          eq(userSafes.workspaceId, workspace.workspaceId),
          isNull(userSafes.workspaceId),
        ),
      ),
    });

    const queryDetails = `Query: userSafes WHERE userDid='${userDid}' AND safeType='primary' AND (workspaceId='${workspace.workspaceId}' OR workspaceId IS NULL)`;
    const found = safesForWorkspaceQuery ? 1 : 0;

    result.routerAccessChecks.getUserSafes.queries.push({
      queryType: `Primary safe for workspace: ${workspace.workspaceName}`,
      expectedResults: found,
      details: queryDetails,
    });

    if (safesForWorkspaceQuery) {
      console.log(
        `   ✅ Workspace "${workspace.workspaceName}": FOUND primary safe`,
      );
      console.log(`      Address: ${safesForWorkspaceQuery.safeAddress}`);
      console.log(
        `      Workspace ID: ${safesForWorkspaceQuery.workspaceId || 'NULL (legacy)'}`,
      );
    } else {
      console.log(
        `   ❌ Workspace "${workspace.workspaceName}": NO primary safe found`,
      );
      console.log(`      This would cause "Primary Account Not Found" error`);
    }
    console.log('');
  }

  console.log('\n📍 SIMULATING: align-router.ts -> getVirtualAccountDetails');
  console.log(
    '   This query finds funding sources scoped to a specific workspace\n',
  );

  for (const workspace of result.workspaces) {
    const fundingSourcesForWorkspace =
      await db.query.userFundingSources.findMany({
        where: and(
          eq(userFundingSources.userPrivyDid, userDid),
          eq(userFundingSources.workspaceId, workspace.workspaceId),
        ),
      });

    const queryDetails = `Query: userFundingSources WHERE userPrivyDid='${userDid}' AND workspaceId='${workspace.workspaceId}'`;

    result.routerAccessChecks.getVirtualAccountDetails.queries.push({
      workspaceId: workspace.workspaceId,
      queryType: `Funding sources for workspace: ${workspace.workspaceName}`,
      expectedResults: fundingSourcesForWorkspace.length,
      details: queryDetails,
    });

    if (fundingSourcesForWorkspace.length > 0) {
      console.log(
        `   ✅ Workspace "${workspace.workspaceName}": FOUND ${fundingSourcesForWorkspace.length} funding source(s)`,
      );
      for (const source of fundingSourcesForWorkspace) {
        console.log(
          `      - ${source.sourceCurrency?.toUpperCase()} (${source.sourceAccountType})`,
        );
      }
    } else {
      console.log(
        `   ❌ Workspace "${workspace.workspaceName}": NO funding sources found`,
      );
      console.log(`      This would cause "No virtual bank accounts" error`);

      const legacyFundingSources = await db.query.userFundingSources.findMany({
        where: and(
          eq(userFundingSources.userPrivyDid, userDid),
          isNull(userFundingSources.workspaceId),
        ),
      });

      if (legacyFundingSources.length > 0) {
        console.log(
          `      ⚠️  Found ${legacyFundingSources.length} legacy funding source(s) with NULL workspaceId`,
        );
        console.log(
          `      These need migration to workspace: ${workspace.workspaceId}`,
        );
      }
    }
    console.log('');
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('DIAGNOSIS SUMMARY');
  console.log(`${'='.repeat(80)}\n`);

  let hasIssues = false;

  for (const workspace of result.workspaces) {
    const hasPrimarySafe =
      result.routerAccessChecks.getUserSafes.queries.find((q) =>
        q.queryType.includes(workspace.workspaceName),
      )?.expectedResults === 1;

    const hasFundingSources =
      result.routerAccessChecks.getVirtualAccountDetails.queries.find(
        (q) => q.workspaceId === workspace.workspaceId,
      )?.expectedResults! > 0;

    if (!hasPrimarySafe || !hasFundingSources) {
      hasIssues = true;
      console.log(
        `❌ ISSUES FOUND for workspace "${workspace.workspaceName}":`,
      );

      if (!hasPrimarySafe) {
        console.log(
          `   - Missing primary safe scoped to workspace ${workspace.workspaceId}`,
        );
        console.log(`   - User will see: "Primary Account Not Found"`);

        const legacySafes = allSafes.filter(
          (s) => s.safeType === 'primary' && !s.workspaceId,
        );
        if (legacySafes.length > 0) {
          console.log(
            `   - FIX: Migrate legacy primary safe to workspaceId: ${workspace.workspaceId}`,
          );
          console.log(`     Safe address: ${legacySafes[0].safeAddress}`);
        } else {
          console.log(`   - FIX: Create new primary safe for workspace`);
        }
      }

      if (!hasFundingSources) {
        console.log(
          `   - Missing funding sources scoped to workspace ${workspace.workspaceId}`,
        );
        console.log(
          `   - User will see: "No virtual bank accounts are connected yet"`,
        );

        const legacyFunding = allFundingSources.filter((s) => !s.workspaceId);
        if (legacyFunding.length > 0) {
          console.log(
            `   - FIX: Migrate ${legacyFunding.length} legacy funding source(s) to workspaceId: ${workspace.workspaceId}`,
          );
          for (const source of legacyFunding) {
            console.log(
              `     Source ID: ${source.id} (${source.sourceCurrency})`,
            );
          }
        } else if (workspace.workspaceDetails.alignCustomerId) {
          console.log(`   - FIX: Create virtual accounts via cron or manually`);
          console.log(
            `     Align Customer ID: ${workspace.workspaceDetails.alignCustomerId}`,
          );
        } else {
          console.log(
            `   - FIX: Complete KYC to get Align Customer ID, then create virtual accounts`,
          );
        }
      }

      console.log('');
    } else {
      console.log(
        `✅ Workspace "${workspace.workspaceName}" is correctly configured`,
      );
      console.log(`   - Has primary safe: ${hasPrimarySafe}`);
      console.log(`   - Has funding sources: ${hasFundingSources}`);
      console.log('');
    }
  }

  if (!hasIssues) {
    console.log('✅ No issues found - all workspaces are correctly configured');
  }

  return result;
}

async function main() {
  try {
    console.log('Starting workspace access diagnostic...\n');

    const result = await diagnoseUserWorkspaceAccess(TARGET_USER_DID);

    console.log(`\n${'='.repeat(80)}`);
    console.log('DIAGNOSTIC COMPLETE');
    console.log(`${'='.repeat(80)}\n`);

    console.log('Full diagnostic data has been collected.');
    console.log(
      'Review the output above for specific issues and recommended fixes.\n',
    );

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error during diagnostic:');
    console.error(error);
    process.exit(1);
  }
}

main();
