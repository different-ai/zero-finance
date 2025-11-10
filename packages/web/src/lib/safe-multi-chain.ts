import {
  createWalletClient,
  createPublicClient,
  http,
  encodeFunctionData,
  parseAbi,
  type Address,
  type Hex,
  getAddress,
  keccak256,
  encodePacked,
} from 'viem';
import { base, arbitrum } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { getPublicClient, getArbitrumRpcUrl } from './multi-chain-clients';
import { getBaseRpcUrl } from './base-rpc-url';

// Safe canonical addresses (same on all EVM chains)
// These MUST be checksummed correctly for viem validation
export const SAFE_PROXY_FACTORY = '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67';
export const SAFE_SINGLETON_141 = '0x41675C099F32341bf84BFc5382aF534df5C7461a'; // Fixed checksum
export const COMPATIBILITY_FALLBACK_HANDLER =
  '0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99';

export const BASE_CHAIN_ID = 8453;
export const ARBITRUM_CHAIN_ID = 42161;

// Safe ABI for reading configuration
const SAFE_ABI = parseAbi([
  'function getOwners() view returns (address[])',
  'function getThreshold() view returns (uint256)',
  'function nonce() view returns (uint256)',
]);

// Safe Singleton ABI for setup
const SAFE_SINGLETON_ABI = parseAbi([
  'function setup(address[] calldata _owners, uint256 _threshold, address to, bytes calldata data, address fallbackHandler, address paymentToken, uint256 payment, address payable paymentReceiver) external',
]);

// Safe Proxy Factory ABI
const SAFE_PROXY_FACTORY_ABI = parseAbi([
  'function createProxyWithNonce(address _singleton, bytes memory initializer, uint256 saltNonce) public returns (address proxy)',
  'function proxyCreationCode() public pure returns (bytes memory)',
]);

export type SafeConfiguration = {
  owners: Address[];
  threshold: number;
  safeAddress: Address;
};

/**
 * Check if a Safe exists on a specific chain
 */
export async function checkSafeExists(
  safeAddress: Address,
  chainId: number
): Promise<boolean> {
  try {
    const client = getPublicClient(chainId);

    const code = await client.getCode({ address: safeAddress });

    // Safe exists if bytecode is not empty
    return code !== undefined && code !== '0x';
  } catch (error) {
    console.error(
      `[Safe Multi-Chain] Error checking Safe existence on chain ${chainId}:`,
      error
    );
    return false;
  }
}

/**
 * Get Safe configuration from a source chain (usually Base)
 */
export async function getSafeConfiguration(
  safeAddress: Address,
  sourceChainId: number = BASE_CHAIN_ID
): Promise<SafeConfiguration> {
  const client = getPublicClient(sourceChainId);

  const normalizedAddress = getAddress(safeAddress);

  console.log(
    `[Safe Multi-Chain] Fetching Safe config for ${normalizedAddress} on chain ${sourceChainId}`
  );

  const [owners, threshold] = await Promise.all([
    client.readContract({
      address: normalizedAddress,
      abi: SAFE_ABI,
      functionName: 'getOwners',
    }),
    client.readContract({
      address: normalizedAddress,
      abi: SAFE_ABI,
      functionName: 'getThreshold',
    }),
  ]);

  // CRITICAL: Sort owners to ensure deterministic address
  const sortedOwners = [...owners].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  ) as Address[];

  console.log(
    `[Safe Multi-Chain] Config: ${sortedOwners.length} owners, threshold ${threshold}`
  );

  return {
    owners: sortedOwners,
    threshold: Number(threshold),
    safeAddress: normalizedAddress,
  };
}

/**
 * Predict Safe address before deployment (for verification)
 */
export function predictSafeAddress(
  owners: Address[],
  threshold: number,
  saltNonce: bigint = 0n
): Address {
  // Sort owners to ensure deterministic result
  const sortedOwners = [...owners].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  // Encode initializer data
  const initializerData = encodeFunctionData({
    abi: SAFE_SINGLETON_ABI,
    functionName: 'setup',
    args: [
      sortedOwners,
      BigInt(threshold),
      '0x0000000000000000000000000000000000000000',
      '0x',
      COMPATIBILITY_FALLBACK_HANDLER,
      '0x0000000000000000000000000000000000000000',
      0n,
      '0x0000000000000000000000000000000000000000',
    ],
  });

  // Calculate salt
  const salt = keccak256(
    encodePacked(['bytes32', 'uint256'], [keccak256(initializerData), saltNonce])
  );

  // Proxy creation code (minimal proxy bytecode)
  const PROXY_CREATION_CODE =
    '0x608060405234801561001057600080fd5b506040516101e63803806101e68339818101604052602081101561003357600080fd5b8101908080519060200190929190505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806101c46022913960400191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060ab806101196000396000f3fe608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea2646970667358221220d1429297349653a4918076d650332de1a1068c5f3e07c5c82360c277770b955264736f6c63430007060033';

  // Encode deployment data (proxy creation code + singleton address)
  const deploymentData = encodePacked(
    ['bytes', 'uint256'],
    [PROXY_CREATION_CODE as Hex, BigInt(SAFE_SINGLETON_141)]
  );

  // Calculate CREATE2 address
  const hash = keccak256(
    encodePacked(
      ['bytes1', 'address', 'bytes32', 'bytes32'],
      ['0xff', SAFE_PROXY_FACTORY, salt, keccak256(deploymentData)]
    )
  );

  // Take last 20 bytes
  const address = `0x${hash.slice(-40)}` as Address;

  return getAddress(address);
}

/**
 * Deploy Safe on destination chain with same configuration
 */
export async function deploySafeOnChain(
  config: SafeConfiguration,
  destinationChainId: number,
  saltNonce: bigint = 0n
): Promise<{ hash: Hex; safeAddress: Address }> {
  console.log(
    `[Safe Multi-Chain] Deploying Safe on chain ${destinationChainId}...`
  );
  console.log(
    `[Safe Multi-Chain] Owners: ${config.owners.join(', ')}, Threshold: ${config.threshold}`
  );

  // 1. Predict address for verification
  const predictedAddress = predictSafeAddress(
    config.owners,
    config.threshold,
    saltNonce
  );
  console.log(`[Safe Multi-Chain] Predicted address: ${predictedAddress}`);

  // 2. Verify it matches the expected address
  if (
    predictedAddress.toLowerCase() !== config.safeAddress.toLowerCase()
  ) {
    console.warn(
      `[Safe Multi-Chain] WARNING: Predicted address ${predictedAddress} doesn't match expected ${config.safeAddress}`
    );
    console.warn(
      `[Safe Multi-Chain] This might happen if saltNonce is different. Proceeding anyway...`
    );
  }

  // 3. Create initializer data
  const initializerData = encodeFunctionData({
    abi: SAFE_SINGLETON_ABI,
    functionName: 'setup',
    args: [
      config.owners,
      BigInt(config.threshold),
      '0x0000000000000000000000000000000000000000',
      '0x',
      COMPATIBILITY_FALLBACK_HANDLER,
      '0x0000000000000000000000000000000000000000',
      0n,
      '0x0000000000000000000000000000000000000000',
    ],
  });

  // 4. Get relayer account
  const relayerPk = process.env.RELAYER_PK;
  if (!relayerPk) {
    throw new Error(
      'RELAYER_PK environment variable not set. Cannot deploy Safe.'
    );
  }

  // Ensure private key starts with 0x
  const formattedPk = relayerPk.startsWith('0x') ? relayerPk : `0x${relayerPk}`;
  const relayerAccount = privateKeyToAccount(formattedPk as Hex);
  console.log(`[Safe Multi-Chain] Deploying from relayer: ${relayerAccount.address}`);

  // 5. Create wallet client for destination chain
  const chain = destinationChainId === ARBITRUM_CHAIN_ID ? arbitrum : base;
  const rpcUrl =
    destinationChainId === ARBITRUM_CHAIN_ID
      ? getArbitrumRpcUrl()
      : getBaseRpcUrl();

  const walletClient = createWalletClient({
    account: relayerAccount,
    chain,
    transport: http(rpcUrl),
  });

  // 6. Deploy Safe via ProxyFactory
  console.log(`[Safe Multi-Chain] Sending deployment transaction...`);

  const hash = await walletClient.writeContract({
    address: SAFE_PROXY_FACTORY,
    abi: SAFE_PROXY_FACTORY_ABI,
    functionName: 'createProxyWithNonce',
    args: [SAFE_SINGLETON_141, initializerData, saltNonce],
  });

  console.log(`[Safe Multi-Chain] Deployment tx hash: ${hash}`);

  // 7. Wait for confirmation
  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 1,
  });

  console.log(
    `[Safe Multi-Chain] Deployment confirmed in block ${receipt.blockNumber}`
  );

  // 8. Verify Safe exists
  const exists = await checkSafeExists(config.safeAddress, destinationChainId);
  if (!exists) {
    throw new Error(
      `Safe deployment succeeded but Safe doesn't exist at ${config.safeAddress}`
    );
  }

  console.log(
    `[Safe Multi-Chain] ✅ Safe deployed successfully at ${config.safeAddress} on chain ${destinationChainId}`
  );

  return {
    hash,
    safeAddress: config.safeAddress,
  };
}

/**
 * Ensure Safe exists on destination chain (deploy if needed)
 */
export async function ensureSafeOnChain(
  safeAddress: Address,
  sourceChainId: number,
  destinationChainId: number
): Promise<{ exists: boolean; deployed: boolean; hash?: Hex }> {
  console.log(
    `[Safe Multi-Chain] Ensuring Safe ${safeAddress} exists on chain ${destinationChainId}...`
  );

  // 1. Check if Safe already exists
  const exists = await checkSafeExists(safeAddress, destinationChainId);

  if (exists) {
    console.log(`[Safe Multi-Chain] Safe already exists on chain ${destinationChainId}`);
    return { exists: true, deployed: false };
  }

  console.log(
    `[Safe Multi-Chain] Safe doesn't exist on chain ${destinationChainId}, deploying...`
  );

  // 2. Get Safe configuration from source chain
  const config = await getSafeConfiguration(safeAddress, sourceChainId);

  // 3. Deploy Safe on destination chain
  const result = await deploySafeOnChain(config, destinationChainId);

  return {
    exists: true,
    deployed: true,
    hash: result.hash,
  };
}
