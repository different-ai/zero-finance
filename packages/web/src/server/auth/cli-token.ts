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
    console.log('[CLI Auth] Validating token...');
    
    // Find all non-expired tokens
    const tokens = await db.query.cliTokens.findMany({
      where: gt(cliTokens.expiresAt, new Date()),
    });

    console.log(`[CLI Auth] Found ${tokens.length} non-expired tokens in database`);

    // Check each token hash
    for (const dbToken of tokens) {
      const isValid = await verifyToken(token, dbToken.tokenHash);
      if (isValid) {
        console.log(`[CLI Auth] Token validated successfully for user: ${dbToken.userId}`);
        
        // Update last used timestamp
        await db
          .update(cliTokens)
          .set({ lastUsed: new Date() })
          .where(eq(cliTokens.id, dbToken.id));

        // Return user info - userId in cliTokens is the Privy DID
        return { id: dbToken.userId };
      }
    }

    console.log('[CLI Auth] No matching token found');
    return null;
  } catch (error) {
    console.error('[CLI Auth] Error validating CLI token:', error);
    return null;
  }
}
