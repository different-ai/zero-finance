/**
 * User Safes Schema
 *
 * This table tracks Safe wallets deployed for users across multiple chains.
 *
 * ## Architecture Context
 *
 * 0 Finance uses a 3-layer wallet hierarchy:
 *
 * ```
 * Layer 1: Privy Embedded Wallet (EOA)
 *     ↓ owns
 * Layer 2: Privy Smart Wallet (Safe - used for gas sponsorship via 4337)
 *     ↓ owns
 * Layer 3: Primary Safe (User's "Bank Account" - where funds reside)
 * ```
 *
 * This table tracks Layer 3 - the user's Primary Safe(s).
 *
 * ## Query Methods
 *
 * There are TWO ways to query user safes, which may return different results:
 *
 * 1. **User-scoped** (by `userDid`) - Use for balance queries and transactions:
 *    - `getMultiChainPositions` in earn-router.ts
 *    - `getUserSafes` in multi-chain-safe-manager.ts
 *
 * 2. **Workspace-scoped** (by `workspaceId`) - Use for workspace-level operations:
 *    - `settings.userSafes.list` tRPC procedure
 *
 * ## Multi-Chain Deployment
 *
 * Safes are deployed with deterministic addresses using CREATE2.
 * The salt nonce is the lowercase Base Safe address, ensuring:
 * - Same user gets same address on all chains
 * - Cross-chain operations can predict target addresses
 *
 * @see packages/web/src/server/earn/multi-chain-safe-manager.ts
 * @see packages/web/src/lib/safe-multi-chain.ts
 * @see .claude/agents/safe-infrastructure.md
 */

import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  uuid,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

/**
 * UserSafes table - Linking users to their Safe addresses across chains
 *
 * Each record represents a Safe wallet deployed on a specific chain.
 * Users can have multiple Safes of different types (primary, tax, etc.)
 * on each supported chain.
 */
export const userSafes = pgTable(
  'user_safes',
  {
    /** Unique identifier for the safe record */
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    /** Foreign key to users table (Privy DID) */
    userDid: text('user_did')
      .notNull()
      .references(() => users.privyDid),

    /** Optional workspace association for team access */
    workspaceId: uuid('workspace_id'),

    /** Ethereum address of the Safe (42 chars with 0x prefix) */
    safeAddress: varchar('safe_address', { length: 42 }).notNull(),

    /**
     * Chain ID where this Safe is deployed
     * - 8453: Base mainnet (default)
     * - 42161: Arbitrum One
     * - 1: Ethereum mainnet (limited support)
     */
    chainId: integer('chain_id').notNull().default(8453),

    /**
     * Type of Safe - determines its purpose in the system
     * - primary: Main bank account for the user
     * - tax: Reserved for tax payments/savings
     * - liquidity: For liquidity provision
     * - yield: Dedicated to yield strategies
     */
    safeType: text('safe_type', {
      enum: ['primary', 'tax', 'liquidity', 'yield'],
    }).notNull(),

    /** Whether the Fluidkey Earn Module is enabled on this Safe */
    isEarnModuleEnabled: boolean('is_earn_module_enabled')
      .default(false)
      .notNull(),

    /** Timestamp when the Safe record was created */
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      /**
       * Ensures a user can only have one Safe of each type per chain.
       * This prevents duplicate records and enforces the intended architecture.
       */
      userTypeChainUniqueIdx: uniqueIndex('user_safe_type_chain_unique_idx').on(
        table.userDid,
        table.safeType,
        table.chainId,
      ),

      /** Index for efficient queries filtering by chain */
      chainIdIdx: index('user_safes_chain_id_idx').on(table.chainId),

      /** Index for workspace-scoped queries */
      workspaceIdx: index('user_safes_workspace_idx').on(table.workspaceId),

      /** Composite index for user + chain lookups (common query pattern) */
      userChainIdx: index('user_safes_user_chain_idx').on(
        table.userDid,
        table.chainId,
      ),
    };
  },
);

/**
 * Relations for userSafes table
 */
export const userSafesRelations = relations(userSafes, ({ one }) => ({
  /** Link back to the user who owns this Safe */
  user: one(users, {
    fields: [userSafes.userDid],
    references: [users.privyDid],
  }),
}));

// --- TYPE INFERENCE ---

/** Select type for userSafes table */
export type UserSafe = typeof userSafes.$inferSelect;

/** Insert type for userSafes table */
export type NewUserSafe = typeof userSafes.$inferInsert;
