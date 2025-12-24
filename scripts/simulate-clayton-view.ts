/**
 * Simulate what Clayton sees in the UI by querying production DB
 *
 * This simulates the align-router.ts -> getVirtualAccountDetails endpoint
 *
 * Usage:
 *   npx tsx scripts/simulate-clayton-view.ts
 *
 * Make sure to have .env.production or .env.production.local with POSTGRES_URL
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and } from 'drizzle-orm';

// Schema imports - we'll define them inline to avoid import issues
import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  varchar,
} from 'drizzle-orm/pg-core';

// Define minimal schema needed for this query
const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey(),
  name: text('name'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  companyName: text('company_name'),
  beneficiaryType: text('beneficiary_type'),
  kycStatus: text('kyc_status'),
  kycSubStatus: text('kyc_sub_status'),
  alignCustomerId: text('align_customer_id'),
  alignVirtualAccountId: text('align_virtual_account_id'),
  createdBy: text('created_by'),
});

const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').primaryKey(),
  workspaceId: uuid('workspace_id'),
  userId: text('user_id'),
  role: text('role'),
  isPrimary: boolean('is_primary'),
});

const userFundingSources = pgTable('user_funding_sources', {
  id: uuid('id').primaryKey(),
  userPrivyDid: text('user_privy_did'),
  workspaceId: uuid('workspace_id'),
  sourceProvider: text('source_provider'),
  accountTier: text('account_tier'),
  sourceAccountType: text('source_account_type'),
  sourceCurrency: text('source_currency'),
  sourceBankName: text('source_bank_name'),
  sourceRoutingNumber: text('source_routing_number'),
  sourceAccountNumber: text('source_account_number'),
  sourceIban: text('source_iban'),
  sourceBicSwift: text('source_bic_swift'),
  sourceBankBeneficiaryName: text('source_bank_beneficiary_name'),
  destinationAddress: text('destination_address'),
  destinationCurrency: text('destination_currency'),
  createdAt: timestamp('created_at'),
});

const users = pgTable('users', {
  privyDid: text('privy_did').primaryKey(),
  primaryWorkspaceId: uuid('primary_workspace_id'),
  kycStatus: text('kyc_status'),
  alignCustomerId: text('align_customer_id'),
});

// Clayton's IDs from the original request
const WORKSPACE_ID = 'e4ed82c6-03b7-4d2f-be1b-6deea6832b09';
const USER_ID = '68c46f1f-5a5b-4e0f-baf8-d4261ed72c05';
const PRIVY_DID = 'did:privy:cmgcrf5nv00fwjg0bkowpqesk';

async function main() {
  // Check for database URL
  const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ No POSTGRES_URL or DATABASE_URL found in environment');
    console.error(
      '   Make sure .env.production.local exists with the database URL',
    );
    process.exit(1);
  }

  console.log('🔍 Connecting to database...');
  console.log(`   URL prefix: ${databaseUrl.substring(0, 30)}...`);

  const client = postgres(databaseUrl);
  const db = drizzle(client);

  console.log('\n' + '='.repeat(80));
  console.log('🎯 SIMULATING: align-router.ts -> getVirtualAccountDetails');
  console.log('   For Clayton (workspace: ' + WORKSPACE_ID + ')');
  console.log('='.repeat(80));

  try {
    // Step 1: Get workspace details (simulating ctx.workspaceId)
    console.log('\n📋 Step 1: Get workspace details');
    const workspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, WORKSPACE_ID))
      .limit(1);

    if (workspace.length === 0) {
      console.error('❌ Workspace not found!');
      process.exit(1);
    }

    const ws = workspace[0];
    console.log('   ✅ Found workspace:');
    console.log(`      Name: ${ws.name}`);
    console.log(`      Company: ${ws.companyName || 'N/A'}`);
    console.log(`      KYC Status: ${ws.kycStatus}`);
    console.log(`      KYC Sub-Status: ${ws.kycSubStatus || 'N/A'}`);
    console.log(`      Align Customer ID: ${ws.alignCustomerId || 'MISSING'}`);
    console.log(`      Align VA ID: ${ws.alignVirtualAccountId || 'MISSING'}`);

    const hasCompletedKyc = ws.kycStatus === 'approved';
    console.log(`\n   🔐 hasCompletedKyc = ${hasCompletedKyc}`);

    // Step 2: Get ALL funding sources for this workspace
    console.log('\n📋 Step 2: Get funding sources for workspace');
    const allFundingSources = await db
      .select()
      .from(userFundingSources)
      .where(eq(userFundingSources.workspaceId, WORKSPACE_ID));

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
    console.log(`   firstName: ${ws.firstName}`);
    console.log(`   lastName: ${ws.lastName}`);
    console.log(`   companyName: ${ws.companyName}`);
    console.log(`   beneficiaryType: ${ws.beneficiaryType}`);

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

    const userFundingSourcesAll = await db
      .select()
      .from(userFundingSources)
      .where(eq(userFundingSources.userPrivyDid, PRIVY_DID));

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
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

main();
