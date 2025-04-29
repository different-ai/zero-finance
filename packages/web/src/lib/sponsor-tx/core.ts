import Safe, { EthSafeTransaction } from '@safe-global/protocol-kit';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { Address, encodeFunctionData, type Hex } from 'viem';
import { base } from 'viem/chains';
import type { Chain } from 'viem/chains';

// 1. describe the ABI-level argument list once
type ExecTxArgs = [
  Address,
  bigint, // value
  `0x${string}`, // data
  number, // operation
  bigint, // safeTxGas
  bigint, // baseGas
  bigint, // gasPrice
  Address, // gasToken
  Address, // refundReceiver
  `0x${string}`, // signatures
];

const SAFE_1_4_1_ABI = [
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

/**
 * Generates a 65-byte pre-validated signature suitable for Safe contracts.
 * This indicates that the transaction is signed by the sender (msg.sender)
 * and requires no further EOA signature verification on-chain.
 * @param owner The address of the owner initiating the transaction.
 * @returns A 65-byte hex string representing the pre-validated signature.
 */
export const buildPrevalidatedSig = (owner: `0x${string}`): `0x${string}` =>
  ('0x' +
    '00'.repeat(12) + // 12 bytes zero-padding
    owner.slice(2).toLowerCase() + // 20-byte owner address (lowercase)
    '00'.repeat(32) + // 32-byte s = 0
    '01') as `0x${string}`; // v = 1

/**
 * Options for building a Safe transaction.
 */
type BuildOpts = {
  safeAddress: Address;
  providerUrl?: string; // fallbacks to public base rpc
  gas?: bigint | string; // pass if you want to skip manual tweak later
};

/**
 * Initializes the Safe SDK and creates a Safe transaction object.
 * @param txs An array of meta-transactions to include in the Safe transaction.
 * @param opts Configuration options including the Safe address and optional provider URL/gas.
 * @returns A Promise resolving to the prepared SafeTransaction object.
 */
export async function buildSafeTx(
  txs: MetaTransactionData[],
  {
    safeAddress,
    providerUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL ||
      'https://mainnet.base.org', // Use env var or default
    gas,
  }: BuildOpts,
): Promise<EthSafeTransaction> {
  const safeSdk = await Safe.init({ provider: providerUrl, safeAddress });
  const safeTx = await safeSdk.createTransaction({ transactions: txs });
  // Allow overriding default gas estimation, falling back to a reasonable default
  safeTx.data.safeTxGas = gas?.toString() ?? '220000';
  return safeTx;
}

/**
 * Relays a prepared Safe transaction using a smart wallet client (like Privy's).
 * It adds the pre-validated signature and uses the smart client to send the `execTransaction` call.
 * @param safeTx The prepared SafeTransaction object from `buildSafeTx`.
 * @param signerAddress The address that will be msg.sender inside the Safe call.
 * @param smartClient The smart wallet client instance (e.g., from Privy `useSmartWallets`).
 * @param safeAddress The Safe contract address.
 * @param chain The target blockchain (defaults to Base).
 * @param providerUrl The provider URL for initializing the Safe SDK (defaults to Base).
 * @returns A Promise resolving to the transaction hash (user operation hash) of the relayed transaction.
 */
export async function relaySafeTx(
  safeTx: EthSafeTransaction,
  signerAddress: Address,
  smartClient: { sendTransaction: Function },
  safeAddress: Address,
  chain: Chain = base,
  providerUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL ||
    'https://mainnet.base.org',
): Promise<Hex> {
  const preSig = buildPrevalidatedSig(signerAddress as `0x${string}`);
  safeTx.addSignature({ signer: signerAddress, data: preSig } as any);

  // Initialize Safe SDK within the relay function to get contract access
  const safeSdk = await Safe.init({
    provider: providerUrl,
    safeAddress,
  });

  // Access contract manager and contract through the initialized SDK instance
  const contractManager = safeSdk.getContractManager();
  const safeContract = contractManager.safeContract; // Access as property
  if (!safeContract) {
    throw new Error('Failed to get Safe contract instance.');
  }
  // 2. build the args separately – **no complex union here**
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

  // Encode execTransaction using the contract instance

  const execData: Hex = encodeFunctionData({
    abi: SAFE_1_4_1_ABI,
    functionName: 'execTransaction',
    args: execArgs, // the tuple you already prepared
  });
  // 3. feed them to the encoder

  return smartClient.sendTransaction({
    chain,
    to: safeAddress,
    data: execData,
    value: 0n,
  });
}
