#!/usr/bin/env tsx
// setup-neon-branch.ts
// TypeScript port of the Neon branch bootstrapper.
// See `setup-neon-branch.mjs` header for detailed behaviour.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function setupNeonBranch(): Promise<void> {
  const {
    NEON_API_KEY,
    NEON_PROJECT_ID,
    NEON_BRANCH_NAME,
    NEON_DATABASE_NAME,
    NEON_ROLE_NAME,
  } = process.env;
  console.log('NEON_API_KEY', NEON_API_KEY);
  console.log('NEON_PROJECT_ID', NEON_PROJECT_ID);
  console.log('NEON_BRANCH_NAME', NEON_BRANCH_NAME);
  console.log('NEON_DATABASE_NAME', NEON_DATABASE_NAME);
  console.log('NEON_ROLE_NAME', NEON_ROLE_NAME);

  // Skip if mandatory env vars are missing.
  if (!NEON_API_KEY || !NEON_PROJECT_ID) {
    console.warn('[neon] NEON_API_KEY and/or NEON_PROJECT_ID not set – skipping Neon branch setup');
    return;
  }

  const branchName = NEON_BRANCH_NAME || `dev-${process.env.USER || 'local'}`;
  const databaseName = NEON_DATABASE_NAME || 'verceldb';
  const roleName = NEON_ROLE_NAME || `${databaseName}_owner`;

  const headers: Record<string, string> = {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: `Bearer ${NEON_API_KEY}`,
  };

  const apiBase = `https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}`;

  // Helper to call Neon API.
  async function fetchJson<T = any>(url: string, opts: RequestInit = {}): Promise<T> {
    const res = await fetch(url, { headers, ...opts });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${opts.method || 'GET'} ${url} → ${res.status} ${text}`);
    }
    return res.json() as Promise<T>;
  }

  // Types for clarity.
  interface Branch { id: string; name: string; }
  interface Endpoint { host: string; type: string; }

  // 1. Find or create branch.
  const { branches } = await fetchJson<{ branches: Branch[] }>(`${apiBase}/branches`);
  let branch = branches.find((b) => b.name === branchName);

  let branchId: string;
  let endpoint: Endpoint | undefined;

  if (branch) {
    branchId = branch.id;
    const { endpoints } = await fetchJson<{ endpoints: Endpoint[] }>(`${apiBase}/branches/${branchId}/endpoints`);
    endpoint = endpoints.find((e) => e.type === 'read_write') || endpoints[0];
  } else {
    const body = JSON.stringify({ branch: { name: branchName }, endpoints: [{ type: 'read_write' }] });
    const created = await fetchJson<{ branch: Branch; endpoints: Endpoint[] }>(`${apiBase}/branches`, {
      method: 'POST',
      body,
    });
    branch = created.branch;
    branchId = branch.id;
    endpoint = created.endpoints[0];
  }

  if (!endpoint) throw new Error(`[neon] Could not determine endpoint for branch ${branchName}`);

  // 3. Retrieve password for role (falls back to empty password on error).
  let password = '';
  try {
    const passResp = await fetchJson<{ password?: string; role?: { password?: string } }>(
      `${apiBase}/branches/${branchId}/roles/${roleName}/reveal_password`,
    );
    password = passResp.password || passResp.role?.password || '';
  } catch {
    console.warn(`[neon] Unable to fetch password for role '${roleName}'. Proceeding with empty password.`);
  }

  const host = endpoint.host;
  const connectionString = `postgres://${roleName}:${encodeURIComponent(password)}@${host}/${databaseName}?sslmode=require`;

  // 4. Persist into .env.local
  const envFile = path.join(process.cwd(), '.env.local');
  let existing = '';
  try {
    existing = await fs.readFile(envFile, 'utf8');
  } catch (err: any) {
    if (err.code !== 'ENOENT') throw err; // Ignore missing file
  }

  const newLine = `POSTGRES_URL=${connectionString}`;
  const updated = existing.match(/^POSTGRES_URL=/m)
    ? existing.replace(/^POSTGRES_URL=.*$/m, newLine)
    : existing
      ? `${existing.trimEnd()}
${newLine}
`
      : `${newLine}
`;

  await fs.writeFile(envFile, updated);
  console.log(`[neon] Using dev branch '${branchName}'. Connection string written to .env.local`);
}

// CLI execution guard
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  setupNeonBranch().catch((err) => {
    console.error('[neon] setup failed:', err.message);
    process.exit(1);
  });
}