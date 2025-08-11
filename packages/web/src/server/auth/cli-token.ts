import { db } from '@/db';
import { cliTokens } from '@/db/schema';
import { gt, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

/**
 * Verify a token against its hash
 */
export async function verifyToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

/**
 * Validate a CLI token and return user info
 */
export async function validateCliToken(token: string): Promise<{ id: string; email?: { address?: string } } | null> {
  try {
    // Find all non-expired tokens
    const tokens = await db.query.cliTokens.findMany({
      where: gt(cliTokens.expiresAt, new Date()),
    });

    // Check each token hash
    for (const dbToken of tokens) {
      const isValid = await verifyToken(token, dbToken.tokenHash);
      if (isValid) {
        // Update last used timestamp
        await db
          .update(cliTokens)
          .set({ lastUsed: new Date() })
          .where(eq(cliTokens.id, dbToken.id));

        // Return user info in format compatible with Privy user object
        return { id: dbToken.userId };
      }
    }

    return null;
  } catch (error) {
    console.error('Error validating CLI token:', error);
    return null;
  }
}