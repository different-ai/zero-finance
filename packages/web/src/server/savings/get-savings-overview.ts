import { appRouter } from '@/server/routers/_app';
import { db } from '@/db';
import { ensureUserWorkspace } from '@/server/utils/workspace';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';
import { USDC_ADDRESS } from '@/lib/constants';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import type { DehydratedState } from '@tanstack/react-query';
import type { SavingsExperienceMode } from '@/hooks/use-demo-savings';
import type { RouterOutputs } from '@/utils/trpc';

const log = {
  info: (payload: any, message: string) =>
    console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
  error: (payload: any, message: string) =>
    console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
  warn: (payload: any, message: string) =>
    console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
};

export type SavingsOverviewPayload = {
  safeAddress: string | null;
  checkingBalance: RouterOutputs['safe']['getBalance'] | null;
  dehydratedState: DehydratedState;
};

export async function getSavingsOverview({
  userId,
  mode,
}: {
  userId: string;
  mode: SavingsExperienceMode;
}): Promise<SavingsOverviewPayload> {
  const { workspaceId } = await ensureUserWorkspace(db, userId);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      userId,
      db,
      log,
      workspaceId,
    },
    transformer: superjson,
  });

  if (mode === 'demo') {
    await helpers.settings.userSafes.list.prefetch();
    await helpers.user.getProfile.prefetch();

    return {
      safeAddress: null,
      checkingBalance: null,
      dehydratedState: helpers.dehydrate(),
    };
  }

  const primarySafe = await helpers.user.getPrimarySafeAddress.fetch();
  const safeAddress = primarySafe?.primarySafeAddress ?? null;

  await helpers.settings.userSafes.list.prefetch();

  let checkingBalance: RouterOutputs['safe']['getBalance'] | null = null;

  if (safeAddress) {
    const baseVaultAddresses = BASE_USDC_VAULTS.map((vault) => vault.address);

    try {
      const balancePromise = helpers.safe.getBalance.fetch({
        safeAddress,
        tokenAddress: USDC_ADDRESS,
      });

      await Promise.all([
        helpers.user.getProfile.prefetch(),
        helpers.earn.getEarnModuleOnChainInitializationStatus.prefetch({
          safeAddress,
        }),
        helpers.earn.stats.prefetch({ safeAddress }),
        helpers.earn.statsByVault.prefetch({
          safeAddress,
          vaultAddresses: baseVaultAddresses,
        }),
        helpers.earn.userPositions.prefetch({
          vaultAddresses: baseVaultAddresses,
        }),
        helpers.earn.getAutoEarnConfig.prefetch({ safeAddress }),
        helpers.earn.getState.prefetch({ safeAddress }),
        helpers.earn.getRecentEarnDeposits.prefetch({
          safeAddress,
          limit: 5,
        }),
      ]);

      checkingBalance = await balancePromise;
    } catch (error) {
      log.error({ error, safeAddress }, 'Failed to prefetch savings queries');
    }
  } else {
    await helpers.user.getProfile.prefetch();
  }

  return {
    safeAddress,
    checkingBalance,
    dehydratedState: helpers.dehydrate(),
  };
}
