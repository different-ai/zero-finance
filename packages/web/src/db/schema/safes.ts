import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  boolean,
  uniqueIndex,
  index,
  text,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workspaces } from './workspaces';

/**
 * Safes table - Multi-chain Safe deployment tracking
 *
 * Architecture:
 * - Base chain (8453) is the primary Safe (source of truth for owners)
 * - Other chains have Safes deployed lazily on first use
 * - All Safes share the same address via CREATE2 deterministic deployment
 * - Owner changes on Base propagate to all other chains
 */
export const safes = pgTable(
  'safes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),

    // Safe address - same across all chains due to CREATE2
    address: varchar('address', { length: 42 }).notNull(),

    // Chain ID (8453 = Base, 42161 = Arbitrum, etc.)
    chainId: integer('chain_id').notNull(),

    // Safe configuration
    owners: jsonb('owners').$type<string[]>().notNull(), // Array of owner addresses
    threshold: integer('threshold').notNull(), // Number of signatures required
    salt: varchar('salt', { length: 66 }).notNull(), // CREATE2 salt for deterministic deployment

    // Primary Safe indicator (Base chain only)
    isPrimary: boolean('is_primary').default(false).notNull(),

    // Deployment tracking
    deploymentTx: varchar('deployment_tx', { length: 66 }), // Transaction hash
    deployedAt: timestamp('deployed_at', { withTimezone: true }),
    deployedBy: varchar('deployed_by', { length: 42 }), // Who deployed (usually relay or first owner)

    // Owner sync tracking
    syncedAt: timestamp('synced_at', { withTimezone: true }), // Last successful owner sync
    syncStatus: text('sync_status', {
      enum: ['synced', 'pending', 'failed'],
    }).default('synced'),

    // Metadata
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Unique constraint: one Safe per workspace per chain
    workspaceChainIdx: uniqueIndex('safes_workspace_chain_idx').on(
      table.workspaceId,
      table.chainId,
    ),
    // Index for quick lookups
    addressIdx: index('safes_address_idx').on(table.address),
    workspaceIdIdx: index('safes_workspace_id_idx').on(table.workspaceId),
    chainIdIdx: index('safes_chain_id_idx').on(table.chainId),
    isPrimaryIdx: index('safes_is_primary_idx').on(table.isPrimary),
  }),
);

/**
 * Safe Owner Sync Operations table
 *
 * Tracks async owner synchronization across chains
 * When owners change on Base Safe, we queue sync operations to other chains
 */
export const safeOwnerSyncOperations = pgTable(
  'safe_owner_sync_operations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),

    // Operation details
    operationType: text('operation_type', {
      enum: ['add_owner', 'remove_owner', 'change_threshold'],
    }).notNull(),

    // Operation parameters
    ownerAddress: varchar('owner_address', { length: 42 }), // For add/remove operations
    threshold: integer('threshold'), // For threshold changes

    // Base chain transaction (primary operation)
    baseTxHash: varchar('base_tx_hash', { length: 66 }),
    baseExecutedAt: timestamp('base_executed_at', { withTimezone: true }),

    // Chains to sync to
    chainsToSync: jsonb('chains_to_sync').$type<string[]>().notNull(), // ['arbitrum', 'optimism']

    // Sync results per chain
    syncResults: jsonb('sync_results').$type<Record<string, {
      status: 'pending' | 'success' | 'failed';
      txHash?: string;
      error?: string;
      executedAt?: string;
    }>>(),

    // Overall status
    status: text('status', {
      enum: ['pending', 'in_progress', 'completed', 'failed'],
    }).notNull().default('pending'),

    // Retry tracking
    retryCount: integer('retry_count').default(0).notNull(),
    maxRetries: integer('max_retries').default(3).notNull(),
    nextRetryAt: timestamp('next_retry_at', { withTimezone: true }),

    // Metadata
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    workspaceIdIdx: index('safe_sync_ops_workspace_id_idx').on(table.workspaceId),
    statusIdx: index('safe_sync_ops_status_idx').on(table.status),
    nextRetryIdx: index('safe_sync_ops_next_retry_idx').on(table.nextRetryAt),
  }),
);

// Relations
export const safesRelations = relations(safes, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [safes.workspaceId],
    references: [workspaces.id],
  }),
  syncOperations: many(safeOwnerSyncOperations),
}));

export const safeOwnerSyncOperationsRelations = relations(
  safeOwnerSyncOperations,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [safeOwnerSyncOperations.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

// Types
export type Safe = typeof safes.$inferSelect;
export type NewSafe = typeof safes.$inferInsert;
export type SafeOwnerSyncOperation = typeof safeOwnerSyncOperations.$inferSelect;
export type NewSafeOwnerSyncOperation = typeof safeOwnerSyncOperations.$inferInsert;
