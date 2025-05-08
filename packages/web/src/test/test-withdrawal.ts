import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

// Create a public client to interact with the Base network
const pc = createPublicClient({ chain: base, transport: http() });

// Define the ABI for the vault operations we need
const VaultAbi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function convertToAssets(uint256) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function asset() view returns (address)'
]);

// Additional ABI for ERC20 token to get decimals
const ERC20Abi = parseAbi([
  'function decimals() view returns (uint8)'
]);

// Define our constants
const vault = '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738'; // Seamless vault address
const safe = '0x1FB6A7E6AcEe45664F8218a05F21F7D0f20ad2c7'; // Your primary safe

async function testWithdrawal() {
  try {
    console.log('Testing Withdrawal System');
    console.log('------------------------');
    console.log(`Safe Address: ${safe}`);
    console.log(`Vault Address: ${vault}`);
    console.log('------------------------');

    // Get shares balance
    const shares = await pc.readContract({ 
      address: vault, 
      abi: VaultAbi,
      functionName: 'balanceOf', 
      args: [safe] 
    });
    
    // Get underlying assets value of those shares
    const assets = await pc.readContract({ 
      address: vault, 
      abi: VaultAbi,
      functionName: 'convertToAssets', 
      args: [shares] 
    });

    // Get decimals for proper formatting
    const vaultDecimals = await pc.readContract({
      address: vault,
      abi: VaultAbi,
      functionName: 'decimals',
    });

    // Get underlying asset address
    const assetAddress = await pc.readContract({
      address: vault,
      abi: VaultAbi,
      functionName: 'asset',
    });

    // Get underlying asset decimals (usually 6 for USDC)
    const assetDecimals = await pc.readContract({
      address: assetAddress,
      abi: ERC20Abi,
      functionName: 'decimals',
    });

    console.log('Vault Information:');
    console.log(`- Shares: ${shares.toString()}`);
    console.log(`- Underlying Assets: ${assets.toString()}`);
    console.log(`- Vault Decimals: ${vaultDecimals.toString()}`);
    console.log(`- Asset Address: ${assetAddress}`);
    console.log(`- Asset Decimals: ${assetDecimals.toString()}`);
    
    // Format values for human readability
    const formattedShares = Number(shares) / 10**18; // Shares are always 18 decimals in ERC4626
    const formattedAssets = Number(assets) / 10**Number(assetDecimals);
    
    console.log('\nHuman Readable:');
    console.log(`- Shares: ${formattedShares.toLocaleString(undefined, { maximumFractionDigits: 8 })}`);
    console.log(`- Underlying Assets: ${formattedAssets.toLocaleString(undefined, { maximumFractionDigits: Number(assetDecimals) })} USDC`);
    
    console.log('\nWithdrawal System Ready to Test');
    console.log('Visit: http://localhost:3050/dashboard/tools/earn-module to test the UI');
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run the test
testWithdrawal(); 