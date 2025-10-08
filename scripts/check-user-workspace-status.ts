import { db } from '../packages/web/src/db';
import {
  users,
  workspaces,
  workspaceMembers,
  userSafes,
  userFundingSources,
} from '../packages/web/src/db/schema';
import { eq, and } from 'drizzle-orm';

async function checkUserStatus(privyDid: string) {
  console.log('\n🔍 Checking status for user:', privyDid);
  console.log('='.repeat(80));

  // 1. Check user record
  const user = await db.query.users.findFirst({
    where: eq(users.privyDid, privyDid),
  });

  if (!user) {
    console.log('❌ User not found in database');
    process.exit(1);
  }

  console.log('\n✅ User found:');
  console.log(`  Primary Workspace ID: ${user.primaryWorkspaceId || 'None'}`);
  console.log(`  Created: ${user.createdAt}`);

  // 2. Get all workspace memberships
  const memberships = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.userId, privyDid),
  });

  console.log(`\n👥 Workspace Memberships: ${memberships.length}`);

  for (const membership of memberships) {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, membership.workspaceId),
    });

    if (!workspace) continue;

    console.log('\n' + '─'.repeat(80));
    console.log(
      `📁 Workspace: ${workspace.companyName || workspace.name || workspace.id}`,
    );
    console.log(`  ID: ${workspace.id}`);
    console.log(`  Role: ${membership.role}`);
    console.log(`  Is Primary: ${membership.isPrimary ? 'Yes' : 'No'}`);
    console.log(`  KYC Status: ${workspace.kycStatus || 'None'}`);
    console.log(`  Align Customer ID: ${workspace.alignCustomerId || 'None'}`);

    // 3. Get safes for this workspace
    const safes = await db.query.userSafes.findMany({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.workspaceId, workspace.id),
      ),
    });

    console.log(`\n  💼 Safes (${safes.length}):`);
    if (safes.length === 0) {
      console.log('    No safes found');
    } else {
      safes.forEach((safe) => {
        console.log(
          `    - ${safe.safeType.toUpperCase()}: ${safe.safeAddress}`,
        );
        console.log(`      ID: ${safe.id}`);
      });
    }

    // 4. Get funding sources for this workspace
    const fundingSources = await db.query.userFundingSources.findMany({
      where: and(
        eq(userFundingSources.userPrivyDid, privyDid),
        eq(userFundingSources.workspaceId, workspace.id),
      ),
    });

    console.log(`\n  💳 Funding Sources (${fundingSources.length}):`);
    if (fundingSources.length === 0) {
      console.log('    No funding sources found');
    } else {
      fundingSources.forEach((source) => {
        console.log(
          `    - ${source.sourceCurrency?.toUpperCase()} (${source.sourceAccountType})`,
        );
        console.log(
          `      Align Virtual Account ID: ${source.alignVirtualAccountIdRef}`,
        );
        console.log(`      Bank: ${source.sourceBankName || 'N/A'}`);
        console.log(
          `      Beneficiary: ${source.sourceBankBeneficiaryName || 'N/A'}`,
        );
        if (
          source.sourceAccountType === 'us_ach' &&
          source.sourceAccountNumber
        ) {
          console.log(`      Account: ${source.sourceAccountNumber}`);
          console.log(`      Routing: ${source.sourceRoutingNumber}`);
        } else if (source.sourceAccountType === 'iban' && source.sourceIban) {
          console.log(`      IBAN: ${source.sourceIban}`);
          console.log(`      BIC: ${source.sourceBicSwift}`);
        }
        console.log('');
      });
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Status check complete\n');
  process.exit(0);
}

const privyDid = process.argv[2];
if (!privyDid) {
  console.error(
    'Usage: npx tsx scripts/check-user-workspace-status.ts <privy-did>',
  );
  process.exit(1);
}

checkUserStatus(privyDid).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
