import { z } from 'zod';
import { publicProcedure, router } from '../create-router';
import { relaySafeTx } from '@/server/relayer/permissionless-relayer';
import { submitSignedSafeOp } from '@/server/relayer/relaykitSponsor';
import { SignedSafeOpPayload } from '@/server/relayer/types';
import { TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { UserOperation } from '@safe-global/relay-kit';

const inputSchema = z.object({
  chainId: z.number(),
  to: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  value: z.string(),
  data: z.string().regex(/^0x/),
  userAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
});

const signedOpSchema = z.object({
  chainId: z.number(),
  userAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  predictedSafe: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  signedSafeOperation: z.any(),
});

export const relayRouter = router({
  sponsorDeployment: publicProcedure
    .input(inputSchema)
    .mutation(async ({ ctx, input }) => {
      // Optional: Add rate limiting logic here
      // const ok = await ratelimit.limit(ctx.ip)
      // if (!ok.success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      try {
        const txHash = await relaySafeTx(input);
        return { txHash };
      } catch (error: any) {
        console.error('Error in relay/sponsorDeployment:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to sponsor deployment',
          cause: error,
        });
      }
    }),

  submitSignedOp: publicProcedure
    .input(signedOpSchema)
    .mutation(async ({ ctx, input }) => {
      // Optional: Add rate limiting logic here
      // const ok = await ratelimit.limit(ctx.ip)
      // if (!ok.success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      try {
        // Cast input to the correct type
        // put that into a const and superjson it
        const userOperation = superjson.parse(input.signedSafeOperation.userOperation);
        const options = input.signedSafeOperation.options;
        const signatures = input.signedSafeOperation.signatures;

        console.log('predictedSafe', input.predictedSafe);

        const payload: SignedSafeOpPayload = {
          chainId: input.chainId,
          userAddress: input.userAddress as `0x${string}`,
          predictedSafe: input.predictedSafe as `0x${string}`,
          // unwrap the superjson
          signedSafeOperation: {
            userOperation: userOperation as UserOperation,
            options: options as any,
            signatures: signatures as any,
          },
        };

        const txHash = await submitSignedSafeOp(payload);
        return { txHash };
      } catch (error: any) {
        console.error('Error in relay/submitSignedOp:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to relay signed operation',
          cause: error,
        });
      }
    }),
});
