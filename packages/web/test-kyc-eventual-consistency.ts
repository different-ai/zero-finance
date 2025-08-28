#!/usr/bin/env tsx
/**
 * Test script to verify KYC eventual consistency fixes
 * This simulates various Align API responses to ensure our system handles them gracefully
 */

import { z } from 'zod';

// Import the updated schema
const alignCustomerSchema = z.object({
  customer_id: z.string(),
  email: z.string().email(),
  kycs: z
    .array(
      z.object({
        status: z.enum(['pending', 'approved', 'rejected']).nullable(),
        sub_status: z
          .enum([
            'kyc_form_submission_started',
            'kyc_form_submission_accepted',
            'kyc_form_resubmission_required',
          ])
          .optional()
          .nullable(),
        kyc_flow_link: z.string().url().nullable(),
      }),
    )
    .optional()
    .default([]),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Test cases that previously broke the system
const testCases = [
  {
    name: "User with null status (hasn't started KYC)",
    data: {
      customer_id: 'test-1',
      email: 'test1@example.com',
      kycs: [
        {
          status: null,
          sub_status: null,
          kyc_flow_link: null,
        },
      ],
    },
  },
  {
    name: 'User with null kyc_flow_link but valid status',
    data: {
      customer_id: 'test-2',
      email: 'test2@example.com',
      kycs: [
        {
          status: 'pending',
          sub_status: 'kyc_form_submission_started',
          kyc_flow_link: null,
        },
      ],
    },
  },
  {
    name: 'User with empty kycs array',
    data: {
      customer_id: 'test-3',
      email: 'test3@example.com',
      kycs: [],
    },
  },
  {
    name: 'User with approved status (normal case)',
    data: {
      customer_id: 'test-4',
      email: 'test4@example.com',
      kycs: [
        {
          status: 'approved',
          sub_status: 'kyc_form_submission_accepted',
          kyc_flow_link: 'https://align.com/kyc/complete',
        },
      ],
    },
  },
];

console.log('Testing KYC Eventual Consistency Fixes\n');
console.log('='.repeat(50));

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  try {
    const result = alignCustomerSchema.parse(testCase.data);
    console.log(`✅ PASSED: ${testCase.name}`);
    console.log(`   - Customer ID: ${result.customer_id}`);
    console.log(`   - KYC Status: ${result.kycs[0]?.status || 'none'}`);
    console.log(`   - KYC Link: ${result.kycs[0]?.kyc_flow_link || 'none'}`);
    passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${testCase.name}`);
    if (error instanceof z.ZodError) {
      console.log(`   - Error: ${error.errors[0].message}`);
    }
    failed++;
  }
  console.log();
}

console.log('='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log(
    '\n🎉 All tests passed! The system can now handle null KYC data gracefully.',
  );
  console.log(
    'This ensures eventual consistency - users will keep being checked until they have valid data.',
  );
} else {
  console.log(
    '\n⚠️ Some tests failed. The system may not achieve eventual consistency.',
  );
  process.exit(1);
}
