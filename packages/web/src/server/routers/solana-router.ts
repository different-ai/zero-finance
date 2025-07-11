import { protectedProcedure, router } from '../create-router';
import { userSafes } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { getPrivyClient } from '@/lib/auth';
import { z } from 'zod';
import { devnetRpc, LAMPORTS_PER_SOL } from '@/lib/solana';
import { Address } from '@solana/kit';

async function getSafeBalance({
  safeAddress,
  token,
}: {
  safeAddress: string;
  token: 'sol' | 'usdc' | 'eurc';
}) {
  if (token === 'sol') {
    const { value: lamports } = await devnetRpc.getBalance(safeAddress as Address).send();
  
    // Divide using bigint — you'll get integer part of SOL
    const solIntegerPart = lamports / BigInt(LAMPORTS_PER_SOL);
  
    // Get the decimal remainder
    const solRemainder = lamports % BigInt(LAMPORTS_PER_SOL);
  
    const formatted = `${solIntegerPart}.${solRemainder.toString().padStart(9, '0').replace(/0+$/, '')}`;
    return Promise.resolve({
      formatted, 
    });
  }

  // handle other tokens
  return Promise.resolve({
    formatted: '0.00', 
  });
}

export const solanaRouter = router({
  getBalance: protectedProcedure
    .input(z.object(
      {
        address: z.string().length(44),
        token: z.enum(['usdc', 'sol', 'eurc'])
      }
    )).query(async ({ ctx, input }) => {
    const { userId, log, db } = ctx;

    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const primarySafeAddress = input.address;

    let virtualBalance = 0;


    // 3. Get crypto balances
    const safeBalance = await getSafeBalance({
      safeAddress: primarySafeAddress,
      token: input.token,
    }).catch(e => {
      log.error(e, `Failed to get balance for safe ${primarySafeAddress}`);
      return null;
    })

    const totalCryptoBalance = safeBalance?.formatted ? parseFloat(safeBalance.formatted) : 0

    // 4. Aggregate balances
    const totalBalance = virtualBalance + totalCryptoBalance;

    return {
      totalBalance,
      network: 'solana' as 'solana',
      primarySafeAddress,
    };
  }),
  createSafe: protectedProcedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
  .mutation(async ({ ctx, input }) => {
    const { userId, db } = ctx;

    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    if (!input.walletAddress) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Missing wallet address parameter' });
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
    

    try {
      // Insert the new safe into the database
      const [insertedSafe] = await db.insert(userSafes).values({
        userDid: userId,
        safeAddress: input.walletAddress,
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
