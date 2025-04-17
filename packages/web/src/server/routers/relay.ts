import { z } from 'zod'
import { publicProcedure, router } from '../create-router'
import { relaySafeTx } from '@/server/relayer/permissionless-relayer'
import { TRPCError } from '@trpc/server'

const inputSchema = z.object({
  chainId:     z.number(),
  to:          z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  value:       z.string(),
  data:        z.string().regex(/^0x/),
  userAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
})

export const relayRouter = router({
  sponsorDeployment: publicProcedure
    .input(inputSchema)
    .mutation(async ({ ctx, input }) => {
      // Optional: Add rate limiting logic here
      // const ok = await ratelimit.limit(ctx.ip)
      // if (!ok.success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      
      try {
        const txHash = await relaySafeTx(input)
        return { txHash }
      } catch (error: any) {
        console.error('Error in relay/sponsorDeployment:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to sponsor deployment',
          cause: error
        })
      }
    }),
}) 