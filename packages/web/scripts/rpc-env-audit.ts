#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type EnvMap = Record<string, string>;

type RpcVarInfo = {
  name: string;
  isSet: boolean;
  provider: string;
  origin: string;
  looksSecret: boolean;
};

function parseEnvFile(filePath: string): EnvMap {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env: EnvMap = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function safeOrigin(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return '';
  }
}

function classifyProvider(url: string): {
  provider: string;
  looksSecret: boolean;
} {
  const origin = safeOrigin(url);
  if (!origin) return { provider: 'invalid_url', looksSecret: false };

  const host = new URL(origin).host.toLowerCase();
  const full = url.toLowerCase();

  if (host.includes('alchemy.com') || full.includes('alchemy.com')) {
    return { provider: 'alchemy', looksSecret: /\/v2\//.test(full) };
  }
  if (host.includes('infura.io') || full.includes('infura.io')) {
    return { provider: 'infura', looksSecret: /\/v3\//.test(full) };
  }
  if (host === 'mainnet.base.org') {
    return { provider: 'base_public', looksSecret: false };
  }
  if (host.includes('llamarpc.com')) {
    return { provider: 'llamarpc', looksSecret: false };
  }
  if (host.includes('drpc.org')) {
    return { provider: 'drpc', looksSecret: false };
  }

  return { provider: host, looksSecret: /\/v(2|3)\//.test(full) };
}

function auditRpcVars(env: EnvMap): RpcVarInfo[] {
  const rpcKeys = Object.keys(env)
    .filter((k) => /RPC_URL/i.test(k))
    .sort((a, b) => a.localeCompare(b));

  return rpcKeys.map((name) => {
    const value = env[name] ?? '';
    const isSet = value.trim().length > 0;

    const origin = isSet ? safeOrigin(value) : '';
    const { provider, looksSecret } = isSet
      ? classifyProvider(value)
      : { provider: 'unset', looksSecret: false };

    return {
      name,
      isSet,
      provider,
      origin,
      looksSecret,
    };
  });
}

function summarizeEnvironment(label: string, filePath: string, env: EnvMap) {
  const rpc = auditRpcVars(env);

  const baseServer = rpc.find((r) => r.name === 'BASE_RPC_URL');
  const basePublic = rpc.find((r) => r.name === 'NEXT_PUBLIC_BASE_RPC_URL');

  const baseMismatch =
    baseServer?.isSet &&
    basePublic?.isSet &&
    baseServer.origin &&
    basePublic.origin &&
    baseServer.origin !== basePublic.origin;

  const baseSame =
    baseServer?.isSet &&
    basePublic?.isSet &&
    baseServer.origin &&
    basePublic.origin &&
    baseServer.origin === basePublic.origin;

  console.log(`\n=== ${label} ===`);
  console.log(`File: ${filePath}`);
  console.log(`Total env vars: ${Object.keys(env).length}`);
  console.log(`RPC vars found (name contains RPC_URL): ${rpc.length}`);

  if (baseServer || basePublic) {
    console.log('\nBase RPC summary:');
    if (baseServer) {
      console.log(
        `- BASE_RPC_URL: ${baseServer.isSet ? 'set' : 'unset'} (${baseServer.provider}${baseServer.origin ? ` @ ${baseServer.origin}` : ''})`,
      );
    }
    if (basePublic) {
      console.log(
        `- NEXT_PUBLIC_BASE_RPC_URL: ${basePublic.isSet ? 'set' : 'unset'} (${basePublic.provider}${basePublic.origin ? ` @ ${basePublic.origin}` : ''})`,
      );
    }
    if (baseMismatch) {
      console.log(
        '- NOTE: BASE_RPC_URL and NEXT_PUBLIC_BASE_RPC_URL point to different providers.',
      );
    } else if (baseSame) {
      console.log(
        '- NOTE: BASE_RPC_URL and NEXT_PUBLIC_BASE_RPC_URL share the same provider origin.',
      );
    }

    const publicLooksSecret = Boolean(
      basePublic?.isSet && basePublic.looksSecret,
    );
    if (publicLooksSecret) {
      console.log(
        '- WARNING: NEXT_PUBLIC_BASE_RPC_URL looks like it may contain a provider key. Avoid exposing provider keys client-side.',
      );
    }
  }

  console.log('\nAll RPC vars (sanitized):');
  for (const item of rpc) {
    const suffix = item.isSet
      ? `${item.provider}${item.origin ? ` @ ${item.origin}` : ''}`
      : 'unset';
    console.log(`- ${item.name}: ${suffix}`);
  }
}

function repoRoot(): string {
  const filePath = fileURLToPath(import.meta.url);
  const dir = path.dirname(filePath);
  // packages/web/scripts -> repo root is ../../..
  return path.resolve(dir, '..', '..', '..');
}

function main() {
  const root = repoRoot();
  const args = process.argv.slice(2);

  const defaultFiles: Array<{ label: string; filePath: string }> = [
    {
      label: 'Vercel env (.env.local)',
      filePath: path.join(root, '.env.local'),
    },
    {
      label: 'Vercel preview snapshot (research/.env.vercel.preview)',
      filePath: path.join(root, 'research', '.env.vercel.preview'),
    },
    {
      label: 'Vercel production snapshot (research/.env.vercel.production)',
      filePath: path.join(root, 'research', '.env.vercel.production'),
    },
  ];

  const fileSpecs =
    args.length > 0
      ? args.map((filePath, idx) => ({
          label: `Env file #${idx + 1}`,
          filePath: path.isAbsolute(filePath)
            ? filePath
            : path.join(root, filePath),
        }))
      : defaultFiles;

  for (const spec of fileSpecs) {
    if (!fs.existsSync(spec.filePath)) {
      console.log(`\n=== ${spec.label} ===`);
      console.log(`File not found: ${spec.filePath}`);
      continue;
    }

    const env = parseEnvFile(spec.filePath);
    summarizeEnvironment(spec.label, spec.filePath, env);
  }
}

main();
