import { createHash, randomBytes } from 'crypto';
import { db } from '@/db';
import { workspaceApiKeys, workspaces } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

const KEY_PREFIX_LIVE = 'zf_live_';
const KEY_PREFIX_TEST = 'zf_test_';
const KEY_LENGTH = 32; // 32 random bytes = 64 hex chars

export interface ApiKeyContext {
  workspaceId: string;
  workspaceName: string;
  keyId: string;
  keyName: string;
  alignCustomerId: string | null;
  isMockMode?: boolean;
}

/**
 * Generate a new API key
 * Returns the raw key (only shown once) and the data to store
 */
export function generateApiKey(isTest = false): {
  rawKey: string;
  keyPrefix: string;
  keyHash: string;
} {
  const prefix = isTest ? KEY_PREFIX_TEST : KEY_PREFIX_LIVE;
  const randomPart = randomBytes(KEY_LENGTH).toString('hex');
  const rawKey = `${prefix}${randomPart}`;

  return {
    rawKey,
    keyPrefix: rawKey.slice(0, 12), // "zf_live_xxxx" for display
    keyHash: hashApiKey(rawKey),
  };
}

/**
 * Hash an API key for storage
 */
export function hashApiKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex');
}

/**
 * Validate an API key and return the workspace context
 * Returns null if invalid or revoked
 */
export async function validateApiKey(
  rawKey: string,
): Promise<ApiKeyContext | null> {
  // Quick format check
  if (
    !rawKey.startsWith(KEY_PREFIX_LIVE) &&
    !rawKey.startsWith(KEY_PREFIX_TEST)
  ) {
    return null;
  }

  const keyHash = hashApiKey(rawKey);

  // Find the key and join with workspace
  const result = await db
    .select({
      keyId: workspaceApiKeys.id,
      keyName: workspaceApiKeys.name,
      workspaceId: workspaceApiKeys.workspaceId,
      revokedAt: workspaceApiKeys.revokedAt,
      expiresAt: workspaceApiKeys.expiresAt,
      workspaceName: workspaces.name,
      alignCustomerId: workspaces.alignCustomerId,
    })
    .from(workspaceApiKeys)
    .innerJoin(workspaces, eq(workspaceApiKeys.workspaceId, workspaces.id))
    .where(
      and(
        eq(workspaceApiKeys.keyHash, keyHash),
        isNull(workspaceApiKeys.revokedAt),
      ),
    )
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const key = result[0];

  // Check expiration
  if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
    return null;
  }

  // Update last used timestamp (fire and forget)
  db.update(workspaceApiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(workspaceApiKeys.id, key.keyId))
    .execute()
    .catch((err) => console.error('Failed to update API key last used:', err));

  // Test tokens (zf_test_*) enable mock mode - bypasses real blockchain/KYC calls
  const isMockMode = rawKey.startsWith(KEY_PREFIX_TEST);

  return {
    workspaceId: key.workspaceId,
    workspaceName: key.workspaceName,
    keyId: key.keyId,
    keyName: key.keyName,
    alignCustomerId: key.alignCustomerId,
    isMockMode,
  };
}

/**
 * Create a new API key for a workspace
 * In development mode, creates test tokens (zf_test_)
 * In production, creates live tokens (zf_live_)
 */
export async function createApiKey(params: {
  workspaceId: string;
  name: string;
  createdBy: string; // Privy DID
  expiresAt?: Date;
}): Promise<{ rawKey: string; keyId: string }> {
  const isTest = process.env.NODE_ENV === 'development';
  const { rawKey, keyPrefix, keyHash } = generateApiKey(isTest);

  const [inserted] = await db
    .insert(workspaceApiKeys)
    .values({
      workspaceId: params.workspaceId,
      name: params.name,
      keyPrefix,
      keyHash,
      createdBy: params.createdBy,
      expiresAt: params.expiresAt,
    })
    .returning({ id: workspaceApiKeys.id });

  return {
    rawKey,
    keyId: inserted.id,
  };
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(
  keyId: string,
  workspaceId: string,
): Promise<boolean> {
  const result = await db
    .update(workspaceApiKeys)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(workspaceApiKeys.id, keyId),
        eq(workspaceApiKeys.workspaceId, workspaceId),
        isNull(workspaceApiKeys.revokedAt),
      ),
    );

  return (result.rowCount ?? 0) > 0;
}

/**
 * List API keys for a workspace (without exposing hashes)
 */
export async function listApiKeys(workspaceId: string) {
  return db
    .select({
      id: workspaceApiKeys.id,
      name: workspaceApiKeys.name,
      keyPrefix: workspaceApiKeys.keyPrefix,
      createdBy: workspaceApiKeys.createdBy,
      createdAt: workspaceApiKeys.createdAt,
      lastUsedAt: workspaceApiKeys.lastUsedAt,
      expiresAt: workspaceApiKeys.expiresAt,
      revokedAt: workspaceApiKeys.revokedAt,
    })
    .from(workspaceApiKeys)
    .where(eq(workspaceApiKeys.workspaceId, workspaceId))
    .orderBy(workspaceApiKeys.createdAt);
}
