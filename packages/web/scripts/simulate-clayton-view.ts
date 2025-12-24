/**
 * Simulate what Clayton sees in the UI by querying production DB
 *
 * This simulates the align-router.ts -> getVirtualAccountDetails endpoint
 *
 * Usage:
 *   cd packages/web
 *   npx tsx scripts/simulate-clayton-view.ts
 *
 * Make sure .env.production.local exists with POSTGRES_URL
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load production env file explicitly
dotenv.config({ path: path.resolve(__dirname, '../.env.production.local') });

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../src/db/schema';

const { workspaces, userFundingSources } = schema;

// Clayton's IDs from the original request
const WORKSPACE_ID = 'e4ed82c6-03b7-4d2f-be1b-6deea6832b09';
const PRIVY_DID = 'did:privy:cmgcrf5nv00fwjg0bkowpqesk';

// Initialize database connection
const databaseUrl = process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error('❌ Error: POSTGRES_URL not found in environment');
  console.error('Make sure .env.production.local exists with POSTGRES_URL');
  process.exit(1);
}

console.log('🔗 Connecting to database...');
console.log(
  `   Database: ${databaseUrl.split('@')[1]?.split('?')[0] || 'unknown'}`,
);

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool, { schema });

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🎯 SIMULATING: align-router.ts -> getVirtualAccountDetails');
  console.log('   For Clayton (workspace: ' + WORKSPACE_ID + ')');
  console.log('='.repeat(80));

  try {
    // Step 1: Get workspace details (simulating ctx.workspaceId)
    console.log('\n📋 Step 1: Get workspace details');
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, WORKSPACE_ID),
    });

    if (!workspace) {
      console.error('❌ Workspace not found!');
      process.exit(1);
    }

    console.log('   ✅ Found workspace:');
    console.log(`      Name: ${workspace.name}`);
    console.log(`      Company: ${workspace.companyName || 'N/A'}`);
    console.log(`      KYC Status: ${workspace.kycStatus}`);
    console.log(`      KYC Sub-Status: ${workspace.kycSubStatus || 'N/A'}`);
    console.log(
      `      Align Customer ID: ${workspace.alignCustomerId || 'MISSING'}`,
    );
    console.log(
      `      Align VA ID: ${workspace.alignVirtualAccountId || 'MISSING'}`,
    );

    const hasCompletedKyc = workspace.kycStatus === 'approved';
    console.log(`\n   🔐 hasCompletedKyc = ${hasCompletedKyc}`);

    // Step 2: Get ALL funding sources for this workspace
    console.log('\n📋 Step 2: Get funding sources for workspace');
    const allFundingSources = await db.query.userFundingSources.findMany({
      where: eq(userFundingSources.workspaceId, WORKSPACE_ID),
    });

    console.log(`   Found ${allFundingSources.length} total funding source(s)`);

    // Step 3: Filter for Align sources
    const alignSources = allFundingSources.filter(
      (source) => source.sourceProvider === 'align',
    );
    console.log(`   Found ${alignSources.length} Align source(s)`);

    // Step 4: Apply KYC filter (this is the key logic!)
    console.log('\n📋 Step 3: Apply KYC-based filtering');
    console.log(`   hasCompletedKyc: ${hasCompletedKyc}`);

    const filteredSources = hasCompletedKyc
      ? alignSources
      : alignSources.filter((source) => source.accountTier === 'starter');

    console.log(`   After KYC filter: ${filteredSources.length} source(s)`);

    // Step 5: Show what would be returned
    console.log('\n' + '='.repeat(80));
    console.log('📦 SIMULATED API RESPONSE: getVirtualAccountDetails');
    console.log('='.repeat(80));

    console.log('\n🏦 fundingSources array:');
    if (filteredSources.length === 0) {
      console.log('   (empty - no accounts to show!)');
    } else {
      filteredSources.forEach((source, i) => {
        console.log(
          `\n   [${i}] ${source.sourceAccountType?.toUpperCase()} Account:`,
        );
        console.log(`       ID: ${source.id}`);
        console.log(
          `       Tier: ${source.accountTier || 'unknown'} ${source.accountTier === 'full' ? '✅ FULL' : '⚠️ STARTER'}`,
        );
        console.log(`       Currency: ${source.sourceCurrency?.toUpperCase()}`);
        console.log(`       Bank: ${source.sourceBankName}`);
        console.log(`       Beneficiary: ${source.sourceBankBeneficiaryName}`);
        if (source.sourceAccountType === 'us_ach') {
          console.log(`       Routing: ${source.sourceRoutingNumber}`);
          console.log(`       Account: ${source.sourceAccountNumber}`);
        } else {
          console.log(`       IBAN: ${source.sourceIban}`);
          console.log(`       BIC: ${source.sourceBicSwift}`);
        }
        console.log(`       Destination: ${source.destinationAddress}`);
      });
    }

    console.log('\n👤 userData:');
    console.log(`   firstName: ${workspace.firstName}`);
    console.log(`   lastName: ${workspace.lastName}`);
    console.log(`   companyName: ${workspace.companyName}`);
    console.log(`   beneficiaryType: ${workspace.beneficiaryType}`);

    console.log(`\n🔐 hasCompletedKyc: ${hasCompletedKyc}`);

    // Step 6: Show what the UI component would render
    console.log('\n' + '='.repeat(80));
    console.log('🖥️  UI COMPONENT BEHAVIOR (BankingInstructionsDisplay)');
    console.log('='.repeat(80));

    const starterAccounts = filteredSources.filter(
      (s) => s.accountTier === 'starter',
    );
    const fullAccounts = filteredSources.filter(
      (s) => s.accountTier === 'full',
    );

    console.log(`\n   Starter accounts: ${starterAccounts.length}`);
    console.log(`   Full accounts: ${fullAccounts.length}`);

    const hasStarter = starterAccounts.length > 0;
    const hasFull = fullAccounts.length > 0;
    const showStarter = hasStarter && !hasFull;

    console.log(`\n   hasStarter: ${hasStarter}`);
    console.log(`   hasFull: ${hasFull}`);
    console.log(`   showStarter (hasStarter && !hasFull): ${showStarter}`);

    console.log('\n   📺 What Clayton would see:');
    if (hasFull) {
      console.log(
        '      ✅ "Your personal accounts" section with "Unlimited" badge',
      );
      fullAccounts.forEach((acc) => {
        console.log(
          `         - ${acc.sourceAccountType?.toUpperCase()}: ${acc.sourceBankName} (${acc.sourceBankBeneficiaryName})`,
        );
      });
    }
    if (showStarter) {
      console.log(
        '      ⚠️ "Instant access accounts" section with "STARTER" badge',
      );
      starterAccounts.forEach((acc) => {
        console.log(
          `         - ${acc.sourceAccountType?.toUpperCase()}: ${acc.sourceBankName} (${acc.sourceBankBeneficiaryName})`,
        );
      });
    }
    if (!hasFull && !hasStarter) {
      console.log('      ❌ No accounts to display!');
    }

    // Step 7: Debug - show ALL funding sources regardless of filter
    console.log('\n' + '='.repeat(80));
    console.log('🔍 DEBUG: ALL funding sources in database for this workspace');
    console.log('='.repeat(80));

    allFundingSources.forEach((source, i) => {
      console.log(`\n   [${i}] ${source.sourceAccountType?.toUpperCase()}:`);
      console.log(`       Provider: ${source.sourceProvider}`);
      console.log(`       Tier: ${source.accountTier}`);
      console.log(`       Bank: ${source.sourceBankName}`);
      console.log(`       Beneficiary: ${source.sourceBankBeneficiaryName}`);
      console.log(`       Created: ${source.createdAt}`);
    });

    // Check if there are funding sources for the user but wrong workspace
    console.log('\n' + '='.repeat(80));
    console.log(
      '🔍 DEBUG: Check for funding sources with NULL or different workspace',
    );
    console.log('='.repeat(80));

    const userFundingSourcesAll = await db.query.userFundingSources.findMany({
      where: eq(userFundingSources.userPrivyDid, PRIVY_DID),
    });

    console.log(
      `\n   Found ${userFundingSourcesAll.length} funding sources for user ${PRIVY_DID}:`,
    );
    userFundingSourcesAll.forEach((source, i) => {
      const wsMatch = source.workspaceId === WORKSPACE_ID ? '✅' : '❌';
      console.log(
        `\n   [${i}] ${source.sourceAccountType?.toUpperCase()} ${wsMatch}`,
      );
      console.log(`       Workspace ID: ${source.workspaceId || 'NULL'}`);
      console.log(`       Tier: ${source.accountTier}`);
      console.log(`       Bank: ${source.sourceBankName}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ Simulation complete');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
}

main();
