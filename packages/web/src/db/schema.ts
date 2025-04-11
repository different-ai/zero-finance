import { pgTable, text, timestamp, varchar, uuid, boolean, jsonb, bigint, primaryKey, uniqueIndex, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define specific types for role and status for better type safety
export type InvoiceRole = 'seller' | 'buyer';
export type InvoiceStatus = 'pending' | 'paid' | 'db_pending';

export const ephemeralKeysTable = pgTable("ephemeral_keys", {
  token: varchar("token", { length: 255 }).primaryKey(),
  privateKey: text("private_key").notNull(),
  publicKey: text("public_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const userWalletsTable = pgTable("user_wallets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull().unique(),
  privateKey: text("private_key").notNull(),
  publicKey: text("public_key").notNull(),
  network: varchar("network", { length: 50 }).notNull().default("gnosis"),
  isDefault: boolean("is_default").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfilesTable = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  privyDid: varchar("privy_did", { length: 255 }).notNull().unique(),
  paymentAddress: varchar("payment_address", { length: 255 }),
  primarySafeAddress: varchar("primary_safe_address", { length: 42 }),
  businessName: varchar("business_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  defaultWalletId: uuid("default_wallet_id").references(() => userWalletsTable.id),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRequestsTable = pgTable("user_requests", {
  id: text('id').primaryKey().default(crypto.randomUUID()), // Using text for UUIDs
  requestId: text('request_id'), // Request Network ID
  userId: text('user_id').notNull(),
  walletAddress: text('wallet_address'), // Wallet address used for the request
  role: text('role').$type<InvoiceRole>(),
  description: text('description'),
  amount: text('amount'), // Stored as string to maintain precision
  currency: text('currency'),
  status: text('status').$type<InvoiceStatus>().default('db_pending'), // Default to db_pending
  client: text('client'),
  invoiceData: jsonb('invoice_data').notNull(), // Store the full validated Zod object (Use jsonb)
  shareToken: text('share_token'), // Added field for the ephemeral share token
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations between tables
export const userProfilesRelations = relations(userProfilesTable, ({ one }) => ({
  defaultWallet: one(userWalletsTable, {
    fields: [userProfilesTable.defaultWalletId],
    references: [userWalletsTable.id],
  }),
}));

export const userWalletsRelations = relations(userWalletsTable, ({ many }) => ({
  profiles: many(userProfilesTable),
}));

// Type inference
export type EphemeralKey = typeof ephemeralKeysTable.$inferSelect;
export type NewEphemeralKey = typeof ephemeralKeysTable.$inferInsert;

export type UserWallet = typeof userWalletsTable.$inferSelect;
export type NewUserWallet = typeof userWalletsTable.$inferInsert;

export type UserProfile = typeof userProfilesTable.$inferSelect;
export type NewUserProfile = typeof userProfilesTable.$inferInsert;

export const companyProfilesTable = pgTable("company_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => userProfilesTable.id),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  // Contact information
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 255 }),
  // Business details
  taxRegistration: varchar("tax_registration", { length: 100 }),
  registrationNumber: varchar("registration_number", { length: 100 }),
  industryType: varchar("industry_type", { length: 100 }),
  // Address
  streetAddress: varchar("street_address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  postalCode: varchar("postal_code", { length: 50 }),
  country: varchar("country", { length: 100 }),
  // Logo and branding
  logoUrl: varchar("logo_url", { length: 500 }),
  brandColor: varchar("brand_color", { length: 50 }),
  // Additional information
  isDefault: boolean("is_default").default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations for company profiles
export const companyProfilesRelations = relations(companyProfilesTable, ({ one }) => ({
  userProfile: one(userProfilesTable, {
    fields: [companyProfilesTable.userId],
    references: [userProfilesTable.id],
  }),
}));

export type UserRequest = typeof userRequestsTable.$inferSelect;
export type NewUserRequest = typeof userRequestsTable.$inferInsert;

export type CompanyProfile = typeof companyProfilesTable.$inferSelect;
export type NewCompanyProfile = typeof companyProfilesTable.$inferInsert;

// --- IMPORTED FROM BANK ---

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

// Define relations for bank tables
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

// Type inference for bank tables
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserSafe = typeof userSafes.$inferSelect;
export type NewUserSafe = typeof userSafes.$inferInsert;

export type AllocationState = typeof allocationStates.$inferSelect;
export type NewAllocationState = typeof allocationStates.$inferInsert;

export type UserFundingSource = typeof userFundingSources.$inferSelect;
export type NewUserFundingSource = typeof userFundingSources.$inferInsert;
