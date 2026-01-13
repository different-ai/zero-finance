import { db } from '@/db';
import {
  sandboxTokens,
  vaultAssets,
  vaultInsurance,
  vaults,
  type Vault,
  type VaultAsset,
  type VaultInsurance,
} from '@/db/schema';
import { TRACKED_VAULTS } from './tracked-vaults-config';
import { ALL_CROSS_CHAIN_VAULTS } from './cross-chain-vaults';
import {
  SUPPORTED_CHAINS,
  getUSDCAddress,
  isSupportedChain,
} from '@/lib/constants/chains';
import { type Address } from 'viem';

const NATIVE_ASSET_PLACEHOLDER: Address =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

const SANDBOX_CHAIN_ID = Number(
  process.env.SANDBOX_CHAIN_ID ?? SUPPORTED_CHAINS.BASE,
);
const SANDBOX_TOKEN_ADDRESS = (process.env.SANDBOX_TOKEN_ADDRESS ||
  NATIVE_ASSET_PLACEHOLDER) as Address;
const SANDBOX_VAULT_ADDRESS = (process.env.SANDBOX_VAULT_ADDRESS ||
  NATIVE_ASSET_PLACEHOLDER) as Address;

if (!process.env.SANDBOX_TOKEN_ADDRESS || !process.env.SANDBOX_VAULT_ADDRESS) {
  console.warn(
    '[vault-registry] Sandbox vault/token addresses not set; using placeholders.',
  );
}

export type VaultRegistryRecord = Vault & {
  asset?: VaultAsset | null;
  insurance?: VaultInsurance | null;
};

export type VaultRegistryFilters = {
  chainId?: number;
  insured?: boolean;
  status?: 'active' | 'inactive';
  sandboxOnly?: boolean;
};

const SANDBOX_VAULTS: Array<{
  id: string;
  name: string;
  displayName: string;
  address: Address;
  chainId: number;
  risk: Vault['riskTier'];
  curator: string;
  appUrl: string;
  protocol: string;
  asset: {
    symbol: string;
    decimals: number;
    address: Address;
  };
}> = [
  {
    id: 'sandbox-zusdc-vault',
    name: 'Sandbox zUSDC Vault',
    displayName: 'Sandbox Yield (Test)',
    address: SANDBOX_VAULT_ADDRESS,
    chainId: SANDBOX_CHAIN_ID,
    risk: 'Conservative',
    curator: '0 Finance',
    appUrl: 'https://www.0.finance/sandbox',
    protocol: 'sandbox-erc4626',
    asset: {
      symbol: 'zUSDC',
      decimals: 6,
      address: SANDBOX_TOKEN_ADDRESS,
    },
  },
];

function resolveAssetAddress(
  chainId: number,
  asset?: { address?: Address; symbol?: string; isNative?: boolean },
): Address {
  if (asset?.address) return asset.address;
  if (asset?.isNative) return NATIVE_ASSET_PLACEHOLDER;
  if (
    asset?.symbol?.toUpperCase().includes('USDC') &&
    isSupportedChain(chainId)
  ) {
    return getUSDCAddress(chainId);
  }
  return NATIVE_ASSET_PLACEHOLDER;
}

async function seedAsset(asset: {
  address: Address;
  chainId: number;
  symbol: string;
  decimals: number;
  name?: string;
}) {
  await db
    .insert(vaultAssets)
    .values({
      address: asset.address,
      chainId: asset.chainId,
      symbol: asset.symbol,
      decimals: asset.decimals,
      name: asset.name ?? null,
    })
    .onConflictDoNothing();

  const record = await db.query.vaultAssets.findFirst({
    where: (tbl, { and, eq: eqLocal }) =>
      and(
        eqLocal(tbl.chainId, asset.chainId),
        eqLocal(tbl.address, asset.address),
      ),
  });

  if (!record) {
    throw new Error('Failed to seed vault asset');
  }

  return record;
}

async function seedVault(vault: {
  id: string;
  name: string;
  displayName: string;
  address: Address;
  chainId: number;
  protocol: string;
  riskTier: Vault['riskTier'];
  curator: string;
  appUrl: string;
  isInsured: boolean;
  isPrimary: boolean;
  sandboxOnly: boolean;
  notes?: string;
  asset: VaultAsset;
  insurance?: {
    provider: string;
    coverageUsd?: string;
    coverageCurrency?: string;
  };
}) {
  await db
    .insert(vaults)
    .values({
      id: vault.id,
      name: vault.name,
      displayName: vault.displayName,
      address: vault.address,
      chainId: vault.chainId,
      assetId: vault.asset.id,
      protocol: vault.protocol,
      riskTier: vault.riskTier,
      curator: vault.curator,
      appUrl: vault.appUrl,
      isInsured: vault.isInsured,
      isPrimary: vault.isPrimary,
      status: 'active',
      sandboxOnly: vault.sandboxOnly,
      notes: vault.notes ?? null,
    })
    .onConflictDoNothing();

  if (vault.insurance) {
    await db
      .insert(vaultInsurance)
      .values({
        vaultId: vault.id,
        provider: vault.insurance.provider,
        coverageUsd: vault.insurance.coverageUsd ?? null,
        coverageCurrency: vault.insurance.coverageCurrency ?? 'USD',
      })
      .onConflictDoNothing();
  }
}

async function seedSandboxVaults() {
  for (const sandboxVault of SANDBOX_VAULTS) {
    const asset = await seedAsset({
      address: sandboxVault.asset.address,
      chainId: sandboxVault.chainId,
      symbol: sandboxVault.asset.symbol,
      decimals: sandboxVault.asset.decimals,
    });

    await seedVault({
      id: sandboxVault.id,
      name: sandboxVault.name,
      displayName: sandboxVault.displayName,
      address: sandboxVault.address,
      chainId: sandboxVault.chainId,
      protocol: sandboxVault.protocol,
      riskTier: sandboxVault.risk,
      curator: sandboxVault.curator,
      appUrl: sandboxVault.appUrl,
      isInsured: false,
      isPrimary: false,
      sandboxOnly: true,
      asset,
    });
  }
}

async function seedTrackedVaults() {
  for (const tracked of TRACKED_VAULTS) {
    const crossChainVault = ALL_CROSS_CHAIN_VAULTS.find(
      (entry) =>
        entry.address.toLowerCase() === tracked.address.toLowerCase() &&
        entry.chainId === tracked.chainId,
    );

    const assetAddress = resolveAssetAddress(
      tracked.chainId,
      crossChainVault?.asset,
    );
    const assetSymbol = crossChainVault?.asset?.symbol ?? 'USDC';
    const assetDecimals = crossChainVault?.asset?.decimals ?? 6;

    const asset = await seedAsset({
      address: assetAddress,
      chainId: tracked.chainId,
      symbol: assetSymbol,
      decimals: assetDecimals,
    });

    await seedVault({
      id: tracked.id,
      name: tracked.name,
      displayName: tracked.displayName,
      address: tracked.address,
      chainId: tracked.chainId,
      protocol: 'morpho-erc4626',
      riskTier: tracked.risk,
      curator: tracked.curator,
      appUrl: tracked.appUrl,
      isInsured: tracked.isInsured,
      isPrimary: tracked.isPrimary ?? false,
      sandboxOnly: false,
      notes: tracked.notes,
      asset,
      insurance: tracked.isInsured
        ? {
            provider: tracked.insuranceCoverage?.provider ?? 'Unknown',
            coverageUsd: tracked.insuranceCoverage?.amount,
            coverageCurrency: tracked.insuranceCoverage?.currency ?? 'USD',
          }
        : undefined,
    });
  }
}

export async function ensureVaultRegistrySeeded() {
  const existing = await db.query.vaults.findFirst({
    where: (tbl, { eq }) => eq(tbl.status, 'active'),
  });

  if (existing) return;

  await seedTrackedVaults();
  await seedSandboxVaults();
  await ensureSandboxTokenSeeded();
}

export async function listVaults(filters: VaultRegistryFilters = {}) {
  await ensureVaultRegistrySeeded();

  return db.query.vaults.findMany({
    where: (tbl, { and, eq: eqLocal }) => {
      const conditions = [] as ReturnType<typeof eqLocal>[];
      if (filters.chainId !== undefined) {
        conditions.push(eqLocal(tbl.chainId, filters.chainId));
      }
      if (filters.insured !== undefined) {
        conditions.push(eqLocal(tbl.isInsured, filters.insured));
      }
      if (filters.status) {
        conditions.push(eqLocal(tbl.status, filters.status));
      }
      if (filters.sandboxOnly !== undefined) {
        conditions.push(eqLocal(tbl.sandboxOnly, filters.sandboxOnly));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    with: {
      asset: true,
      insurance: true,
    },
  });
}

export async function getVaultById(vaultId: string) {
  await ensureVaultRegistrySeeded();

  return db.query.vaults.findFirst({
    where: (tbl, { eq }) => eq(tbl.id, vaultId),
    with: {
      asset: true,
      insurance: true,
    },
  });
}

export async function getVaultByAddress(address: Address, chainId: number) {
  await ensureVaultRegistrySeeded();

  return db.query.vaults.findFirst({
    where: (tbl, { and, eq }) =>
      and(eq(tbl.chainId, chainId), eq(tbl.address, address)),
    with: {
      asset: true,
      insurance: true,
    },
  });
}

export async function getSandboxToken() {
  await ensureVaultRegistrySeeded();
  return ensureSandboxTokenSeeded();
}

export async function ensureSandboxTokenSeeded() {
  const existing = await db.query.sandboxTokens.findFirst({
    where: (tbl, { eq: eqLocal }) =>
      eqLocal(tbl.address, SANDBOX_TOKEN_ADDRESS),
  });

  if (existing) return existing;

  await db
    .insert(sandboxTokens)
    .values({
      symbol: 'zUSDC',
      name: 'Zero Finance Sandbox USDC',
      address: SANDBOX_TOKEN_ADDRESS,
      chainId: SANDBOX_CHAIN_ID,
      decimals: 6,
      faucetEnabled: true,
      maxDailyMint: '100000000000',
    })
    .onConflictDoNothing();

  return db.query.sandboxTokens.findFirst({
    where: (tbl, { eq: eqLocal }) =>
      eqLocal(tbl.address, SANDBOX_TOKEN_ADDRESS),
  });
}
