import {
  encodeFunctionData,
  parseAbi,
  type Address,
  type Hex,
  getAddress,
  keccak256,
  encodePacked,
} from 'viem';
import { getPublicClient } from './multi-chain-clients';

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
  chainId: number,
): Promise<boolean> {
  try {
    const client = getPublicClient(chainId);

    const code = await client.getCode({ address: safeAddress });

    // Safe exists if bytecode is not empty
    return code !== undefined && code !== '0x';
  } catch (error) {
    console.error(
      `[Safe Multi-Chain] Error checking Safe existence on chain ${chainId}:`,
      error,
    );
    return false;
  }
}

/**
 * Get Safe configuration from a source chain (usually Base)
 */
export async function getSafeConfiguration(
  safeAddress: Address,
  sourceChainId: number = BASE_CHAIN_ID,
): Promise<SafeConfiguration> {
  const client = getPublicClient(sourceChainId);

  const normalizedAddress = getAddress(safeAddress);

  console.log(
    `[Safe Multi-Chain] Fetching Safe config for ${normalizedAddress} on chain ${sourceChainId}`,
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
    a.toLowerCase().localeCompare(b.toLowerCase()),
  ) as Address[];

  console.log(
    `[Safe Multi-Chain] Config: ${sortedOwners.length} owners, threshold ${threshold}`,
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
  saltNonce: bigint = 0n,
): Address {
  // Sort owners to ensure deterministic result
  const sortedOwners = [...owners].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
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
    encodePacked(
      ['bytes32', 'uint256'],
      [keccak256(initializerData), saltNonce],
    ),
  );

  // Proxy creation code (minimal proxy bytecode)
  const PROXY_CREATION_CODE =
    '0x608060405234801561001057600080fd5b506040516101e63803806101e68339818101604052602081101561003357600080fd5b8101908080519060200190929190505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806101c46022913960400191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060ab806101196000396000f3fe608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea2646970667358221220d1429297349653a4918076d650332de1a1068c5f3e07c5c82360c277770b955264736f6c63430007060033';

  // Encode deployment data (proxy creation code + singleton address)
  const deploymentData = encodePacked(
    ['bytes', 'uint256'],
    [PROXY_CREATION_CODE as Hex, BigInt(SAFE_SINGLETON_141)],
  );

  // Calculate CREATE2 address
  const hash = keccak256(
    encodePacked(
      ['bytes1', 'address', 'bytes32', 'bytes32'],
      ['0xff', SAFE_PROXY_FACTORY, salt, keccak256(deploymentData)],
    ),
  );

  // Take last 20 bytes
  const address = `0x${hash.slice(-40)}` as Address;

  return getAddress(address);
}

/**
 * Generate Safe deployment transaction data (for user to sign)
 * Returns the transaction that needs to be sent to deploy the Safe
 */
export function generateSafeDeploymentTransaction(
  config: SafeConfiguration,
  destinationChainId: number,
  saltNonce: bigint = 0n,
): { to: Address; data: Hex; value: bigint } {
  console.log(
    `[Safe Multi-Chain] Generating deployment transaction for chain ${destinationChainId}...`,
  );
  console.log(
    `[Safe Multi-Chain] Owners: ${config.owners.join(', ')}, Threshold: ${config.threshold}`,
  );

  // 1. Predict address for verification
  const predictedAddress = predictSafeAddress(
    config.owners,
    config.threshold,
    saltNonce,
  );
  console.log(`[Safe Multi-Chain] Predicted address: ${predictedAddress}`);

  // 2. Verify it matches the expected address
  if (predictedAddress.toLowerCase() !== config.safeAddress.toLowerCase()) {
    console.warn(
      `[Safe Multi-Chain] WARNING: Predicted address ${predictedAddress} doesn't match expected ${config.safeAddress}`,
    );
    console.warn(
      `[Safe Multi-Chain] This might happen if saltNonce is different. Proceeding anyway...`,
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

  // 4. Encode the createProxyWithNonce call
  const deploymentData = encodeFunctionData({
    abi: SAFE_PROXY_FACTORY_ABI,
    functionName: 'createProxyWithNonce',
    args: [SAFE_SINGLETON_141, initializerData, saltNonce],
  });

  console.log(`[Safe Multi-Chain] Generated deployment transaction data`);

  return {
    to: SAFE_PROXY_FACTORY,
    data: deploymentData,
    value: 0n,
  };
}

/**
 * Check if Safe needs deployment and get deployment transaction
 * Returns null if Safe already exists, otherwise returns the deployment transaction
 */
export async function getSafeDeploymentTransaction(
  safeAddress: Address,
  sourceChainId: number,
  destinationChainId: number,
  saltNonce: bigint = 0n,
): Promise<{ to: Address; data: Hex; value: bigint } | null> {
  console.log(
    `[Safe Multi-Chain] Checking if Safe ${safeAddress} needs deployment on chain ${destinationChainId}...`,
  );

  // 1. Check if Safe already exists
  const exists = await checkSafeExists(safeAddress, destinationChainId);

  if (exists) {
    console.log(
      `[Safe Multi-Chain] Safe already exists on chain ${destinationChainId}`,
    );
    return null;
  }

  console.log(
    `[Safe Multi-Chain] Safe doesn't exist on chain ${destinationChainId}, generating deployment transaction...`,
  );

  // 2. Get Safe configuration from source chain
  const config = await getSafeConfiguration(safeAddress, sourceChainId);

  // 3. Generate deployment transaction for user to sign
  const deploymentTx = generateSafeDeploymentTransaction(
    config,
    destinationChainId,
    saltNonce,
  );

  return deploymentTx;
}
