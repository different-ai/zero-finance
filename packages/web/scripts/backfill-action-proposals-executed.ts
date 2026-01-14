import { db } from '@/db';
import { actionProposals } from '@/db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';
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

type VaultPayload = Record<string, unknown>;

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

function isHexHash(value: string): value is Hex {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

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

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const get = (flag: string): string | null => {
    const index = args.indexOf(flag);
    if (index === -1) return null;
    return args[index + 1] ?? null;
  };

  const limitRaw = get('--limit');
  const limit = limitRaw ? Number(limitRaw) : 500;
  const workspaceId = get('--workspace-id');

  return {
    dryRun,
    limit: Number.isFinite(limit) ? limit : 500,
    workspaceId,
  };
}

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return (error as { shortMessage?: string }).shortMessage ?? error.message;
  }

  return String(error);
}

async function main() {
  const { dryRun, limit, workspaceId } = parseArgs(process.argv);

  console.log('[backfill] Starting action_proposals execution verification', {
    dryRun,
    limit,
    workspaceId: workspaceId ?? null,
  });

  const conditions = [
    eq(actionProposals.status, 'executed'),
    isNotNull(actionProposals.txHash),
  ];

  if (workspaceId) {
    conditions.push(eq(actionProposals.workspaceId, workspaceId));
  }

  const proposals = await db.query.actionProposals.findMany({
    where: and(...conditions),
    limit,
    orderBy: (table, { desc }) => [desc(table.updatedAt)],
  });

  console.log(`[backfill] Loaded ${proposals.length} executed proposals`);

  const rpcManager = getRPCManager();

  let checked = 0;
  let reclassified = 0;
  let skipped = 0;

  for (const proposal of proposals) {
    checked += 1;

    const storedHash = proposal.txHash;
    if (!storedHash || !isHexHash(storedHash)) {
      skipped += 1;
      console.warn('[backfill] Skipping proposal with invalid txHash', {
        proposalId: proposal.id,
        txHash: storedHash,
      });
      continue;
    }

    const chainId = resolvePayloadChainId(proposal.payload as VaultPayload);
    const publicClient = rpcManager.getClient(chainId);

    let receipt: TransactionReceipt;
    try {
      receipt = await publicClient.getTransactionReceipt({
        hash: storedHash,
      });
    } catch (error) {
      skipped += 1;
      console.warn('[backfill] Receipt not found', {
        proposalId: proposal.id,
        chainId,
        txHash: storedHash,
        error: formatErrorMessage(error),
      });
      continue;
    }

    if (receipt.status !== 'success') {
      const reason = `Transaction ${storedHash} reverted on-chain.`;
      console.warn('[backfill] Reclassifying reverted transaction', {
        proposalId: proposal.id,
        chainId,
        txHash: storedHash,
        blockNumber: receipt.blockNumber?.toString(),
      });

      if (!dryRun) {
        const updatedMessage = proposal.proposalMessage
          ? `${proposal.proposalMessage}\n\nExecution failed: ${reason}`
          : reason;

        await db
          .update(actionProposals)
          .set({
            status: 'failed',
            proposalMessage: updatedMessage,
          })
          .where(eq(actionProposals.id, proposal.id));
      }

      reclassified += 1;
      continue;
    }

    const safeExecution = findSafeExecutionEvent(receipt);
    if (!safeExecution) {
      skipped += 1;
      console.warn('[backfill] Missing Safe execution logs', {
        proposalId: proposal.id,
        chainId,
        txHash: storedHash,
      });
      continue;
    }

    if (safeExecution.status === 'success') {
      continue;
    }

    const reason = `Safe execution failed (ExecutionFailure). safeTxHash: ${safeExecution.safeTxHash}`;
    console.warn('[backfill] Reclassifying safe ExecutionFailure', {
      proposalId: proposal.id,
      chainId,
      txHash: storedHash,
      safeAddress: safeExecution.safeAddress,
      safeTxHash: safeExecution.safeTxHash,
    });

    if (!dryRun) {
      const updatedMessage = proposal.proposalMessage
        ? `${proposal.proposalMessage}\n\nExecution failed: ${reason}`
        : reason;

      await db
        .update(actionProposals)
        .set({
          status: 'failed',
          proposalMessage: updatedMessage,
        })
        .where(eq(actionProposals.id, proposal.id));
    }

    reclassified += 1;
  }

  console.log('[backfill] Completed', { checked, reclassified, skipped });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[backfill] Failed', error);
    process.exit(1);
  });
