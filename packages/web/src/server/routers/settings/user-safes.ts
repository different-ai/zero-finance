import { z } from 'zod';
import { router, protectedProcedure } from '../../create-router'; // Corrected import path
import { db } from '@/db'; // Import db directly
import { userSafes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { initializeAndDeploySafe, prepareSafeDeploymentTransaction } from '@/app/(authenticated)/dashboard/bank/server/safe-deployment-service';
import { isAddress, createPublicClient, http, type Address, type Hex } from 'viem'; // Import isAddress, viem client utils, and Hex type
import { base } from 'viem/chains'; // Assuming Base network for Safes

// Define allowed secondary safe types
const ALLOWED_SECONDARY_SAFE_TYPES = ['liquidity', 'yield'] as const;
type AllowedSafeType = (typeof ALLOWED_SECONDARY_SAFE_TYPES)[number];

const safeTypeSchema = z.enum(ALLOWED_SECONDARY_SAFE_TYPES);

// Minimal Safe ABI for isOwner
const safeAbiIsOwner = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "isOwner",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Use the exported 'router' function to create the sub-router
export const userSafesRouter = router({
  /**
   * Fetches all safes associated with the authenticated user.
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.user.id; // Use ctx.user.id from isAuthed middleware
    console.log(`Fetching safes for user DID: ${privyDid}`);

    try {
      // Use the imported 'db' directly
      const safes = await db.query.userSafes.findMany({
        where: eq(userSafes.userDid, privyDid),
        // Let drizzle-orm infer types for orderBy parameters
        orderBy: (safes, { asc }) => [asc(safes.createdAt)],
      });
      console.log(`Found ${safes.length} safes for user DID: ${privyDid}`);
      return safes;
    } catch (error) {
      console.error(`Error fetching safes for user ${privyDid}:`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch user safes.',
        cause: error,
      });
    }
  }),

  /**
   * Fetches the address of the primary safe for the authenticated user.
   * Returns null if no primary safe is found.
   */
  getPrimarySafeAddress: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.user.id; 
    try {
      const primarySafe = await db.query.userSafes.findFirst({
        where: and(
          eq(userSafes.userDid, privyDid),
          eq(userSafes.safeType, 'primary')
        ),
        columns: { safeAddress: true },
      });
      
      return primarySafe?.safeAddress ?? null; // Return address or null

    } catch (error) {
      console.error(`Error fetching primary safe address for user ${privyDid}:`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch primary safe address.',
        cause: error,
      });
    }
  }),

  /**
   * Creates a new secondary safe (liquidity or yield) for the authenticated user.
   * Requires an existing primary safe.
   */
  create: protectedProcedure
    .input(
      z.object({
        safeType: safeTypeSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id; // Use ctx.user.id
      const { safeType } = input;
      console.log(`Attempting to create ${safeType} safe for user DID: ${privyDid}`);

      try {
        // 1. Check for existing primary safe
        // Use the imported 'db' directly
        const primarySafe = await db.query.userSafes.findFirst({
          where: and(
            eq(userSafes.userDid, privyDid),
            eq(userSafes.safeType, 'primary')
          ),
          columns: { safeAddress: true },
        });

        if (!primarySafe) {
          console.error(`Primary safe not found for user DID: ${privyDid}`);
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Primary safe not found. Cannot create secondary safe.',
          });
        }
        console.log(`Found primary safe address: ${primarySafe.safeAddress} for user DID: ${privyDid}`);

        // 2. Check if a safe of the requested type already exists
        // Use the imported 'db' directly
        const existingSafe = await db.query.userSafes.findFirst({
          where: and(
            eq(userSafes.userDid, privyDid),
            eq(userSafes.safeType, safeType)
          ),
          columns: { id: true },
        });

        if (existingSafe) {
          console.warn(`Safe of type '${safeType}' already exists for user DID: ${privyDid}`);
          throw new TRPCError({
            code: 'CONFLICT',
            message: `Safe of type '${safeType}' already exists for this user.`,
          });
        }
        console.log(`No existing ${safeType} safe found for user DID: ${privyDid}. Proceeding with creation.`);

        // 3. Define Safe configuration
        const owners = [primarySafe.safeAddress];
        const threshold = 1;
        const saltNonce = undefined;

        // 4. Call the Safe Deployment Service
        console.log(`Calling Safe Deployment Service for ${safeType} safe for user DID: ${privyDid}...`);
        const newSafeAddress = await initializeAndDeploySafe(owners, threshold, saltNonce);
        console.log(`Safe Deployment Service returned address: ${newSafeAddress} for ${safeType} safe, user DID: ${privyDid}`);

        // 5. Insert the new safe record into the database
        // Use the imported 'db' directly
        const [insertedSafe] = await db
          .insert(userSafes)
          .values({
            userDid: privyDid,
            safeAddress: newSafeAddress,
            safeType: safeType,
          })
          .returning();

        console.log(`Successfully inserted ${safeType} safe (ID: ${insertedSafe.id}) into DB for user DID: ${privyDid}`);

        return {
          message: `${safeType.charAt(0).toUpperCase() + safeType.slice(1)} safe created successfully.`,
          data: insertedSafe,
        };

      } catch (error) {
        console.error(`Error creating ${safeType} safe for user DID ${privyDid}:`, error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create ${safeType} safe.`,
          cause: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }),

  /**
   * Registers an existing Safe address as the primary safe for the user.
   */
  registerPrimary: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().refine(isAddress, {
          message: "Invalid Ethereum address provided.",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;
      const { safeAddress } = input;
      console.log(`Attempting to register primary safe ${safeAddress} for user DID: ${privyDid}`);

      // Get user's associated wallet address from context (assuming it exists)
      // TODO: Verify this is the correct/reliable way to get the owning EOA
      const userWalletAddress = ctx.user.wallet?.address as Address | undefined;
      if (!userWalletAddress) {
          throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Could not determine user wallet address for ownership check.',
          });
      }

      try {
        // 1. Check if a primary safe already exists for this user
        const existingPrimary = await db.query.userSafes.findFirst({
          where: and(
            eq(userSafes.userDid, privyDid),
            eq(userSafes.safeType, 'primary')
          ),
          columns: { id: true },
        });

        if (existingPrimary) {
          console.warn(`User ${privyDid} already has a primary safe.`);
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A primary safe is already registered for this user.',
          });
        }

        // 2. Verify Safe Ownership
        console.log(`Verifying if ${userWalletAddress} owns Safe ${safeAddress}...`);
        try {
             const publicClient = createPublicClient({
                chain: base, // Assuming Base network
                transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL)
            });

            const isOwnerResult = await publicClient.readContract({
                address: safeAddress as Address,
                abi: safeAbiIsOwner,
                functionName: 'isOwner',
                args: [userWalletAddress]
            });

            if (!isOwnerResult) {
                console.warn(`Ownership check failed: ${userWalletAddress} is not an owner of Safe ${safeAddress}.`);
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Authenticated user is not an owner of the provided Safe address.' });
            }
             console.log(`Ownership check passed for Safe ${safeAddress}.`);

        } catch (contractError: any) {
             console.error(`Error during Safe ownership check for ${safeAddress}:`, contractError);
             // Handle cases where the address isn't a valid contract or doesn't support isOwner
             throw new TRPCError({
                 code: 'BAD_REQUEST',
                 message: `Failed to verify ownership of the provided address. Ensure it's a valid Safe contract on Base network. Error: ${contractError.shortMessage || contractError.message}`,
                 cause: contractError
             });
        }
        // Removed console.warn for skipping check
        // console.warn(`TODO: Skipping Safe ownership check...`);

        // 3. Insert the new primary safe record
        const [insertedSafe] = await db
          .insert(userSafes)
          .values({
            userDid: privyDid,
            safeAddress: safeAddress,
            safeType: 'primary',
          })
          .returning();
          
        console.log(`Successfully registered primary safe ${safeAddress} (ID: ${insertedSafe.id}) for user DID: ${privyDid}`);

        return {
          message: `Primary safe registered successfully.`, 
          data: insertedSafe,
        };

      } catch (error) {
        console.error(`Error registering primary safe ${safeAddress} for user ${privyDid}:`, error);
        if (error instanceof TRPCError) {
          throw error; // Re-throw known TRPC errors
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to register primary safe.',
          cause: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }),

  /**
   * Confirms the creation of a secondary safe after the client sends the transaction.
   * Verifies the transaction receipt and saves the safe to the database.
   */
  confirmCreate: protectedProcedure
    .input(
      z.object({
        safeType: safeTypeSchema,
        predictedAddress: z.string().refine(isAddress, { message: "Invalid predicted address."}),
        transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, { message: "Invalid transaction hash." }),
      })
    )
    .mutation(async ({ ctx, input }) => {
        const privyDid = ctx.user.id;
        const { safeType, predictedAddress, transactionHash } = input;
        console.log(`Confirming creation of ${safeType} safe at ${predictedAddress} for user ${privyDid} with tx ${transactionHash}`);

        try {
            // 1. Verify Transaction Receipt
            console.log(`Verifying transaction receipt for ${transactionHash}...`);
            try {
                const publicClient = createPublicClient({
                    chain: base, // Assuming Base network
                    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL)
                });

                const receipt = await publicClient.waitForTransactionReceipt({ 
                    hash: transactionHash as Hex // Cast to Hex type
                });

                if (receipt.status !== 'success') {
                    console.error(`Transaction ${transactionHash} failed or was reverted. Status: ${receipt.status}`);
                    throw new TRPCError({ code: 'BAD_REQUEST', message: `Transaction ${transactionHash} failed or was reverted.` });
                }
                console.log(`Transaction ${transactionHash} successfully verified.`);
                
                // TODO: Optional extra checks (ProxyCreation event, SafeSetup event) could be added here for robustness

            } catch (receiptError: any) {
                 console.error(`Error verifying transaction receipt for ${transactionHash}:`, receiptError);
                 throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: `Failed to verify transaction receipt: ${receiptError.shortMessage || receiptError.message}`,
                    cause: receiptError
                 });
            }
            // Removed console.warn for skipping check
            // console.warn(`TODO: Skipping transaction receipt verification...`);

            // Check again if the safe was somehow created between prepare and confirm
            const existingSafe = await db.query.userSafes.findFirst({
              where: and(
                eq(userSafes.userDid, privyDid),
                eq(userSafes.safeType, safeType)
              ),
              columns: { id: true },
            });
            if (existingSafe) {
              console.warn(`Safe of type '${safeType}' was already created for user DID: ${privyDid} before confirmation.`);
              // Return existing safe data
              const safeData = await db.query.userSafes.findFirst({ where: eq(userSafes.id, existingSafe.id) });
              return { 
                  message: `Safe already existed.`, 
                  data: safeData 
              };
            }

            // Insert the new safe record into the database
            const [insertedSafe] = await db
              .insert(userSafes)
              .values({
                userDid: privyDid,
                safeAddress: predictedAddress, // Use the *predicted* address
                safeType: safeType,
              })
              .returning();

            console.log(`Successfully inserted confirmed ${safeType} safe (ID: ${insertedSafe.id}) into DB for user DID: ${privyDid}`);

            // Return the newly inserted safe data
             const newSafeData = await db.query.userSafes.findFirst({ where: eq(userSafes.id, insertedSafe.id) });

            return {
              message: `${safeType.charAt(0).toUpperCase() + safeType.slice(1)} safe confirmed and saved successfully.`,
              data: newSafeData,
            };

        } catch (error) {
            console.error(`Error confirming ${safeType} safe creation for user ${privyDid} (Tx: ${transactionHash}):`, error);
            if (error instanceof TRPCError) {
                 throw error;
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Failed to confirm ${safeType} safe creation.`,
              cause: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }),

  prepareCreate: protectedProcedure
    .input(
      z.object({
        safeType: safeTypeSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;
      const { safeType } = input;
      console.log(`Preparing transaction to create ${safeType} safe for user DID: ${privyDid}`);

      try {
        // 1. Check for existing primary safe
        // Use the imported 'db' directly
        const primarySafe = await db.query.userSafes.findFirst({
          where: and(
            eq(userSafes.userDid, privyDid),
            eq(userSafes.safeType, 'primary')
          ),
          columns: { safeAddress: true },
        });

        if (!primarySafe) {
          console.error(`Primary safe not found for user DID: ${privyDid}`);
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Primary safe not found. Cannot create secondary safe.',
          });
        }
        console.log(`Found primary safe address: ${primarySafe.safeAddress} for user DID: ${privyDid}`);

        // 2. Check if a safe of the requested type already exists
        // Use the imported 'db' directly
        const existingSafe = await db.query.userSafes.findFirst({
          where: and(
            eq(userSafes.userDid, privyDid),
            eq(userSafes.safeType, safeType)
          ),
          columns: { id: true },
        });

        if (existingSafe) {
          console.warn(`Safe of type '${safeType}' already exists for user DID: ${privyDid}`);
          throw new TRPCError({
            code: 'CONFLICT',
            message: `Safe of type '${safeType}' already exists for this user.`,
          });
        }
        console.log(`No existing ${safeType} safe found for user DID: ${privyDid}. Proceeding with creation.`);

        // 3. Define Safe configuration
        const owners = [primarySafe.safeAddress]; // The primary safe will be the owner
        const threshold = 1;
        // Use a numeric string for saltNonce compatible with BigInt conversion
        const saltNonce = Date.now().toString(); 
        console.log(`Using saltNonce: ${saltNonce} for ${safeType} safe deployment`);

        // 4. Call the Safe Deployment Preparation Service
        console.log(`Calling Safe Deployment Preparation Service for ${safeType} safe for user DID: ${privyDid}...`);
        const { predictedAddress, deploymentTx } = await prepareSafeDeploymentTransaction(
            owners,
            threshold,
            saltNonce // Pass the numeric string saltNonce
        );
        console.log(`Safe Deployment Preparation Service returned predicted address: ${predictedAddress} for ${safeType} safe, user DID: ${privyDid}`);

        // 5. Return the predicted address and transaction data to the client
        return {
          message: `Transaction data prepared for ${safeType} safe creation.`,
          predictedAddress: predictedAddress,
          transaction: {
            to: deploymentTx.to,
            value: deploymentTx.value,
            data: deploymentTx.data,
          },
          context: { 
             userDid: privyDid, 
             safeType: safeType, 
             predictedAddress: predictedAddress 
          }
        };

      } catch (error) {
        console.error(`Error preparing transaction to create ${safeType} safe for user DID ${privyDid}:`, error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to prepare transaction for ${safeType} safe creation.`,
          cause: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }),
});