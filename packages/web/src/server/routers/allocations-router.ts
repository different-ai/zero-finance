import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { userSafes, allocationStrategies, type AllocationStrategy } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { createPublicClient, http, type Address, isAddress, erc20Abi, formatUnits, encodeFunctionData, parseUnits, type Hex } from 'viem';
import { base } from 'viem/chains';
import { appRouter } from './_app'; // Import the main router

// Base Mainnet USDC Contract Address
const USDC_ADDRESS_BASE = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_BASE as Address || '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;
const USDC_DECIMALS = 6;

// Viem public client for Base
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || undefined),
});

// Function to fetch USDC balance for a single address
async function getUsdcBalance(address: Address): Promise<bigint> {
  try {
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS_BASE,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    });
    return balance;
  } catch (error) {
    console.error(`Error fetching balance for ${address}:`, error);
    return BigInt(0);
  }
}

// Type for Safe transaction
type SafeTransaction = {
  to: Address;
  value: string;
  data: `0x${string}`;
};

// Define output structure for allocation status
interface AllocationStatus {
  strategy: AllocationStrategy[];
  balances: {
    [safeType: string]: { 
        address: Address;
        actualWei: string; // Actual balance on-chain (wei string)
        targetWei: string; // Target balance based on strategy (wei string)
        deltaWei: string;  // Difference (target - actual) (wei string)
    }
  };
  totalBalanceWei: string;
  totalUnallocatedWei: string; // Sum of positive deltas
}

export const allocationsRouter = router({
  /**
   * Get allocation status: strategy, actual balances, target balances, and deltas.
   */
  getStatus: protectedProcedure.query(async ({ ctx }): Promise<AllocationStatus> => {
    const privyDid = ctx.user.id;
    const trpcCaller = appRouter.createCaller(ctx); // Create caller from imported appRouter

    try {
      // 1. Fetch User Safes
      const userSafeRecords = await db.query.userSafes.findMany({
        where: eq(userSafes.userDid, privyDid),
      });
      if (userSafeRecords.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'No safes found for user.' });
      }
      const safeMap = new Map(userSafeRecords.map(s => [s.safeType, s.safeAddress as Address]));

      // 2. Fetch Allocation Strategy (using tRPC caller)
      const strategy = await trpcCaller.allocationStrategy.get();
      if (strategy.length === 0) {
         throw new TRPCError({ code: 'NOT_FOUND', message: 'Allocation strategy not set.' });
      }

      // 3. Fetch Actual Balances
      const balancePromises = userSafeRecords.map(safe => 
          getUsdcBalance(safe.safeAddress as Address).then(balance => ({ 
              safeType: safe.safeType, 
              address: safe.safeAddress as Address,
              balance: balance 
          }))
      );
      const actualBalancesRaw = await Promise.all(balancePromises);
      
      const actualBalancesMap = new Map(actualBalancesRaw.map(b => [b.safeType, { address: b.address, actualWei: b.balance }]));
      const totalBalanceWei = actualBalancesRaw.reduce((sum, b) => sum + b.balance, BigInt(0));

      // 4. Calculate Targets and Deltas
      const calculatedBalances: AllocationStatus['balances'] = {};
      let totalUnallocatedWei = BigInt(0);

      for (const rule of strategy) {
        const safeType = rule.destinationSafeType;
        const safeInfo = actualBalancesMap.get(safeType);
        if (!safeInfo) {
          console.warn(`Safe of type ${safeType} defined in strategy but not found for user ${privyDid}. Skipping.`);
          continue; // Skip if safe doesn't exist (e.g., strategy set before safe creation)
        }

        const actualWei = safeInfo.actualWei;
        const targetWei = (totalBalanceWei * BigInt(rule.percentage)) / BigInt(100);
        const deltaWei = targetWei - actualWei;
        
        calculatedBalances[safeType] = {
            address: safeInfo.address,
            actualWei: actualWei.toString(),
            targetWei: targetWei.toString(),
            deltaWei: deltaWei.toString(),
        };

        if (deltaWei > BigInt(0)) {
            totalUnallocatedWei += deltaWei;
        }
      }
      
      // Ensure all existing safes are in the result, even if not in strategy (target/delta 0)
      for (const [safeType, safeInfo] of actualBalancesMap.entries()) {
          if (!calculatedBalances[safeType]) {
              calculatedBalances[safeType] = {
                  address: safeInfo.address,
                  actualWei: safeInfo.actualWei.toString(),
                  targetWei: '0',
                  deltaWei: (BigInt(0) - safeInfo.actualWei).toString(),
              };
          }
      }

      return {
        strategy,
        balances: calculatedBalances,
        totalBalanceWei: totalBalanceWei.toString(),
        totalUnallocatedWei: totalUnallocatedWei.toString(),
      };

    } catch (error) {
      console.error(`Error fetching allocation status for ${privyDid}:`, error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch allocation status',
        cause: error
      });
    }
  }),

  /**
   * Prepares Safe transactions to move funds from the primary safe 
   * to other safes according to the user's strategy to cover positive deltas.
   */
  prepareAllocation: protectedProcedure
    // No input needed - calculates based on current status
    .mutation(async ({ ctx }): Promise<{ transactions: SafeTransaction[], message: string }> => {
      const privyDid = ctx.user.id;
      const trpcCaller = appRouter.createCaller(ctx); // Create caller from imported appRouter

      try {
        // 1. Get current allocation status
        const status = await trpcCaller.allocations.getStatus();

        const primarySafeInfo = status.balances['primary'];
        if (!primarySafeInfo) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Primary safe address not found in status.' });
        }
        const primaryBalanceWei = BigInt(primarySafeInfo.actualWei);
        
        // 2. Identify transfers needed (positive deltas)
        const preparedTransactions: SafeTransaction[] = [];
        let totalToTransferWei = BigInt(0);

        const transferAbi = {
          inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function'
        } as const;

        for (const safeType in status.balances) {
          if (safeType === 'primary') continue; // Don't transfer from primary to primary

          const info = status.balances[safeType];
          const deltaWei = BigInt(info.deltaWei);

          if (deltaWei > BigInt(0)) {
            const amountToTransfer = deltaWei; // Transfer the exact delta needed
            totalToTransferWei += amountToTransfer;

            const transferData = encodeFunctionData({
              abi: [transferAbi],
              functionName: 'transfer',
              args: [info.address, amountToTransfer],
            });
            preparedTransactions.push({ to: USDC_ADDRESS_BASE, value: '0', data: transferData });
          }
        }

        // 3. Check if any transfers are needed
        if (preparedTransactions.length === 0) {
          return { transactions: [], message: 'Funds are already allocated according to the strategy.' };
        }

        // 4. Check primary safe balance sufficiency
        if (primaryBalanceWei < totalToTransferWei) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: `Insufficient funds in primary safe. Required: ${formatUnits(totalToTransferWei, USDC_DECIMALS)}, Available: ${formatUnits(primaryBalanceWei, USDC_DECIMALS)} USDC`
          });
        }

        // 5. Return prepared transactions
        return { 
          transactions: preparedTransactions, 
          message: `Ready to allocate ${formatUnits(totalToTransferWei, USDC_DECIMALS)} USDC across ${preparedTransactions.length} destination(s).`
        };

      } catch (error) {
        console.error(`Error preparing allocation transactions for ${privyDid}:`, error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error during allocation preparation',
          cause: error
        });
      }
    }),
}); 