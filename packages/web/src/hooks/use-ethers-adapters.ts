import * as React from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { type PublicClient, type WalletClient, type HttpTransport } from 'viem'
import { providers } from 'ethers'

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  if (!chain) return undefined;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId })
  return React.useMemo(() => publicClient ? publicClientToProvider(publicClient) : undefined, [publicClient])
}


export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  if (!account || !chain) return undefined;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return React.useMemo(() => walletClient ? walletClientToSigner(walletClient) : undefined, [walletClient])
} 