import { createPublicClient, http, parseAbi, encodeFunctionData, parseUnits, formatUnits } from 'viem';
import { base } from 'viem/chains';
import { erc20Abi } from 'viem'; // Import generic ERC20 ABI for allowance

// Create a public client to interact with the Base network
const pc = createPublicClient({ chain: base, transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org') });

// Define the ABI for the vault operations we need
const VAULT_ABI = parseAbi([
  'function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares)',
  'function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets)',
  'function balanceOf(address owner) external view returns (uint256 shares)',
  'function convertToAssets(uint256 shares) external view returns (uint256 assets)',
  'function asset() external view returns (address)'
]);

// Define ERC20 ABI for token info (already present, but good to note its use for asset details)
const ERC20_DETAIL_ABI = parseAbi([
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
]);

// Define our constants
const VAULT_ADDRESS = '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738'; // Seamless vault address
const SAFE_ADDRESS = '0x1FB6A7E6AcEe45664F8218a05F21F7D0f20ad2c7'; // User's safe address
const SHARES_TO_REDEEM = 1000000000000000000n; // 1 share (18 decimals)
let USDC_ADDRESS: `0x${string}`;

async function testRedeemSimulation() {
  try {
    console.log('==== REDEEM DIAGNOSIS - SIMULATE VAULT CALL ====');
    console.log(`Safe Address (Owner/Receiver): ${SAFE_ADDRESS}`);
    console.log(`Vault Address: ${VAULT_ADDRESS}`);
    console.log(`Shares to Redeem: ${SHARES_TO_REDEEM.toString()} (1 share formatted)`);

    USDC_ADDRESS = await pc.readContract({
      address: VAULT_ADDRESS, abi: VAULT_ABI, functionName: 'asset'
    }) as `0x${string}`;
    const assetSymbol = await pc.readContract({
      address: USDC_ADDRESS, abi: ERC20_DETAIL_ABI, functionName: 'symbol'
    });
    const assetDecimals = await pc.readContract({
      address: USDC_ADDRESS, abi: ERC20_DETAIL_ABI, functionName: 'decimals'
    });
    console.log(`Underlying Asset: ${assetSymbol} (${USDC_ADDRESS}), Decimals: ${assetDecimals}`);

    // Check Safe's current share balance in the vault
    const currentShares = await pc.readContract({
        address: VAULT_ADDRESS, abi: VAULT_ABI, functionName: 'balanceOf', args: [SAFE_ADDRESS]
    });
    console.log(`Safe's current shares in vault: ${formatUnits(currentShares, 18)} shares`);

    if (currentShares < SHARES_TO_REDEEM) {
        console.error(`ERROR: Safe does not have enough shares (${formatUnits(currentShares, 18)}) to redeem ${formatUnits(SHARES_TO_REDEEM, 18)} shares.`);
        // return; // Might still want to simulate to see the vault's error
    }

    // Check Allowance (Safe -> Vault for USDC)
    const allowanceRaw = await pc.readContract({
      address: USDC_ADDRESS, abi: erc20Abi, functionName: 'allowance', args: [SAFE_ADDRESS, VAULT_ADDRESS],
    });
    console.log(`USDC Allowance (Safe -> Vault): ${formatUnits(allowanceRaw, Number(assetDecimals))} ${assetSymbol}`);
    if (allowanceRaw === 0n && SHARES_TO_REDEEM > 0n) {
        console.warn("WARNING: Safe has ZERO USDC allowance for the Vault. This might not directly block redeem if assets are already in vault, but is unusual.");
    }

    console.log('\nAttempting to simulate redeem call directly to the vault...');
    // To simulate a call from the Safe, we use the Safe itself as the `account` for simulation purposes,
    // as the `owner` parameter in redeem is the entity authorized to burn shares.
    const { result, request } = await pc.simulateContract({
      account: SAFE_ADDRESS, // Simulate as if the Safe is calling (important for owner checks)
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'redeem',
      args: [SHARES_TO_REDEEM, SAFE_ADDRESS, SAFE_ADDRESS], // shares, receiver, owner
    });

    console.log('\n✅ Redeem simulation successful!');
    console.log(`   Estimated assets to receive: ${formatUnits(result, Number(assetDecimals))} ${assetSymbol}`);
    console.log('   Encoded Call Data for redeem:', request.data);

  } catch (error: any) {
    console.error('\n❌ Redeem simulation failed:');
    if (error.cause) {
      console.error('   Error Cause:', error.cause);
    } else {
      console.error('   Error:', error.message);
    }
    if (error.shortMessage) {
        console.error('   Short Message:', error.shortMessage)
    }
    // Log the full error object if it might contain more details like a revert reason
    // console.error('   Full Error Object:', JSON.stringify(error, null, 2));
  }
}

testRedeemSimulation(); 