import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { actionProposals } from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import {
  decodeEventLog,
  getEventSelector,
  parseAbiItem,
  type Address,
  type Hex,
  type TransactionReceipt,
} from 'viem';
import {
  isSupportedChain,
  SUPPORTED_CHAINS,
  type SupportedChainId,
} from '@/lib/constants/chains';
import { getRPCManager } from '@/lib/multi-chain-rpc';
import {
  dispatchWebhookEvent,
  logAuditEvent,
} from '@/server/services/webhook-service';
import { getVaultPositions } from '@/server/earn/yield-positions';
import { getWorkspaceSafes } from '@/server/earn/multi-chain-safe-manager';
import { getVaultByAddress } from '@/server/earn/vault-registry';

const proposalTypeSchema = z.enum([
  'crypto_transfer',
  'savings_deposit',
  'savings_withdraw',
]);

function requireWorkspaceId(workspaceId: string | null | undefined): string {
  if (!workspaceId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Workspace context is required.',
    });
  }
  return workspaceId;
}

type SavingsDirection = 'deposit' | 'withdraw';

type VaultPayload = Record<string, unknown>;

function resolveSavingsDirection(
  proposalType: string,
): SavingsDirection | null {
  if (proposalType === 'savings_deposit') return 'deposit';
  if (proposalType === 'savings_withdraw') return 'withdraw';
  return null;
}

function resolvePayloadAmount(payload: VaultPayload): string | undefined {
  const amount = payload.amount;
  if (typeof amount === 'string') return amount;
  if (typeof amount === 'number') return amount.toString();
  return undefined;
}

async function resolveVaultId(payload: VaultPayload) {
  const directId =
    (typeof payload.vault_id === 'string' && payload.vault_id) ||
    (typeof payload.vaultId === 'string' && payload.vaultId) ||
    null;

  if (directId) return directId;

  const address =
    (typeof payload.vaultAddress === 'string' && payload.vaultAddress) ||
    (typeof payload.vault_address === 'string' && payload.vault_address) ||
    null;

  const chainIdRaw =
    (payload.chainId as number | string | undefined) ??
    (payload.chain_id as number | string | undefined);
  const chainId =
    typeof chainIdRaw === 'number'
      ? chainIdRaw
      : typeof chainIdRaw === 'string'
        ? Number(chainIdRaw)
        : null;

  if (!address || !chainId) return null;

  const vault = await getVaultByAddress(address as Address, chainId);
  return vault?.id ?? null;
}

function resolvePayloadChainId(payload: VaultPayload): SupportedChainId {
  const chainIdRaw =
    (payload.chainId as number | string | undefined) ??
    (payload.chain_id as number | string | undefined);

  const chainId =
    typeof chainIdRaw === 'number'
      ? chainIdRaw
      : typeof chainIdRaw === 'string'
        ? Number(chainIdRaw)
        : null;

  if (chainId && isSupportedChain(chainId)) {
    return chainId;
  }

  return SUPPORTED_CHAINS.BASE;
}

const ENTRY_POINT_BY_CHAIN: Partial<Record<SupportedChainId, Address>> = {
  [SUPPORTED_CHAINS.BASE]: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
};

const USER_OPERATION_EVENT = parseAbiItem(
  'event UserOperationEvent(bytes32 userOpHash,address sender,address paymaster,uint256 nonce,bool success,uint256 actualGasCost,uint256 actualGasUsed)',
);

const SAFE_EXECUTION_SUCCESS_EVENT = parseAbiItem(
  'event ExecutionSuccess(bytes32 txHash,uint256 payment)',
);

const SAFE_EXECUTION_FAILURE_EVENT = parseAbiItem(
  'event ExecutionFailure(bytes32 txHash,uint256 payment)',
);

const SAFE_EXECUTION_SUCCESS_SELECTOR = getEventSelector(
  SAFE_EXECUTION_SUCCESS_EVENT,
);

const SAFE_EXECUTION_FAILURE_SELECTOR = getEventSelector(
  SAFE_EXECUTION_FAILURE_EVENT,
);

type ActionProposalCompletion =
  | {
      status: 'executed';
      txHash: Hex;
      safeTxHash?: Hex;
      userOpHash?: Hex;
    }
  | {
      status: 'failed';
      txHash: Hex;
      safeTxHash?: Hex;
      userOpHash?: Hex;
      reason: string;
    }
  | {
      status: 'unverified';
      txHash: Hex;
      userOpHash?: Hex;
      reason: string;
    };

function formatExecutionError(error: unknown): string {
  if (error instanceof Error) {
    const maybeShort = (error as { shortMessage?: string }).shortMessage;
    return maybeShort ?? error.message;
  }
  return String(error);
}

async function waitForReceiptOrUserOpReceipt({
  chainId,
  hash,
  timeoutMs = 60_000,
  pollMs = 2_000,
  lookbackBlocks = 50_000n,
}: {
  chainId: SupportedChainId;
  hash: Hex;
  timeoutMs?: number;
  pollMs?: number;
  lookbackBlocks?: bigint;
}): Promise<{
  receipt: TransactionReceipt;
  txHash: Hex;
  userOpHash?: Hex;
} | null> {
  const publicClient = getRPCManager().getClient(chainId);
  const deadline = Date.now() + timeoutMs;
  const entryPoint = ENTRY_POINT_BY_CHAIN[chainId];
  let resolvedTxHash: Hex | null = null;

  while (Date.now() < deadline) {
    try {
      const targetHash = resolvedTxHash ?? hash;
      const receipt = await publicClient.getTransactionReceipt({
        hash: targetHash,
      });
      return {
        receipt,
        txHash: targetHash,
        ...(resolvedTxHash ? { userOpHash: hash } : null),
      };
    } catch {
      // Keep polling until we can retrieve the receipt.
    }

    if (entryPoint && !resolvedTxHash) {
      try {
        const logs = await publicClient.getLogs({
          address: entryPoint,
          event: USER_OPERATION_EVENT,
          args: { userOpHash: hash },
          fromBlock: -lookbackBlocks,
        });

        const txHash = logs[0]?.transactionHash;
        if (txHash) {
          resolvedTxHash = txHash;
        }
      } catch {
        // Ignore lookup issues; we'll retry on the next poll tick.
      }
    }

    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }

  return null;
}

function findSafeExecutionEvent(receipt: TransactionReceipt): {
  status: 'success' | 'failure';
  safeTxHash: Hex;
  safeAddress: Address;
} | null {
  for (const log of receipt.logs) {
    if (log.topics[0] === SAFE_EXECUTION_FAILURE_SELECTOR) {
      const decoded = decodeEventLog({
        abi: [SAFE_EXECUTION_FAILURE_EVENT],
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === 'ExecutionFailure') {
        return {
          status: 'failure',
          safeTxHash: decoded.args.txHash as Hex,
          safeAddress: log.address as Address,
        };
      }
    }
  }

  for (const log of receipt.logs) {
    if (log.topics[0] === SAFE_EXECUTION_SUCCESS_SELECTOR) {
      const decoded = decodeEventLog({
        abi: [SAFE_EXECUTION_SUCCESS_EVENT],
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === 'ExecutionSuccess') {
        return {
          status: 'success',
          safeTxHash: decoded.args.txHash as Hex,
          safeAddress: log.address as Address,
        };
      }
    }
  }

  return null;
}

async function verifySafeExecution({
  proposal,
  txHash,
}: {
  proposal: { payload: unknown };
  txHash: Hex;
}): Promise<ActionProposalCompletion> {
  const payload = proposal.payload as VaultPayload;
  const chainId = resolvePayloadChainId(payload);

  const receiptResult = await waitForReceiptOrUserOpReceipt({
    chainId,
    hash: txHash,
  });

  if (!receiptResult) {
    return {
      status: 'unverified',
      txHash,
      reason: 'Timed out waiting for transaction receipt.',
    };
  }

  const { receipt, txHash: normalizedTxHash, userOpHash } = receiptResult;

  if (receipt.status !== 'success') {
    return {
      status: 'failed',
      txHash: normalizedTxHash,
      userOpHash,
      reason: `Transaction ${normalizedTxHash} reverted on-chain.`,
    };
  }

  const safeExecution = findSafeExecutionEvent(receipt);

  if (!safeExecution) {
    return {
      status: 'unverified',
      txHash: normalizedTxHash,
      userOpHash,
      reason:
        'Unable to verify Safe execution (missing ExecutionSuccess/ExecutionFailure logs).',
    };
  }

  if (safeExecution.status === 'failure') {
    return {
      status: 'failed',
      txHash: normalizedTxHash,
      userOpHash,
      safeTxHash: safeExecution.safeTxHash,
      reason: `Safe execution failed (ExecutionFailure). safeTxHash: ${safeExecution.safeTxHash}`,
    };
  }

  return {
    status: 'executed',
    txHash: normalizedTxHash,
    userOpHash,
    safeTxHash: safeExecution.safeTxHash,
  };
}

type VaultActionStatus = 'executed' | 'failed';

async function emitVaultActionCompleted({
  workspaceId,
  actor,
  proposal,
  status,
  txHash,
  reason,
}: {
  workspaceId: string;
  actor: string | undefined;
  proposal: { id: string; proposalType: string; payload: unknown };
  status: VaultActionStatus;
  txHash?: string;
  reason?: string;
}) {
  const direction = resolveSavingsDirection(proposal.proposalType);
  if (!direction) return;

  const payload = proposal.payload as VaultPayload;
  const vaultId = await resolveVaultId(payload);
  const amount = resolvePayloadAmount(payload);

  await logAuditEvent({
    workspaceId,
    actor,
    eventType: 'vault.action.completed',
    metadata: {
      proposal_id: proposal.id,
      vault_id: vaultId,
      amount,
      direction,
      status,
      ...(txHash ? { tx_hash: txHash } : null),
      ...(reason ? { reason } : null),
    },
  });

  await dispatchWebhookEvent({
    workspaceId,
    eventType: 'vault.action.completed',
    payload: {
      proposal_id: proposal.id,
      vault_id: vaultId,
      amount,
      direction,
      status,
      ...(txHash ? { tx_hash: txHash } : null),
      ...(reason ? { reason } : null),
    },
  });

  if (!vaultId) return;

  const safes = await getWorkspaceSafes(workspaceId);
  const ownerAddresses = safes.map((safe) => safe.safeAddress as Address);

  if (ownerAddresses.length === 0) return;

  const positions = await getVaultPositions({ ownerAddresses });
  const filtered = positions.filter((position) => position.vaultId === vaultId);

  await logAuditEvent({
    workspaceId,
    actor,
    eventType: 'vault.position.updated',
    metadata: {
      vault_id: vaultId,
      positions: filtered,
    },
  });

  await dispatchWebhookEvent({
    workspaceId,
    eventType: 'vault.position.updated',
    payload: {
      vault_id: vaultId,
      positions: filtered,
      count: filtered.length,
    },
  });
}

export const actionProposalsRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          includeCompleted: z.boolean().optional(),
          types: z.array(proposalTypeSchema).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      const conditions = [
        eq(actionProposals.workspaceId, workspaceId),
        eq(actionProposals.dismissed, false),
      ];

      if (input?.types?.length) {
        conditions.push(inArray(actionProposals.proposalType, input.types));
      }

      if (!input?.includeCompleted) {
        conditions.push(
          inArray(actionProposals.status, ['pending', 'approved']),
        );
      }

      return db.query.actionProposals.findMany({
        where: and(...conditions),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
      });
    }),

  dismiss: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      const proposal = await db.query.actionProposals.findFirst({
        where: and(
          eq(actionProposals.id, input.id),
          eq(actionProposals.workspaceId, workspaceId),
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal not found',
        });
      }

      if (proposal.status !== 'pending') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: `Only pending proposals can be dismissed (status: ${proposal.status}).`,
        });
      }

      await db
        .update(actionProposals)
        .set({ status: 'canceled', dismissed: true })
        .where(eq(actionProposals.id, proposal.id));

      return { success: true };
    }),

  markExecuted: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, {
          message: 'Invalid transaction hash.',
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      const proposal = await db.query.actionProposals.findFirst({
        where: and(
          eq(actionProposals.id, input.id),
          eq(actionProposals.workspaceId, workspaceId),
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal not found',
        });
      }

      if (proposal.status === 'executed') {
        return {
          success: true,
          status: 'executed' as const,
          txHash: proposal.txHash ?? input.txHash,
        };
      }

      if (proposal.status !== 'pending' && proposal.status !== 'approved') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: `Cannot mark proposal executed from status: ${proposal.status}.`,
        });
      }

      const txHash = input.txHash as Hex;

      let completion: ActionProposalCompletion;
      try {
        completion = await verifySafeExecution({ proposal, txHash });
      } catch (error) {
        await db
          .update(actionProposals)
          .set({ txHash: input.txHash })
          .where(eq(actionProposals.id, proposal.id));

        return {
          success: false,
          status: proposal.status,
          txHash: input.txHash,
          verified: false,
          reason: `Failed to verify execution: ${formatExecutionError(error)}`,
        };
      }

      if (completion.status === 'unverified') {
        await db
          .update(actionProposals)
          .set({ txHash: completion.txHash })
          .where(eq(actionProposals.id, proposal.id));

        return {
          success: false,
          status: proposal.status,
          txHash: completion.txHash,
          verified: false,
          pending: true,
          reason: completion.reason,
          ...(completion.userOpHash
            ? { userOpHash: completion.userOpHash }
            : null),
        };
      }

      if (completion.status === 'failed') {
        await db
          .update(actionProposals)
          .set({
            status: 'failed',
            txHash: completion.txHash,
            proposalMessage: completion.reason ?? proposal.proposalMessage,
          })
          .where(eq(actionProposals.id, proposal.id));

        await emitVaultActionCompleted({
          workspaceId,
          actor: ctx.userId ?? undefined,
          proposal,
          status: 'failed',
          txHash: completion.txHash,
          reason: completion.reason,
        });

        return {
          success: false,
          status: 'failed' as const,
          txHash: completion.txHash,
          reason: completion.reason,
          ...(completion.safeTxHash
            ? { safeTxHash: completion.safeTxHash }
            : null),
          ...(completion.userOpHash
            ? { userOpHash: completion.userOpHash }
            : null),
        };
      }

      await db
        .update(actionProposals)
        .set({
          status: 'executed',
          txHash: completion.txHash,
        })
        .where(eq(actionProposals.id, proposal.id));

      await emitVaultActionCompleted({
        workspaceId,
        actor: ctx.userId ?? undefined,
        proposal,
        status: 'executed',
        txHash: completion.txHash,
      });

      return {
        success: true,
        status: 'executed' as const,
        txHash: completion.txHash,
        ...(completion.safeTxHash
          ? { safeTxHash: completion.safeTxHash }
          : null),
        ...(completion.userOpHash
          ? { userOpHash: completion.userOpHash }
          : null),
      };
    }),

  markFailed: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        reason: z.string().optional(),
        txHash: z
          .string()
          .regex(/^0x[a-fA-F0-9]{64}$/, {
            message: 'Invalid transaction hash.',
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      const proposal = await db.query.actionProposals.findFirst({
        where: and(
          eq(actionProposals.id, input.id),
          eq(actionProposals.workspaceId, workspaceId),
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal not found',
        });
      }

      const txHash = proposal.txHash ?? input.txHash ?? null;

      await db
        .update(actionProposals)
        .set({
          status: 'failed',
          txHash,
          proposalMessage: input.reason ?? proposal.proposalMessage,
        })
        .where(eq(actionProposals.id, proposal.id));

      await emitVaultActionCompleted({
        workspaceId,
        actor: ctx.userId ?? undefined,
        proposal,
        status: 'failed',
        txHash: txHash ?? undefined,
        reason: input.reason,
      });

      return { success: true, status: 'failed' as const, txHash };
    }),
});
