import { z } from 'zod';
import { router, protectedProcedure } from '../../create-router';
import { TRPCError } from '@trpc/server';
import { createApiKey, revokeApiKey, listApiKeys } from '@/lib/mcp/api-key';

/**
 * API Keys Router
 *
 * Manages MCP API keys for workspace-level agent access.
 * All procedures are workspace-centric and require authentication.
 */
export const apiKeysRouter = router({
  /**
   * List all API keys for the current workspace
   * Returns key metadata (not the actual keys)
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.workspaceId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Workspace context required',
      });
    }

    const keys = await listApiKeys(ctx.workspaceId);

    return keys.map((key) => ({
      id: key.id,
      name: key.name,
      keyPrefix: key.keyPrefix, // e.g., "zf_live_xxxx"
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt,
      isRevoked: key.revokedAt !== null,
      revokedAt: key.revokedAt,
    }));
  }),

  /**
   * Create a new API key
   * Returns the raw key (only shown once!)
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
        expiresInDays: z
          .number()
          .int()
          .min(1)
          .max(365)
          .optional()
          .describe('Number of days until key expires'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.workspaceId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Workspace context required',
        });
      }

      const expiresAt = input.expiresInDays
        ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined;

      // ctx.userId is the Privy DID
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      const { rawKey, keyId } = await createApiKey({
        workspaceId: ctx.workspaceId,
        name: input.name,
        createdBy: ctx.userId,
        expiresAt,
      });

      return {
        id: keyId,
        name: input.name,
        rawKey, // Only returned once!
        expiresAt,
        message: 'Store this key securely. It will not be shown again.',
      };
    }),

  /**
   * Revoke an API key
   * The key will immediately stop working
   */
  revoke: protectedProcedure
    .input(
      z.object({
        keyId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.workspaceId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Workspace context required',
        });
      }

      const success = await revokeApiKey(input.keyId, ctx.workspaceId);

      if (!success) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'API key not found or already revoked',
        });
      }

      return { success: true };
    }),
});
