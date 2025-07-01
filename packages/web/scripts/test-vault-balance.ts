#!/usr/bin/env tsx
import { createPublicClient, http, parseAbi, getAddress } from 'viem';
import { base } from 'viem/chains';
import { db } from '../src/db';
import { earnDeposits } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const publicClient = createPublicClient({ chain: base, transport: http(BASE_RPC_URL) });

const VAULT_ADDRESS = '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738';
const SAFE_ADDRESS = '0x341Eb50366F22161C90EDD4505d2916Ae275595e';

const ERC4626_VAULT_ABI = parseAbi([
  'function balanceOf(address owner) external view returns (uint256 shares)',
  'function convertToAssets(uint256 shares) external view returns (uint256 assets)',
  'function decimals() external view returns (uint8)', 
  'function asset() external view returns (address)'
]);

async function checkVaultBalance() {
  console.log('🔍 Checking Vault Balance\n');
  
  try {
    // 1. Get shares balance
    const shares = await publicClient.readContract({
      address: VAULT_ADDRESS as `0x${string}`,
      abi: ERC4626_VAULT_ABI,
      functionName: 'balanceOf',
      args: [SAFE_ADDRESS as `0x${string}`],
    });
    
    console.log(`Shares balance: ${shares}`);
    
    // 2. Try to convert shares to assets
    if (shares > 0n) {
      try {
        const assets = await publicClient.readContract({
          address: VAULT_ADDRESS as `0x${string}`,
          abi: ERC4626_VAULT_ABI,
          functionName: 'convertToAssets',
          args: [shares],
        });
        
        console.log(`Assets value: ${assets} (${Number(assets) / 1e6} USDC)`);
      } catch (error) {
        console.error('Error converting shares to assets:', error);
      }
    } else {
      console.log('No shares found in vault');
    }
    
    // 3. Check deposits in DB
    const deposits = await db.select().from(earnDeposits)
      .where(eq(earnDeposits.safeAddress, SAFE_ADDRESS as `0x${string}`));
    
    console.log(`\n📊 Database Deposits: ${deposits.length}`);
    for (const deposit of deposits) {
      console.log(`- Amount: ${Number(deposit.assetsDeposited) / 1e6} USDC`);
      console.log(`  Shares: ${deposit.sharesReceived}`);
      console.log(`  Tx: ${deposit.txHash}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkVaultBalance().catch(console.error).finally(() => process.exit(0)); 