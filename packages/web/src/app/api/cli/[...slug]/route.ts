import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateApiKeyRequest,
  hasValidAdminToken,
} from '@/server/cli/auth';
import {
  listSavedBankAccounts,
  proposeBankTransfer,
  listProposals,
  createBankAccount,
  createInvoice,
  updateInvoice,
  listInvoices,
  getInvoice,
  sendInvoice,
  listTransactions,
  getTransaction,
  attachDocument,
  listAttachments,
  removeAttachment,
  getPaymentDetails,
  sharePaymentDetails,
  dismissProposal,
} from '@/app/api/mcp/route';
import { createApiKey } from '@/lib/mcp/api-key';
import { createPrivyUser, pregeneratePrivyWallets } from '@/server/cli/privy';
import { ensureUserWorkspace } from '@/server/utils/workspace';
import { db } from '@/db';
import {
  actionProposals,
  userProfilesTable,
  users,
  workspaces,
} from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { isAddress, parseUnits } from 'viem';
import {
  BASE_USDC_VAULTS,
  USDC_ASSET,
  BASE_CHAIN_ID,
} from '@/server/earn/base-vaults';
import { getSpendableBalanceByWorkspace } from '@/server/services/spendable-balance';

export const dynamic = 'force-dynamic';

type McpTextResult = {
  content: Array<{ type: string; text: string }>;
};

function unwrapMcpResult(result: unknown) {
  if (!result || typeof result !== 'object') {
    return result;
  }

  if (!('content' in result)) {
    return result;
  }

  const content = (result as McpTextResult).content;
  const text = content?.[0]?.text;
  if (!text) {
    return result;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

function jsonResponse(payload: unknown, status = 200) {
  return NextResponse.json(payload, { status });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

function requireAdmin(request: NextRequest) {
  if (!hasValidAdminToken(request)) {
    throw new Error('Unauthorized: invalid admin token');
  }
}

async function requireApiContext(request: NextRequest) {
  const context = await authenticateApiKeyRequest(request);
  if (!context) {
    throw new Error('Unauthorized: invalid or missing API key');
  }
  return context;
}

async function findWorkspaceOwner(workspaceId: string) {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  return workspace.createdBy;
}

async function createProposal(params: {
  workspaceId: string;
  proposalType: 'crypto_transfer' | 'savings_deposit' | 'savings_withdraw';
  proposalMessage?: string;
  payload: Record<string, unknown>;
}) {
  const ownerDid = await findWorkspaceOwner(params.workspaceId);

  const [proposal] = await db
    .insert(actionProposals)
    .values({
      userDid: ownerDid,
      workspaceId: params.workspaceId,
      proposalType: params.proposalType,
      proposalMessage: params.proposalMessage,
      payload: params.payload,
      status: 'pending',
      proposedByAgent: true,
    })
    .returning();

  if (!proposal) {
    throw new Error('Failed to create proposal');
  }

  return proposal;
}

function parseLimit(searchParams: URLSearchParams) {
  const limitParam = searchParams.get('limit');
  if (!limitParam) return undefined;
  const limit = Number(limitParam);
  return Number.isFinite(limit) ? limit : undefined;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  try {
    const { slug = [] } = await params;
    if (slug.length === 0) {
      return errorResponse('Not found', 404);
    }

    if (slug[0] === 'whoami') {
      const context = await requireApiContext(request);
      return jsonResponse({
        workspace_id: context.workspaceId,
        workspace_name: context.workspaceName,
        key_id: context.keyId,
        key_name: context.keyName,
        align_customer_id: context.alignCustomerId,
      });
    }

    if (slug[0] === 'balance') {
      const context = await requireApiContext(request);
      const payload = await getSpendableBalanceByWorkspace(context.workspaceId);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'bank-accounts') {
      const context = await requireApiContext(request);
      const result = await listSavedBankAccounts(context);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'bank-transfers' && slug[1] === 'proposals') {
      const context = await requireApiContext(request);
      const searchParams = new URL(request.url).searchParams;
      const includeCompleted = searchParams.get('include_completed') === 'true';
      const result = await listProposals(context, {
        include_completed: includeCompleted,
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'invoices') {
      const context = await requireApiContext(request);
      if (slug[1]) {
        const result = await getInvoice(context, { invoice_id: slug[1] });
        const payload = unwrapMcpResult(result);
        if (payload && typeof payload === 'object' && 'error' in payload) {
          return jsonResponse(payload, 400);
        }
        return jsonResponse(payload);
      }

      const searchParams = new URL(request.url).searchParams;
      const status = searchParams.get('status') as
        | 'db_pending'
        | 'pending'
        | 'paid'
        | 'canceled'
        | null;
      const limit = parseLimit(searchParams);
      const result = await listInvoices(context, {
        status: status ?? undefined,
        limit,
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'transactions') {
      const context = await requireApiContext(request);
      if (slug[1]) {
        const result = await getTransaction(context, {
          transaction_id: slug[1],
        });
        const payload = unwrapMcpResult(result);
        if (payload && typeof payload === 'object' && 'error' in payload) {
          return jsonResponse(payload, 400);
        }
        return jsonResponse(payload);
      }

      const searchParams = new URL(request.url).searchParams;
      const status = searchParams.get('status') as
        | 'pending'
        | 'completed'
        | 'failed'
        | null;
      const limit = parseLimit(searchParams);
      const result = await listTransactions(context, {
        status: status ?? undefined,
        limit,
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'attachments') {
      const context = await requireApiContext(request);
      const searchParams = new URL(request.url).searchParams;
      const result = await listAttachments(context, {
        transaction_id: searchParams.get('transaction_id') || undefined,
        transaction_type:
          (searchParams.get('transaction_type') as
            | 'offramp'
            | 'invoice'
            | null) ?? undefined,
        limit: parseLimit(searchParams),
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'payment-details') {
      const context = await requireApiContext(request);
      const result = await getPaymentDetails(context);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'crypto-transfers' && slug[1] === 'proposals') {
      const context = await requireApiContext(request);
      const searchParams = new URL(request.url).searchParams;
      const includeCompleted = searchParams.get('include_completed') === 'true';

      const conditions = [
        eq(actionProposals.workspaceId, context.workspaceId),
        eq(actionProposals.proposalType, 'crypto_transfer'),
        eq(actionProposals.dismissed, false),
      ];

      if (!includeCompleted) {
        conditions.push(
          inArray(actionProposals.status, ['pending', 'approved']),
        );
      }

      const proposals = await db.query.actionProposals.findMany({
        where: and(...conditions),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
      });

      return jsonResponse({ proposals, count: proposals.length });
    }

    if (slug[0] === 'savings' && slug[1] === 'proposals') {
      const context = await requireApiContext(request);
      const searchParams = new URL(request.url).searchParams;
      const includeCompleted = searchParams.get('include_completed') === 'true';

      const conditions = [
        eq(actionProposals.workspaceId, context.workspaceId),
        inArray(actionProposals.proposalType, [
          'savings_deposit',
          'savings_withdraw',
        ]),
        eq(actionProposals.dismissed, false),
      ];

      if (!includeCompleted) {
        conditions.push(
          inArray(actionProposals.status, ['pending', 'approved']),
        );
      }

      const proposals = await db.query.actionProposals.findMany({
        where: and(...conditions),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
      });

      return jsonResponse({ proposals, count: proposals.length });
    }

    if (slug[0] === 'vaults') {
      await requireApiContext(request);
      const vaults = BASE_USDC_VAULTS.map((vault) => ({
        id: vault.id,
        name: vault.name,
        display_name: vault.displayName,
        address: vault.address,
        risk: vault.risk,
        curator: vault.curator,
        chain_id: vault.chainId,
        asset: vault.asset,
      }));
      return jsonResponse({ vaults, count: vaults.length });
    }

    if (slug[0] === 'savings' && slug[1] === 'positions') {
      const context = await requireApiContext(request);
      const payload = await getSpendableBalanceByWorkspace(context.workspaceId);
      return jsonResponse(payload);
    }

    if (slug[0] === 'users' && slug[1]) {
      requireAdmin(request);
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, slug[1]),
      });

      if (!user) {
        return errorResponse('User not found', 404);
      }

      const profile = await db.query.userProfilesTable.findFirst({
        where: eq(userProfilesTable.privyDid, slug[1]),
      });

      return jsonResponse({ user, profile });
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message.toLowerCase().includes('unauthorized')) {
      return errorResponse(message, 401);
    }
    return errorResponse(message, 400);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  try {
    const { slug = [] } = await params;
    if (slug.length === 0) {
      return errorResponse('Not found', 404);
    }

    if (slug[0] === 'bank-accounts') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await createBankAccount(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload, 201);
    }

    if (slug[0] === 'bank-transfers' && slug[1] === 'proposals' && !slug[2]) {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await proposeBankTransfer(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload, 201);
    }

    if (
      slug[0] === 'bank-transfers' &&
      slug[1] === 'proposals' &&
      slug[2] &&
      slug[3] === 'dismiss'
    ) {
      const context = await requireApiContext(request);
      const result = await dismissProposal(context, { proposal_id: slug[2] });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'invoices' && !slug[1]) {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await createInvoice(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload, 201);
    }

    if (slug[0] === 'invoices' && slug[1] && slug[2] === 'send') {
      const context = await requireApiContext(request);
      const result = await sendInvoice(context, { invoice_id: slug[1] });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'attachments') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await attachDocument(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload, 201);
    }

    if (slug[0] === 'payment-details' && slug[1] === 'share') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await sharePaymentDetails(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'crypto-transfers' && slug[1] === 'proposals') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const chainId = Number(body.chain_id ?? BASE_CHAIN_ID);

      if (!isAddress(body.to_address)) {
        return errorResponse('Invalid to_address');
      }
      if (!isAddress(body.token_address)) {
        return errorResponse('Invalid token_address');
      }

      const tokenDecimals =
        typeof body.token_decimals === 'number'
          ? body.token_decimals
          : body.token_address?.toLowerCase() ===
              USDC_ASSET.address.toLowerCase()
            ? USDC_ASSET.decimals
            : undefined;

      if (tokenDecimals === undefined) {
        return errorResponse('token_decimals is required for non-USDC tokens');
      }

      const amountBaseUnits = parseUnits(String(body.amount), tokenDecimals);

      const proposal = await createProposal({
        workspaceId: context.workspaceId,
        proposalType: 'crypto_transfer',
        proposalMessage: body.reason,
        payload: {
          toAddress: body.to_address,
          tokenAddress: body.token_address,
          tokenSymbol: body.token_symbol ?? null,
          tokenDecimals,
          amount: String(body.amount),
          amountBaseUnits: amountBaseUnits.toString(),
          chainId,
        },
      });

      return jsonResponse(
        {
          proposal_id: proposal.id,
          status: proposal.status,
        },
        201,
      );
    }

    if (
      slug[0] === 'crypto-transfers' &&
      slug[1] === 'proposals' &&
      slug[2] &&
      slug[3] === 'dismiss'
    ) {
      const context = await requireApiContext(request);
      const proposal = await db.query.actionProposals.findFirst({
        where: and(
          eq(actionProposals.id, slug[2]),
          eq(actionProposals.workspaceId, context.workspaceId),
        ),
      });

      if (!proposal) {
        return errorResponse('Proposal not found', 404);
      }

      await db
        .update(actionProposals)
        .set({ status: 'canceled', dismissed: true })
        .where(eq(actionProposals.id, proposal.id));

      return jsonResponse({ success: true });
    }

    if (slug[0] === 'savings' && slug[1] === 'deposits') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const vault = BASE_USDC_VAULTS.find(
        (item) =>
          item.address.toLowerCase() ===
          String(body.vault_address).toLowerCase(),
      );

      if (!vault) {
        return errorResponse('Vault not supported for CLI deposits');
      }

      const amountBaseUnits = parseUnits(
        String(body.amount),
        vault.asset.decimals,
      );

      const proposal = await createProposal({
        workspaceId: context.workspaceId,
        proposalType: 'savings_deposit',
        proposalMessage: body.reason,
        payload: {
          vaultAddress: vault.address,
          vaultName: vault.name,
          vaultDisplayName: vault.displayName,
          assetAddress: vault.asset.address,
          assetSymbol: vault.asset.symbol,
          assetDecimals: vault.asset.decimals,
          amount: String(body.amount),
          amountBaseUnits: amountBaseUnits.toString(),
          chainId: vault.chainId,
        },
      });

      return jsonResponse(
        {
          proposal_id: proposal.id,
          status: proposal.status,
        },
        201,
      );
    }

    if (slug[0] === 'savings' && slug[1] === 'withdrawals') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const vault = BASE_USDC_VAULTS.find(
        (item) =>
          item.address.toLowerCase() ===
          String(body.vault_address).toLowerCase(),
      );

      if (!vault) {
        return errorResponse('Vault not supported for CLI withdrawals');
      }

      const amountBaseUnits = parseUnits(
        String(body.amount),
        vault.asset.decimals,
      );

      const proposal = await createProposal({
        workspaceId: context.workspaceId,
        proposalType: 'savings_withdraw',
        proposalMessage: body.reason,
        payload: {
          vaultAddress: vault.address,
          vaultName: vault.name,
          vaultDisplayName: vault.displayName,
          assetAddress: vault.asset.address,
          assetSymbol: vault.asset.symbol,
          assetDecimals: vault.asset.decimals,
          amount: String(body.amount),
          amountBaseUnits: amountBaseUnits.toString(),
          chainId: vault.chainId,
        },
      });

      return jsonResponse(
        {
          proposal_id: proposal.id,
          status: proposal.status,
        },
        201,
      );
    }

    if (slug[0] === 'users') {
      requireAdmin(request);
      const body = await request.json();

      if (!body.email && !body.phone) {
        return errorResponse('email or phone is required');
      }

      const linkedAccounts = [] as Array<{
        type: 'email' | 'phone';
        address: string;
      }>;
      if (body.email) {
        linkedAccounts.push({ type: 'email', address: body.email });
      }
      if (body.phone) {
        linkedAccounts.push({ type: 'phone', address: body.phone });
      }

      const privyUser = await createPrivyUser({
        linked_accounts: linkedAccounts,
        ...(body.wallets ? { wallets: body.wallets } : {}),
        ...(body.create_direct_signer !== undefined
          ? { create_direct_signer: body.create_direct_signer }
          : {}),
        ...(body.custom_metadata
          ? { custom_metadata: body.custom_metadata }
          : {}),
      });

      const privyDid = privyUser?.id ?? privyUser?.user?.id;
      if (!privyDid) {
        return errorResponse('Privy user creation failed');
      }

      const { workspaceId } = await ensureUserWorkspace(
        db,
        privyDid,
        body.email ?? null,
      );

      const existingProfile = await db.query.userProfilesTable.findFirst({
        where: eq(userProfilesTable.privyDid, privyDid),
      });

      if (!existingProfile) {
        await db.insert(userProfilesTable).values({
          privyDid,
          email: body.email ?? null,
          skippedOrCompletedOnboardingStepper: false,
        });
      }

      const keyName = body.api_key_name ?? 'CLI Access';
      const { rawKey, keyId } = await createApiKey({
        workspaceId,
        name: keyName,
        createdBy: privyDid,
        expiresAt: body.api_key_expires_at
          ? new Date(body.api_key_expires_at)
          : undefined,
      });

      return jsonResponse(
        {
          privy_user: privyUser,
          workspace_id: workspaceId,
          api_key: rawKey,
          api_key_id: keyId,
        },
        201,
      );
    }

    if (slug[0] === 'users' && slug[1] && slug[2] === 'wallets') {
      requireAdmin(request);
      const body = await request.json();
      const wallets = body.wallets ?? [
        {
          chain_type: 'ethereum',
        },
      ];
      const privyUser = await pregeneratePrivyWallets({
        user_id: slug[1],
        wallets,
        ...(body.create_direct_signer !== undefined
          ? { create_direct_signer: body.create_direct_signer }
          : {}),
      });

      return jsonResponse({ privy_user: privyUser });
    }

    if (slug[0] === 'api-keys') {
      requireAdmin(request);
      const body = await request.json();

      if (!body.workspace_id || !body.created_by) {
        return errorResponse('workspace_id and created_by are required');
      }

      const { rawKey, keyId } = await createApiKey({
        workspaceId: body.workspace_id,
        name: body.name ?? 'CLI Access',
        createdBy: body.created_by,
        expiresAt: body.expires_at ? new Date(body.expires_at) : undefined,
      });

      return jsonResponse({ api_key: rawKey, api_key_id: keyId }, 201);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message.toLowerCase().includes('unauthorized')) {
      return errorResponse(message, 401);
    }
    return errorResponse(message, 400);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  try {
    const { slug = [] } = await params;
    if (slug[0] === 'invoices' && slug[1]) {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await updateInvoice(context, {
        invoice_id: slug[1],
        ...body,
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message.toLowerCase().includes('unauthorized')) {
      return errorResponse(message, 401);
    }
    return errorResponse(message, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  try {
    const { slug = [] } = await params;
    if (slug[0] === 'attachments' && slug[1]) {
      const context = await requireApiContext(request);
      const result = await removeAttachment(context, {
        attachment_id: slug[1],
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message.toLowerCase().includes('unauthorized')) {
      return errorResponse(message, 401);
    }
    return errorResponse(message, 400);
  }
}
