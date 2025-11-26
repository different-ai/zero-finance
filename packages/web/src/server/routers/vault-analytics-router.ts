import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '../../db';
import { admins } from '../../db/schema';
import { eq } from 'drizzle-orm';
import {
  fetchVaultMetrics,
  fetchVaultHistoricalData,
  fetchComprehensiveVaultData,
  parseMorphoVaultUrl,
  CHAIN_NAMES,
  MORPHO_CHAIN_IDS,
} from '../earn/morpho-analytics-service';
import { BASE_USDC_VAULTS, ORIGIN_SUPER_OETH_VAULT } from '../earn/base-vaults';
import { ARBITRUM_USDC_VAULTS } from '../earn/arbitrum-vaults';

// Check admin status
async function checkIsUserAdmin(privyDid: string): Promise<boolean> {
  const normalizedId = privyDid.trim();
  try {
    const admin = await db.query.admins.findFirst({
      where: eq(admins.privyDid, normalizedId),
    });
    return !!admin;
  } catch {
    return false;
  }
}

async function requireAdmin(privyDid: string | null | undefined) {
  if (!privyDid) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }
  const isAdmin = await checkIsUserAdmin(privyDid);
  if (!isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
}

// Get all tracked vaults from codebase
function getTrackedVaults() {
  const vaults = [
    ...BASE_USDC_VAULTS.map((v) => ({
      ...v,
      source: 'base-vaults' as const,
    })),
    { ...ORIGIN_SUPER_OETH_VAULT, source: 'base-vaults' as const },
    ...ARBITRUM_USDC_VAULTS.map((v) => ({
      ...v,
      source: 'arbitrum-vaults' as const,
    })),
  ];

  return vaults;
}

export const vaultAnalyticsRouter = router({
  /**
   * Get all tracked vaults with current metrics
   */
  getTrackedVaults: protectedProcedure.query(async ({ ctx }) => {
    await requireAdmin(ctx.userId);

    const trackedVaults = getTrackedVaults();

    // Fetch live metrics for all vaults in parallel
    const vaultsWithMetrics = await Promise.all(
      trackedVaults.map(async (vault) => {
        const metrics = await fetchVaultMetrics(vault.address, vault.chainId);

        return {
          // Config from codebase
          id: vault.id,
          name: vault.name,
          displayName: vault.displayName,
          address: vault.address,
          chainId: vault.chainId,
          chainName: CHAIN_NAMES[vault.chainId] || 'Unknown',
          risk: vault.risk,
          curator: vault.curator,
          appUrl: vault.appUrl,
          source: vault.source,
          // Live metrics from Morpho API
          metrics: metrics
            ? {
                totalAssetsUsd: metrics.totalAssetsUsd,
                totalAssets: metrics.totalAssets,
                apy: metrics.apy,
                netApy: metrics.netApy,
                avgApy: metrics.avgApy,
                weeklyApy: metrics.weeklyApy,
                monthlyApy: metrics.monthlyApy,
                sharePrice: metrics.sharePrice,
                sharePriceUsd: metrics.sharePriceUsd,
                asset: metrics.asset,
                warnings: metrics.warnings,
              }
            : null,
        };
      }),
    );

    return {
      vaults: vaultsWithMetrics,
      chains: Object.entries(CHAIN_NAMES).map(([id, name]) => ({
        id: parseInt(id),
        name,
      })),
    };
  }),

  /**
   * Get detailed metrics for a single vault
   */
  getVaultDetails: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        chainId: z.number(),
        historicalDays: z.number().optional().default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      await requireAdmin(ctx.userId);

      const { metrics, historical, deployment } =
        await fetchComprehensiveVaultData(
          input.address,
          input.chainId,
          input.historicalDays,
        );

      if (!metrics) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vault not found or unable to fetch metrics',
        });
      }

      // Calculate APY stats from historical data
      let apyStats = null;
      if (historical?.apy && historical.apy.length > 0) {
        const apyValues = historical.apy.map((p) => p.value);
        apyStats = {
          current: metrics.apy,
          high: Math.max(...apyValues),
          low: Math.min(...apyValues),
          average: apyValues.reduce((a, b) => a + b, 0) / apyValues.length,
        };
      }

      return {
        metrics: {
          ...metrics,
          chainName: CHAIN_NAMES[input.chainId] || 'Unknown',
        },
        historical,
        deployment,
        apyStats,
      };
    }),

  /**
   * Get historical APY data for a vault
   */
  getVaultHistory: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        chainId: z.number(),
        days: z.number().min(1).max(365).default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      await requireAdmin(ctx.userId);

      const historical = await fetchVaultHistoricalData(
        input.address,
        input.chainId,
        input.days,
      );

      if (!historical) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Unable to fetch historical data',
        });
      }

      return historical;
    }),

  /**
   * Parse a Morpho vault URL and fetch its data
   * This is the "add vault by URL" feature
   */
  parseAndFetchVault: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await requireAdmin(ctx.userId);

      const parsed = parseMorphoVaultUrl(input.url);
      if (!parsed) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Invalid Morpho vault URL. Expected format: https://app.morpho.org/{chain}/vault/{address}',
        });
      }

      const { metrics, historical, deployment } =
        await fetchComprehensiveVaultData(
          parsed.vaultAddress,
          parsed.chainId,
          30,
        );

      if (!metrics) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vault not found on Morpho',
        });
      }

      // Check if this vault is already tracked
      const trackedVaults = getTrackedVaults();
      const isTracked = trackedVaults.some(
        (v) =>
          v.address.toLowerCase() === parsed.vaultAddress.toLowerCase() &&
          v.chainId === parsed.chainId,
      );

      // Calculate APY stats
      let apyStats = null;
      if (historical?.apy && historical.apy.length > 0) {
        const apyValues = historical.apy.map((p) => p.value);
        apyStats = {
          current: metrics.apy,
          high: Math.max(...apyValues),
          low: Math.min(...apyValues),
          average: apyValues.reduce((a, b) => a + b, 0) / apyValues.length,
        };
      }

      return {
        parsed: {
          ...parsed,
          chainName: CHAIN_NAMES[parsed.chainId] || 'Unknown',
        },
        metrics: {
          ...metrics,
          chainName: CHAIN_NAMES[parsed.chainId] || 'Unknown',
        },
        historical,
        deployment,
        apyStats,
        isTracked,
      };
    }),

  /**
   * Get vault comparison data
   * Fetches metrics for multiple vaults to compare
   */
  compareVaults: protectedProcedure
    .input(
      z.object({
        vaults: z.array(
          z.object({
            address: z.string(),
            chainId: z.number(),
          }),
        ),
      }),
    )
    .query(async ({ ctx, input }) => {
      await requireAdmin(ctx.userId);

      const results = await Promise.all(
        input.vaults.map(async (vault) => {
          const [metrics, historical] = await Promise.all([
            fetchVaultMetrics(vault.address, vault.chainId),
            fetchVaultHistoricalData(vault.address, vault.chainId, 30),
          ]);

          let apyStats = null;
          if (historical?.apy && historical.apy.length > 0) {
            const apyValues = historical.apy.map((p) => p.value);
            apyStats = {
              high: Math.max(...apyValues),
              low: Math.min(...apyValues),
              average: apyValues.reduce((a, b) => a + b, 0) / apyValues.length,
            };
          }

          return {
            address: vault.address,
            chainId: vault.chainId,
            chainName: CHAIN_NAMES[vault.chainId] || 'Unknown',
            metrics,
            apyStats,
          };
        }),
      );

      return {
        vaults: results.filter((r) => r.metrics !== null),
      };
    }),

  /**
   * Get supported chains
   */
  getSupportedChains: protectedProcedure.query(async ({ ctx }) => {
    await requireAdmin(ctx.userId);

    return Object.entries(MORPHO_CHAIN_IDS).map(([name, id]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      id,
    }));
  }),
});
