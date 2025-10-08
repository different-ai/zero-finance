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

async function findBrokenWorkspaceAccess() {
  console.log('🔍 Scanning for users with broken workspace access...\n');

  const allMembers = await db
    .select({
      userId: workspaceMembers.userId,
      workspaceId: workspaceMembers.workspaceId,
      role: workspaceMembers.role,
      workspace: {
        name: workspaces.name,
        kycStatus: workspaces.kycStatus,
        alignCustomerId: workspaces.alignCustomerId,
      },
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id));

  console.log(`Found ${allMembers.length} workspace memberships to check\n`);

  const issues: Array<{
    userId: string;
    workspaceId: string;
    workspaceName: string;
    problems: string[];
  }> = [];

  for (const member of allMembers) {
    const problems: string[] = [];

    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, member.userId),
        eq(userSafes.safeType, 'primary'),
        or(
          eq(userSafes.workspaceId, member.workspaceId),
          isNull(userSafes.workspaceId),
        ),
      ),
    });

    if (!primarySafe) {
      problems.push('Missing primary safe');
    }

    const fundingSources = await db.query.userFundingSources.findMany({
      where: and(
        eq(userFundingSources.userPrivyDid, member.userId),
        eq(userFundingSources.workspaceId, member.workspaceId),
      ),
    });

    if (fundingSources.length === 0) {
      if (member.workspace.kycStatus === 'approved') {
        problems.push('Missing funding sources (KYC approved)');
      } else {
        problems.push(
          `Missing funding sources (KYC: ${member.workspace.kycStatus || 'none'})`,
        );
      }
    }

    if (problems.length > 0) {
      issues.push({
        userId: member.userId,
        workspaceId: member.workspaceId,
        workspaceName: member.workspace.name,
        problems,
      });
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(80)}\n`);

  if (issues.length === 0) {
    console.log(
      '✅ No issues found - all workspace memberships are properly configured\n',
    );
    return;
  }

  console.log(
    `❌ Found ${issues.length} user(s) with workspace access issues:\n`,
  );

  for (const issue of issues) {
    console.log(`User: ${issue.userId}`);
    console.log(`Workspace: ${issue.workspaceName} (${issue.workspaceId})`);
    console.log(`Problems:`);
    for (const problem of issue.problems) {
      console.log(`  - ${problem}`);
    }
    console.log('');
  }

  console.log('\n💡 To diagnose a specific user, run:');
  console.log('   tsx scripts/diagnose-workspace-access.ts');
  console.log('   (Update TARGET_USER_DID in the script first)\n');
}

async function main() {
  try {
    await findBrokenWorkspaceAccess();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:');
    console.error(error);
    process.exit(1);
  }
}

main();
