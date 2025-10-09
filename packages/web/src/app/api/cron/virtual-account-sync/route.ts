import { NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, userFundingSources, userSafes } from '@/db/schema';
import { eq, and, isNull, or } from 'drizzle-orm';
import { alignApi } from '@/server/services/align-api';
import type { Address } from 'viem';

/**
 * Virtual Account Sync Cron Job
 *
 * Ensures all approved workspaces have their virtual bank accounts (USD/EUR) properly created.
 * This runs periodically to catch cases where:
 * - KYC was approved but virtual account creation failed
 * - Workspace was created but never got virtual accounts
 * - Multi-workspace users need separate accounts per workspace
 *
 * Schedule: Every 30 minutes
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

/**
 * Create virtual accounts for a workspace
 */
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

    // Check if workspace already has FULL-tier funding sources
    // Ignore starter accounts since they should coexist with full accounts
    const existingFullAccounts = await db.query.userFundingSources.findMany({
      where: and(
        eq(userFundingSources.userPrivyDid, userId),
        eq(userFundingSources.workspaceId, workspaceId),
        eq(userFundingSources.accountTier, 'full'),
      ),
    });

    if (existingFullAccounts.length > 0) {
      console.log(
        `[virtual-account-sync] Workspace ${workspaceId} already has ${existingFullAccounts.length} full-tier funding source(s)`,
      );
      return {
        success: true,
        details: `Already has ${existingFullAccounts.length} full-tier funding source(s)`,
      };
    }

    const results = [];
    const errors = [];

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
        accountTier: 'full',
        ownerAlignCustomerId: alignCustomerId,
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
        accountTier: 'full',
        ownerAlignCustomerId: alignCustomerId,
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

    // Update workspace with first account ID if any were created
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

export async function GET(request: Request) {
  try {
    // Verify cron secret if in production
    const authHeader = request.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      console.error('[virtual-account-sync] Unauthorized cron attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[virtual-account-sync] Starting virtual account sync job');
    const startTime = Date.now();

    // Find all workspaces with approved KYC but no virtual accounts
    const approvedWorkspaces = await db
      .select({
        id: workspaces.id,
        createdBy: workspaces.createdBy,
        alignCustomerId: workspaces.alignCustomerId,
        kycStatus: workspaces.kycStatus,
        alignVirtualAccountId: workspaces.alignVirtualAccountId,
      })
      .from(workspaces)
      .where(
        and(
          eq(workspaces.kycStatus, 'approved'),
          // Has alignCustomerId (required to create virtual accounts)
          // Using a simple check - if alignCustomerId exists, it won't be null
        ),
      );

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
        status: 'skipped' | 'created' | 'failed';
        details: string;
      }>,
    };

    for (const workspace of approvedWorkspaces) {
      // Skip if no alignCustomerId
      if (!workspace.alignCustomerId) {
        console.log(
          `[virtual-account-sync] Skipping workspace ${workspace.id} - no alignCustomerId`,
        );
        results.skipped++;
        results.details.push({
          workspaceId: workspace.id,
          status: 'skipped',
          details: 'No Align customer ID',
        });
        continue;
      }

      // Check if workspace already has funding sources
      const existingAccounts = await db.query.userFundingSources.findMany({
        where: and(
          eq(userFundingSources.userPrivyDid, workspace.createdBy),
          eq(userFundingSources.workspaceId, workspace.id),
        ),
      });

      if (existingAccounts.length > 0) {
        console.log(
          `[virtual-account-sync] Workspace ${workspace.id} already has ${existingAccounts.length} account(s)`,
        );
        results.skipped++;
        results.details.push({
          workspaceId: workspace.id,
          status: 'skipped',
          details: `Already has ${existingAccounts.length} account(s)`,
        });
        continue;
      }

      // Get workspace's primary safe address (workspace-scoped only)
      const primarySafe = await db.query.userSafes.findFirst({
        where: and(
          eq(userSafes.userDid, workspace.createdBy),
          eq(userSafes.safeType, 'primary'),
          eq(userSafes.workspaceId, workspace.id),
        ),
      });

      if (!primarySafe?.safeAddress) {
        console.log(
          `[virtual-account-sync] Skipping workspace ${workspace.id} - no primary safe`,
        );
        results.skipped++;
        results.details.push({
          workspaceId: workspace.id,
          status: 'skipped',
          details: 'No primary safe address',
        });
        continue;
      }

      // Create virtual accounts for this workspace
      results.processed++;
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
          status: 'created',
          details: result.details,
        });
      } else {
        results.failed++;
        results.details.push({
          workspaceId: workspace.id,
          status: 'failed',
          details: result.error || result.details,
        });
      }
    }

    const duration = Date.now() - startTime;
    console.log(
      `[virtual-account-sync] Completed in ${duration}ms - Processed: ${results.processed}, Created: ${results.created}, Failed: ${results.failed}, Skipped: ${results.skipped}`,
    );

    return NextResponse.json({
      success: true,
      duration,
      ...results,
    });
  } catch (error) {
    console.error('[virtual-account-sync] Fatal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
