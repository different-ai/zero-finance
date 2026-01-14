#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadDotenv } from 'dotenv';
import {
  createPublicClient,
  http,
  parseAbi,
  type Address,
  type Hex,
} from 'viem';
import { base } from 'viem/chains';

import { BASE_USDC_VAULTS } from '../src/server/earn/base-vaults';

function repoRoot(): string {
  const filePath = fileURLToPath(import.meta.url);
  const dir = path.dirname(filePath);
  return path.resolve(dir, '..', '..', '..');
}

function loadEnv() {
  const root = repoRoot();
  const envPath = path.join(root, '.env.local');
  if (fs.existsSync(envPath)) {
    loadDotenv({ path: envPath });
  }
}

loadEnv();

type RpcTarget = {
  label: string;
  url: string;
};

type TimedResult<T> =
  | { ok: true; label: string; ms: number; result: T }
  | { ok: false; label: string; ms: number };

const DEFAULT_SAFE = '0x954A329e1e59101DF529CC54A54666A0b36Cae22' as Address;
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;

const ERC20_BALANCE_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
]);

const VAULT_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
]);

function safeOrigin(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return 'invalid_url';
  }
}

async function timed<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<TimedResult<T>> {
  const start = performance.now();
  try {
    const result = await fn();
    const ms = Math.round(performance.now() - start);
    return { ok: true, label, ms, result };
  } catch {
    const ms = Math.round(performance.now() - start);
    return { ok: false, label, ms };
  }
}

function pad32(hexNo0x: string): string {
  return hexNo0x.padStart(64, '0');
}

function encodeBalanceOf(owner: Address): Hex {
  // balanceOf(address) selector: 0x70a08231
  const selector = '70a08231';
  const addr = owner.toLowerCase().replace(/^0x/, '');
  return `0x${selector}${pad32(addr)}` as Hex;
}

async function jsonRpc(url: string, method: string, params: unknown[] = []) {
  const body = {
    jsonrpc: '2.0',
    id: 1,
    method,
    params,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('rpc_http_error');
  }

  const json = (await res.json()) as any;
  if (json.error) {
    throw new Error('rpc_error');
  }

  return json.result;
}

function makeRandomAddress(i: number): Address {
  const hex = i.toString(16).padStart(40, '0');
  return `0x${hex}` as Address;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    if (idx === -1) return undefined;
    return args[idx + 1];
  };

  const safe = (
    get('--safe') ??
    process.env.NEXT_PUBLIC_SAFE_ADDRESS ??
    ''
  ).trim();
  const safeAddress = (safe || DEFAULT_SAFE) as Address;

  return { safeAddress };
}

async function benchEndpoint(target: RpcTarget, safeAddress: Address) {
  const origin = safeOrigin(target.url);
  console.log(`\n=== ${target.label} (${origin}) ===`);

  const chainId = await timed('rpc:eth_chainId', () =>
    jsonRpc(target.url, 'eth_chainId'),
  );
  const blockNumber = await timed('rpc:eth_blockNumber', () =>
    jsonRpc(target.url, 'eth_blockNumber'),
  );

  if (chainId.ok) console.log(`- chainId: ${chainId.result} (${chainId.ms}ms)`);
  else console.log(`- chainId: ERROR (${chainId.ms}ms)`);

  if (blockNumber.ok)
    console.log(`- blockNumber: ${blockNumber.result} (${blockNumber.ms}ms)`);
  else console.log(`- blockNumber: ERROR (${blockNumber.ms}ms)`);

  const client = createPublicClient({
    chain: base,
    transport: http(target.url, {
      timeout: 15_000,
      batch: { batchSize: 100, wait: 16 },
    }),
    batch: { multicall: true },
  });

  const usdcBalance = await timed('viem:USDC.balanceOf(safe)', async () => {
    const raw = await client.readContract({
      address: USDC_BASE,
      abi: ERC20_BALANCE_ABI,
      functionName: 'balanceOf',
      args: [safeAddress],
    });
    return raw;
  });

  console.log(
    usdcBalance.ok
      ? `- USDC.balanceOf: ok (${usdcBalance.ms}ms)`
      : `- USDC.balanceOf: ERROR (${usdcBalance.ms}ms)`,
  );

  const vaults = BASE_USDC_VAULTS;
  console.log(`- Vaults tested: ${vaults.length}`);

  const unbatched = await timed(
    'viem:unbatched vault position reads',
    async () => {
      const positions: Array<{
        vault: string;
        shares: bigint;
        assets: bigint;
      }> = [];

      for (const vault of vaults) {
        const shares = await client.readContract({
          address: vault.address as Address,
          abi: VAULT_ABI,
          functionName: 'balanceOf',
          args: [safeAddress],
        });

        let assets = 0n;
        if (shares > 0n) {
          assets = await client.readContract({
            address: vault.address as Address,
            abi: VAULT_ABI,
            functionName: 'convertToAssets',
            args: [shares],
          });
        }

        positions.push({ vault: vault.address, shares, assets });
      }

      return positions;
    },
  );

  if (unbatched.ok) {
    const nonZero = unbatched.result.filter((p) => p.shares > 0n).length;
    console.log(
      `- Unbatched: ok (${unbatched.ms}ms, nonZeroVaults=${nonZero})`,
    );
  } else {
    console.log(`- Unbatched: ERROR (${unbatched.ms}ms)`);
  }

  const batched = await timed(
    'viem:multicall vault position reads',
    async () => {
      const balanceCalls = vaults.map((vault) => ({
        address: vault.address as Address,
        abi: VAULT_ABI,
        functionName: 'balanceOf' as const,
        args: [safeAddress],
      }));

      const sharesResults = await client.multicall({ contracts: balanceCalls });

      const convertCalls: Array<{
        address: Address;
        abi: typeof VAULT_ABI;
        functionName: 'convertToAssets';
        args: [bigint];
      }> = [];

      sharesResults.forEach((r, idx) => {
        if (
          r.status === 'success' &&
          typeof r.result === 'bigint' &&
          r.result > 0n
        ) {
          convertCalls.push({
            address: vaults[idx].address as Address,
            abi: VAULT_ABI,
            functionName: 'convertToAssets',
            args: [r.result],
          });
        }
      });

      const assetsResults =
        convertCalls.length > 0
          ? await client.multicall({ contracts: convertCalls })
          : [];

      return {
        sharesCalls: sharesResults.length,
        convertCalls: convertCalls.length,
        assetsResults: assetsResults.length,
      };
    },
  );

  if (batched.ok) {
    console.log(
      `- Multicall: ok (${batched.ms}ms, sharesCalls=${batched.result.sharesCalls}, convertCalls=${batched.result.convertCalls})`,
    );
  } else {
    console.log(`- Multicall: ERROR (${batched.ms}ms)`);
  }

  const scanSafeCounts = [25, 100, 250];
  for (const safeCount of scanSafeCounts) {
    const scan = await timed(
      `viem:admin-scan balanceOf (safes=${safeCount})`,
      async () => {
        const safeAddresses = Array.from({ length: safeCount }, (_, i) =>
          makeRandomAddress(i + 1),
        );

        const calls = vaults.flatMap((vault) =>
          safeAddresses.map((safe) => ({
            address: vault.address as Address,
            abi: VAULT_ABI,
            functionName: 'balanceOf' as const,
            args: [safe],
          })),
        );

        const results = await client.multicall({ contracts: calls });
        return { calls: calls.length, results: results.length };
      },
    );

    console.log(
      scan.ok
        ? `- Admin-scan safes=${safeCount}: ok (${scan.ms}ms, calls=${scan.result.calls})`
        : `- Admin-scan safes=${safeCount}: ERROR (${scan.ms}ms)`,
    );
  }

  const rateProbe = await timed(
    'rpc:10 parallel eth_call USDC.balanceOf',
    async () => {
      const call = { to: USDC_BASE, data: encodeBalanceOf(safeAddress) };
      const promises = Array.from({ length: 10 }, () =>
        jsonRpc(target.url, 'eth_call', [call, 'latest']),
      );

      const settled = await Promise.allSettled(promises);
      const ok = settled.filter((r) => r.status === 'fulfilled').length;
      const failed = settled.length - ok;

      return { ok, failed };
    },
  );

  console.log(
    rateProbe.ok
      ? `- Rate probe: ok (${rateProbe.ms}ms, ok=${rateProbe.result.ok}, failed=${rateProbe.result.failed})`
      : `- Rate probe: ERROR (${rateProbe.ms}ms)`,
  );
}

async function main() {
  const { safeAddress } = parseArgs();

  const builtinTargets: RpcTarget[] = [
    { label: 'base_public:mainnet.base.org', url: 'https://mainnet.base.org' },
    {
      label: 'base_public:base.llamarpc.com',
      url: 'https://base.llamarpc.com',
    },
    { label: 'base_public:base.drpc.org', url: 'https://base.drpc.org' },
  ];

  const envTargets: RpcTarget[] = [];

  if (process.env.BASE_RPC_URL) {
    envTargets.push({
      label: 'env:BASE_RPC_URL',
      url: process.env.BASE_RPC_URL,
    });
  }
  if (process.env.NEXT_PUBLIC_BASE_RPC_URL) {
    envTargets.push({
      label: 'env:NEXT_PUBLIC_BASE_RPC_URL',
      url: process.env.NEXT_PUBLIC_BASE_RPC_URL,
    });
  }

  const targets = [...envTargets, ...builtinTargets];

  console.log('Balance RPC benchmark (sanitized):');
  console.log(`- Safe tested: ${safeAddress}`);
  console.log(`- USDC: ${USDC_BASE}`);
  console.log(`- Vault count: ${BASE_USDC_VAULTS.length}`);

  for (const target of targets) {
    await benchEndpoint(target, safeAddress);
  }
}

main().catch(() => {
  console.error('Benchmark failed');
  process.exit(1);
});
