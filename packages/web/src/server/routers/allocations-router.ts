import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { userSafes, allocationStates } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { createPublicClient, http, Address, isAddress, erc20Abi, formatUnits, encodeFunctionData } from 'viem';
import { base } from 'viem/chains';

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

export const allocationsRouter = router({
  /**
   * Get allocation data for the authenticated user
   */
  getManualAllocations: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.user.id;
    
    try {
      // Find user's primary safe
      const primarySafe = await db.query.userSafes.findFirst({
        where: and(
          eq(userSafes.userDid, privyDid),
          eq(userSafes.safeType, 'primary')
        ),
        columns: { id: true, safeAddress: true }
      });

      if (!primarySafe) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Primary safe not found.' });
      }
      
      // Fetch the user's allocation state using primary safe ID
      const userAllocationState = await db.query.allocationStates.findFirst({
        where: eq(allocationStates.userSafeId, primarySafe.id),
      });
      
      // Return data, defaulting to zeros if no allocation state exists
      return {
        allocatedTax: userAllocationState?.allocatedTax || '0',
        allocatedLiquidity: userAllocationState?.allocatedLiquidity || '0',
        allocatedYield: userAllocationState?.allocatedYield || '0',
        totalDeposited: userAllocationState?.totalDeposited || '0',
        lastUpdated: userAllocationState?.lastUpdated,
        primarySafeAddress: primarySafe.safeAddress
      };
    } catch (error) {
      console.error('Error fetching allocation state:', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR', 
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        cause: error
      });
    }
  }),

  /**
   * Prepare transactions for manual allocation
   */
  prepareAllocation: protectedProcedure
    .input(z.object({
      allocatedTax: z.string(),
      allocatedLiquidity: z.string(),
      allocatedYield: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;
      const { allocatedTax, allocatedLiquidity, allocatedYield } = input;
      
      try {
        // 1. Fetch all safes for the user
        const allUserSafes = await db.query.userSafes.findMany({
          where: eq(userSafes.userDid, privyDid),
          columns: { safeAddress: true, safeType: true },
        });

        // 2. Map addresses and check for required safes
        const safeAddresses: { [key: string]: Address | undefined } = {};
        allUserSafes.forEach(safe => {
          if (safe.safeAddress && isAddress(safe.safeAddress)) {
            safeAddresses[safe.safeType] = safe.safeAddress as Address;
          }
        });

        const primaryAddress = safeAddresses['primary'];
        const taxAddress = safeAddresses['tax'];
        const liquidityAddress = safeAddresses['liquidity'];
        const yieldAddress = safeAddresses['yield'];

        if (!primaryAddress) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Primary safe address not found.' });
        }
        if (!taxAddress || !liquidityAddress || !yieldAddress) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Missing one or more destination safe addresses (tax, liquidity, yield).'
          });
        }

        // 3. Parse input amounts
        let taxAmount: bigint;
        let liquidityAmount: bigint;
        let yieldAmount: bigint;
        try {
          taxAmount = BigInt(allocatedTax);
          liquidityAmount = BigInt(allocatedLiquidity);
          yieldAmount = BigInt(allocatedYield);
          if (taxAmount < BigInt(0) || liquidityAmount < BigInt(0) || yieldAmount < BigInt(0)) {
            throw new Error("Allocation amounts cannot be negative.");
          }
        } catch (e) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Invalid allocation amount(s). Please provide valid non-negative numbers.'
          });
        }

        const totalToAllocate = taxAmount + liquidityAmount + yieldAmount;

        if (totalToAllocate <= BigInt(0)) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Total allocation amount must be greater than zero.'
          });
        }

        // 4. Check primary safe balance
        const primaryBalance = await getUsdcBalance(primaryAddress);

        if (primaryBalance < totalToAllocate) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: `Insufficient funds in primary safe. Required: ${totalToAllocate}, Available: ${primaryBalance}`
          });
        }

        // 5. Prepare transfer transactions
        const preparedTransactions: SafeTransaction[] = [];
        
        // Define the transfer function ABI for encoding
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

        // Tax Transfer
        if (taxAmount > 0n) {
          const taxData = encodeFunctionData({
            abi: [transferAbi],
            functionName: 'transfer',
            args: [taxAddress, taxAmount],
          });
          preparedTransactions.push({ to: USDC_ADDRESS_BASE, value: '0', data: taxData });
        }

        // Liquidity Transfer
        if (liquidityAmount > 0n) {
          const liquidityData = encodeFunctionData({
            abi: [transferAbi],
            functionName: 'transfer',
            args: [liquidityAddress, liquidityAmount],
          });
          preparedTransactions.push({ to: USDC_ADDRESS_BASE, value: '0', data: liquidityData });
        }

        // Yield Transfer
        if (yieldAmount > 0n) {
          const yieldData = encodeFunctionData({
            abi: [transferAbi],
            functionName: 'transfer',
            args: [yieldAddress, yieldAmount],
          });
          preparedTransactions.push({ to: USDC_ADDRESS_BASE, value: '0', data: yieldData });
        }

        // 6. Return prepared transactions
        return { 
          transactions: preparedTransactions, 
          message: `Ready to allocate ${totalToAllocate} USDC.`
        };
      } catch (error) {
        console.error('Error preparing allocation transactions:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred during allocation preparation',
          cause: error
        });
      }
    }),

  /**
   * Check for deposits and update allocation state
   */
  checkDeposits: protectedProcedure.mutation(async ({ ctx }) => {
    const privyDid = ctx.user.id;
    
    try {
      // Fetch user safes
      const userSafeRecords = await db.query.userSafes.findMany({
        where: eq(userSafes.userDid, privyDid),
      });
      
      if (!userSafeRecords || userSafeRecords.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No safes found. Please set up your primary safe first.'
        });
      }
      
      const primarySafe = userSafeRecords.find(safe => safe.safeType === 'primary');
      
      if (!primarySafe) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Primary safe not found. Please set up your primary safe first.'
        });
      }
      
      // Get balances for all safes
      const safeBalances = await Promise.all(
        userSafeRecords.map(async (safe) => {
          const balance = await getUsdcBalance(safe.safeAddress as Address);
          return {
            ...safe,
            tokenBalance: balance.toString(),
          };
        })
      );
      
      // Calculate total deposited amount
      const totalDepositedBigInt = safeBalances.reduce((sum, safe) => {
        const balance = safe.tokenBalance ? BigInt(safe.tokenBalance) : BigInt(0);
        return sum + balance;
      }, BigInt(0));
      const totalDeposited = totalDepositedBigInt.toString();

      if (totalDeposited === "0") {
        return {
          message: 'No USDC deposits found in any safe.',
          data: { 
            allocatedTax: '0', 
            allocatedLiquidity: '0', 
            allocatedYield: '0', 
            totalDeposited: '0' 
          }
        };
      }
      
      // Calculate default allocations based on percentages
      const allocatedTax = (totalDepositedBigInt * BigInt(3000) / BigInt(10000)).toString(); // 30%
      const allocatedLiquidity = (totalDepositedBigInt * BigInt(6000) / BigInt(10000)).toString(); // 60% for primary safe
      const allocatedYield = (totalDepositedBigInt * BigInt(1000) / BigInt(10000)).toString(); // 10%
      
      // Get existing allocation state for user based on primary safe ID
      const currentState = await db.query.allocationStates.findFirst({
        where: eq(allocationStates.userSafeId, primarySafe.id),
      });
      
      // Define the data structure matching the schema
      const allocationData = {
        userSafeId: primarySafe.id,
        allocatedTax,
        allocatedLiquidity,
        allocatedYield,
        totalDeposited,
        lastUpdated: new Date()
      };

      if (!currentState) {
        // Create a new allocation record
        await db.insert(allocationStates).values(allocationData);
      } else {
        // Update existing allocation record
        await db.update(allocationStates)
          .set(allocationData)
          .where(eq(allocationStates.userSafeId, primarySafe.id));
      }
      
      return {
        message: `Deposits checked. Total USDC: ${formatUnits(totalDepositedBigInt, USDC_DECIMALS)}. Allocations updated.`,
        data: {
          allocatedTax,
          allocatedLiquidity,
          allocatedYield,
          totalDeposited,
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error checking deposits:', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred during deposit check',
        cause: error
      });
    }
  })
}); 