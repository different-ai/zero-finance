import { INSURED_VAULT_IDS } from '../demo-data';

export type VaultStat = {
  vaultAddress: string;
  yield?: number | bigint | null;
  principal?: bigint | null;
  principalRecorded?: bigint | null;
  yieldRecorded?: bigint | null;
  yieldCorrectionApplied?: 'ledger_shortfall' | 'rounding' | null;
  monthlyNetApy?: number | string | null;
  monthlyApy?: number | string | null;
  netApy?: number | string | null;
  apy?: number | string | null;
};

export type UserPosition = {
  vaultAddress: string;
  assetsUsd?: number | string | null;
};

export type BaseVault = {
  id: string;
  name: string;
  displayName?: string;
  risk: string;
  curator: string;
  address: string;
  appUrl?: string;
};

export type VaultViewModel = {
  id: string;
  name: string;
  displayName?: string;
  risk: string;
  curator: string;
  address: string;
  appUrl?: string;
  apy: number;
  balanceUsd: number;
  earnedUsd: number;
  principalUsd: number;
  recordedPrincipalUsd: number;
  rawEarnedUsd: number | null;
  yieldCorrectionReason: 'ledger_shortfall' | 'rounding' | null;
  isAuto: boolean;
  instantApy: number;
  isInsured: boolean;
  isContactOnly: boolean;
};

export function toNumberOrFallback(
  value: number | string | null | undefined,
  fallback: number,
): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function calculateVaultViewModels(
  baseVaults: BaseVault[],
  vaultStatsMany: VaultStat[] | undefined,
  userPositions: UserPosition[] | undefined,
  userIsInsured: boolean = false,
): VaultViewModel[] {
  return baseVaults.map((v) => {
    const stat = vaultStatsMany?.find(
      (s) => s.vaultAddress.toLowerCase() === v.address.toLowerCase(),
    );
    const pos = userPositions?.find(
      (p) => p.vaultAddress.toLowerCase() === v.address.toLowerCase(),
    );

    const balanceUsd = pos?.assetsUsd ? Number(pos.assetsUsd) : 0;

    const extendedStat =
      stat && typeof stat === 'object' && 'principal' in stat
        ? (stat as {
            principal: bigint;
            principalRecorded?: bigint | null;
            yieldRecorded?: bigint | null;
            yieldCorrectionApplied?: 'ledger_shortfall' | 'rounding' | null;
          })
        : null;

    const principalUsd = extendedStat
      ? Number(extendedStat.principal) / 1e6
      : balanceUsd;

    const recordedPrincipalUsd =
      extendedStat?.principalRecorded !== undefined &&
      extendedStat?.principalRecorded !== null
        ? Number(extendedStat.principalRecorded) / 1e6
        : principalUsd;

    const statWithApyFields = stat as
      | {
          monthlyNetApy?: number | string | null;
          monthlyApy?: number | string | null;
          netApy?: number | string | null;
          apy?: number | string | null;
        }
      | undefined;

    const displayApySource = toNumberOrFallback(
      statWithApyFields?.monthlyNetApy,
      toNumberOrFallback(
        statWithApyFields?.monthlyApy,
        toNumberOrFallback(
          statWithApyFields?.netApy,
          toNumberOrFallback(statWithApyFields?.apy, 0.08),
        ),
      ),
    );

    const netApySource = toNumberOrFallback(
      statWithApyFields?.netApy,
      toNumberOrFallback(statWithApyFields?.apy, displayApySource),
    );

    const apyDecimal =
      displayApySource > 1 ? displayApySource / 100 : displayApySource;
    const apy = apyDecimal * 100;
    const instantApy = netApySource > 1 ? netApySource / 100 : netApySource;

    const rawEarnedUsd =
      extendedStat?.yieldRecorded !== undefined &&
      extendedStat?.yieldRecorded !== null
        ? Number(extendedStat.yieldRecorded) / 1e6
        : null;

    const correctionReason = extendedStat?.yieldCorrectionApplied ?? null;

    const ledgerEarnedUsd =
      stat?.yield !== undefined && stat?.yield !== null
        ? Number(stat.yield) / 1e6
        : null;

    const fallbackEarnedUsd = balanceUsd - principalUsd;

    let earnedUsd = 0;

    if (
      ledgerEarnedUsd !== null &&
      Number.isFinite(ledgerEarnedUsd) &&
      ledgerEarnedUsd >= 0
    ) {
      earnedUsd = ledgerEarnedUsd;
    } else if (fallbackEarnedUsd > 0 && principalUsd > 0) {
      earnedUsd = fallbackEarnedUsd;
    } else if (balanceUsd > 0 && apy > 0) {
      earnedUsd = ((balanceUsd * (apy / 100)) / 365) * 14;
    }

    if (earnedUsd < 0) {
      earnedUsd = 0;
    }

    return {
      id: v.id,
      name: v.name,
      displayName: v.displayName,
      risk: v.risk,
      curator: v.curator,
      address: v.address,
      appUrl: v.appUrl,
      apy,
      balanceUsd,
      earnedUsd,
      principalUsd,
      recordedPrincipalUsd,
      rawEarnedUsd,
      yieldCorrectionReason: correctionReason,
      isAuto: v.id === 'morphoGauntlet',
      instantApy,
      isInsured:
        INSURED_VAULT_IDS.has(v.id) ||
        (userIsInsured && v.id === 'morphoGauntlet'),
      isContactOnly: false,
    };
  });
}

export function calculateTotalSaved(vaults: VaultViewModel[]): number {
  return vaults.reduce((sum, v) => sum + v.balanceUsd, 0);
}

export function calculateTotalEarned(vaults: VaultViewModel[]): number {
  return vaults.reduce((sum, v) => sum + v.earnedUsd, 0);
}

export function calculateAverageApy(vaults: VaultViewModel[]): number {
  if (vaults.length === 0) return 8.0;
  return vaults.reduce((sum, v) => sum + v.apy, 0) / vaults.length;
}

export function calculateWeightedInstantApy(
  vaults: VaultViewModel[],
  totalSaved: number,
): number {
  if (totalSaved > 0) {
    const weightedSum = vaults.reduce(
      (sum, v) => sum + v.instantApy * v.balanceUsd,
      0,
    );
    return weightedSum / totalSaved;
  }

  if (vaults.length > 0) {
    return vaults.reduce((sum, v) => sum + v.instantApy, 0) / vaults.length;
  }

  return 0.08;
}
