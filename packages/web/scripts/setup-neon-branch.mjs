#!/usr/bin/env node
// setup-neon-branch.mjs
// Creates (or reuses) a per-developer Neon branch and writes the connection string
// to `.env.local` as POSTGRES_URL. This avoids accidental writes to the shared
// staging database while enabling a seamless `pnpm dev` experience.
//
// Requirements (export in your shell or your `.env`):
//   NEON_API_KEY      – a Neon API key (personal or project-scoped)
//   NEON_PROJECT_ID   – the target Neon project ID
// Optional overrides:
//   NEON_BRANCH_NAME  – name for the dev branch (defaults to `dev-${USER}`)
//   NEON_DATABASE_NAME – database to connect to (defaults to `neondb`)
//   NEON_ROLE_NAME    – Postgres role to connect as (defaults to `neondb_owner`)
//
// If mandatory env vars are missing, the script prints a warning and returns
// without blocking the rest of the dev process.

import fs from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const {
    NEON_API_KEY,
    NEON_PROJECT_ID,
    NEON_BRANCH_NAME,
    NEON_DATABASE_NAME,
    NEON_ROLE_NAME,
  } = process.env;

  // Skip silently if Neon credentials are not configured.
  if (!NEON_API_KEY || !NEON_PROJECT_ID) {
    console.warn('[neon] NEON_API_KEY and/or NEON_PROJECT_ID not set – skipping Neon branch setup');
    return;
  }

  const branchName = NEON_BRANCH_NAME || `dev-${process.env.USER || 'local'}`;
  const databaseName = NEON_DATABASE_NAME || 'neondb';
  const roleName = NEON_ROLE_NAME || `${databaseName}_owner`;

  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'authorization': `Bearer ${NEON_API_KEY}`,
  };

  const apiBase = `https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}`;

  // Helper to fetch JSON with basic error handling.
  async function fetchJson(url, opts = {}) {
    const res = await fetch(url, { headers, ...opts });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${opts.method || 'GET'} ${url} → ${res.status} ${text}`);
    }
    return res.json();
  }

  // 1. Look for an existing branch with the desired name.
  const { branches } = await fetchJson(`${apiBase}/branches`);
  let branch = branches.find(b => b.name === branchName);

  let branchId;
  let endpoint;

  if (branch) {
    branchId = branch.id;
    // Retrieve endpoints – they are not included in the list call
    const { endpoints } = await fetchJson(`${apiBase}/branches/${branchId}/endpoints`);
    endpoint = endpoints.find(e => e.type === 'read_write') || endpoints[0];
  } else {
    // 2. Create branch with a read/write compute endpoint.
    const body = JSON.stringify({
      branch: { name: branchName },
      endpoints: [{ type: 'read_write' }],
    });
    const { branch: created, endpoints } = await fetchJson(`${apiBase}/branches`, {
      method: 'POST',
      body,
    });
    branch = created;
    branchId = created.id;
    endpoint = endpoints[0];
  }

  if (!endpoint) throw new Error(`[neon] Could not determine endpoint for branch ${branchName}`);

  // 3. Grab (or reveal) the role password so we can craft a full connection string.
  let password;
  try {
    const passResp = await fetchJson(`${apiBase}/branches/${branchId}/roles/${roleName}/reveal_password`);
    password = passResp.password || passResp.role?.password;
  } catch (err) {
    console.warn(`[neon] Unable to fetch password for role '${roleName}'. Using empty password.`);
    password = '';
  }

  const host = endpoint.host;
  const connectionString = `postgres://${roleName}:${encodeURIComponent(password)}@${host}/${databaseName}?sslmode=require`;

  // 4. Write/patch POSTGRES_URL inside `.env.local`.
  const envFile = path.join(process.cwd(), '.env.local');
  let existing = '';
  try {
    existing = await fs.readFile(envFile, 'utf8');
  } catch (e) {
    if (e.code !== 'ENOENT') throw e; // Ignore missing file; create later
  }

  const newLine = `POSTGRES_URL=${connectionString}`;
  const updated = existing.match(/^POSTGRES_URL=/m)
    ? existing.replace(/^POSTGRES_URL=.*$/m, newLine)
    : (existing ? `${existing.trimEnd()}
${newLine}
` : `${newLine}
`);

  await fs.writeFile(envFile, updated);

  console.log(`[neon] Using dev branch '${branchName}'. Connection string written to .env.local`);
}

main().catch(err => {
  console.error('[neon] setup failed:', err.message);
  process.exit(1);
});