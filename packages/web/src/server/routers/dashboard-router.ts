import { protectedProcedure, router } from '../create-router';
import { getSafeBalance } from '@/server/services/safe.service';
import { USDC_ADDRESS } from '@/lib/constants';

export const dashboardRouter = router({
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const { userId, log, db, alignService } = ctx;

    // 1. Get virtual account balance from Align
    let virtualBalance = 0;
    if (alignService) {
      try {
        const statement = await alignService.getStatement();
        if (statement?.endingBalance) {
          virtualBalance = statement.endingBalance;
        }
      } catch (error) {
        log.error({ error }, 'Failed to fetch Align virtual account statement');
      }
    }

    // 2. Get user safes
    const userSafes = await db.query.safes.findMany({
      where: (safes, { eq }) => eq(safes.userId, userId),
    });

    // 3. Get crypto balances
    const safeBalances = await Promise.all(
      userSafes.map(safe =>
        getSafeBalance({
          safeAddress: safe.safeAddress,
          tokenAddress: USDC_ADDRESS, // Hardcoded USDC
        }).catch(e => {
          log.error(e, `Failed to get balance for safe ${safe.safeAddress}`);
          return null;
        }),
      ),
    );

    const totalCryptoBalance = safeBalances.reduce((total, balance) => {
      if (balance?.formatted) {
        return total + parseFloat(balance.formatted);
      }
      return total;
    }, 0);

    // 4. Aggregate balances
    const totalBalance = virtualBalance + totalCryptoBalance;
    const primarySafe = userSafes.find(s => s.safeType === 'primary');

    return {
      totalBalance,
      primarySafeAddress: primarySafe?.safeAddress as `0x${string}` | undefined,
    };
  }),
}); 