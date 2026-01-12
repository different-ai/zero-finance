import { NextRequest } from 'next/server';
import { validateApiKey, type ApiKeyContext } from '@/lib/mcp/api-key';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_TOKEN_HEADER = 'x-admin-token';

export async function authenticateApiKeyRequest(
  request: NextRequest,
): Promise<ApiKeyContext | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const apiKey = authHeader.slice(7);
  const devMagicKey = process.env.MCP_DEV_MAGIC_KEY;

  if (
    process.env.NODE_ENV === 'development' &&
    devMagicKey &&
    apiKey === devMagicKey
  ) {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.name, 'Demo Workspace'),
    });

    if (workspace) {
      return {
        workspaceId: workspace.id,
        workspaceName: workspace.name || 'Test Workspace',
        keyId: 'dev-magic-key',
        keyName: 'Dev Magic Key',
        alignCustomerId: workspace.alignCustomerId,
        isMockMode: true,
      };
    }
  }

  return validateApiKey(apiKey);
}

export function hasValidAdminToken(request: NextRequest): boolean {
  const expectedToken = process.env.ADMIN_SECRET_TOKEN;
  if (!expectedToken) {
    return false;
  }

  const provided = request.headers.get(ADMIN_TOKEN_HEADER);
  return !!provided && provided === expectedToken;
}
