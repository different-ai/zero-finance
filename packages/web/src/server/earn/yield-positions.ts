import { listVaults } from './vault-registry';
import { getRPCManager } from '@/lib/multi-chain-rpc';
import { isSupportedChain } from '@/lib/constants/chains';
import { type Address } from 'viem';

const NATIVE_ASSET_PLACEHOLDER =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as const;

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

const ERC4626_ABI = [
  {
    name: 'convertToAssets',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export type VaultPosition = {
  vaultId: string;
  vaultAddress: Address;
  chainId: number;
  ownerAddress: Address;
  shareBalance: string;
  assetBalance: string;
  assetSymbol: string;
  assetDecimals: number;
};

export async function getVaultPositions(params: { ownerAddresses: Address[] }) {
  const vaults = await listVaults({ status: 'active' });
  const rpcManager = getRPCManager();
  const positions: VaultPosition[] = [];

  for (const vault of vaults) {
    if (!vault.asset) continue;
    if (!isSupportedChain(vault.chainId)) continue;
    if (vault.address === NATIVE_ASSET_PLACEHOLDER) continue;

    const client = rpcManager.getClient(vault.chainId as never);

    for (const ownerAddress of params.ownerAddresses) {
      const shareBalance = await client.readContract({
        address: vault.address as Address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [ownerAddress],
      });

      if (shareBalance === 0n) {
        continue;
      }

      const assetBalance = await client.readContract({
        address: vault.address as Address,
        abi: ERC4626_ABI,
        functionName: 'convertToAssets',
        args: [shareBalance],
      });

      positions.push({
        vaultId: vault.id,
        vaultAddress: vault.address as Address,
        chainId: vault.chainId,
        ownerAddress,
        shareBalance: shareBalance.toString(),
        assetBalance: assetBalance.toString(),
        assetSymbol: vault.asset.symbol,
        assetDecimals: vault.asset.decimals,
      });
    }
  }

  return positions;
}
