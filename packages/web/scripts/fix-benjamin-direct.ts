import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function fixBenjaminDirectly() {
  console.log('🔧 Direct fix for benjamin.shafii@gmail.com earnings data');

  const safeAddress = '0x341Eb50366F22161C90EDD4505d2916Ae275595e';
  const SEAMLESS_VAULT = '0x4A9B7ed993871184b1Fc9331b7E8217309Ea35fc';
  const GAUNTLET_VAULT = '0x96c466Cb11796120C549f557b4E831e8DC5d2a97';

  await db.transaction(async (tx) => {
    // First, let's see what we have
    console.log('\n📊 Current state:');

    const seamlessDeposits = await tx.execute(
      sql`SELECT id, assets_deposited, shares_received, timestamp 
          FROM earn_deposits 
          WHERE safe_address = ${safeAddress} 
          AND vault_address = ${SEAMLESS_VAULT}
          ORDER BY timestamp DESC`,
    );

    console.log(`Seamless deposits: ${seamlessDeposits.rows.length}`);
    for (const dep of seamlessDeposits.rows) {
      console.log(
        `  - ${dep.id}: $${Number(dep.assets_deposited) / 1e6} with ${dep.shares_received} shares`,
      );
    }

    const seamlessWithdrawals = await tx.execute(
      sql`SELECT id, assets_withdrawn, shares_burned, timestamp 
          FROM earn_withdrawals 
          WHERE safe_address = ${safeAddress} 
          AND vault_address = ${SEAMLESS_VAULT}
          ORDER BY timestamp DESC`,
    );

    console.log(`Seamless withdrawals: ${seamlessWithdrawals.rows.length}`);
    for (const wd of seamlessWithdrawals.rows) {
      console.log(
        `  - ${wd.id}: $${Number(wd.assets_withdrawn) / 1e6} with ${wd.shares_burned} shares`,
      );
    }

    const gauntletWithdrawals = await tx.execute(
      sql`SELECT id, assets_withdrawn, shares_burned, timestamp 
          FROM earn_withdrawals 
          WHERE safe_address = ${safeAddress} 
          AND vault_address = ${GAUNTLET_VAULT}
          ORDER BY timestamp DESC`,
    );

    console.log(
      `Gauntlet withdrawals (no deposits): ${gauntletWithdrawals.rows.length}`,
    );

    // Clean up corrupted data
    console.log('\n🗑️  Cleaning corrupted data...');

    // 1. Delete deposits with 0 shares (corrupted)
    const deleted1 = await tx.execute(
      sql`DELETE FROM earn_deposits 
          WHERE safe_address = ${safeAddress} 
          AND shares_received = 0
          RETURNING id`,
    );
    console.log(`✅ Deleted ${deleted1.rows.length} deposits with 0 shares`);

    // 2. Delete ALL withdrawals from both vaults (since we have more withdrawals than deposits)
    const deleted2 = await tx.execute(
      sql`DELETE FROM earn_withdrawals 
          WHERE safe_address = ${safeAddress}
          RETURNING id, vault_address`,
    );
    console.log(
      `✅ Deleted ${deleted2.rows.length} total withdrawals to reset state`,
    );

    // 3. Delete remaining deposits to fully reset
    const deleted3 = await tx.execute(
      sql`DELETE FROM earn_deposits 
          WHERE safe_address = ${safeAddress}
          RETURNING id`,
    );
    console.log(
      `✅ Deleted ${deleted3.rows.length} remaining deposits for clean slate`,
    );

    // Verify clean state
    console.log('\n✅ Verification:');

    const finalDeposits = await tx.execute(
      sql`SELECT COUNT(*) as count FROM earn_deposits WHERE safe_address = ${safeAddress}`,
    );

    const finalWithdrawals = await tx.execute(
      sql`SELECT COUNT(*) as count FROM earn_withdrawals WHERE safe_address = ${safeAddress}`,
    );

    console.log(`Final deposits: ${finalDeposits.rows[0].count}`);
    console.log(`Final withdrawals: ${finalWithdrawals.rows[0].count}`);
    console.log(
      '\n🎉 Database cleaned! User now has a fresh start with 0 deposits and 0 withdrawals.',
    );
  });
}

fixBenjaminDirectly()
  .then(() => {
    console.log('\n✅ Fix completed successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Fix failed:', err);
    process.exit(1);
  });
