#!/usr/bin/env tsx
import { createPublicClient, http, parseAbi, getAddress } from 'viem';
import { base } from 'viem/chains';
import { db } from '../src/db';
import { earnDeposits, userSafes } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';

const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const publicClient = createPublicClient({ chain: base, transport: http(BASE_RPC_URL) });

const ERC4626_VAULT_ABI = parseAbi([
  'function balanceOf(address owner) external view returns (uint256 shares)',
  'function convertToAssets(uint256 shares) external view returns (uint256 assets)',
  'function decimals() external view returns (uint8)', 
  'function asset() external view returns (address)',
  'function totalAssets() external view returns (uint256)',
  'function totalSupply() external view returns (uint256)'
]);

const ERC20_ABI = parseAbi([
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)'
]);

async function debugVaultWithdrawal(userDid: string, safeAddress: string) {
  console.log('🔍 Debugging Vault Withdrawal Issue\n');
  console.log(`User DID: ${userDid}`);
  console.log(`Safe Address: ${safeAddress}\n`);
  
  try {
    // 1. Get all deposits for this safe
    const deposits = await db.select().from(earnDeposits)
      .where(eq(earnDeposits.safeAddress, safeAddress as `0x${string}`));
    
    console.log(`📊 Found ${deposits.length} deposits in database:`);
    
    const vaultAddresses = new Set<string>();
    for (const deposit of deposits) {
      vaultAddresses.add(deposit.vaultAddress);
      console.log(`\n- Deposit ${deposit.id}:`);
      console.log(`  Vault: ${deposit.vaultAddress}`);
      console.log(`  Assets: ${Number(deposit.assetsDeposited) / 1e6} USDC`);
      console.log(`  Shares: ${deposit.sharesReceived}`);
      console.log(`  Tx: ${deposit.txHash}`);
      console.log(`  Date: ${deposit.timestamp}`);
    }
    
    // 2. Check balance in each unique vault
    console.log(`\n🏦 Checking balances in ${vaultAddresses.size} unique vault(s):`);
    
    for (const vaultAddress of vaultAddresses) {
      console.log(`\n📍 Vault: ${vaultAddress}`);
      
      try {
        // Get shares balance
        const shares = await publicClient.readContract({
          address: vaultAddress as `0x${string}`,
          abi: ERC4626_VAULT_ABI,
          functionName: 'balanceOf',
          args: [safeAddress as `0x${string}`],
        });
        
        console.log(`  Shares balance: ${shares}`);
        
        // Get asset info
        const assetAddress = await publicClient.readContract({
          address: vaultAddress as `0x${string}`,
          abi: ERC4626_VAULT_ABI,
          functionName: 'asset',
        });
        
        const assetDecimals = await publicClient.readContract({
          address: assetAddress,
          abi: ERC20_ABI,
          functionName: 'decimals',
        });
        
        const assetSymbol = await publicClient.readContract({
          address: assetAddress,
          abi: ERC20_ABI,
          functionName: 'symbol',
        });
        
        console.log(`  Asset: ${assetSymbol} (${assetAddress})`);
        console.log(`  Asset decimals: ${assetDecimals}`);
        
        // Convert shares to assets
        if (shares > 0n) {
          const assets = await publicClient.readContract({
            address: vaultAddress as `0x${string}`,
            abi: ERC4626_VAULT_ABI,
            functionName: 'convertToAssets',
            args: [shares],
          });
          
          const assetsFormatted = Number(assets) / (10 ** Number(assetDecimals));
          console.log(`  Assets value: ${assets} (${assetsFormatted} ${assetSymbol})`);
          
          // Get vault totals for context
          const totalAssets = await publicClient.readContract({
            address: vaultAddress as `0x${string}`,
            abi: ERC4626_VAULT_ABI,
            functionName: 'totalAssets',
          });
          
          const totalSupply = await publicClient.readContract({
            address: vaultAddress as `0x${string}`,
            abi: ERC4626_VAULT_ABI,
            functionName: 'totalSupply',
          });
          
          console.log(`  Vault total assets: ${totalAssets}`);
          console.log(`  Vault total supply: ${totalSupply}`);
          
          if (assets === 0n && shares > 0n) {
            console.log(`  ⚠️  WARNING: Has shares but converts to 0 assets!`);
          }
        } else {
          console.log(`  ⚠️  No shares found in this vault`);
        }
        
      } catch (error) {
        console.error(`  ❌ Error checking vault ${vaultAddress}:`, error);
      }
    }
    
    // 3. Compare with what the earn router stats would return
    console.log(`\n📈 Checking earn router stats logic:`);
    
    // Get total from deposits (what stats query does)
    const totalAssets = deposits.reduce((sum, d) => sum + Number(d.assetsDeposited), 0);
    const totalShares = deposits.reduce((sum, d) => sum + BigInt(d.sharesReceived), 0n);
    
    console.log(`  Total assets from deposits: ${totalAssets / 1e6} USDC`);
    console.log(`  Total shares from deposits: ${totalShares}`);
    
    // Calculate yield (simplified version)
    if (vaultAddresses.size === 1) {
      const vaultAddress = Array.from(vaultAddresses)[0];
      const currentShares = await publicClient.readContract({
        address: vaultAddress as `0x${string}`,
        abi: ERC4626_VAULT_ABI,
        functionName: 'balanceOf',
        args: [safeAddress as `0x${string}`],
      });
      
      if (currentShares > 0n) {
        const currentAssets = await publicClient.readContract({
          address: vaultAddress as `0x${string}`,
          abi: ERC4626_VAULT_ABI,
          functionName: 'convertToAssets',
          args: [currentShares],
        });
        
        const yieldAmount = Number(currentAssets) - totalAssets;
        console.log(`  Calculated yield: ${yieldAmount / 1e6} USDC`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage: Pass user DID and safe address as command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: pnpm tsx scripts/debug-vault-withdrawal.ts <userDid> <safeAddress>');
  console.error('Example: pnpm tsx scripts/debug-vault-withdrawal.ts did:privy:xxx 0x123...');
  process.exit(1);
}

debugVaultWithdrawal(args[0], args[1]).catch(console.error).finally(() => process.exit(0)); 