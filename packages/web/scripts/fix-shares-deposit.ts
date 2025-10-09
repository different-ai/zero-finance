#!/usr/bin/env tsx
import { db } from '../src/db';
import { earnDeposits } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function fixSharesDeposit() {
  const depositId = 'f8c2d959-5bde-4e50-b4aa-447dc3de0939';
  const correctShares = 97988454034924103n; // From the vault balance check
  
  console.log(`🔧 Fixing shares for deposit ${depositId}`);
  console.log(`Setting shares to: ${correctShares}`);
  
  try {
    const result = await db
      .update(earnDeposits)
      .set({ sharesReceived: correctShares.toString() })
      .where(eq(earnDeposits.id, depositId))
      .returning();
    
    if (result.length > 0) {
      console.log('✅ Successfully updated deposit record');
      console.log('Updated record:', result[0]);
    } else {
      console.log('❌ No record found with that ID');
    }
  } catch (error) {
    console.error('Error updating deposit:', error);
  } finally {
    process.exit(0);
  }
}

fixSharesDeposit(); 
