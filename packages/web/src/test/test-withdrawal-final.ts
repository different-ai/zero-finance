import { createPublicClient, http, parseAbi, encodeFunctionData } from 'viem';
import { base } from 'viem/chains';

// Create a public client to interact with the Base network
const pc = createPublicClient({ chain: base, transport: http() });

// Define the ABI for the vault operations we need
const VAULT_ABI = parseAbi([
  'function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares)',
  'function balanceOf(address owner) external view returns (uint256 shares)',
  'function convertToAssets(uint256 shares) external view returns (uint256 assets)',
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
const EXAMPLE_USDC_AMOUNT = '1.0'; // 1 USDC

async function testWithdrawal() {
  try {
    console.log('==== WITHDRAWAL FINAL TEST - USDC DECIMALS FIX ====');
    console.log(`Safe Address: ${SAFE_ADDRESS}`);
    console.log(`Vault Address: ${VAULT_ADDRESS}`);
    
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
    
    // Get asset decimals (should be 6 for USDC)
    const assetDecimals = await pc.readContract({
      address: assetAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });
    
    console.log(`\nUnderlying Asset Information:`);
    console.log(`- Asset Address: ${assetAddress}`);
    console.log(`- Asset Symbol: ${assetSymbol}`);
    console.log(`- Asset Decimals: ${assetDecimals}`);
    
    // Get user's share balance
    const userShares = await pc.readContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'balanceOf',
      args: [SAFE_ADDRESS],
    });
    
    // Convert shares to underlying assets
    const userAssets = await pc.readContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'convertToAssets',
      args: [userShares],
    });
    
    console.log(`\nUser's Current Position:`);
    console.log(`- Raw Shares: ${userShares.toString()}`);
    console.log(`- Raw Assets: ${userAssets.toString()}`);
    console.log(`- Formatted Assets: ${Number(userAssets) / 10**Number(assetDecimals)} ${assetSymbol}`);
    
    // Calculate withdraw amount with USDC decimals (6)
    const usdcAmount = parseFloat(EXAMPLE_USDC_AMOUNT) * 10**Number(assetDecimals);
    const usdcAmountBigInt = BigInt(Math.floor(usdcAmount));
    
    console.log(`\nSimulating withdrawal of ${EXAMPLE_USDC_AMOUNT} ${assetSymbol}:`);
    console.log(`- Raw Amount with ${assetDecimals} decimals: ${usdcAmountBigInt.toString()}`);
    
    // Encode the withdraw function call
    const withdrawCall = encodeFunctionData({
      abi: VAULT_ABI,
      functionName: 'withdraw',
      args: [usdcAmountBigInt, SAFE_ADDRESS, SAFE_ADDRESS]
    });
    
    console.log(`\nCORRECT Withdraw Call Encoding:`);
    console.log(withdrawCall);
    
    // Show the incorrect encoding for comparison (with 18 decimals)
    const incorrectAmount = parseFloat(EXAMPLE_USDC_AMOUNT) * 10**18;
    const incorrectAmountBigInt = BigInt(Math.floor(incorrectAmount));
    const incorrectWithdrawCall = encodeFunctionData({
      abi: VAULT_ABI,
      functionName: 'withdraw',
      args: [incorrectAmountBigInt, SAFE_ADDRESS, SAFE_ADDRESS]
    });
    
    console.log(`\nINCORRECT Withdraw Call Encoding (18 decimals):`);
    console.log(incorrectWithdrawCall);
    
    console.log(`\n==== SUMMARY ====`);
    console.log(`When withdrawing ${EXAMPLE_USDC_AMOUNT} ${assetSymbol}, the correct amount value is:`);
    console.log(`${usdcAmountBigInt.toString()} (${EXAMPLE_USDC_AMOUNT} × 10^${assetDecimals})`);
    console.log(`NOT ${incorrectAmountBigInt.toString()} (${EXAMPLE_USDC_AMOUNT} × 10^18)`);
    
  } catch (error) {
    console.error('Error running withdrawal test:', error);
  }
}

// Run the test
testWithdrawal(); 