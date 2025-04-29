/**
 * one-shot demo:
 *  – nested safe executes USDC.transfer()
 *  – primary safe sponsors & signs the call
 *  – whole thing is bundled in a single multisend delegatecall
 *
 * prerequisites
 *  • BOTH safes are ≥ v1.3 on Base
 *  • nested.threshold == 1 and owners = [PRIMARY]
 *  • PRIMARY is owned by your privy wallet EOA (so relaySafeTx can pre-sig)
 */

import Safe from '@safe-global/protocol-kit';
import { encodeMultiSendData } from '@safe-global/safe-core-sdk-utils';
import { encodeFunctionData } from 'viem';
import { relaySafeTx, buildContractSig, buildSafeTx, SAFE_ABI } from '../lib/sponsor-tx/core';
import { erc20Abi, type Address } from 'viem';
import dotenv from 'dotenv';
dotenv.config();

// ─────────────────── env ───────────────────
const RPC       = 'https://mainnet.base.org';
const NESTED    = '0x5199E9372E5D9a1db576844b0ed5c6c98d086E63' as Address;
const PRIMARY   = '0x1FB6A7E6AcEe45664F8218a05F21F7D0f20ad2c7' as Address;
const SENDER    = process.env.PRIVY_WALLET as Address || '0x0000000000000000000000000000000000000000' as Address;     // your EOA
const USDC      = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;    // Base USDC
const DEST      = '0x0000000000000000000000000000000000000001' as Address;    // where to send
const AMOUNT    = 1_000_000n;                                      // 1 USDC (6 decimals)

// smart-wallet client that has .sendTransaction({ to, data, value, chain })
import { getPrivyClient } from './getPrivyClient';                 // <- your helper

async function main() {
  const smartClient = await getPrivyClient();

  // ─────────────────── 1. build the *business* call inside nested ─────────────
  const transferCalldata = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [DEST, AMOUNT],
  });

  const nestedTx = await buildSafeTx(
    [
      {
        to: USDC as Address,
        value: '0',
        data: transferCalldata,
        operation: 0,
      },
    ],
    { safeAddress: NESTED, providerUrl: RPC },
  );

  // ─────────────────── 2. ask Safe for the expected txHash ────────────────────
  const nestedSdk  = await Safe.init({ provider: RPC, safeAddress: NESTED });
  const txHash     = await nestedSdk.getTransactionHash(nestedTx);

  // ─────────────────── 3. meta-tx #1  approveHash(txHash) ─────────────────────
  const approveMeta = {
    to: NESTED,
    value: '0',
    data: encodeFunctionData({
      abi: [{ name: 'approveHash', type: 'function', inputs: [{ type: 'bytes32' }] }] as const,
      functionName: 'approveHash',
      args: [txHash as `0x${string}`],
    }),
    operation: 0,
  };

  // ─────────────────── 4. meta-tx #2  nested execTransaction(sig=contract) ───
  const contractSig = buildContractSig(PRIMARY);
  nestedTx.addSignature({ signer: PRIMARY, data: contractSig } as any);

  // Define ExecTxArgs type to match core.ts exports
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

  const execArgs: ExecTxArgs = [
    nestedTx.data.to as Address,
    BigInt(nestedTx.data.value),
    nestedTx.data.data as `0x${string}`,
    nestedTx.data.operation,
    BigInt(nestedTx.data.safeTxGas),
    BigInt(nestedTx.data.baseGas),
    BigInt(nestedTx.data.gasPrice),
    nestedTx.data.gasToken as Address,
    nestedTx.data.refundReceiver as Address,
    nestedTx.encodedSignatures() as `0x${string}`
  ];

  const nestedExecMeta = {
    to: NESTED,
    value: '0',
    data: encodeFunctionData({ abi: SAFE_ABI, functionName: 'execTransaction', args: execArgs }),
    operation: 0,
  };

  // ─────────────────── 5. pack with MultiSend (delegatecall) ──────────────────
  const MULTISEND = '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761' as const;
  const multiSendData = encodeMultiSendData([approveMeta, nestedExecMeta]);

  const multiSendMeta = {
    to: MULTISEND,
    value: '0',
    data: multiSendData,
    operation: 1,   // DELEGATECALL
  };

  // ─────────────────── 6. execute from PRIMARY via relaySafeTx ────────────────
  const primarySafeTx = await buildSafeTx([multiSendMeta], { safeAddress: PRIMARY, providerUrl: RPC });

  const userOpHash = await relaySafeTx(
    primarySafeTx,
    SENDER,
    smartClient,
    PRIMARY,
    undefined,
    RPC,
  );

  console.log('submitted userOp', userOpHash);
}

main().catch(console.error); 