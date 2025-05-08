import { createPublicClient, http, parseAbi, encodeFunctionData } from 'viem';
import { base } from 'viem/chains';

// Create a public client to interact with the Base network
const pc = createPublicClient({ chain: base, transport: http() });

// Define the ABI for the vault operations we need
const VAULT_ABI = parseAbi([
  'function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares)',
  'function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets)',
  'function balanceOf(address owner) external view returns (uint256 shares)',
  'function convertToAssets(uint256 shares) external view returns (uint256 assets)',
  'function convertToShares(uint256 assets) external view returns (uint256 shares)',
  'function decimals() external view returns (uint8)',
  'function asset() external view returns (address)'
]);

// Define ERC20 ABI for token info
const ERC20_ABI = parseAbi([
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
]);

// Define our constants
const VAULT_ADDRESS = '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738'; // Seamless vault address
const SAFE_ADDRESS = '0x1FB6A7E6AcEe45664F8218a05F21F7D0f20ad2c7'; // User's safe address
const EXAMPLE_AMOUNT = '1.0'; // Example amount to withdraw

async function testWithdrawalEncoding() {
  try {
    console.log('Testing Withdrawal Encoding');
    console.log('---------------------------');
    console.log(`Safe Address: ${SAFE_ADDRESS}`);
    console.log(`Vault Address: ${VAULT_ADDRESS}`);
    console.log('---------------------------');
    
    // Get the underlying asset address
    const assetAddress = await pc.readContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'asset',
    });
    
    // Get the asset symbol
    const assetSymbol = await pc.readContract({
      address: assetAddress,
      abi: ERC20_ABI,
      functionName: 'symbol',
    });
    
    // Get asset decimals
    const assetDecimals = await pc.readContract({
      address: assetAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });
    
    console.log(`\nUnderlying Asset Information:`);
    console.log(`- Asset Address: ${assetAddress}`);
    console.log(`- Asset Symbol: ${assetSymbol}`);
    console.log(`- Asset Decimals: ${assetDecimals}`);
    
    // Simulate "assets" based withdrawal (e.g., USDC with 6 decimals)
    // This simulates withdrawing 1.0 USDC
    const assetAmount = parseFloat(EXAMPLE_AMOUNT) * 10**Number(assetDecimals);
    const assetAmountBigInt = BigInt(Math.floor(assetAmount));
    
    console.log(`\nSimulating withdrawal of ${EXAMPLE_AMOUNT} ${assetSymbol}:`);
    console.log(`- Raw Amount with ${assetDecimals} decimals: ${assetAmountBigInt.toString()}`);
    
    // Encode the withdraw function call
    const withdrawCall = encodeFunctionData({
      abi: VAULT_ABI,
      functionName: 'withdraw',
      args: [assetAmountBigInt, SAFE_ADDRESS, SAFE_ADDRESS]
    });
    
    console.log(`\nEncoded Withdraw Call:`);
    console.log(withdrawCall);
    
    // Log the actual amount we saw in the failing transaction
    console.log(`\nComparing with failing transaction amount:`);
    console.log(`- Failed TX Amount: 1000000000000000000 (1 with 18 zeros)`);
    console.log(`- Correct Amount: ${assetAmountBigInt.toString()} (1 with ${assetDecimals} zeros)`);
    
    console.log(`\nSummary: When withdrawing ${EXAMPLE_AMOUNT} ${assetSymbol}, the amount should be:`)
    console.log(`${assetAmountBigInt.toString()} (${EXAMPLE_AMOUNT} x 10^${assetDecimals})`);
    console.log(`NOT 1000000000000000000 (${EXAMPLE_AMOUNT} x 10^18)`);
    console.log(`\nThe WithdrawEarnCard should now be fixed to use the correct decimals.`);
    
  } catch (error) {
    console.error('Error running withdrawal test:', error);
  }
}

// Run the test
testWithdrawalEncoding(); 