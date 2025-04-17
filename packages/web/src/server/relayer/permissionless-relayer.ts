import { createPimlicoClient } from 'permissionless/clients/pimlico'
import { createSmartAccountClient } from 'permissionless'
import { toSafeSmartAccount } from 'permissionless/accounts'
import { entryPoint07Address } from 'viem/account-abstraction'
import { createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'

interface RelayArgs {
  chainId: number
  to: string
  value: string
  data: string
  userAddress: string
}

export async function relaySafeTx(args: RelayArgs): Promise<`0x${string}`> {
  if (args.chainId !== base.id) throw new Error('unsupported chain')

  const apiKey  = process.env.PIMLICO_API_KEY!
  const ownerPk = process.env.OWNER_PK! as `0x${string}`
  const policy  = process.env.SPONSORSHIP_POLICY_ID

  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL!),
  })

  const pimlicoUrl = `https://api.pimlico.io/v2/base/rpc?apikey=${apiKey}`
  const pimlico    = createPimlicoClient({
    transport: http(pimlicoUrl),
    entryPoint: { address: entryPoint07Address, version: '0.7' },
  })
  
  // Create Safe Account
  const safeAccount = await toSafeSmartAccount({
    client: publicClient,
    owners: [privateKeyToAccount(ownerPk)],
    entryPoint: { address: entryPoint07Address, version: '0.7' },
    version: '1.4.1',
  })

  // Create the client with appropriate options
  // Note: For Pimlico sponsorship policy, check their docs for the latest approach
  // We'll provide a minimal config here
  const sac = createSmartAccountClient({
    account: safeAccount,
    chain: base,
    bundlerTransport: http(pimlicoUrl),
    paymaster: pimlico,
    userOperation: {
      estimateFeesPerGas: async () =>
        (await pimlico.getUserOperationGasPrice()).fast,
    },
  })

  // Send the transaction
  return await sac.sendTransaction({
    to: args.to as `0x${string}`,
    value: BigInt(args.value),
    data: args.data as `0x${string}`,
  })
} 