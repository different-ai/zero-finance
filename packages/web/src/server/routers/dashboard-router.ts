import { protectedProcedure, router } from '../create-router';
import { getSafeBalance } from '@/server/services/safe.service';
import { USDC_ADDRESS } from '@/lib/constants';
import { userSafes, type UserSafe } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
// import { AlignService } from '../services/align-service'; // This service does not exist

export const dashboardRouter = router({
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const { userId, log, db } = ctx;
    // const alignService = new AlignService(db); // This service does not exist

    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // TODO: Implement fetching virtual account balance from Align
    // The previous implementation was using a non-existent `AlignService`.
    // The actual Align API client is in `packages/web/src/server/services/align-api.ts`
    // but it does not have a `getStatement` method. This needs to be implemented.
    let virtualBalance = 0;
    // if (alignService) {
    //   try {
    //     const statement = await alignService.getStatement(userId);
    //     if (statement?.endingBalance) {
    //       virtualBalance = statement.endingBalance;
    //     }
    //   } catch (error) {
    //     log.error({ error }, 'Failed to fetch Align virtual account statement');
    //   }
    // }

    // 2. Get workspace safes (all safes in the workspace, not just user's own)
    const workspaceId = ctx.workspaceId;
    if (!workspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Workspace context is unavailable.',
      });
    }

    const userSafeRecords = await db.query.userSafes.findMany({
      where: eq(userSafes.workspaceId, workspaceId),
    });

    // 3. Get crypto balances
    const safeBalances = await Promise.all(
      userSafeRecords.map((safe: UserSafe) =>
        getSafeBalance({
          safeAddress: safe.safeAddress as `0x${string}`,
          tokenAddress: USDC_ADDRESS, // Hardcoded USDC
        }).catch((e) => {
          log.error(e, `Failed to get balance for safe ${safe.safeAddress}`);
          return null;
        }),
      ),
    );

    const totalCryptoBalance = safeBalances.reduce((total: number, balance) => {
      if (balance?.formatted) {
        return total + parseFloat(balance.formatted);
      }
      return total;
    }, 0);

    // 4. Aggregate balances
    const totalBalance = virtualBalance + totalCryptoBalance;
    const primarySafe = userSafeRecords.find(
      (s: UserSafe) => s.safeType === 'primary',
    );

    return {
      totalBalance,
      primarySafeAddress: primarySafe?.safeAddress as `0x${string}` | undefined,
    };
  }),
});
