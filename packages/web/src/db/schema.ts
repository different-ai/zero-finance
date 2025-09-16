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

export const userWalletsTable = pgTable('user_wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull().unique(),
  privateKey: text('private_key').notNull(),
  publicKey: text('public_key').notNull(),
  network: varchar('network', { length: 50 }).notNull().default('gnosis'),
  isDefault: boolean('is_default').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userProfilesTable = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  privyDid: varchar('privy_did', { length: 255 }).notNull().unique(),
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
});

export const userRequestsTable = pgTable('user_requests', {
  id: text('id').primaryKey().default(crypto.randomUUID()), // Using text for UUIDs
  requestId: text('request_id'), // Request Network ID
  userId: text('user_id').notNull(),
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
});

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

// Users table - Storing basic user info, identified by Privy DID
export const users = pgTable('users', {
  privyDid: text('privy_did').primaryKey(), // Privy Decentralized ID
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  // User identity fields
  firstName: text('first_name'),
  lastName: text('last_name'),
  companyName: text('company_name'),
  beneficiaryType: text('beneficiary_type', {
    enum: ['individual', 'business'],
  }),
  // Align-specific fields
  alignCustomerId: text('align_customer_id').unique(), // Customer ID from Align API
  kycProvider: text('kyc_provider', { enum: ['align', 'other'] }), // KYC provider
  kycStatus: text('kyc_status', {
    enum: ['none', 'pending', 'approved', 'rejected'],
  }).default('none'), // KYC status
  kycFlowLink: text('kyc_flow_link'), // Link to KYC flow
  alignVirtualAccountId: text('align_virtual_account_id'), // Virtual account ID from Align
  // User indicated they finished the KYC flow
  kycMarkedDone: boolean('kyc_marked_done').default(false).notNull(),
  kycSubStatus: text('kyc_sub_status'),
  // KYC notification tracking
  kycNotificationSent: timestamp('kyc_notification_sent', {
    withTimezone: true,
  }), // When KYC approved email was sent
  kycNotificationStatus: text('kyc_notification_status', {
    enum: ['pending', 'sent', 'failed'],
  }), // Status of notification
  // Flag to track if contact has been sent to Loops
  loopsContactSynced: boolean('loops_contact_synced').default(false).notNull(),
  // User role to differentiate between startups and contractors
  userRole: text('user_role', {
    enum: ['startup', 'contractor'],
  })
    .default('startup')
    .notNull(),
  // Invite code used for contractor onboarding
  contractorInviteCode: text('contractor_invite_code'),
});

// UserSafes table - Linking users to their various Safe addresses
export const userSafes = pgTable(
  'user_safes',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()), // Unique ID for the safe record
    userDid: text('user_did')
      .notNull()
      .references(() => users.privyDid), // Foreign key to users table
    safeAddress: varchar('safe_address', { length: 42 }).notNull(), // Ethereum address (42 chars)
    safeType: text('safe_type', {
      enum: ['primary', 'tax', 'liquidity', 'yield'],
    }).notNull(), // Type of Safe
    isEarnModuleEnabled: boolean('is_earn_module_enabled')
      .default(false)
      .notNull(), // Tracks if the earn module is enabled
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Ensure a user can only have one Safe of each type
      userTypeUniqueIdx: uniqueIndex('user_safe_type_unique_idx').on(
        table.userDid,
        table.safeType,
      ),
    };
  },
);

// UserFundingSources table - Storing linked bank accounts and crypto destinations
export const userFundingSources = pgTable(
  'user_funding_sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userPrivyDid: text('user_privy_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),

    // Source Provider
    sourceProvider: text('source_provider', {
      enum: ['align', 'manual', 'other'],
    }), // Provider of the funding source
    alignVirtualAccountIdRef: text('align_virtual_account_id_ref'), // Reference to Align virtual account ID

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
      alignIdIdx: index('onramp_transfers_align_id_idx').on(
        table.alignTransferId,
      ),
    };
  },
);

// --- RELATIONS ---

// Define relations for bank tables
export const usersRelations = relations(users, ({ many }) => ({
  safes: many(userSafes),
  fundingSources: many(userFundingSources),
  destinationBankAccounts: many(userDestinationBankAccounts), // Added relation
  offrampTransfers: many(offrampTransfers), // Added relation
  onrampTransfers: many(onrampTransfers), // Added relation
  allocationStrategies: many(allocationStrategies), // Added relation for strategies
  actionLedgerEntries: many(actionLedger), // Added relation for approved actions
  inboxCards: many(inboxCards), // Added relation for inbox cards
  cardActions: many(cardActions), // Added relation for card actions
  chats: many(chats), // Relation from users to their chats
  classificationSettings: many(userClassificationSettings), // Added relation for classification settings
}));

export const userSafesRelations = relations(userSafes, ({ one, many }) => ({
  user: one(users, {
    fields: [userSafes.userDid],
    references: [users.privyDid],
  }),
  // allocationState relation removed – deprecated table
  // Add relation from UserSafes to UserFundingSources if needed
  // Example: user funding sources associated with this safe (might need linking table or direct relation)
}));

// Removed allocationStatesRelations – deprecated table

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
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserSafe = typeof userSafes.$inferSelect;
export type NewUserSafe = typeof userSafes.$inferInsert;

// Removed AllocationState and NewAllocationState type exports – deprecated table

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
    safeAddress: varchar('safe_address', { length: 42 }).notNull(),
    vaultAddress: varchar('vault_address', { length: 42 }).notNull(),
    tokenAddress: varchar('token_address', { length: 42 }).notNull(),
    assetsDeposited: bigint('assets_deposited', { mode: 'bigint' }).notNull(),
    sharesReceived: bigint('shares_received', { mode: 'bigint' }).notNull(),
    txHash: varchar('tx_hash', { length: 66 }).notNull().unique(),
    timestamp: timestamp('timestamp', { withTimezone: true })
      .notNull()
      .defaultNow(),
    depositPercentage: integer('deposit_percentage'),
  },
  (table) => {
    return {
      safeAddressIdx: index('earn_safe_address_idx').on(table.safeAddress),
      vaultAddressIdx: index('earn_vault_address_idx').on(table.vaultAddress),
      userDidIdx: index('earn_user_did_idx').on(table.userDid),
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
    safeAddress: varchar('safe_address', { length: 42 }).notNull(),
    vaultAddress: varchar('vault_address', { length: 42 }).notNull(),
    tokenAddress: varchar('token_address', { length: 42 }).notNull(),
    assetsWithdrawn: bigint('assets_withdrawn', { mode: 'bigint' }).notNull(),
    sharesBurned: bigint('shares_burned', { mode: 'bigint' }).notNull(),
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
      userDidIdx: index('earn_withdrawals_user_did_idx').on(table.userDid),
      statusIdx: index('earn_withdrawals_status_idx').on(table.status),
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
    safeAddress: varchar('safe_address', { length: 42 }).notNull(),
    txHash: varchar('tx_hash', { length: 66 }).notNull().unique(),
    fromAddress: varchar('from_address', { length: 42 }).notNull(),
    tokenAddress: varchar('token_address', { length: 42 }).notNull(),
    amount: bigint('amount', { mode: 'bigint' }).notNull(), // Amount in smallest unit
    blockNumber: bigint('block_number', { mode: 'bigint' }).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),

    // Sweep tracking
    swept: boolean('swept').notNull().default(false),
    sweptAmount: bigint('swept_amount', { mode: 'bigint' }), // Amount that was swept to savings
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
  },
  (table) => {
    return {
      userSafeUniqueIdx: uniqueIndex('auto_earn_user_safe_unique_idx').on(
        table.userDid,
        table.safeAddress,
      ),
    };
  },
);

// --- INBOX CARDS -------------------------------------------------------------
export const inboxCards = pgTable(
  'inbox_cards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // User who owns this inbox card
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),

    // Core card information
    cardId: text('card_id').notNull().unique(), // Original UI card ID for linking
    icon: text('icon').notNull(), // bank, invoice, compliance, fx, etc.
    title: text('title').notNull(),
    subtitle: text('subtitle').notNull(),
    confidence: integer('confidence').notNull(), // AI confidence score (0-100)

    // Status and state
    status: text('status', {
      enum: [
        'pending',
        'executed',
        'dismissed',
        'auto',
        'snoozed',
        'error',
        'seen',
        'done',
      ],
    })
      .notNull()
      .default('pending'),
    blocked: boolean('blocked').notNull().default(false),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    snoozedTime: text('snoozed_time'), // e.g., "for 2 hours", "until tomorrow"
    isAiSuggestionPending: boolean('is_ai_suggestion_pending').default(false),

    // Action details
    requiresAction: boolean('requires_action').default(false),
    suggestedActionLabel: text('suggested_action_label'),

    // Financial information
    amount: text('amount'), // Optional amount for display
    currency: text('currency'), // Currency code
    fromEntity: text('from_entity'), // Optional: from field
    toEntity: text('to_entity'), // Optional: to field

    // NEW: Payment and expense tracking
    paymentStatus: text('payment_status', {
      enum: [
        'unpaid',
        'paid',
        'partial',
        'overdue',
        'not_applicable',
        'scheduled',
      ],
    }).default('unpaid'),
    paidAt: timestamp('paid_at', { withTimezone: true }), // When it was marked as paid
    paidAmount: text('paid_amount'), // Amount that was paid
    paymentMethod: text('payment_method'), // How it was paid (card, crypto, wire, etc)
    dueDate: timestamp('due_date', { withTimezone: true }), // When payment is due
    reminderDate: timestamp('reminder_date', { withTimezone: true }), // When to remind user
    reminderSent: boolean('reminder_sent').default(false), // If reminder was sent

    // Expense tracking
    expenseCategory: text('expense_category'), // Category for expense reporting
    expenseNote: text('expense_note'), // Additional notes for expense
    addedToExpenses: boolean('added_to_expenses').default(false), // If added to expense ledger
    expenseAddedAt: timestamp('expense_added_at', { withTimezone: true }), // When added to expenses

    // Fraud tracking
    markedAsFraud: boolean('marked_as_fraud').default(false), // If card is marked as fraudulent
    fraudMarkedAt: timestamp('fraud_marked_at', { withTimezone: true }), // When it was marked as fraud
    fraudReason: text('fraud_reason'), // Reason for marking as fraud
    fraudMarkedBy: text('fraud_marked_by'), // User who marked it as fraud

    // Attachment storage
    attachmentUrls: text('attachment_urls').array(), // S3/storage URLs for PDFs
    hasAttachments: boolean('has_attachments').default(false), // Quick check for attachments

    // Core processing data
    logId: text('log_id').notNull(), // Original source system ID
    subjectHash: text('subject_hash'), // Hash of email subject for duplicate prevention

    // NEW: semantic embedding for deduplication / search (OpenAI 1536-dim vector)
    embedding: jsonb('embedding'),

    // NEW: Classification tracking
    appliedClassifications: jsonb('applied_classifications'), // Array of {id, name, matched: boolean}
    classificationTriggered: boolean('classification_triggered').default(false), // If any classification matched
    autoApproved: boolean('auto_approved').default(false), // If card was auto-approved by classification

    // NEW: Categories for better organization
    categories: text('categories').array(), // Array of category tags

    rationale: text('rationale').notNull(), // AI reasoning
    codeHash: text('code_hash').notNull(), // AI logic version
    chainOfThought: text('chain_of_thought').array().notNull(), // AI reasoning steps

    // Complex data stored as JSONB
    impact: jsonb('impact').notNull(), // Financial impact object
    parsedInvoiceData: jsonb('parsed_invoice_data'), // AiProcessedDocument if applicable
    sourceDetails: jsonb('source_details').notNull(), // Source information object
    comments: jsonb('comments').default('[]'), // Array of Comment objects
    suggestedUpdate: jsonb('suggested_update'), // Pending AI suggestions
    metadata: jsonb('metadata'), // Additional context data

    // NEW: Raw text data for better extraction
    rawTextContent: text('raw_text_content'), // Preserved raw text from email/document

    // Source information
    sourceType: text('source_type').notNull(), // email, bank_transaction, stripe, etc.

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
      userIdIdx: index('inbox_cards_user_id_idx').on(table.userId),
      statusIdx: index('inbox_cards_status_idx').on(table.status),
      sourceTypeIdx: index('inbox_cards_source_type_idx').on(table.sourceType),
      timestampIdx: index('inbox_cards_timestamp_idx').on(table.timestamp),
      confidenceIdx: index('inbox_cards_confidence_idx').on(table.confidence),
      cardIdIdx: index('inbox_cards_card_id_idx').on(table.cardId),
      subjectHashIdx: index('inbox_cards_subject_hash_idx').on(
        table.subjectHash,
      ),
      // Prevent duplicate processing of the same email
      userLogIdUniqueIdx: uniqueIndex('inbox_cards_user_log_id_unique_idx').on(
        table.userId,
        table.logId,
      ),
    };
  },
);

// --- ACTION LEDGER -----------------------------------------------------------
export const actionLedger = pgTable(
  'action_ledger',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // User who approved the action
    approvedBy: text('approved_by')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),

    // Original inbox card information
    inboxCardId: text('inbox_card_id').notNull(), // Original card ID from the UI
    actionTitle: text('action_title').notNull(), // Title of the approved action
    actionSubtitle: text('action_subtitle'), // Subtitle/description
    actionType: text('action_type').notNull(), // e.g., 'payment', 'transfer', 'invoice', 'allocation'

    // Source information
    sourceType: text('source_type').notNull(), // email, bank_transaction, stripe, etc.
    sourceDetails: jsonb('source_details'), // Store the full source details object

    // Financial impact
    impactData: jsonb('impact_data'), // Store the impact object (balances, yield, etc.)
    amount: text('amount'), // Primary amount as string for display
    currency: text('currency'), // Currency code

    // AI processing details
    confidence: integer('confidence'), // AI confidence score (0-100)
    rationale: text('rationale'), // AI's reasoning
    chainOfThought: text('chain_of_thought').array(), // Array of reasoning steps

    // Full card data for audit trail
    originalCardData: jsonb('original_card_data').notNull(), // Complete InboxCard object
    parsedInvoiceData: jsonb('parsed_invoice_data'), // Invoice data if applicable

    // Execution details
    status: text('status', {
      enum: ['approved', 'executed', 'failed', 'cancelled'],
    })
      .notNull()
      .default('approved'),
    executionDetails: jsonb('execution_details'), // Transaction hashes, API responses, etc.
    errorMessage: text('error_message'), // If execution failed

    // Metadata
    metadata: jsonb('metadata'), // Additional context-specific data

    // Timestamps
    approvedAt: timestamp('approved_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    executedAt: timestamp('executed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    note: text('note'),
    categories: text('categories').array(),
  },
  (table) => {
    return {
      approvedByIdx: index('action_ledger_approved_by_idx').on(
        table.approvedBy,
      ),
      actionTypeIdx: index('action_ledger_action_type_idx').on(
        table.actionType,
      ),
      sourceTypeIdx: index('action_ledger_source_type_idx').on(
        table.sourceType,
      ),
      statusIdx: index('action_ledger_status_idx').on(table.status),
      approvedAtIdx: index('action_ledger_approved_at_idx').on(
        table.approvedAt,
      ),
    };
  },
);

export type AutoEarnConfig = typeof autoEarnConfigs.$inferSelect;
export type NewAutoEarnConfig = typeof autoEarnConfigs.$inferInsert;

// Added relations for action ledger
export const actionLedgerRelations = relations(actionLedger, ({ one }) => ({
  approver: one(users, {
    fields: [actionLedger.approvedBy],
    references: [users.privyDid],
  }),
}));

// Added relations for inbox cards
export const inboxCardsRelations = relations(inboxCards, ({ one }) => ({
  user: one(users, {
    fields: [inboxCards.userId],
    references: [users.privyDid],
  }),
}));

// Added type inference for action ledger
export type ActionLedgerEntry = typeof actionLedger.$inferSelect;
export type NewActionLedgerEntry = typeof actionLedger.$inferInsert;

// Added type inference for inbox cards
export type InboxCardDB = typeof inboxCards.$inferSelect;
export type NewInboxCardDB = typeof inboxCards.$inferInsert;

// --- CHAT TABLES -------------------------------------------------------------

// Chats table - Storing overall chat sessions
export const chats = pgTable(
  'chats',
  {
    id: text('id').primaryKey(), // UI-generated chat ID (e.g., UUID)
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
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

// Gmail OAuth tokens table - Storing OAuth credentials for each user
export const gmailOAuthTokens = pgTable(
  'gmail_oauth_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userPrivyDid: text('user_privy_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    expiryDate: timestamp('expiry_date'),
    scope: text('scope').notNull(),
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
      userDidIdx: index('gmail_oauth_tokens_user_did_idx').on(
        table.userPrivyDid,
      ),
    };
  },
);

// New table for temporary OAuth states
export const oauthStates = pgTable(
  'oauth_states',
  {
    state: text('state').primaryKey(), // The unique state string
    userPrivyDid: text('user_privy_did').notNull(), // User associated with this state
    provider: text('provider').notNull().default('gmail'), // e.g., 'gmail', 'google_calendar'
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    // Add an expiresAt field to automatically clean up old states
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => {
    return {
      userDidIdx: index('oauth_states_user_did_idx').on(table.userPrivyDid),
      providerIdx: index('oauth_states_provider_idx').on(table.provider),
    };
  },
);

export const gmailSyncJobs = pgTable(
  'gmail_sync_jobs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    status: text('status', {
      enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'],
    })
      .notNull()
      .default('PENDING'),
    error: text('error'),
    startedAt: timestamp('started_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    cardsAdded: integer('cards_added').default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    nextPageToken: text('next_page_token'), // Add cursor for pagination
    processedCount: integer('processed_count').default(0), // Track total processed
    currentAction: text('current_action'), // Track what the sync is currently doing
  },
  (table) => {
    return {
      userIdx: index('gmail_sync_jobs_user_id_idx').on(table.userId),
    };
  },
);

// Gmail processing preferences - track when user enabled automatic processing
export const gmailProcessingPrefs = pgTable(
  'gmail_processing_prefs',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    isEnabled: boolean('is_enabled').default(false).notNull(),
    activatedAt: timestamp('activated_at', { withTimezone: true }), // When the user first enabled processing
    keywords: text('keywords')
      .array()
      .default(['invoice', 'bill', 'payment', 'receipt', 'order', 'statement'])
      .notNull(), // Keywords to filter emails
    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }), // Track last successful sync
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
      userIdIdx: index('gmail_processing_prefs_user_id_idx').on(table.userId),
    };
  },
);

// --- USER CLASSIFICATION SETTINGS -------------------------------------------
export const userClassificationSettings = pgTable(
  'user_classification_settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
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

// Workspace tables for partner expense tracking
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdBy: varchar('created_by', { length: 255 })
    .notNull()
    .references(() => users.privyDid, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const workspaceMembers = pgTable(
  'workspace_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    role: varchar('role', { length: 50 }).notNull().default('member'), // 'owner', 'admin', 'member'
    joinedAt: timestamp('joined_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      workspaceUserIdx: uniqueIndex('workspace_members_workspace_user_idx').on(
        table.workspaceId,
        table.userId,
      ),
      workspaceIdIdx: index('workspace_members_workspace_id_idx').on(
        table.workspaceId,
      ),
      userIdIdx: index('workspace_members_user_id_idx').on(table.userId),
    };
  },
);

// Relations for workspace tables
export const workspacesRelations = relations(workspaces, ({ many, one }) => ({
  members: many(workspaceMembers),
  creator: one(users, {
    fields: [workspaces.createdBy],
    references: [users.privyDid],
  }),
  inboxCards: many(inboxCards),
}));

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.privyDid],
    }),
  }),
);

// Type inference for workspace tables
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;

// Relations for gmail processing preferences
export const gmailProcessingPrefsRelations = relations(
  gmailProcessingPrefs,
  ({ one }) => ({
    user: one(users, {
      fields: [gmailProcessingPrefs.userId],
      references: [users.privyDid],
    }),
  }),
);

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

// Type inference for incoming deposits
export type IncomingDeposit = typeof incomingDeposits.$inferSelect;
export type NewIncomingDeposit = typeof incomingDeposits.$inferInsert;

// NEW: platformTotals table – store aggregated platform-level totals like total USDC across all safes
export const platformTotals = pgTable('platform_totals', {
  token: text('token').primaryKey(), // e.g., 'USDC'
  totalDeposited: bigint('total_deposited', { mode: 'bigint' }).notNull(), // Amount in smallest unit (BigInt)
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type PlatformTotal = typeof platformTotals.$inferSelect;
export type NewPlatformTotal = typeof platformTotals.$inferInsert;

// Type inference for gmail processing preferences
export type GmailProcessingPref = typeof gmailProcessingPrefs.$inferSelect;
export type NewGmailProcessingPref = typeof gmailProcessingPrefs.$inferInsert;

// --- CARD ACTIONS TABLE ------------------------------------------------------
// Track all actions performed on inbox cards (both human and AI)
export const cardActions = pgTable(
  'card_actions',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Reference to the inbox card
    cardId: text('card_id').notNull(), // References inboxCards.cardId (not the uuid)
    userId: text('user_id')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),

    // Action details
    actionType: text('action_type', {
      enum: [
        // Status changes
        'status_changed',
        'marked_seen',
        'marked_paid',
        'dismissed',
        'ignored',
        'snoozed',
        'deleted',
        'approved',
        'executed',
        'marked_fraud',

        // Data modifications
        'category_added',
        'category_removed',
        'note_added',
        'note_updated',
        'amount_updated',
        'due_date_updated',

        // Financial actions
        'added_to_expenses',
        'payment_recorded',
        'payment_executed',
        'payment_cancelled',
        'reminder_set',
        'reminder_sent',

        // AI actions
        'ai_classified',
        'ai_auto_approved',
        'ai_suggested_update',

        // Classification actions
        'classification_evaluated',
        'classification_matched',
        'classification_auto_approved',

        // Payment actions
        'payment_scheduled',
        'payment_cancelled',
        'payment_executed',

        // Document actions
        'document_uploaded',
        'document_rejected',

        // Other
        'attachment_downloaded',
        'shared',
        'comment_added',
      ],
    }).notNull(),

    // Who performed the action
    actor: text('actor', { enum: ['human', 'ai', 'system'] })
      .notNull()
      .default('human'),
    actorDetails: jsonb('actor_details'), // e.g., { aiModel: 'gpt-4', confidence: 95 }

    // Action payload
    previousValue: jsonb('previous_value'), // What was the value before
    newValue: jsonb('new_value'), // What is the value after
    details: jsonb('details'), // Additional context (e.g., payment method, category name, etc.)

    // Result
    status: text('status', { enum: ['success', 'failed', 'pending'] })
      .notNull()
      .default('success'),
    errorMessage: text('error_message'),

    // Metadata
    metadata: jsonb('metadata'), // Any additional data

    // Timestamp
    performedAt: timestamp('performed_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      cardIdIdx: index('card_actions_card_id_idx').on(table.cardId),
      userIdIdx: index('card_actions_user_id_idx').on(table.userId),
      actionTypeIdx: index('card_actions_action_type_idx').on(table.actionType),
      performedAtIdx: index('card_actions_performed_at_idx').on(
        table.performedAt,
      ),
      // Composite index for getting all actions for a card in order
      cardActionsIdx: index('card_actions_card_performed_idx').on(
        table.cardId,
        table.performedAt,
      ),
    };
  },
);

// Relations for card actions
export const cardActionsRelations = relations(cardActions, ({ one }) => ({
  user: one(users, {
    fields: [cardActions.userId],
    references: [users.privyDid],
  }),
}));

// Type inference for card actions
export type CardAction = typeof cardActions.$inferSelect;
export type NewCardAction = typeof cardActions.$inferInsert;

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
    featureName: text('feature_name', {
      enum: ['inbox', 'savings', 'advanced_analytics', 'auto_categorization'],
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
    };
  },
);

export type UserInvoicePreferences = typeof userInvoicePreferences.$inferSelect;
export type NewUserInvoicePreferences =
  typeof userInvoicePreferences.$inferInsert;

// Workspace invite system for team collaboration
export const workspaceInvites = pgTable(
  'workspace_invites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id').references(() => companies.id),
    token: varchar('token', { length: 255 }).unique().notNull(),
    createdBy: varchar('created_by', { length: 255 })
      .notNull()
      .references(() => users.privyDid),
    email: varchar('email', { length: 255 }),
    role: varchar('role', { length: 50 }).default('member'),
    shareInbox: boolean('share_inbox').default(true),
    shareCompanyData: boolean('share_company_data').default(true),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    usedAt: timestamp('used_at', { withTimezone: true }),
    usedBy: varchar('used_by', { length: 255 }).references(
      () => users.privyDid,
    ),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex('workspace_invites_token_idx').on(table.token),
      workspaceIdx: index('workspace_invites_workspace_idx').on(
        table.workspaceId,
      ),
      createdByIdx: index('workspace_invites_created_by_idx').on(
        table.createdBy,
      ),
    };
  },
);

// Update workspace members to include permissions
export const workspaceMembersExtended = pgTable('workspace_members_extended', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id')
    .notNull()
    .references(() => workspaceMembers.id, { onDelete: 'cascade' }),
  canViewInbox: boolean('can_view_inbox').default(true),
  canEditExpenses: boolean('can_edit_expenses').default(false),
  canViewCompanyData: boolean('can_view_company_data').default(true),
});

// Relations for workspace invites
export const workspaceInvitesRelations = relations(
  workspaceInvites,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceInvites.workspaceId],
      references: [workspaces.id],
    }),
    company: one(companies, {
      fields: [workspaceInvites.companyId],
      references: [companies.id],
    }),
    createdByUser: one(users, {
      fields: [workspaceInvites.createdBy],
      references: [users.privyDid],
    }),
    usedByUser: one(users, {
      fields: [workspaceInvites.usedBy],
      references: [users.privyDid],
    }),
  }),
);

// Type inference for workspace invites
export type WorkspaceInvite = typeof workspaceInvites.$inferSelect;
export type NewWorkspaceInvite = typeof workspaceInvites.$inferInsert;
export type WorkspaceMemberExtended =
  typeof workspaceMembersExtended.$inferSelect;
export type NewWorkspaceMemberExtended =
  typeof workspaceMembersExtended.$inferInsert;
