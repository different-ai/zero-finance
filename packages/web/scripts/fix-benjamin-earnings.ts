import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function fixBenjaminEarnings() {
  console.log('🔧 Starting fix for benjamin.shafii@gmail.com earnings');

  // Find user profile
  const userResult = await db.execute(
    sql`SELECT primary_safe_address FROM user_profiles WHERE email = 'benjamin.shafii@gmail.com'`,
  );

  if (
    userResult.rows.length === 0 ||
    !userResult.rows[0].primary_safe_address
  ) {
    console.log('❌ User not found or no primary safe address');
    process.exit(1);
  }

  const safeAddress = userResult.rows[0].primary_safe_address as string;
  console.log(`📍 Safe address: ${safeAddress}`);

  // Define vault addresses
  const SEAMLESS_VAULT = '0x4A9B7ed993871184b1Fc9331b7E8217309Ea35fc';
  const GAUNTLET_VAULT = '0x96c466Cb11796120C549f557b4E831e8DC5d2a97';

  await db.transaction(async (tx) => {
    console.log(
      '\n🗑️  Step 1: Remove corrupted deposits with 0 shares from Seamless',
    );
    const deletedDeposits = await tx.execute(
      sql`DELETE FROM earn_deposits 
          WHERE safe_address = ${safeAddress} 
          AND vault_address = ${SEAMLESS_VAULT} 
          AND shares_received = 0
          RETURNING id`,
    );
    console.log(
      `  ✅ Removed ${deletedDeposits.rows.length} deposits with 0 shares`,
    );

    console.log(
      '\n🗑️  Step 2: Remove all withdrawals from Gauntlet (no deposits exist)',
    );
    const deletedGauntletWithdrawals = await tx.execute(
      sql`DELETE FROM earn_withdrawals 
          WHERE safe_address = ${safeAddress} 
          AND vault_address = ${GAUNTLET_VAULT}
          RETURNING id`,
    );
    console.log(
      `  ✅ Removed ${deletedGauntletWithdrawals.rows.length} withdrawals from Gauntlet`,
    );

    console.log('\n📊 Step 3: Check remaining Seamless transactions');

    // Get remaining deposits
    const remainingDeposits = await tx.execute(
      sql`SELECT * FROM earn_deposits 
          WHERE safe_address = ${safeAddress} 
          AND vault_address = ${SEAMLESS_VAULT}
          ORDER BY timestamp DESC`,
    );

    // Get remaining withdrawals
    const remainingWithdrawals = await tx.execute(
      sql`SELECT * FROM earn_withdrawals 
          WHERE safe_address = ${safeAddress} 
          AND vault_address = ${SEAMLESS_VAULT}
          ORDER BY timestamp ASC`,
    );

    // Calculate totals for Seamless
    let totalDeposited = 0n;
    let totalWithdrawn = 0n;
    let totalShares = 0n;

    for (const deposit of remainingDeposits.rows) {
      totalDeposited += BigInt(deposit.assets_deposited as string);
      totalShares += BigInt(deposit.shares_received as string);
    }

    for (const withdrawal of remainingWithdrawals.rows) {
      totalWithdrawn += BigInt(withdrawal.assets_withdrawn as string);
      totalShares -= BigInt(withdrawal.shares_burned as string);
    }

    console.log(`  📥 Remaining deposits: ${remainingDeposits.rows.length}`);
    console.log(
      `  📤 Remaining withdrawals: ${remainingWithdrawals.rows.length}`,
    );
    console.log(
      `  💰 Total deposited: $${(Number(totalDeposited) / 1e6).toFixed(4)}`,
    );
    console.log(
      `  💸 Total withdrawn: $${(Number(totalWithdrawn) / 1e6).toFixed(4)}`,
    );
    console.log(`  📊 Net shares: ${totalShares}`);

    // If we still have negative shares, we need to remove excess withdrawals
    if (totalShares < 0n) {
      console.log(
        '\n⚠️  Still have negative shares, removing excess withdrawals',
      );

      let sharesToRecover = -totalShares;
      const withdrawalsToDelete: string[] = [];

      for (const withdrawal of remainingWithdrawals.rows) {
        if (sharesToRecover > 0n) {
          withdrawalsToDelete.push(withdrawal.id as string);
          sharesToRecover -= BigInt(withdrawal.shares_burned as string);
        }
      }

      if (withdrawalsToDelete.length > 0) {
        const deleted = await tx.execute(
          sql`DELETE FROM earn_withdrawals 
              WHERE safe_address = ${safeAddress} 
              AND vault_address = ${SEAMLESS_VAULT}
              AND id = ANY(${withdrawalsToDelete})
              RETURNING id`,
        );
        console.log(
          `  ✅ Removed ${deleted.rows.length} excess withdrawals to balance shares`,
        );
      }
    }

    // Final verification
    console.log('\n🔍 Final verification:');

    const finalDeposits = await tx.execute(
      sql`SELECT 
            COUNT(*) as count,
            COALESCE(SUM(assets_deposited), 0) as total_deposited,
            COALESCE(SUM(shares_received), 0) as total_shares
          FROM earn_deposits 
          WHERE safe_address = ${safeAddress} 
          AND vault_address = ${SEAMLESS_VAULT}`,
    );

    const finalWithdrawals = await tx.execute(
      sql`SELECT 
            COUNT(*) as count,
            COALESCE(SUM(assets_withdrawn), 0) as total_withdrawn,
            COALESCE(SUM(shares_burned), 0) as total_shares_burned
          FROM earn_withdrawals 
          WHERE safe_address = ${safeAddress} 
          AND vault_address = ${SEAMLESS_VAULT}`,
    );

    const finalDepositCount = Number(finalDeposits.rows[0].count);
    const finalDepositAmount = BigInt(
      finalDeposits.rows[0].total_deposited as string,
    );
    const finalDepositShares = BigInt(
      finalDeposits.rows[0].total_shares as string,
    );

    const finalWithdrawalCount = Number(finalWithdrawals.rows[0].count);
    const finalWithdrawalAmount = BigInt(
      finalWithdrawals.rows[0].total_withdrawn as string,
    );
    const finalWithdrawalShares = BigInt(
      finalWithdrawals.rows[0].total_shares_burned as string,
    );

    console.log(
      `  📥 Final deposits: ${finalDepositCount} totaling $${(Number(finalDepositAmount) / 1e6).toFixed(4)}`,
    );
    console.log(
      `  📤 Final withdrawals: ${finalWithdrawalCount} totaling $${(Number(finalWithdrawalAmount) / 1e6).toFixed(4)}`,
    );
    console.log(
      `  💰 Net principal: $${(Number(finalDepositAmount - finalWithdrawalAmount) / 1e6).toFixed(4)}`,
    );
    console.log(
      `  📊 Net shares: ${finalDepositShares - finalWithdrawalShares}`,
    );

    if (finalDepositShares - finalWithdrawalShares < 0n) {
      console.log('  ❌ WARNING: Still have negative shares after cleanup!');
    } else {
      console.log('  ✅ Share balance is now positive');
    }
  });

  console.log('\n✅ Fix completed successfully!');
  console.log('Now run the diagnosis script to verify the fix:');
  console.log(
    'pnpm tsx scripts/diagnose-earnings.ts benjamin.shafii@gmail.com',
  );
}

fixBenjaminEarnings()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Fix failed:', err);
    process.exit(1);
  });
