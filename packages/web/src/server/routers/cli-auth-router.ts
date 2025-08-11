import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { cliTokens } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a secure random token
 */
function generateSecureToken(): string {
  // Generate 32 bytes of random data and encode as base64url
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Hash a token for storage
 */
async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

/**
 * Router for CLI authentication
 */
export const cliAuthRouter = router({
  /**
   * Generate a new CLI access token
   */
  generateToken: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        expiresInDays: z.number().min(1).max(365).default(90),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Check if user already has 10 tokens (limit)
      const existingTokens = await db.query.cliTokens.findMany({
        where: eq(cliTokens.userId, userId),
      });

      if (existingTokens.length >= 10) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Maximum number of CLI tokens (10) reached. Please delete unused tokens.',
        });
      }

      // Generate token
      const token = generateSecureToken();
      const hashedToken = await hashToken(token);

      // Calculate expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);

      // Store in database
      const [newToken] = await db
        .insert(cliTokens)
        .values({
          userId,
          tokenHash: hashedToken,
          name: input.name,
          expiresAt,
        })
        .returning();

      // Return the unhashed token (only shown once)
      return {
        id: newToken.id,
        token, // This is the only time the unhashed token is returned
        name: newToken.name,
        expiresAt: newToken.expiresAt,
      };
    }),

  /**
   * List all tokens for the current user
   */
  listTokens: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const tokens = await db.query.cliTokens.findMany({
      where: eq(cliTokens.userId, userId),
      orderBy: [desc(cliTokens.createdAt)],
    });

    // Don't expose token hashes
    return tokens.map(({ tokenHash, ...token }) => ({
      ...token,
      isExpired: token.expiresAt ? token.expiresAt < new Date() : false,
    }));
  }),

  /**
   * Revoke a CLI token
   */
  revokeToken: protectedProcedure
    .input(
      z.object({
        tokenId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Delete the token (only if it belongs to the user)
      await db
        .delete(cliTokens)
        .where(
          and(
            eq(cliTokens.id, input.tokenId),
            eq(cliTokens.userId, userId)
          )
        );

      return { success: true };
    }),

  /**
   * Revoke all CLI tokens for the current user
   */
  revokeAllTokens: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;

    await db.delete(cliTokens).where(eq(cliTokens.userId, userId));

    return { success: true };
  }),
});