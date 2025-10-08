import { db } from '../packages/web/src/db';
import {
  workspaces,
  userFundingSources,
  userSafes,
} from '../packages/web/src/db/schema';
import { eq, and } from 'drizzle-orm';
import { alignApi } from '../packages/web/src/server/services/align-api';
import type { Address } from 'viem';

async function createVirtualAccountsForWorkspace(
  workspaceId: string,
  userId: string,
  alignCustomerId: string,
  destinationAddress: Address,
): Promise<{ success: boolean; details: string; error?: string }> {
  try {
    console.log(
      `[virtual-account-sync] Creating accounts for workspace ${workspaceId}`,
    );

    const existingAccounts = await db.query.userFundingSources.findMany({
      where: and(
        eq(userFundingSources.userPrivyDid, userId),
        eq(userFundingSources.workspaceId, workspaceId),
      ),
    });

    if (existingAccounts.length > 0) {
      console.log(
        `[virtual-account-sync] Workspace ${workspaceId} already has ${existingAccounts.length} funding source(s)`,
      );
      return {
        success: true,
        details: `Already has ${existingAccounts.length} funding source(s)`,
      };
    }

    const results: Array<{ currency: string; id: string }> = [];
    const errors: Array<{ currency: string; error: string }> = [];

    // Create USD (ACH) account
    try {
      console.log(
        `[virtual-account-sync] Creating USD account for workspace ${workspaceId}`,
      );
      const usdAccount = await alignApi.createVirtualAccount(alignCustomerId, {
        source_currency: 'usd',
        destination_token: 'usdc',
        destination_network: 'base',
        destination_address: destinationAddress,
      });

      await db.insert(userFundingSources).values({
        userPrivyDid: userId,
        workspaceId: workspaceId,
        sourceProvider: 'align',
        alignVirtualAccountIdRef: usdAccount.id,
        sourceAccountType: 'us_ach',
        sourceCurrency: 'usd',
        sourceBankName: usdAccount.deposit_instructions.bank_name,
        sourceBankAddress: usdAccount.deposit_instructions.bank_address,
        sourceBankBeneficiaryName:
          usdAccount.deposit_instructions.beneficiary_name ||
          usdAccount.deposit_instructions.account_beneficiary_name,
        sourceBankBeneficiaryAddress:
          usdAccount.deposit_instructions.beneficiary_address ||
          usdAccount.deposit_instructions.account_beneficiary_address,
        sourceAccountNumber:
          usdAccount.deposit_instructions.us?.account_number ||
          usdAccount.deposit_instructions.account_number,
        sourceRoutingNumber:
          usdAccount.deposit_instructions.us?.routing_number ||
          usdAccount.deposit_instructions.routing_number,
        sourcePaymentRails: usdAccount.deposit_instructions.payment_rails,
        destinationCurrency: 'usdc',
        destinationPaymentRail: 'base',
        destinationAddress: destinationAddress,
      });

      results.push({ currency: 'USD', id: usdAccount.id });
      console.log(
        `[virtual-account-sync] ✅ Created USD account: ${usdAccount.id}`,
      );
    } catch (error) {
      console.error(
        `[virtual-account-sync] Error creating USD account:`,
        error,
      );
      errors.push({
        currency: 'USD',
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Create EUR (IBAN) account
    try {
      console.log(
        `[virtual-account-sync] Creating EUR account for workspace ${workspaceId}`,
      );
      const eurAccount = await alignApi.createVirtualAccount(alignCustomerId, {
        source_currency: 'eur',
        destination_token: 'usdc',
        destination_network: 'base',
        destination_address: destinationAddress,
      });

      await db.insert(userFundingSources).values({
        userPrivyDid: userId,
        workspaceId: workspaceId,
        sourceProvider: 'align',
        alignVirtualAccountIdRef: eurAccount.id,
        sourceAccountType: 'iban',
        sourceCurrency: 'eur',
        sourceBankName: eurAccount.deposit_instructions.bank_name,
        sourceBankAddress: eurAccount.deposit_instructions.bank_address,
        sourceBankBeneficiaryName:
          eurAccount.deposit_instructions.beneficiary_name ||
          eurAccount.deposit_instructions.account_beneficiary_name,
        sourceBankBeneficiaryAddress:
          eurAccount.deposit_instructions.beneficiary_address ||
          eurAccount.deposit_instructions.account_beneficiary_address,
        sourceIban: eurAccount.deposit_instructions.iban?.iban_number,
        sourceBicSwift:
          eurAccount.deposit_instructions.iban?.bic ||
          eurAccount.deposit_instructions.bic?.bic_code,
        sourcePaymentRails: eurAccount.deposit_instructions.payment_rails,
        destinationCurrency: 'usdc',
        destinationPaymentRail: 'base',
        destinationAddress: destinationAddress,
      });

      results.push({ currency: 'EUR', id: eurAccount.id });
      console.log(
        `[virtual-account-sync] ✅ Created EUR account: ${eurAccount.id}`,
      );
    } catch (error) {
      console.error(
        `[virtual-account-sync] Error creating EUR account:`,
        error,
      );
      errors.push({
        currency: 'EUR',
        error: error instanceof Error ? error.message : String(error),
      });
    }

    if (results.length > 0) {
      await db
        .update(workspaces)
        .set({
          alignVirtualAccountId: results[0].id,
        })
        .where(eq(workspaces.id, workspaceId));
    }

    if (results.length === 2) {
      return {
        success: true,
        details: `Created USD and EUR accounts (${results[0].id}, ${results[1].id})`,
      };
    } else if (results.length === 1) {
      return {
        success: true,
        details: `Created ${results[0].currency} account (${results[0].id}), ${errors[0]?.currency} failed`,
        error: errors[0]?.error,
      };
    } else {
      return {
        success: false,
        details: 'Failed to create any accounts',
        error: errors.map((e) => `${e.currency}: ${e.error}`).join('; '),
      };
    }
  } catch (error) {
    console.error(
      `[virtual-account-sync] Error in createVirtualAccountsForWorkspace for ${workspaceId}:`,
      error,
    );
    return {
      success: false,
      details: 'Exception during account creation',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log('[virtual-account-sync] Starting virtual account sync script');
  const startTime = Date.now();

  const approvedWorkspaces = await db
    .select({
      id: workspaces.id,
      createdBy: workspaces.createdBy,
      alignCustomerId: workspaces.alignCustomerId,
      kycStatus: workspaces.kycStatus,
      alignVirtualAccountId: workspaces.alignVirtualAccountId,
      companyName: workspaces.companyName,
    })
    .from(workspaces)
    .where(eq(workspaces.kycStatus, 'approved'));

  console.log(
    `[virtual-account-sync] Found ${approvedWorkspaces.length} approved workspaces`,
  );

  const results = {
    total: approvedWorkspaces.length,
    processed: 0,
    skipped: 0,
    created: 0,
    failed: 0,
    details: [] as Array<{
      workspaceId: string;
      companyName: string | null;
      status: 'skipped' | 'created' | 'failed';
      details: string;
    }>,
  };

  for (const workspace of approvedWorkspaces) {
    if (!workspace.alignCustomerId) {
      console.log(
        `[virtual-account-sync] Skipping workspace ${workspace.id} (${workspace.companyName}) - no alignCustomerId`,
      );
      results.skipped++;
      results.details.push({
        workspaceId: workspace.id,
        companyName: workspace.companyName,
        status: 'skipped',
        details: 'No Align customer ID',
      });
      continue;
    }

    const existingAccounts = await db.query.userFundingSources.findMany({
      where: and(
        eq(userFundingSources.userPrivyDid, workspace.createdBy),
        eq(userFundingSources.workspaceId, workspace.id),
      ),
    });

    if (existingAccounts.length > 0) {
      console.log(
        `[virtual-account-sync] Workspace ${workspace.id} (${workspace.companyName}) already has ${existingAccounts.length} account(s)`,
      );
      results.skipped++;
      results.details.push({
        workspaceId: workspace.id,
        companyName: workspace.companyName,
        status: 'skipped',
        details: `Already has ${existingAccounts.length} account(s)`,
      });
      continue;
    }

    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, workspace.createdBy),
        eq(userSafes.safeType, 'primary'),
        eq(userSafes.workspaceId, workspace.id),
      ),
    });

    if (!primarySafe?.safeAddress) {
      console.log(
        `[virtual-account-sync] Skipping workspace ${workspace.id} (${workspace.companyName}) - no primary safe`,
      );
      results.skipped++;
      results.details.push({
        workspaceId: workspace.id,
        companyName: workspace.companyName,
        status: 'skipped',
        details: 'No primary safe address',
      });
      continue;
    }

    results.processed++;
    console.log(
      `\n[virtual-account-sync] Processing workspace: ${workspace.id} (${workspace.companyName})`,
    );
    const result = await createVirtualAccountsForWorkspace(
      workspace.id,
      workspace.createdBy,
      workspace.alignCustomerId,
      primarySafe.safeAddress as Address,
    );

    if (result.success) {
      results.created++;
      results.details.push({
        workspaceId: workspace.id,
        companyName: workspace.companyName,
        status: 'created',
        details: result.details,
      });
    } else {
      results.failed++;
      results.details.push({
        workspaceId: workspace.id,
        companyName: workspace.companyName,
        status: 'failed',
        details: result.error || result.details,
      });
    }
  }

  const duration = Date.now() - startTime;
  console.log(
    `\n[virtual-account-sync] ✅ Completed in ${duration}ms - Processed: ${results.processed}, Created: ${results.created}, Failed: ${results.failed}, Skipped: ${results.skipped}`,
  );

  console.log('\n📊 Summary:');
  results.details.forEach((detail) => {
    const emoji =
      detail.status === 'created'
        ? '✅'
        : detail.status === 'failed'
          ? '❌'
          : '⏭️';
    console.log(
      `  ${emoji} ${detail.companyName || detail.workspaceId}: ${detail.details}`,
    );
  });

  process.exit(0);
}

main().catch((error) => {
  console.error('[virtual-account-sync] Fatal error:', error);
  process.exit(1);
});
