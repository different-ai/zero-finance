#!/usr/bin/env tsx

import { db } from '../packages/web/src/db';
import {
  userSafes,
  userFundingSources,
  workspaceMembers,
} from '../packages/web/src/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

interface MigrationPlan {
  userDid: string;
  targetWorkspaceId: string;
  safesToMigrate: Array<{
    safeAddress: string;
    safeType: string;
    currentWorkspaceId: string | null;
  }>;
  fundingSourcesToMigrate: Array<{
    id: string;
    sourceCurrency: string | null;
    sourceAccountType: string | null;
    currentWorkspaceId: string | null;
  }>;
}

async function generateMigrationPlan(
  userDid: string,
  targetWorkspaceId: string,
): Promise<MigrationPlan> {
  const plan: MigrationPlan = {
    userDid,
    targetWorkspaceId,
    safesToMigrate: [],
    fundingSourcesToMigrate: [],
  };

  const membership = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.userId, userDid),
      eq(workspaceMembers.workspaceId, targetWorkspaceId),
    ),
  });

  if (!membership) {
    throw new Error(
      `User ${userDid} is not a member of workspace ${targetWorkspaceId}`,
    );
  }

  const legacySafes = await db.query.userSafes.findMany({
    where: and(eq(userSafes.userDid, userDid), isNull(userSafes.workspaceId)),
  });

  plan.safesToMigrate = legacySafes.map((safe) => ({
    safeAddress: safe.safeAddress,
    safeType: safe.safeType,
    currentWorkspaceId: safe.workspaceId,
  }));

  const legacyFundingSources = await db.query.userFundingSources.findMany({
    where: and(
      eq(userFundingSources.userPrivyDid, userDid),
      isNull(userFundingSources.workspaceId),
    ),
  });

  plan.fundingSourcesToMigrate = legacyFundingSources.map((source) => ({
    id: source.id,
    sourceCurrency: source.sourceCurrency,
    sourceAccountType: source.sourceAccountType,
    currentWorkspaceId: source.workspaceId,
  }));

  return plan;
}

async function executeMigration(
  plan: MigrationPlan,
  dryRun: boolean = true,
): Promise<void> {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`MIGRATION ${dryRun ? 'PLAN (DRY RUN)' : 'EXECUTION'}`);
  console.log(`${'='.repeat(80)}\n`);

  console.log(`User: ${plan.userDid}`);
  console.log(`Target Workspace: ${plan.targetWorkspaceId}`);
  console.log('');

  console.log(`🔐 SAFES TO MIGRATE: ${plan.safesToMigrate.length}`);
  for (const safe of plan.safesToMigrate) {
    console.log(`   - ${safe.safeAddress} (${safe.safeType})`);
  }
  console.log('');

  console.log(
    `💳 FUNDING SOURCES TO MIGRATE: ${plan.fundingSourcesToMigrate.length}`,
  );
  for (const source of plan.fundingSourcesToMigrate) {
    console.log(
      `   - ${source.id} (${source.sourceCurrency} - ${source.sourceAccountType})`,
    );
  }
  console.log('');

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made to the database');
    console.log('   Run with --execute flag to perform the migration');
    return;
  }

  console.log('🚀 EXECUTING MIGRATION...\n');

  let safesMigrated = 0;
  for (const safe of plan.safesToMigrate) {
    try {
      await db
        .update(userSafes)
        .set({ workspaceId: plan.targetWorkspaceId })
        .where(
          and(
            eq(userSafes.userDid, plan.userDid),
            eq(userSafes.safeAddress, safe.safeAddress),
            isNull(userSafes.workspaceId),
          ),
        );

      console.log(`   ✅ Migrated safe: ${safe.safeAddress}`);
      safesMigrated++;
    } catch (error) {
      console.error(`   ❌ Failed to migrate safe ${safe.safeAddress}:`, error);
    }
  }

  let fundingSourcesMigrated = 0;
  for (const source of plan.fundingSourcesToMigrate) {
    try {
      await db
        .update(userFundingSources)
        .set({ workspaceId: plan.targetWorkspaceId })
        .where(
          and(
            eq(userFundingSources.userPrivyDid, plan.userDid),
            eq(userFundingSources.id, source.id),
            isNull(userFundingSources.workspaceId),
          ),
        );

      console.log(
        `   ✅ Migrated funding source: ${source.id} (${source.sourceCurrency})`,
      );
      fundingSourcesMigrated++;
    } catch (error) {
      console.error(
        `   ❌ Failed to migrate funding source ${source.id}:`,
        error,
      );
    }
  }

  console.log('');
  console.log(`${'='.repeat(80)}`);
  console.log('MIGRATION COMPLETE');
  console.log(`${'='.repeat(80)}\n`);
  console.log(
    `✅ Migrated ${safesMigrated}/${plan.safesToMigrate.length} safes`,
  );
  console.log(
    `✅ Migrated ${fundingSourcesMigrated}/${plan.fundingSourcesToMigrate.length} funding sources`,
  );
}

async function main() {
  const args = process.argv.slice(2);
  const userDid = args.find((arg) => arg.startsWith('--user='))?.split('=')[1];
  const workspaceId = args
    .find((arg) => arg.startsWith('--workspace='))
    ?.split('=')[1];
  const shouldExecute = args.includes('--execute');

  if (!userDid) {
    console.error('❌ Error: --user=<did> is required');
    console.log('\nUsage:');
    console.log(
      '  tsx scripts/migrate-legacy-data-to-workspace.ts --user=<did> --workspace=<id> [--execute]',
    );
    console.log('\nExample:');
    console.log('  tsx scripts/migrate-legacy-data-to-workspace.ts \\');
    console.log('    --user=did:privy:cm90bst3m00v7l40lk5qfxzkz \\');
    console.log('    --workspace=cm123abc \\');
    console.log('    --execute');
    process.exit(1);
  }

  if (!workspaceId) {
    console.error('❌ Error: --workspace=<id> is required');
    console.log(
      '\nRun the diagnostic script first to find the target workspace ID:',
    );
    console.log('  tsx scripts/diagnose-workspace-access.ts');
    process.exit(1);
  }

  try {
    console.log('Generating migration plan...\n');

    const plan = await generateMigrationPlan(userDid, workspaceId);

    if (
      plan.safesToMigrate.length === 0 &&
      plan.fundingSourcesToMigrate.length === 0
    ) {
      console.log(
        '✅ No legacy data to migrate - user data is already workspace-scoped',
      );
      process.exit(0);
    }

    await executeMigration(plan, !shouldExecute);

    if (!shouldExecute) {
      console.log(
        '\n💡 To execute this migration, run the command again with --execute flag',
      );
    } else {
      console.log('\n✅ Migration completed successfully');
      console.log('   Run the diagnostic script again to verify:');
      console.log('   tsx scripts/diagnose-workspace-access.ts');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:');
    console.error(error);
    process.exit(1);
  }
}

main();
