#!/usr/bin/env tsx

/**
 * Test script to verify onboarding skip functionality
 * Run with: pnpm tsx scripts/test-onboarding-skip.ts
 */

import { db } from '../src/db';
import { userProfilesTable } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function testOnboardingSkip() {
  console.log('🧪 Testing onboarding skip functionality...\n');
  
  // Test user's Privy DID (you can change this to test with different users)
  const testPrivyDid = 'did:privy:test-user-123';
  
  try {
    // Step 1: Check if test user exists, create if not
    let userProfile = await db.query.userProfilesTable.findFirst({
      where: eq(userProfilesTable.privyDid, testPrivyDid),
    });
    
    if (!userProfile) {
      console.log('Creating test user profile...');
      const [newProfile] = await db
        .insert(userProfilesTable)
        .values({
          privyDid: testPrivyDid,
          email: 'test@example.com',
          skippedOrCompletedOnboardingStepper: false,
        })
        .returning();
      userProfile = newProfile;
      console.log('✅ Test user created\n');
    } else {
      console.log('✅ Test user found\n');
    }
    
    // Step 2: Display current state
    console.log('Current user profile state:');
    console.log(`- Privy DID: ${userProfile.privyDid}`);
    console.log(`- Email: ${userProfile.email || 'Not set'}`);
    console.log(`- Skipped/Completed Stepper: ${userProfile.skippedOrCompletedOnboardingStepper}`);
    console.log('');
    
    // Step 3: Simulate skipping onboarding
    console.log('Simulating onboarding skip...');
    await db
      .update(userProfilesTable)
      .set({ 
        skippedOrCompletedOnboardingStepper: true,
        updatedAt: new Date(),
      })
      .where(eq(userProfilesTable.privyDid, testPrivyDid));
    console.log('✅ Onboarding skip flag set\n');
    
    // Step 4: Verify the update
    const updatedProfile = await db.query.userProfilesTable.findFirst({
      where: eq(userProfilesTable.privyDid, testPrivyDid),
    });
    
    console.log('Updated user profile state:');
    console.log(`- Skipped/Completed Stepper: ${updatedProfile?.skippedOrCompletedOnboardingStepper}`);
    console.log('');
    
    if (updatedProfile?.skippedOrCompletedOnboardingStepper === true) {
      console.log('✅ Test passed! Onboarding skip functionality is working correctly.');
    } else {
      console.log('❌ Test failed! Flag was not updated properly.');
    }
    
    // Step 5: Reset for next test (optional)
    console.log('\nResetting test user state...');
    await db
      .update(userProfilesTable)
      .set({ 
        skippedOrCompletedOnboardingStepper: false,
        updatedAt: new Date(),
      })
      .where(eq(userProfilesTable.privyDid, testPrivyDid));
    console.log('✅ Test user reset');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
  
  console.log('\n🎉 All tests completed!');
  process.exit(0);
}

// Run the test
testOnboardingSkip(); 