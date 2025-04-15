import { pgTable, text, varchar, timestamp, bigint, primaryKey, uniqueIndex, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - Storing basic user info, identified by Privy DID
export const users = pgTable('users', {
  privyDid: text('privy_did').primaryKey(), // Privy Decentralized ID
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// UserSafes table - Linking users to their various Safe addresses
export const userSafes = pgTable('user_safes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()), // Unique ID for the safe record
  userDid: text('user_did').notNull().references(() => users.privyDid), // Foreign key to users table
  safeAddress: varchar('safe_address', { length: 42 }).notNull(), // Ethereum address (42 chars)
  safeType: text('safe_type', { enum: ['primary', 'tax', 'liquidity', 'yield'] }).notNull(), // Type of Safe
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    // Ensure a user can only have one Safe of each type
    userTypeUniqueIdx: uniqueIndex('user_safe_type_unique_idx').on(table.userDid, table.safeType),
  };
});

// AllocationStates table - Storing allocation data per primary Safe
export const allocationStates = pgTable('allocation_states', {
  userSafeId: text('user_safe_id').notNull().references(() => userSafes.id), // Foreign key to the specific primary user safe
  lastCheckedUSDCBalance: text('last_checked_usdc_balance').default('0').notNull(), // Storing as text to handle large numbers (wei)
  totalDeposited: text('total_deposited').default('0').notNull(),        // Storing as text
  allocatedTax: text('allocated_tax').default('0').notNull(),          // Storing as text
  allocatedLiquidity: text('allocated_liquidity').default('0').notNull(),    // Storing as text
  allocatedYield: text('allocated_yield').default('0').notNull(),        // Storing as text
  pendingDepositAmount: text('pending_deposit_amount').default('0').notNull(), // Storing as text
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    // Make userSafeId the primary key, as each primary safe has one state
    pk: primaryKey({ columns: [table.userSafeId] }),
  };
});

// UserFundingSources table - Storing linked bank accounts and crypto destinations
export const userFundingSources = pgTable('user_funding_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  userPrivyDid: text('user_privy_did').notNull().references(() => users.privyDid, { onDelete: 'cascade' }),

  // Source Bank Account Details
  sourceAccountType: text('source_account_type', { enum: ['us_ach', 'iban', 'uk_details', 'other'] }).notNull(), // Type identifier - Reverted to NOT NULL
  sourceCurrency: text('source_currency'),
  sourceBankName: text('source_bank_name'),
  sourceBankAddress: text('source_bank_address'), // Optional general address
  sourceBankBeneficiaryName: text('source_bank_beneficiary_name'),
  sourceBankBeneficiaryAddress: text('source_bank_beneficiary_address'), // Beneficiary's address

  // Type-Specific Identifiers (nullable)
  sourceIban: text('source_iban'), // International Bank Account Number - NEW
  sourceBicSwift: text('source_bic_swift'), // Bank Identifier Code - NEW
  sourceRoutingNumber: text('source_routing_number'), // US ABA routing transit number - Now nullable
  sourceAccountNumber: text('source_account_number'), // US / UK account number - Now nullable
  sourceSortCode: text('source_sort_code'), // UK Sort Code - NEW

  // Payment Rails
  sourcePaymentRail: text('source_payment_rail'), // Primary rail used/intended (e.g., ach_push, sepa_credit, faster_payments)
  sourcePaymentRails: text('source_payment_rails').array(), // All supported rails

  // Destination Details (remains the same)
  destinationCurrency: text('destination_currency'),
  destinationPaymentRail: text('destination_payment_rail'),
  destinationAddress: varchar('destination_address', { length: 42 }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => {
  return {
    // Add index on user privy did for faster lookups
    userDidIdx: index('user_funding_sources_user_did_idx').on(table.userPrivyDid), // Added index
  };
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  safes: many(userSafes),
  fundingSources: many(userFundingSources),
}));

export const userSafesRelations = relations(userSafes, ({ one }) => ({
  user: one(users, {
    fields: [userSafes.userDid],
    references: [users.privyDid],
  }),
  allocationState: one(allocationStates, {
    fields: [userSafes.id],
    references: [allocationStates.userSafeId],
  }),
}));

export const allocationStatesRelations = relations(allocationStates, ({ one }) => ({
  userSafe: one(userSafes, {
    fields: [allocationStates.userSafeId],
    references: [userSafes.id],
  }),
}));

export const userFundingSourcesRelations = relations(userFundingSources, ({ one }) => ({
  user: one(users, {
    fields: [userFundingSources.userPrivyDid],
    references: [users.privyDid],
  }),
})); 