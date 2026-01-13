import { NextResponse } from 'next/server';
import { getUserById, getUserId } from '@/lib/auth';
import { createApiKey } from '@/lib/mcp/api-key';
import { db } from '@/db';
import { ensureUserWorkspace } from '@/server/utils/workspace';

export const runtime = 'nodejs';

export async function POST() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserById(userId);
  const userEmail =
    typeof user?.email === 'string'
      ? user.email
      : (user?.email?.address ?? null);

  const { workspaceId } = await ensureUserWorkspace(db, userId, userEmail);
  const keyName = `agent-bank cli ${new Date().toISOString()}`;

  const { rawKey, keyId } = await createApiKey({
    workspaceId,
    name: keyName,
    createdBy: userId,
  });

  return NextResponse.json(
    {
      apiKey: rawKey,
      keyId,
      workspaceId,
      keyName,
      message: 'Store this key securely. It will not be shown again.',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
