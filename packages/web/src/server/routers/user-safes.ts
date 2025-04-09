import { z } from 'zod';
import { router, protectedProcedure } from '../create-router'; // Correct import path and names
import { db } from '@/db'; // Import db directly
import { userSafes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { initializeAndDeploySafe, prepareSafeDeploymentTransaction } from '@/app/dashboard/(bank)/server/safe-deployment-service';
import { isAddress } from 'viem'; // Import isAddress

// Define allowed safe types using the schema enum if available, otherwise manually
// Assuming userSafes schema has an enum or specific values for safeType
// If not, define it explicitly:
const ALLOWED_SECONDARY_SAFE_TYPES = ['tax', 'liquidity', 'yield'] as const;
type AllowedSafeType = (typeof ALLOWED_SECONDARY_SAFE_TYPES)[number];

const safeTypeSchema = z.enum(ALLOWED_SECONDARY_SAFE_TYPES);

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
   * Creates a new secondary safe (tax, liquidity, or yield) for the authenticated user.
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

        // 2. **IMPORTANT SECURITY CHECK (Placeholder)**
        // TODO: Verify that the privyDid (or associated wallet) is an owner of the provided safeAddress.
        // This requires interacting with the Safe contracts/API.
        // Example using hypothetical function:
        // const isOwner = await verifySafeOwner(safeAddress, privyDidAssociatedWallet);
        // if (!isOwner) {
        //   throw new TRPCError({ code: 'FORBIDDEN', message: 'Authenticated user is not an owner of the provided Safe.' });
        // }
        console.warn(`TODO: Skipping Safe ownership check for ${safeAddress} and user ${privyDid}`);

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
   * Verifies the transaction receipt (TODO) and saves the safe to the database.
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
            // TODO: Add transaction receipt verification logic here
            // 1. Set up a viem public client
            // const publicClient = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL) });
            // 2. Call publicClient.waitForTransactionReceipt({ hash: transactionHash })
            // const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash as `0x${string}` });
            // 3. Check receipt.status === 'success'
            // if (receipt.status !== 'success') {
            //    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: `Transaction ${transactionHash} failed or was reverted.` });
            // }
            // 4. Optionally, verify the deployed contract code at predictedAddress matches the expected Safe proxy factory code.
            // 5. Optionally, verify event logs for SafeSetup event emission.
            console.warn(`TODO: Skipping transaction receipt verification for tx ${transactionHash}`);

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