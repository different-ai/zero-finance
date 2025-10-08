#!/usr/bin/env tsx

import { db } from '../packages/web/src/db';
import {
  users,
  workspaces,
  workspaceMembers,
  userSafes,
  userFundingSources,
} from '../packages/web/src/db/schema';
import { eq } from 'drizzle-orm';

async function showUserWorkspaces(userDid: string) {
  console.log('='.repeat(80));
  console.log('WORKSPACE MEMBERSHIP DEBUG');
  console.log('='.repeat(80));
  console.log();

  const user = await db.query.users.findFirst({
    where: eq(users.privyDid, userDid),
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('👤 USER INFO');
  console.log('  DID:', user.privyDid);
  console.log('  Name:', user.firstName, user.lastName);
  console.log('  Primary Workspace:', user.primaryWorkspaceId || 'None');
  console.log();

  const memberships = await db
    .select({
      workspaceId: workspaceMembers.workspaceId,
      role: workspaceMembers.role,
      joinedAt: workspaceMembers.joinedAt,
      isPrimary: workspaceMembers.isPrimary,
      workspace: {
        id: workspaces.id,
        name: workspaces.name,
        kycStatus: workspaces.kycStatus,
        kycMarkedDone: workspaces.kycMarkedDone,
        alignCustomerId: workspaces.alignCustomerId,
        alignVirtualAccountId: workspaces.alignVirtualAccountId,
        createdBy: workspaces.createdBy,
        createdAt: workspaces.createdAt,
      },
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(eq(workspaceMembers.userId, userDid));

  console.log(`🏢 WORKSPACE MEMBERSHIPS (${memberships.length})`);
  console.log();

  for (const membership of memberships) {
    const isOwner = membership.workspace.createdBy === userDid;

    console.log(`  📁 ${membership.workspace.name}`);
    console.log(`     ID: ${membership.workspaceId}`);
    console.log(`     Role: ${membership.role} ${isOwner ? '(OWNER)' : ''}`);
    console.log(`     Primary: ${membership.isPrimary}`);
    console.log(`     Joined: ${membership.joinedAt.toISOString()}`);
    console.log(
      `     Created: ${membership.workspace.createdAt.toISOString()}`,
    );
    console.log();
    console.log('     💳 KYC & Banking:');
    console.log(`       Status: ${membership.workspace.kycStatus || 'none'}`);
    console.log(`       Marked Done: ${membership.workspace.kycMarkedDone}`);
    console.log(
      `       Align Customer ID: ${membership.workspace.alignCustomerId || 'N/A'}`,
    );
    console.log(
      `       Align Virtual Account ID: ${membership.workspace.alignVirtualAccountId || 'N/A'}`,
    );
    console.log();

    const safes = await db.query.userSafes.findMany({
      where: eq(userSafes.workspaceId, membership.workspaceId),
      columns: {
        safeAddress: true,
        safeType: true,
        userDid: true,
      },
    });

    console.log(`     🔐 SAFES (${safes.length}):`);
    for (const safe of safes) {
      const isMine = safe.userDid === userDid;
      console.log(
        `       - ${safe.safeType}: ${safe.safeAddress} ${isMine ? '(MINE)' : `(owned by ${safe.userDid})`}`,
      );
    }
    console.log();

    const fundingSources = await db.query.userFundingSources.findMany({
      where: eq(userFundingSources.workspaceId, membership.workspaceId),
      columns: {
        id: true,
        userPrivyDid: true,
        sourceProvider: true,
        sourceAccountType: true,
        sourceCurrency: true,
        sourceAccountNumber: true,
        sourceIban: true,
        alignVirtualAccountIdRef: true,
      },
    });

    console.log(`     💰 FUNDING SOURCES (${fundingSources.length}):`);
    if (fundingSources.length === 0) {
      console.log('       (none)');
    } else {
      for (const source of fundingSources) {
        const isMine = source.userPrivyDid === userDid;
        console.log(
          `       - ${source.sourceAccountType} (${source.sourceCurrency})`,
        );
        console.log(
          `         Account: ${source.sourceAccountNumber || source.sourceIban || 'N/A'}`,
        );
        console.log(`         Provider: ${source.sourceProvider}`);
        console.log(
          `         Align Ref: ${source.alignVirtualAccountIdRef || 'N/A'}`,
        );
        console.log(`         Owner: ${isMine ? 'ME' : source.userPrivyDid}`);
      }
    }
    console.log();
    console.log('  ' + '-'.repeat(76));
    console.log();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const userDid =
    args.find((arg) => arg.startsWith('--did='))?.split('=')[1] || args[0];

  if (!userDid || userDid.startsWith('--')) {
    console.error('❌ Error: User DID is required');
    console.log('\nUsage:');
    console.log('  tsx scripts/show-user-workspace-debug.ts <did>');
    console.log('  tsx scripts/show-user-workspace-debug.ts --did=<did>');
    console.log('\nExample:');
    console.log(
      '  tsx scripts/show-user-workspace-debug.ts did:privy:cmf62r60400pnjo0avjpa9pcj',
    );
    process.exit(1);
  }

  try {
    await showUserWorkspaces(userDid);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:');
    console.error(error);
    process.exit(1);
  }
}

main();
