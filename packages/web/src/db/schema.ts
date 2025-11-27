import {
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  boolean,
  jsonb,
  bigint,
  primaryKey,
  uniqueIndex,
  index,
  integer,
  numeric,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import crypto from 'crypto';

const largeIntNumeric = (name: string) =>
  numeric(name, { precision: 78, scale: 0 }).$type<string>();

// Import and re-export users and workspaces from modular schema
export { users, type User, type NewUser } from './schema/users';
export {
  workspaces,
  workspaceMembers,
  workspaceInvites,
  workspaceMembersExtended,
  workspacesRelations,
  workspaceMembersRelations,
  workspaceInvitesRelations,
  type Workspace,
  type NewWorkspace,
  type WorkspaceMember,
  type NewWorkspaceMember,
  type WorkspaceInvite,
  type NewWorkspaceInvite,
  type WorkspaceMemberExtended,
  type NewWorkspaceMemberExtended,
} from './schema/workspaces';
export { admins, type Admin, type NewAdmin } from './schema/admins';

// User Safes - modular schema with architecture documentation
export {
  userSafes,
  userSafesRelations,
  type UserSafe,
  type NewUserSafe,
} from './schema/user-safes';

// Import for internal use within this file
import { users } from './schema/users';
import { workspaces, workspaceMembers } from './schema/workspaces';
import { userSafes } from './schema/user-safes';

// Define specific types for role and status for better type safety
export type InvoiceRole = 'seller' | 'buyer';
export type InvoiceStatus =
  | 'pending' // Invoice is committed to Request Network and awaiting payment
  | 'paid' // Invoice has been paid
  | 'db_pending' // Invoice is only saved in the database, not yet committed to Request Network
  | 'committing' // Invoice is in the process of being committed to Request Network
  | 'failed' // Invoice failed to commit to Request Network
  | 'canceled'; // Invoice has been canceled

// Removed: ephemeralKeysTable definition
/*
export const ephemeralKeysTable = pgTable("ephemeral_keys", {
  token: varchar("token", { length: 255 }).primaryKey(),
  privateKey: text("private_key").notNull(),
  publicKey: text("public_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});
*/

export const userWalletsTable = pgTable(
  'user_wallets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    workspaceId: uuid('workspace_id'),
    address: varchar('address', { length: 255 }).notNull().unique(),
    privateKey: text('private_key').notNull(),
    publicKey: text('public_key').notNull(),
    network: varchar('network', { length: 50 }).notNull().default('gnosis'),
    isDefault: boolean('is_default').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      workspaceIdx: index('user_wallets_workspace_idx').on(table.workspaceId),
    };
  },
);

export const userProfilesTable = pgTable(
  'user_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    privyDid: varchar('privy_did', { length: 255 }).notNull().unique(),
    workspaceId: uuid('workspace_id'),
    paymentAddress: varchar('payment_address', { length: 255 }),
    primarySafeAddress: varchar('primary_safe_address', { length: 42 }),
    businessName: varchar('business_name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    defaultWalletId: uuid('default_wallet_id').references(
      () => userWalletsTable.id,
    ),
    skippedOrCompletedOnboardingStepper: boolean(
      'skipped_or_completed_onboarding_stepper',
    ).default(false),
    isInsured: boolean('is_insured').default(false),
    insuranceActivatedAt: timestamp('insurance_activated_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      workspaceIdx: index('user_profiles_workspace_idx').on(table.workspaceId),
    };
  },
);

export const userRequestsTable = pgTable(
  'user_requests',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()), // Using text for UUIDs
    requestId: text('request_id'), // Request Network ID
    userId: text('user_id').notNull(),
    workspaceId: uuid('workspace_id'),
    companyId: uuid('company_id'), // Link to company (optional)
    senderCompanyId: uuid('sender_company_id').references(() => companies.id), // Company sending the invoice
    recipientCompanyId: uuid('recipient_company_id').references(
      () => companies.id,
    ), // Company receiving the invoice
    walletAddress: text('wallet_address'), // Wallet address used for the request
    role: text('role').$type<InvoiceRole>(),
    description: text('description'),
    amount: bigint('amount', { mode: 'bigint' }), // Stored as bigint (smallest unit)
    currency: text('currency'),
    currencyDecimals: integer('currency_decimals'), // Store the decimals used for the amount
    status: text('status').$type<InvoiceStatus>().default('db_pending'), // Default to db_pending
    client: text('client'),
    invoiceData: jsonb('invoice_data').notNull(), // Store the full validated Zod object (Use jsonb)
    // Removed: shareToken: text('share_token'), // Removed field for the ephemeral share token
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      workspaceIdx: index('user_requests_workspace_idx').on(table.workspaceId),
    };
  },
);

// Define relations between tables
export const userProfilesRelations = relations(
  userProfilesTable,
  ({ one }) => ({
    defaultWallet: one(userWalletsTable, {
      fields: [userProfilesTable.defaultWalletId],
      references: [userWalletsTable.id],
    }),
  }),
);

export const userWalletsRelations = relations(userWalletsTable, ({ many }) => ({
  profiles: many(userProfilesTable),
}));

// Type inference
// Removed: EphemeralKey types
// export type EphemeralKey = typeof ephemeralKeysTable.$inferSelect;
// export type NewEphemeralKey = typeof ephemeralKeysTable.$inferInsert;

export type UserWallet = typeof userWalletsTable.$inferSelect;
export type NewUserWallet = typeof userWalletsTable.$inferInsert;

export type UserProfile = typeof userProfilesTable.$inferSelect;
export type NewUserProfile = typeof userProfilesTable.$inferInsert;

export type UserRequest = typeof userRequestsTable.$inferSelect;
export type NewUserRequest = typeof userRequestsTable.$inferInsert;

// --- IMPORTED FROM BANK ---

// Users table - imported from schema/users.ts (see top of file)
// UserSafes table - imported from schema/user-safes.ts (see top of file)

// UserFundingSources table - Storing linked bank accounts and crypto destinations
export const userFundingSources = pgTable(
  'user_funding_sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userPrivyDid: text('user_privy_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),

    // Source Provider
    sourceProvider: text('source_provider', {
      enum: ['align', 'manual', 'other'],
    }), // Provider of the funding source
    alignVirtualAccountIdRef: text('align_virtual_account_id_ref'), // Reference to Align virtual account ID

    // Account Tier & Ownership
    accountTier: text('account_tier', {
      enum: ['starter', 'full'],
    }).default('full'), // Starter = pre-approved company KYB, Full = user's own KYB
    ownerAlignCustomerId: text('owner_align_customer_id'), // Which Align customer owns this virtual account

    // Source Bank Account Details
    sourceAccountType: text('source_account_type', {
      enum: ['us_ach', 'iban', 'uk_details', 'other'],
    }).notNull(), // Type identifier - Reverted to NOT NULL
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
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      // Add index on user privy did for faster lookups
      userDidIdx: index('user_funding_sources_user_did_idx').on(
        table.userPrivyDid,
      ), // Added index
      workspaceIdx: index('user_funding_sources_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

// Destination Bank Accounts table - Storing bank accounts for offramp transfers
export const userDestinationBankAccounts = pgTable(
  'user_destination_bank_accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(), // Changed from serial to uuid for consistency
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }), // Link to user's privy DID
    workspaceId: uuid('workspace_id'),
    accountName: text('account_name').notNull(), // Nickname for the account
    bankName: text('bank_name').notNull(),
    accountHolderType: text('account_holder_type', {
      enum: ['individual', 'business'],
    }).notNull(),
    accountHolderFirstName: text('account_holder_first_name'),
    accountHolderLastName: text('account_holder_last_name'),
    accountHolderBusinessName: text('account_holder_business_name'),

    // Address
    country: text('country').notNull(),
    city: text('city').notNull(),
    streetLine1: text('street_line_1').notNull(),
    streetLine2: text('street_line_2'),
    postalCode: text('postal_code').notNull(),

    // Account type
    accountType: text('account_type', { enum: ['us', 'iban'] }).notNull(),

    // US-specific fields (potentially encrypt these in the future)
    accountNumber: text('account_number'),
    routingNumber: text('routing_number'),

    // IBAN-specific fields (potentially encrypt iban_number)
    ibanNumber: text('iban_number'),
    bicSwift: text('bic_swift'),

    isDefault: boolean('is_default').default(false).notNull(), // Added notNull constraint
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()), // Added $onUpdate
  },
  (table) => {
    return {
      userDidIdx: index('user_dest_bank_accounts_user_id_idx').on(table.userId), // Added index
      workspaceIdx: index('user_dest_bank_accounts_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

// New table for Allocation Strategies
export const allocationStrategies = pgTable(
  'allocation_strategies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userDid: text('user_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),
    // Ensure a user can only have one strategy entry per safe type
    destinationSafeType: text('destination_safe_type', {
      enum: ['primary', 'tax', 'liquidity', 'yield'],
    }).notNull(),
    // Percentage stored as integer (e.g., 30 for 30%)
    percentage: integer('percentage').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userTypeUniqueIdx: uniqueIndex('user_strategy_type_unique_idx').on(
        table.userDid,
        table.destinationSafeType,
      ),
      workspaceIdx: index('allocation_strategies_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

// --- OFFRAMP RELATED TABLES ---

// OfframpTransfers table - Storing details about offramp transactions
export const offrampTransfers = pgTable(
  'offramp_transfers',
  {
    id: uuid('id').primaryKey().defaultRandom(), // Internal unique ID
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }), // Link to user
    workspaceId: uuid('workspace_id'),
    alignTransferId: text('align_transfer_id').notNull().unique(), // ID from Align API
    status: text('status', {
      enum: ['pending', 'processing', 'completed', 'failed', 'canceled'],
    }).notNull(), // Mirror Align statuses

    // Transfer Details
    amountToSend: text('amount_to_send').notNull(), // Amount of fiat to receive
    destinationCurrency: text('destination_currency').notNull(),
    destinationPaymentRails: text('destination_payment_rails'),
    // Store reference to the saved bank account used, if applicable
    destinationBankAccountId: uuid('destination_bank_account_id').references(
      () => userDestinationBankAccounts.id,
      { onDelete: 'set null' },
    ),
    // Store details of the bank account used (in case saved one is deleted, or for manual entry)
    destinationBankAccountSnapshot: jsonb('destination_bank_account_snapshot'),

    // Crypto Deposit Details (from Align quote)
    depositAmount: text('deposit_amount').notNull(), // Amount of crypto to send
    depositToken: text('deposit_token').notNull(),
    depositNetwork: text('deposit_network').notNull(),
    depositAddress: text('deposit_address').notNull(),
    feeAmount: text('fee_amount'),
    quoteExpiresAt: timestamp('quote_expires_at'),

    // Crypto Transaction Details (User Execution)
    transactionHash: text('transaction_hash'), // Hash of the user's deposit tx
    userOpHash: text('user_op_hash'), // Hash if sent via AA/Relayer

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdx: index('offramp_transfers_user_id_idx').on(table.userId),
      workspaceIdx: index('offramp_transfers_workspace_idx').on(
        table.workspaceId,
      ),
      alignIdIdx: index('offramp_transfers_align_id_idx').on(
        table.alignTransferId,
      ),
    };
  },
);

// --- ONRAMP TRANSFERS -------------------------------------------------------
export const onrampTransfers = pgTable(
  'onramp_transfers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),
    alignTransferId: text('align_transfer_id').notNull().unique(),

    // Transfer details
    status: text('status', {
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    }).notNull(),
    amount: text('amount').notNull(), // Amount in source currency
    sourceCurrency: text('source_currency').notNull(), // usd, eur
    sourceRails: text('source_rails').notNull(), // ach, sepa, wire
    destinationNetwork: text('destination_network').notNull(), // polygon, ethereum, solana, base
    destinationToken: text('destination_token').notNull(), // usdc, usdt
    destinationAddress: text('destination_address').notNull(),

    // Quote details
    depositRails: text('deposit_rails').notNull(),
    depositCurrency: text('deposit_currency').notNull(),
    depositBankAccount: jsonb('deposit_bank_account'), // Bank account details
    depositAmount: text('deposit_amount').notNull(),
    depositMessage: text('deposit_message'), // Reference for bank transfer
    feeAmount: text('fee_amount').notNull(),

    // Metadata
    metadata: jsonb('metadata'),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdx: index('onramp_transfers_user_id_idx').on(table.userId),
      workspaceIdx: index('onramp_transfers_workspace_idx').on(
        table.workspaceId,
      ),
      alignIdIdx: index('onramp_transfers_align_id_idx').on(
        table.alignTransferId,
      ),
    };
  },
);

// --- RELATIONS ---

// userSafesRelations - imported from schema/user-safes.ts (see top of file)

export const userFundingSourcesRelations = relations(
  userFundingSources,
  ({ one }) => ({
    user: one(users, {
      fields: [userFundingSources.userPrivyDid],
      references: [users.privyDid],
    }),
  }),
);

// Added relations for userDestinationBankAccounts
export const userDestinationBankAccountsRelations = relations(
  userDestinationBankAccounts,
  ({ one }) => ({
    user: one(users, {
      fields: [userDestinationBankAccounts.userId],
      references: [users.privyDid],
    }),
  }),
);

// Added relations for offrampTransfers
export const offrampTransfersRelations = relations(
  offrampTransfers,
  ({ one }) => ({
    user: one(users, {
      fields: [offrampTransfers.userId],
      references: [users.privyDid],
    }),
    // Optional: Link back to the specific destination bank account used
    destinationBankAccount: one(userDestinationBankAccounts, {
      fields: [offrampTransfers.destinationBankAccountId],
      references: [userDestinationBankAccounts.id],
    }),
  }),
);

// Added relations for allocationStrategies
export const allocationStrategiesRelations = relations(
  allocationStrategies,
  ({ one }) => ({
    user: one(users, {
      fields: [allocationStrategies.userDid],
      references: [users.privyDid],
    }),
  }),
);

// Added relations for onrampTransfers
export const onrampTransfersRelations = relations(
  onrampTransfers,
  ({ one }) => ({
    user: one(users, {
      fields: [onrampTransfers.userId],
      references: [users.privyDid],
    }),
  }),
);

// --- TYPE INFERENCE ---

// Type inference for bank tables
// User and NewUser types imported from schema/users.ts (see top of file)
// UserSafe and NewUserSafe types imported from schema/user-safes.ts (see top of file)

export type UserFundingSource = typeof userFundingSources.$inferSelect;
export type NewUserFundingSource = typeof userFundingSources.$inferInsert;

// Added type inference for destination bank accounts
export type UserDestinationBankAccount =
  typeof userDestinationBankAccounts.$inferSelect;
export type NewUserDestinationBankAccount =
  typeof userDestinationBankAccounts.$inferInsert;

// Added type inference for offramp transfers
export type OfframpTransfer = typeof offrampTransfers.$inferSelect;
export type NewOfframpTransfer = typeof offrampTransfers.$inferInsert;

// Added type inference for allocation strategies
export type AllocationStrategy = typeof allocationStrategies.$inferSelect;
export type NewAllocationStrategy = typeof allocationStrategies.$inferInsert;

export const earnDeposits = pgTable(
  'earn_deposits',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userDid: text('user_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),
    safeAddress: varchar('safe_address', { length: 42 }).notNull(),
    chainId: integer('chain_id').notNull().default(8453), // Chain ID where the vault is deployed (default: Base mainnet)
    vaultAddress: varchar('vault_address', { length: 42 }).notNull(),
    tokenAddress: varchar('token_address', { length: 42 }).notNull(),
    assetsDeposited: largeIntNumeric('assets_deposited').notNull(),
    sharesReceived: largeIntNumeric('shares_received').notNull(),
    txHash: varchar('tx_hash', { length: 66 }).notNull().unique(),
    timestamp: timestamp('timestamp', { withTimezone: true })
      .notNull()
      .defaultNow(),
    depositPercentage: integer('deposit_percentage'),
    apyBasisPoints: integer('apy_basis_points'),
    assetDecimals: integer('asset_decimals').notNull().default(6),
  },
  (table) => {
    return {
      safeAddressIdx: index('earn_safe_address_idx').on(table.safeAddress),
      vaultAddressIdx: index('earn_vault_address_idx').on(table.vaultAddress),
      chainIdIdx: index('earn_deposits_chain_id_idx').on(table.chainId),
      userDidIdx: index('earn_user_did_idx').on(table.userDid),
      workspaceIdx: index('earn_workspace_idx').on(table.workspaceId),
    };
  },
);

export const earnWithdrawals = pgTable(
  'earn_withdrawals',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userDid: text('user_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),
    safeAddress: varchar('safe_address', { length: 42 }).notNull(),
    chainId: integer('chain_id').notNull().default(8453), // Chain ID where the vault is deployed (default: Base mainnet)
    vaultAddress: varchar('vault_address', { length: 42 }).notNull(),
    tokenAddress: varchar('token_address', { length: 42 }).notNull(),
    assetsWithdrawn: largeIntNumeric('assets_withdrawn').notNull(),
    sharesBurned: largeIntNumeric('shares_burned').notNull(),
    txHash: varchar('tx_hash', { length: 66 }).notNull().unique(),
    userOpHash: varchar('user_op_hash', { length: 66 }), // For AA transactions
    timestamp: timestamp('timestamp', { withTimezone: true })
      .notNull()
      .defaultNow(),
    status: text('status', {
      enum: ['pending', 'completed', 'failed'],
    })
      .notNull()
      .default('pending'),
  },
  (table) => {
    return {
      safeAddressIdx: index('earn_withdrawals_safe_address_idx').on(
        table.safeAddress,
      ),
      vaultAddressIdx: index('earn_withdrawals_vault_address_idx').on(
        table.vaultAddress,
      ),
      chainIdIdx: index('earn_withdrawals_chain_id_idx').on(table.chainId),
      userDidIdx: index('earn_withdrawals_user_did_idx').on(table.userDid),
      workspaceIdx: index('earn_withdrawals_workspace_idx').on(
        table.workspaceId,
      ),
      statusIdx: index('earn_withdrawals_status_idx').on(table.status),
    };
  },
);

export const earnVaultApySnapshots = pgTable(
  'earn_vault_apy_snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    vaultAddress: varchar('vault_address', { length: 42 }).notNull(),
    chainId: integer('chain_id').notNull(),
    apyBasisPoints: integer('apy_basis_points').notNull(),
    source: text('source'),
    capturedAt: timestamp('captured_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      vaultIdx: index('earn_vault_apy_snapshots_vault_idx').on(
        table.vaultAddress,
      ),
      vaultTimeIdx: index('earn_vault_apy_snapshots_vault_time_idx').on(
        table.vaultAddress,
        table.capturedAt,
      ),
    };
  },
);

// --- INCOMING DEPOSITS TRACKING ----------------------------------------------
export const incomingDeposits = pgTable(
  'incoming_deposits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userDid: text('user_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),
    safeAddress: varchar('safe_address', { length: 42 }).notNull(),
    txHash: varchar('tx_hash', { length: 66 }).notNull().unique(),
    fromAddress: varchar('from_address', { length: 42 }).notNull(),
    tokenAddress: varchar('token_address', { length: 42 }).notNull(),
    amount: largeIntNumeric('amount').notNull(), // Amount in smallest unit
    blockNumber: bigint('block_number', { mode: 'bigint' }).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),

    // Sweep tracking
    swept: boolean('swept').notNull().default(false),
    sweptAmount: largeIntNumeric('swept_amount'), // Amount that was swept to savings
    sweptPercentage: integer('swept_percentage'), // Percentage used for sweep
    sweptTxHash: varchar('swept_tx_hash', { length: 66 }), // Transaction hash of the sweep
    sweptAt: timestamp('swept_at', { withTimezone: true }), // When it was swept

    // Metadata
    metadata: jsonb('metadata'), // Additional data like transaction type, labels, etc.

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      safeAddressIdx: index('incoming_deposits_safe_address_idx').on(
        table.safeAddress,
      ),
      txHashIdx: index('incoming_deposits_tx_hash_idx').on(table.txHash),
      userDidIdx: index('incoming_deposits_user_did_idx').on(table.userDid),
      workspaceIdx: index('incoming_deposits_workspace_idx').on(
        table.workspaceId,
      ),
      sweptIdx: index('incoming_deposits_swept_idx').on(table.swept),
      timestampIdx: index('incoming_deposits_timestamp_idx').on(
        table.timestamp,
      ),
    };
  },
);

// Define relations if necessary, e.g., if you want to link earnDeposits back to userSafes or users directly in queries
// export const earnDepositsRelations = relations(earnDeposits, ({ one }) => ({
//   user: one(users, {
//     fields: [earnDeposits.userDid],
//     references: [users.privyDid],
//   }),
//   safe: one(userSafes, { // This relation might be complex if safeAddress is not unique across users in userSafes
//     fields: [earnDeposits.safeAddress, earnDeposits.userDid], // Example composite key
//     references: [userSafes.safeAddress, userSafes.userDid], // Example composite key
//   }),
// }));

// --- AUTO-EARN CONFIGS ------------------------------------------------------
export const autoEarnConfigs = pgTable(
  'auto_earn_configs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userDid: varchar('user_did', { length: 66 }).notNull(),
    safeAddress: varchar('safe_address', { length: 42 }).notNull(),
    pct: integer('pct').notNull(),
    lastTrigger: timestamp('last_trigger', { withTimezone: true }),
    autoVaultAddress: varchar('auto_vault_address', { length: 42 }),
    workspaceId: uuid('workspace_id'),
  },
  (table) => {
    return {
      userSafeUniqueIdx: uniqueIndex('auto_earn_user_safe_unique_idx').on(
        table.userDid,
        table.safeAddress,
      ),
      workspaceIdx: index('auto_earn_workspace_idx').on(table.workspaceId),
    };
  },
);

// --- CHAT TABLES -------------------------------------------------------------

// Chats table - Storing overall chat sessions
export const chats = pgTable(
  'chats',
  {
    id: text('id').primaryKey(), // UI-generated chat ID (e.g., UUID)
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),
    title: text('title').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    visibility: text('visibility', { enum: ['private', 'public', 'unlisted'] })
      .default('private')
      .notNull(),
    sharePath: text('share_path').unique(), // For link sharing
  },
  (table) => {
    return {
      userIdIdx: index('chats_user_id_idx').on(table.userId),
      workspaceIdx: index('chats_workspace_idx').on(table.workspaceId),
      sharePathIdx: index('chats_share_path_idx').on(table.sharePath),
    };
  },
);

// ChatMessages table - Storing individual messages within a chat
export const chatMessages = pgTable(
  'chat_messages',
  {
    id: text('id').primaryKey(), // UI-generated message ID (e.g., UUID)
    chatId: text('chat_id')
      .notNull()
      .references(() => chats.id, { onDelete: 'cascade' }),
    role: text('role', {
      enum: ['user', 'assistant', 'system', 'tool'],
    }).notNull(),
    content: text('content'), // Simple text content, can be deprecated if parts is always used
    parts: jsonb('parts'), // For Vercel AI SDK UIMessagePart structure or similar rich content
    attachments: jsonb('attachments'), // Array of attachment objects
    toolName: text('tool_name'),
    toolCallId: text('tool_call_id'),
    toolResult: jsonb('tool_result'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      chatIdIdx: index('chat_messages_chat_id_idx').on(table.chatId),
      roleIdx: index('chat_messages_role_idx').on(table.role),
    };
  },
);

// Optional: ChatStreams table (if resumable streams are needed)
// export const chatStreams = pgTable(
//   "chat_streams",
//   {
//     streamId: text("stream_id").primaryKey(),
//     chatId: text("chat_id").notNull().references(() => chats.id, { onDelete: 'cascade' }),
//     createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
//   },
//   (table) => {
//     return {
//       chatIdIdx: index("chat_streams_chat_id_idx").on(table.chatId),
//     };
//   },
// );

// Relations for Chat tables
export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.privyDid],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chats, {
    fields: [chatMessages.chatId],
    references: [chats.id],
  }),
}));

// Type inference for Chat tables
export type ChatDB = typeof chats.$inferSelect;
export type NewChatDB = typeof chats.$inferInsert;

export type ChatMessageDB = typeof chatMessages.$inferSelect;
export type NewChatMessageDB = typeof chatMessages.$inferInsert;

// Optional: Type inference for ChatStreams table
// export type ChatStreamDB = typeof chatStreams.$inferSelect;
// export type NewChatStreamDB = typeof chatStreams.$inferInsert;

// --- USER CLASSIFICATION SETTINGS -------------------------------------------
export const userClassificationSettings = pgTable(
  'user_classification_settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),
    name: text('name').notNull(), // User-friendly name for the prompt
    prompt: text('prompt').notNull(), // The actual classification instruction
    enabled: boolean('enabled').default(true).notNull(),
    priority: integer('priority').default(0).notNull(), // Lower number = higher priority
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIdx: index('user_classification_settings_user_id_idx').on(
        table.userId,
      ),
      priorityIdx: index('user_classification_settings_priority_idx').on(
        table.priority,
      ),
      enabledIdx: index('user_classification_settings_enabled_idx').on(
        table.enabled,
      ),
      workspaceIdx: index('user_classification_settings_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

// Relations for classification settings
export const userClassificationSettingsRelations = relations(
  userClassificationSettings,
  ({ one }) => ({
    user: one(users, {
      fields: [userClassificationSettings.userId],
      references: [users.privyDid],
    }),
  }),
);

// Workspace tables for partner expense tracking - imported from schema/workspaces.ts (see top of file)

// Define relations for users once workspaces are declared
export const usersRelations = relations(users, ({ one, many }) => ({
  primaryWorkspace: one(workspaces, {
    fields: [users.primaryWorkspaceId],
    references: [workspaces.id],
  }),
  safes: many(userSafes),
  fundingSources: many(userFundingSources),
  destinationBankAccounts: many(userDestinationBankAccounts),
  offrampTransfers: many(offrampTransfers),
  onrampTransfers: many(onrampTransfers),
  allocationStrategies: many(allocationStrategies),
  chats: many(chats),
  classificationSettings: many(userClassificationSettings),
}));

// Type inference for workspace tables - imported from schema/workspaces.ts (see top of file)

// Type inference for classification settings
export type UserClassificationSetting =
  typeof userClassificationSettings.$inferSelect;
export type NewUserClassificationSetting =
  typeof userClassificationSettings.$inferInsert;

// Added type inference for onramp transfers
export type OnrampTransfer = typeof onrampTransfers.$inferSelect;
export type NewOnrampTransfer = typeof onrampTransfers.$inferInsert;

// Type inference for earn tables
export type EarnDeposit = typeof earnDeposits.$inferSelect;
export type NewEarnDeposit = typeof earnDeposits.$inferInsert;

export type EarnWithdrawal = typeof earnWithdrawals.$inferSelect;
export type NewEarnWithdrawal = typeof earnWithdrawals.$inferInsert;

export type EarnVaultApySnapshot = typeof earnVaultApySnapshots.$inferSelect;
export type NewEarnVaultApySnapshot = typeof earnVaultApySnapshots.$inferInsert;

// Type inference for incoming deposits
export type IncomingDeposit = typeof incomingDeposits.$inferSelect;
export type NewIncomingDeposit = typeof incomingDeposits.$inferInsert;

// NEW: platformTotals table – store aggregated platform-level totals like total USDC across all safes
export const platformTotals = pgTable('platform_totals', {
  token: text('token').primaryKey(), // e.g., 'USDC'
  totalDeposited: largeIntNumeric('total_deposited').notNull(), // Amount in smallest unit (string-encoded integer)
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type PlatformTotal = typeof platformTotals.$inferSelect;
export type NewPlatformTotal = typeof platformTotals.$inferInsert;

// User Features table - Track which features users have access to
export const userFeatures = pgTable(
  'user_features',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userPrivyDid: text('user_privy_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),
    featureName: text('feature_name', {
      enum: ['savings'],
    }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    purchaseSource: text('purchase_source', {
      enum: ['polar', 'manual', 'promo'],
    }).default('polar'),
    purchaseReference: text('purchase_reference'), // Reference to the purchase (e.g., Polar order ID)
    activatedAt: timestamp('activated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }), // null means no expiration
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Ensure a user can only have one active feature of each type
      userFeatureUniqueIdx: uniqueIndex('user_feature_unique_idx').on(
        table.userPrivyDid,
        table.featureName,
      ),
      userDidIdx: index('user_features_user_did_idx').on(table.userPrivyDid),
      workspaceIdx: index('user_features_workspace_idx').on(table.workspaceId),
    };
  },
);

export type UserFeature = typeof userFeatures.$inferSelect;
export type NewUserFeature = typeof userFeatures.$inferInsert;

// Invoice Templates table - For saving reusable templates
export const invoiceTemplates = pgTable(
  'invoice_templates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userPrivyDid: text('user_privy_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),

    name: text('name').notNull(),
    description: text('description'),
    templateData: jsonb('template_data'), // Stores services, compliance, default values

    // Usage tracking
    usageCount: integer('usage_count').default(0),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIdx: index('invoice_templates_user_id_idx').on(table.userPrivyDid),
      nameIdx: index('invoice_templates_name_idx').on(table.name),
      workspaceIdx: index('invoice_templates_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

export type InvoiceTemplate = typeof invoiceTemplates.$inferSelect;
export type NewInvoiceTemplate = typeof invoiceTemplates.$inferInsert;

// Multi-tenant company tables - Companies serve as profiles for invoicing
export const companies = pgTable(
  'companies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    ownerPrivyDid: text('owner_privy_did').notNull(),
    workspaceId: uuid('workspace_id'),

    // Address information
    address: text('address'),
    city: text('city'),
    postalCode: text('postal_code'),
    country: text('country'),

    // Payment details
    paymentAddress: text('payment_address'), // wallet address
    preferredNetwork: text('preferred_network').default('solana'), // solana, base, ethereum
    preferredCurrency: text('preferred_currency').default('USDC'),

    // Business details
    taxId: text('tax_id'),

    // Company settings stored as JSONB for additional data
    settings: jsonb('settings').default('{}'), // {paymentTerms, etc}

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', { withTimezone: true }), // Soft delete
  },
  (table) => {
    return {
      ownerIdx: index('companies_owner_idx').on(table.ownerPrivyDid),
      workspaceIdx: index('companies_workspace_idx').on(table.workspaceId),
    };
  },
);

export const companyMembers = pgTable(
  'company_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    userPrivyDid: text('user_privy_did').notNull(),
    role: text('role', { enum: ['owner', 'member'] })
      .notNull()
      .default('member'),
    workspaceId: uuid('workspace_id'),

    // Timestamps
    joinedAt: timestamp('joined_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      companyUserIdx: uniqueIndex('company_members_company_user_idx').on(
        table.companyId,
        table.userPrivyDid,
      ),
      userIdx: index('company_members_user_idx').on(table.userPrivyDid),
      workspaceIdx: index('company_members_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

export const sharedCompanyData = pgTable(
  'shared_company_data',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),
    dataKey: text('data_key').notNull(),
    dataValue: text('data_value').notNull(),

    // Timestamps
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      companyKeyIdx: uniqueIndex('shared_company_data_company_key_idx').on(
        table.companyId,
        table.dataKey,
      ),
      workspaceIdx: index('shared_company_data_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

// Company Clients - Track which companies are used as clients by users
export const companyClients = pgTable(
  'company_clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userPrivyDid: text('user_privy_did').notNull(), // User who saved this client
    clientCompanyId: uuid('client_company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),

    // Metadata
    notes: text('notes'),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userClientIdx: uniqueIndex('company_clients_user_client_idx').on(
        table.userPrivyDid,
        table.clientCompanyId,
      ),
      userIdx: index('company_clients_user_idx').on(table.userPrivyDid),
      workspaceIdx: index('company_clients_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

export type CompanyClient = typeof companyClients.$inferSelect;
export type NewCompanyClient = typeof companyClients.$inferInsert;

export const companyInviteLinks = pgTable(
  'company_invite_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    token: text('token').unique().notNull(),
    workspaceId: uuid('workspace_id'),

    // Optional metadata
    metadata: jsonb('metadata').default('{}'), // Can store invite purpose, permissions, etc

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    usedCount: integer('used_count').default(0),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex('company_invite_links_token_idx').on(table.token),
      companyIdx: index('company_invite_links_company_idx').on(table.companyId),
      workspaceIdx: index('company_invite_links_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type CompanyMember = typeof companyMembers.$inferSelect;
export type NewCompanyMember = typeof companyMembers.$inferInsert;
export type SharedCompanyData = typeof sharedCompanyData.$inferSelect;
export type NewSharedCompanyData = typeof sharedCompanyData.$inferInsert;
export type CompanyInviteLink = typeof companyInviteLinks.$inferSelect;
export type NewCompanyInviteLink = typeof companyInviteLinks.$inferInsert;

// Company relations
export const companiesRelations = relations(companies, ({ many }) => ({
  members: many(companyMembers),
  sharedData: many(sharedCompanyData),
  inviteLinks: many(companyInviteLinks),
}));

export const companyMembersRelations = relations(companyMembers, ({ one }) => ({
  company: one(companies, {
    fields: [companyMembers.companyId],
    references: [companies.id],
  }),
}));

export const sharedCompanyDataRelations = relations(
  sharedCompanyData,
  ({ one }) => ({
    company: one(companies, {
      fields: [sharedCompanyData.companyId],
      references: [companies.id],
    }),
  }),
);

export const companyInviteLinksRelations = relations(
  companyInviteLinks,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyInviteLinks.companyId],
      references: [companies.id],
    }),
  }),
);

// User Invoice Preferences - Store default invoice settings
export const userInvoicePreferences = pgTable(
  'user_invoice_preferences',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userPrivyDid: text('user_privy_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'),

    // Default seller information
    defaultSellerName: text('default_seller_name'),
    defaultSellerEmail: text('default_seller_email'),
    defaultSellerAddress: text('default_seller_address'),
    defaultSellerCity: text('default_seller_city'),
    defaultSellerPostalCode: text('default_seller_postal_code'),
    defaultSellerCountry: text('default_seller_country'),

    // Default payment settings
    defaultPaymentTerms: text('default_payment_terms'),
    defaultCurrency: text('default_currency'),
    defaultPaymentType: text('default_payment_type'),
    defaultNetwork: text('default_network'),

    // Default notes and terms
    defaultNotes: text('default_notes'),
    defaultTerms: text('default_terms'),

    // Multiple profiles support
    profileName: text('profile_name').default('Default'),
    isActive: boolean('is_active').default(true),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('user_invoice_prefs_user_id_idx').on(table.userPrivyDid),
      activeIdx: index('user_invoice_prefs_active_idx').on(table.isActive),
      workspaceIdx: index('user_invoice_prefs_workspace_idx').on(
        table.workspaceId,
      ),
    };
  },
);

export type UserInvoicePreferences = typeof userInvoicePreferences.$inferSelect;
export type NewUserInvoicePreferences =
  typeof userInvoicePreferences.$inferInsert;

// API Waitlist table
export const apiWaitlist = pgTable(
  'api_waitlist',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }),
    companyName: varchar('company_name', { length: 255 }),
    useCase: text('use_case'),
    privyDid: varchar('privy_did', { length: 255 }),
    userId: varchar('user_id', { length: 255 }),
    status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, contacted, onboarded
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      emailIdx: index('api_waitlist_email_idx').on(table.email),
      privyDidIdx: index('api_waitlist_privy_did_idx').on(table.privyDid),
      statusIdx: index('api_waitlist_status_idx').on(table.status),
    };
  },
);

export type ApiWaitlist = typeof apiWaitlist.$inferSelect;
export type NewApiWaitlist = typeof apiWaitlist.$inferInsert;

// Workspace invite system and extensions - imported from schema/workspaces.ts (see top of file)

// Bridge transactions for cross-chain operations
export {
  bridgeTransactions,
  type InsertBridgeTransaction,
  type SelectBridgeTransaction,
} from './schema/bridge-transactions';

// Workspace features for admin-controlled feature activation
export {
  workspaceFeatures,
  workspaceFeaturesRelations,
  type WorkspaceFeature,
  type NewWorkspaceFeature,
  type WorkspaceFeatureName,
} from './schema/workspace-features';
