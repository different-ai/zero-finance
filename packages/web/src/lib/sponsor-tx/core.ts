'use client';

import Safe, {
  // encodeMultiSendData,
  EthSafeTransaction,
} from '@safe-global/protocol-kit';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { Address, Hex, encodeFunctionData } from 'viem';
import { base } from 'viem/chains';
import type { Chain } from 'viem/chains';
// at the top of both core.ts and page.tsx

/** canonical multisend on every chain (v1.3+ safes) */
// export const MULTISEND_ADDRESS =
//   '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761' as const;

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

/** 65‑byte pre‑validated signature (v = 1, r = owner, s = 0). */
export const buildPrevalidatedSig = (owner: `0x${string}`): `0x${string}` =>
  ('0x' +
    '00'.repeat(12) +
    owner.slice(2).toLowerCase() +
    '00'.repeat(32) +
    '01') as `0x${string}`;

/** 65‑byte “contract” signature (v = 0, r = owner, s = 0x20, empty payload). */
export const buildContractSig = (owner: `0x${string}`): `0x${string}` => {
  /* r = owner (left‑padded to 32 bytes) */
  const r = '00'.repeat(12) + owner.slice(2).toLowerCase();
  /* s = 0x20 (pointer to the 32‑byte empty payload appended after the first 65 bytes) */
  const s = '00'.repeat(31) + '20';
  /* v = 0 => contract signature */
  const v = '00';
  /* 32‑byte empty payload (length = 0) */
  const payload = '00'.repeat(32);
  return ('0x' + r + s + v + payload) as `0x${string}`;
};

const APPROVE_HASH_ABI = [
  { name: 'approveHash', type: 'function', inputs: [{ type: 'bytes32' }] },
] as const;

export const buildApproveHashCalldata = (txHash: `0x${string}`): Hex =>
  encodeFunctionData({
    abi: APPROVE_HASH_ABI,
    functionName: 'approveHash',
    args: [txHash],
  });

/* -------------------------------------------------------------------------- */
/*                               buildSafeTx                                  */
/* -------------------------------------------------------------------------- */

type BuildOpts = {
  safeAddress: Address;
  providerUrl?: string;
  gas?: bigint | string;
};

/** create a SafeTx with optional overridden safeTxGas */
export async function buildSafeTx(
  txs: MetaTransactionData[],
  {
    safeAddress,
    providerUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL ||
      'https://mainnet.base.org',
  }: BuildOpts,
): Promise<EthSafeTransaction> {
  console.log('building safe tx', safeAddress);
  const sdk = await Safe.init({ provider: providerUrl, safeAddress });
  const safeTx = await sdk.createTransaction({ transactions: txs });

  return safeTx;
}

/* -------------------------------------------------------------------------- */
/*                               relaySafeTx                                  */
/* -------------------------------------------------------------------------- */

export const SAFE_ABI = [
  {
    name: 'execTransaction',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'data', type: 'bytes' },
      { name: 'operation', type: 'uint8' },
      { name: 'safeTxGas', type: 'uint256' },
      { name: 'baseGas', type: 'uint256' },
      { name: 'gasPrice', type: 'uint256' },
      { name: 'gasToken', type: 'address' },
      { name: 'refundReceiver', type: 'address' },
      { name: 'signatures', type: 'bytes' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;

type ExecTxArgs = [
  Address,
  bigint,
  `0x${string}`,
  number,
  bigint,
  bigint,
  bigint,
  Address,
  Address,
  `0x${string}`,
];

/** relay a prepared SafeTx through a privy smart‑wallet client */
export async function relaySafeTx(
  safeTx: EthSafeTransaction,
  signerAddress: Address,
  smartClient: { sendTransaction: Function },
  safeAddress: Address,
  chain: Chain = base,
  providerUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL ||
    'https://mainnet.base.org',
  opts: { skipPreSig?: boolean } = {},
): Promise<Hex> {
  console.log('relaying safe tx', safeAddress);
  if (!opts.skipPreSig) {
    const preSig = buildPrevalidatedSig(signerAddress as `0x${string}`);
    safeTx.addSignature({ signer: signerAddress, data: preSig } as any);
  }
  console.log('safeTx', safeTx);
  const execArgs: ExecTxArgs = [
    safeTx.data.to as Address,
    BigInt(safeTx.data.value),
    safeTx.data.data as `0x${string}`,
    safeTx.data.operation,
    BigInt(safeTx.data.safeTxGas),
    BigInt(safeTx.data.baseGas),
    BigInt(safeTx.data.gasPrice),
    safeTx.data.gasToken as Address,
    safeTx.data.refundReceiver as Address,
    safeTx.encodedSignatures() as `0x${string}`,
  ];

  const execData = encodeFunctionData({
    abi: SAFE_ABI,
    functionName: 'execTransaction',
    args: execArgs,
  });

  return smartClient.sendTransaction({
    chain,
    to: safeAddress,
    data: execData,
    value: 0n,
  });
}

/* -------------------------------------------------------------------------- */
/*                            relayNestedSafeTx                               */
/* -------------------------------------------------------------------------- */

export async function relayNestedSafeTx(
  nestedTxs: MetaTransactionData[],
  {
    nestedSafe,
    primarySafe,
    signerAddress,
    smartClient,
    chain = base,
    providerUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL ||
      'https://mainnet.base.org',
  }: {
    nestedSafe: Address;
    primarySafe: Address;
    signerAddress: Address;
    smartClient: { sendTransaction: Function };
    chain?: Chain;
    providerUrl?: string;
  },
): Promise<Hex> {
  /* ---------- build the nested SafeTx ---------- */
  console.log('building nested safe tx', nestedSafe);
  const nestedSafeTx = await buildSafeTx(nestedTxs, {
    safeAddress: nestedSafe,
    providerUrl,
  });
  console.log('nestedSafeTx', nestedSafeTx);
  /* ---------- attach a v = 1 pre‑validated sig from the PRIMARY safe ---------- */
  const preSig = buildPrevalidatedSig(primarySafe as `0x${string}`);
  nestedSafeTx.addSignature({ signer: primarySafe, data: preSig } as any);

  /* ---------- encode nestedSafe.execTransaction() ---------- */
  const execArgs: ExecTxArgs = [
    nestedSafeTx.data.to as Address,
    BigInt(nestedSafeTx.data.value),
    nestedSafeTx.data.data as `0x${string}`,
    nestedSafeTx.data.operation,
    BigInt(nestedSafeTx.data.safeTxGas),
    BigInt(nestedSafeTx.data.baseGas),
    BigInt(nestedSafeTx.data.gasPrice),
    nestedSafeTx.data.gasToken as Address,
    nestedSafeTx.data.refundReceiver as Address,
    nestedSafeTx.encodedSignatures() as `0x${string}`,
  ];

  const nestedExecMeta: MetaTransactionData = {
    to: nestedSafe,
    value: '0',
    data: encodeFunctionData({
      abi: SAFE_ABI,
      functionName: 'execTransaction',
      args: execArgs,
    }),
    operation: 0, // CALL
  };

  /* ---------- execute that meta‑tx from the primary Safe ---------- */
  const primarySafeTx = await buildSafeTx([nestedExecMeta], {
    safeAddress: primarySafe,
    providerUrl,
  });

  const txHash = await relaySafeTx(
    primarySafeTx,
    signerAddress,
    smartClient,
    primarySafe,
    chain,
    providerUrl,
  );

  return txHash;
}
