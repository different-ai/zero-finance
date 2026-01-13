import {
  getVaultById,
  listVaults,
  type VaultRegistryRecord,
} from './vault-registry';
import {
  getWorkspaceYieldPolicy,
  isVaultActionable,
} from '../services/yield-policy';
import {
  buildVaultInstructions,
  getVaultQuote,
  type VaultDirection,
} from './vault-adapters';
import { getRPCManager } from '@/lib/multi-chain-rpc';
import { type Address } from 'viem';

const ERC20_ALLOWANCE_ABI = [
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address' }, { type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export type VaultActionability = {
  actionable: boolean;
  reason?: string;
};

export type VaultPolicyErrorDetails = {
  reason?: string;
  insurance_status: string;
  has_completed_kyc: boolean;
  sandbox_enabled: boolean;
  sandbox_only: boolean;
  insured: boolean;
  required_insurance_status: string;
};

export type VaultResponse = VaultRegistryRecord & {
  actionability: VaultActionability;
};

function toActionability(
  vault: VaultRegistryRecord,
  policy: Awaited<ReturnType<typeof getWorkspaceYieldPolicy>>,
): VaultActionability {
  const result = isVaultActionable(
    { isInsured: vault.isInsured, sandboxOnly: vault.sandboxOnly },
    policy,
  );
  return {
    actionable: result.allowed,
    reason: result.reason,
  };
}

export function buildVaultPolicyErrorDetails(
  policy: Awaited<ReturnType<typeof getWorkspaceYieldPolicy>>,
  vault: Pick<VaultRegistryRecord, 'sandboxOnly' | 'isInsured'>,
  reason?: string,
): VaultPolicyErrorDetails {
  return {
    reason,
    insurance_status: policy.insuranceStatus,
    has_completed_kyc: policy.hasCompletedKyc,
    sandbox_enabled: policy.canUseSandbox,
    sandbox_only: vault.sandboxOnly,
    insured: vault.isInsured,
    required_insurance_status: vault.sandboxOnly
      ? 'sandbox'
      : vault.isInsured
        ? 'active'
        : 'pending_or_active',
  };
}

export async function listVaultsForWorkspace(
  workspaceId: string,
  filters?: Parameters<typeof listVaults>[0],
): Promise<VaultResponse[]> {
  const policy = await getWorkspaceYieldPolicy(workspaceId);
  const vaults = await listVaults(filters ?? {});
  return vaults.map((vault) => ({
    ...vault,
    actionability: toActionability(vault, policy),
  }));
}

export async function getVaultForWorkspace(
  workspaceId: string,
  vaultId: string,
): Promise<VaultResponse | null> {
  const policy = await getWorkspaceYieldPolicy(workspaceId);
  const vault = await getVaultById(vaultId);
  if (!vault) return null;
  return {
    ...vault,
    actionability: toActionability(vault, policy),
  };
}

export async function getVaultSuggestions(
  workspaceId: string,
  limit = 3,
): Promise<
  Array<{
    id: string;
    displayName: string;
    chainId: number;
    insured: boolean;
    sandboxOnly: boolean;
  }>
> {
  const vaults = await listVaultsForWorkspace(workspaceId, {
    status: 'active',
  });

  return vaults.slice(0, limit).map((vault) => ({
    id: vault.id,
    displayName: vault.displayName ?? vault.name,
    chainId: vault.chainId,
    insured: vault.isInsured,
    sandboxOnly: vault.sandboxOnly,
  }));
}

export async function getVaultQuoteForWorkspace(params: {
  workspaceId: string;
  vaultId: string;
  amount: string;
  direction: VaultDirection;
  slippageBps?: number;
}) {
  const vault = await getVaultById(params.vaultId);
  if (!vault || !vault.asset) {
    throw new Error('Vault not found');
  }

  if (vault.sandboxOnly) {
    return {
      direction: params.direction,
      amount: params.amount,
      assetDecimals: vault.asset.decimals,
      shareDecimals: vault.asset.decimals,
      expectedShares:
        params.direction === 'deposit' ? params.amount : undefined,
      expectedAssets:
        params.direction === 'withdraw' ? params.amount : undefined,
      minShares: params.direction === 'deposit' ? params.amount : undefined,
      minAssets: params.direction === 'withdraw' ? params.amount : undefined,
      quoteSource: 'fallback' as const,
    };
  }

  try {
    return await getVaultQuote(
      {
        vaultAddress: vault.address as Address,
        chainId: vault.chainId,
        assetAddress: vault.asset.address as Address,
        assetDecimals: vault.asset.decimals,
      },
      {
        direction: params.direction,
        amount: params.amount,
        slippageBps: params.slippageBps,
      },
    );
  } catch (error) {
    return {
      direction: params.direction,
      amount: params.amount,
      assetDecimals: vault.asset.decimals,
      shareDecimals: vault.asset.decimals,
      expectedShares:
        params.direction === 'deposit' ? params.amount : undefined,
      expectedAssets:
        params.direction === 'withdraw' ? params.amount : undefined,
      minShares: params.direction === 'deposit' ? params.amount : undefined,
      minAssets: params.direction === 'withdraw' ? params.amount : undefined,
      quoteSource: 'fallback' as const,
    };
  }
}

export async function getVaultInstructionsForWorkspace(params: {
  workspaceId: string;
  vaultId: string;
  amount: string;
  direction: VaultDirection;
  receiver: Address;
  owner: Address;
}) {
  const policy = await getWorkspaceYieldPolicy(params.workspaceId);
  const vault = await getVaultById(params.vaultId);

  if (!vault || !vault.asset) {
    throw new Error('Vault not found');
  }

  const actionability = isVaultActionable(
    { isInsured: vault.isInsured, sandboxOnly: vault.sandboxOnly },
    policy,
  );

  if (!actionability.allowed) {
    throw new Error(actionability.reason ?? 'Vault action not allowed');
  }

  const instructions = buildVaultInstructions(
    {
      vaultAddress: vault.address as Address,
      chainId: vault.chainId,
      assetAddress: vault.asset.address as Address,
      assetDecimals: vault.asset.decimals,
    },
    {
      direction: params.direction,
      amount: params.amount,
      receiver: params.receiver,
      owner: params.owner,
    },
  );

  if (instructions.approval) {
    const rpcManager = getRPCManager();
    const client = rpcManager.getClient(vault.chainId as never);
    const allowance = await client.readContract({
      address: instructions.approval.token,
      abi: ERC20_ALLOWANCE_ABI,
      functionName: 'allowance',
      args: [params.owner, instructions.approval.spender],
    });
    instructions.approval.currentAllowance = allowance.toString();
  }

  return instructions;
}

export async function validateVaultChain(vaultId: string) {
  const vault = await getVaultById(vaultId);
  if (!vault) throw new Error('Vault not found');
  const rpcManager = getRPCManager();
  await rpcManager.getBlockNumber(vault.chainId as never);
  return vault.chainId;
}
