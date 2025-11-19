'use client';

import Safe, { EthSafeTransaction } from '@safe-global/protocol-kit';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { Address, Hex, encodeFunctionData } from 'viem';
import { base, arbitrum } from 'viem/chains';
import type { Chain } from 'viem/chains';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

/** 65‑byte pre‑validated signature (v = 1, r = owner, s = 0). */
export const buildPrevalidatedSig = (owner: `0x${string}`): `0x${string}` =>
  `0x000000000000000000000000${owner.slice(2)}000000000000000000000000000000000000000000000000000000000000000001`;

const APPROVE_HASH_ABI = [
  { name: 'approveHash', type: 'function', inputs: [{ type: 'bytes32' }] },
] as const;

/**
 * Helper to get RPC URL for a chain ID
 */
function getRpcUrlForChain(chainId: number): string {
  if (chainId === SUPPORTED_CHAINS.ARBITRUM) {
    return (
      process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'
    );
  }
  if (chainId === SUPPORTED_CHAINS.MAINNET) {
    return (
      process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'
    );
  }
  return getBaseRpcUrl(); // Default to Base
}

/**
 * Helper to get Chain object for a chain ID
 */
function getChainForId(chainId: number): Chain {
  if (chainId === SUPPORTED_CHAINS.ARBITRUM) {
    return arbitrum;
  }
  return base;
}

/* -------------------------------------------------------------------------- */
/*                               buildSafeTx                                  */
/* -------------------------------------------------------------------------- */

type BuildOpts = {
  safeAddress: Address;
  chainId?: number; // Optional chainId to select correct RPC
  gas?: bigint | string;
};

/** create a SafeTx with optional overridden safeTxGas */
export async function buildSafeTx(
  txs: MetaTransactionData[],
  { safeAddress, chainId, gas = 200_000n }: BuildOpts,
): Promise<EthSafeTransaction> {
  console.log(
    `building safe tx for ${safeAddress} on chain ${chainId || 'default(base)'}`,
  );

  // Determine provider URL based on chainId
  const providerUrl = chainId ? getRpcUrlForChain(chainId) : getBaseRpcUrl();

  const sdk = await Safe.init({ provider: providerUrl, safeAddress });

  // If only one transaction, create it directly without MultiSend
  // This avoids any delegatecall issues
  if (txs.length === 1) {
    const safeTx = await sdk.createTransaction({
      transactions: txs,
      options: {
        safeTxGas: gas.toString(),
      },
    });
    return safeTx;
  }

  // For multiple transactions, use MultiSendCallOnly with onlyCalls: true
  const safeTx = await sdk.createTransaction({
    transactions: txs,
    onlyCalls: true, // Use regular calls instead of delegatecall to MultiSend
    options: {
      safeTxGas: gas.toString(),
    },
  });

  return safeTx;
}

/* -------------------------------------------------------------------------- */
/*                               relaySafeTx                                  */
/* -------------------------------------------------------------------------- */

export const SAFE_ABI = [
  /* -------- write / tx ---------- */
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
  smartClient: { sendTransaction: Function; signTypedData?: Function },
  safeAddress: Address,
  chain?: Chain, // Explicit Chain object for the wallet client
  providerUrl?: string, // Kept for backward compatibility but unused here
  opts: { skipPreSig?: boolean } = {},
): Promise<Hex> {
  if (!opts.skipPreSig) {
    const preSig = buildPrevalidatedSig(signerAddress as `0x${string}`);
    safeTx.addSignature({ signer: signerAddress, data: preSig } as any);
  }

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

  // If no chain provided, default to Base, but for cross-chain we expect it passed or implied by smartClient
  const targetChain = chain || base;

  console.log('[relaySafeTx] Sending transaction:', {
    chainId: targetChain.id,
    chainName: targetChain.name,
    safeAddress,
    signerAddress,
  });

  return smartClient.sendTransaction(
    {
      chain: targetChain,
      to: safeAddress,
      data: execData,
      value: 0n,
    },
    {
      uiOptions: {
        showWalletUIs: false,
      },
    },
  );
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
    providerUrl = getBaseRpcUrl(),
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
    chainId: chain?.id,
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
    chainId: chain?.id,
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

/* -------------------------------------------------------------------------- */
/*                            getSafeTxHash                                   */
/* -------------------------------------------------------------------------- */

/**
 * Calculate the transaction hash for a Safe transaction
 * Useful for signing the hash (EOA owner) before relaying
 */
export async function getSafeTxHash(
  safeAddress: Address,
  safeTx: EthSafeTransaction,
  chainId: number,
): Promise<string> {
  const providerUrl = getRpcUrlForChain(chainId);
  const sdk = await Safe.init({ provider: providerUrl, safeAddress });
  return sdk.getTransactionHash(safeTx);
}
