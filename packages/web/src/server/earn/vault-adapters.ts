import { type Address, encodeFunctionData, parseUnits } from 'viem';
import { getRPCManager } from '@/lib/multi-chain-rpc';

export type VaultDirection = 'deposit' | 'withdraw';

export type VaultQuote = {
  direction: VaultDirection;
  amount: string;
  assetDecimals: number;
  shareDecimals: number;
  expectedShares?: string;
  expectedAssets?: string;
  minShares?: string;
  minAssets?: string;
  quoteSource: 'preview' | 'fallback';
};

export type VaultInstructions = {
  direction: VaultDirection;
  target: Address;
  data: `0x${string}`;
  value: string;
  approval?: {
    token: Address;
    spender: Address;
    amount: string;
    currentAllowance?: string;
  };
  receiver: Address;
  owner: Address;
};

export type VaultAdapterContext = {
  vaultAddress: Address;
  chainId: number;
  assetAddress: Address;
  assetDecimals: number;
};

const ERC4626_ABI = [
  {
    name: 'asset',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    name: 'previewDeposit',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'previewWithdraw',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'uint256' }, { type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'uint256' }, { type: 'address' }, { type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export async function getVaultShareDecimals(
  context: VaultAdapterContext,
): Promise<number> {
  const rpcManager = getRPCManager();
  const client = rpcManager.getClient(context.chainId as never);
  const decimals = await client.readContract({
    address: context.vaultAddress,
    abi: ERC4626_ABI,
    functionName: 'decimals',
  });
  return Number(decimals);
}

export async function getVaultQuote(
  context: VaultAdapterContext,
  params: {
    direction: VaultDirection;
    amount: string;
    slippageBps?: number;
  },
): Promise<VaultQuote> {
  const rpcManager = getRPCManager();
  const client = rpcManager.getClient(context.chainId as never);
  const amountBaseUnits = parseUnits(params.amount, context.assetDecimals);
  const shareDecimals = await getVaultShareDecimals(context);

  if (params.direction === 'deposit') {
    const shares = await client.readContract({
      address: context.vaultAddress,
      abi: ERC4626_ABI,
      functionName: 'previewDeposit',
      args: [amountBaseUnits],
    });

    const expectedShares = shares.toString();
    const slippageBps = params.slippageBps ?? 50;
    const minShares = (
      (shares * BigInt(10_000 - slippageBps)) /
      BigInt(10_000)
    ).toString();

    return {
      direction: 'deposit',
      amount: params.amount,
      assetDecimals: context.assetDecimals,
      shareDecimals,
      expectedShares,
      minShares,
      quoteSource: 'preview',
    };
  }

  const shares = await client.readContract({
    address: context.vaultAddress,
    abi: ERC4626_ABI,
    functionName: 'previewWithdraw',
    args: [amountBaseUnits],
  });

  const expectedAssets = amountBaseUnits.toString();
  const slippageBps = params.slippageBps ?? 50;
  const minAssets = (
    (amountBaseUnits * BigInt(10_000 - slippageBps)) /
    BigInt(10_000)
  ).toString();

  return {
    direction: 'withdraw',
    amount: params.amount,
    assetDecimals: context.assetDecimals,
    shareDecimals,
    expectedShares: shares.toString(),
    expectedAssets,
    minAssets,
    quoteSource: 'preview',
  };
}

export function buildVaultInstructions(
  context: VaultAdapterContext,
  params: {
    direction: VaultDirection;
    amount: string;
    receiver: Address;
    owner: Address;
  },
): VaultInstructions {
  const amountBaseUnits = parseUnits(params.amount, context.assetDecimals);

  if (params.direction === 'deposit') {
    return {
      direction: 'deposit',
      target: context.vaultAddress,
      data: encodeFunctionData({
        abi: ERC4626_ABI,
        functionName: 'deposit',
        args: [amountBaseUnits, params.receiver],
      }),
      value: '0',
      approval: {
        token: context.assetAddress,
        spender: context.vaultAddress,
        amount: amountBaseUnits.toString(),
      },
      receiver: params.receiver,
      owner: params.owner,
    };
  }

  return {
    direction: 'withdraw',
    target: context.vaultAddress,
    data: encodeFunctionData({
      abi: ERC4626_ABI,
      functionName: 'withdraw',
      args: [amountBaseUnits, params.receiver, params.owner],
    }),
    value: '0',
    receiver: params.receiver,
    owner: params.owner,
  };
}
