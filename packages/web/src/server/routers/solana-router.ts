import { protectedProcedure, router } from '../create-router';
import { USDC_ADDRESS } from '@/lib/constants';
import { userSafes } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { getPrivyClient } from '@/lib/auth';

function getSafeBalance({
  safeAddress,
  tokenAddress,
}: {
  safeAddress: string;
  tokenAddress: string;
}) {
  // This function should call the actual service to get the balance
  // For now, it's a placeholder
  return Promise.resolve({
    // Example balance, replace with actual logic
    formatted: '100.00', 
  });
}

export const solanaRouter = router({
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const { userId, log, db } = ctx;

    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    let virtualBalance = 0;

    // 2. Get user safes
    const userSafeRecords = await db.query.userSafes.findMany({
      where: and(
        eq(userSafes.userDid, userId),
        eq(userSafes.safeChain, 'solana'),
      ),
      columns: {
        safeAddress: true,
        safeType: true,
      }
    });

    // 3. Get crypto balances
    const safeBalances = await Promise.all(
      userSafeRecords.map((safe) =>
        getSafeBalance({
          safeAddress: safe.safeAddress,
          tokenAddress: USDC_ADDRESS, // Hardcoded USDC
        }).catch(e => {
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
    const primarySafe = userSafeRecords.find((s) => s.safeType === 'primary') || userSafeRecords[0];

    return {
      totalBalance,
      network: 'solana' as 'solana',
      primarySafeAddress: primarySafe?.safeAddress as string | undefined,
    };
  }),
  createSafe: protectedProcedure.mutation(async ({ ctx }) => {
    const { userId, db } = ctx;

    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const client = await getPrivyClient();
    if (!client) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Privy client not initialized' });
    }
    const countSafes = await db.select({
      count: count(),
    }).from(userSafes)
    .where(and(
      eq(userSafes.userDid, userId),
      eq(userSafes.safeChain, 'solana'),
    ));
    if (countSafes[0].count > 0) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Solana safe already exists for this user' });
    }
    
    let safeAddress: string | undefined;
    try {
      const solanaAccount = await client.walletApi.createWallet({
        chainType: 'solana',
      });
      console.log('Solana account created', solanaAccount);
      safeAddress = solanaAccount.address;
    } catch (error) {
      console.error('Error creating Solana account:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create Solana account' });
    }

    try {
      // Insert the new safe into the database
      const [insertedSafe] = await db.insert(userSafes).values({
        userDid: userId,
        safeAddress,
        safeType: 'other',
        safeChain: 'solana',
      }).returning();
      console.log(`Successfully inserted ${insertedSafe.safeType} safe (ID: ${insertedSafe.id}) into DB for user DID: ${userId}`);

      return {
        message: `${insertedSafe.safeType.charAt(0).toUpperCase() + insertedSafe.safeType.slice(1)} safe created successfully.`,
        data: insertedSafe,
      };
    } catch (error) {
      console.error('Error creating Solana safe:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create Solana safe' });
    }
  })
});
