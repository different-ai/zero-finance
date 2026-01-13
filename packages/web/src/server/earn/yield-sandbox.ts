import { db } from '@/db';
import { sandboxFaucetEvents, type SandboxToken } from '@/db/schema';
import { ensureSandboxTokenSeeded } from './vault-registry';
import { createWalletClient, http, type Address, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base, arbitrum, gnosis, optimism, mainnet } from 'viem/chains';
import {
  getChainConfig,
  isSupportedChain,
  type SupportedChainId,
} from '@/lib/constants/chains';

const FAUCET_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'address' }, { type: 'uint256' }],
    outputs: [],
  },
] as const;

export class SandboxFaucetLimitError extends Error {
  retryAt: Date | null;
  scope: 'workspace' | 'address';

  constructor(
    message: string,
    params: { retryAt: Date | null; scope: 'workspace' | 'address' },
  ) {
    super(message);
    this.name = 'SandboxFaucetLimitError';
    this.retryAt = params.retryAt;
    this.scope = params.scope;
  }
}

function resolveViemChain(chainId: SupportedChainId) {
  switch (chainId) {
    case 1:
      return mainnet;
    case 10:
      return optimism;
    case 100:
      return gnosis;
    case 42161:
      return arbitrum;
    case 8453:
    default:
      return base;
  }
}

async function getDailyMintTotals(params: {
  workspaceId: string;
  tokenId: string;
  recipient: Address;
}) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const events = await db.query.sandboxFaucetEvents.findMany({
    where: (tbl, { and, eq: eqLocal, gte: gteLocal }) =>
      and(
        eqLocal(tbl.workspaceId, params.workspaceId),
        eqLocal(tbl.tokenId, params.tokenId),
        gteLocal(tbl.createdAt, since),
      ),
  });

  const workspaceTotal = events.reduce(
    (sum, event) => sum + BigInt(event.amount),
    0n,
  );

  const addressEvents = events.filter(
    (event) => event.recipientAddress === params.recipient,
  );

  const addressTotal = addressEvents.reduce(
    (sum, event) => sum + BigInt(event.amount),
    0n,
  );

  const workspaceRetryAt = events.length
    ? new Date(
        Math.min(...events.map((event) => event.createdAt.getTime())) +
          24 * 60 * 60 * 1000,
      )
    : null;

  const addressRetryAt = addressEvents.length
    ? new Date(
        Math.min(...addressEvents.map((event) => event.createdAt.getTime())) +
          24 * 60 * 60 * 1000,
      )
    : null;

  return {
    workspaceTotal,
    addressTotal,
    workspaceRetryAt,
    addressRetryAt,
  };
}

async function mintSandboxToken(params: {
  token: SandboxToken;
  recipient: Address;
  amount: string;
}) {
  const faucetPrivateKey = process.env.SANDBOX_FAUCET_PRIVATE_KEY as
    | Hex
    | undefined;
  const allowMock = process.env.SANDBOX_FAUCET_MOCK === 'true';

  if (!faucetPrivateKey) {
    if (!allowMock) {
      throw new Error('Sandbox faucet not configured');
    }
    return { txHash: null };
  }

  if (!isSupportedChain(params.token.chainId)) {
    throw new Error('Unsupported chain for sandbox faucet');
  }

  const chainConfig = getChainConfig(params.token.chainId);
  const account = privateKeyToAccount(faucetPrivateKey);
  const client = createWalletClient({
    account,
    chain: resolveViemChain(params.token.chainId),
    transport: http(
      chainConfig.rpcUrls.alchemy ?? chainConfig.rpcUrls.public[0],
    ),
  });

  const txHash = await client.writeContract({
    address: params.token.address as Address,
    abi: FAUCET_ABI,
    functionName: 'mint',
    args: [params.recipient, BigInt(params.amount)],
  });

  return { txHash };
}

export async function createSandboxFaucetMint(params: {
  workspaceId: string;
  recipient: Address;
  amount: string;
}) {
  const token = await ensureSandboxTokenSeeded();
  if (!token) {
    throw new Error('Sandbox token not configured');
  }

  if (!token.faucetEnabled) {
    throw new Error('Sandbox faucet disabled');
  }

  const maxDailyMint = token.maxDailyMint ? BigInt(token.maxDailyMint) : null;
  const { workspaceTotal, addressTotal, workspaceRetryAt, addressRetryAt } =
    await getDailyMintTotals({
      workspaceId: params.workspaceId,
      tokenId: token.id,
      recipient: params.recipient,
    });

  const mintAmount = BigInt(params.amount);
  if (maxDailyMint) {
    if (workspaceTotal + mintAmount > maxDailyMint) {
      throw new SandboxFaucetLimitError('Workspace faucet limit exceeded', {
        retryAt: workspaceRetryAt,
        scope: 'workspace',
      });
    }
    if (addressTotal + mintAmount > maxDailyMint) {
      throw new SandboxFaucetLimitError('Address faucet limit exceeded', {
        retryAt: addressRetryAt,
        scope: 'address',
      });
    }
  }

  const { txHash } = await mintSandboxToken({
    token,
    recipient: params.recipient,
    amount: params.amount,
  });

  await db.insert(sandboxFaucetEvents).values({
    workspaceId: params.workspaceId,
    tokenId: token.id,
    recipientAddress: params.recipient,
    amount: params.amount,
    txHash: txHash ?? null,
  });

  return {
    token: {
      id: token.id,
      symbol: token.symbol,
      address: token.address,
      chainId: token.chainId,
      decimals: token.decimals,
    },
    amount: params.amount,
    txHash,
  };
}
