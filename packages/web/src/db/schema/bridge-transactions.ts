/**
 * Bridge transactions schema
 * Tracks cross-chain bridge operations via Across Protocol
 */

import {
  pgTable,
  text,
  integer,
  varchar,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { numeric } from 'drizzle-orm/pg-core';

/**
 * Bridge transactions table
 * Stores all cross-chain bridge deposits for monitoring and debugging
 */
export const bridgeTransactions = pgTable('bridge_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userDid: text('user_did').notNull(),
  sourceChainId: integer('source_chain_id').notNull(),
  destChainId: integer('dest_chain_id').notNull(),
  vaultAddress: varchar('vault_address', { length: 42 }).notNull(),
  amount: numeric('amount', { precision: 78, scale: 0 }).notNull(),
  bridgeFee: numeric('bridge_fee', { precision: 78, scale: 0 }).notNull(),
  lpFee: numeric('lp_fee', { precision: 78, scale: 0 }),
  relayerGasFee: numeric('relayer_gas_fee', { precision: 78, scale: 0 }),
  relayerCapitalFee: numeric('relayer_capital_fee', {
    precision: 78,
    scale: 0,
  }),
  depositTxHash: varchar('deposit_tx_hash', { length: 66 }),
  fillTxHash: varchar('fill_tx_hash', { length: 66 }),
  depositId: text('deposit_id'),
  status: text('status', {
    enum: ['pending', 'filled', 'failed'],
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  filledAt: timestamp('filled_at'),
  failedAt: timestamp('failed_at'),
  errorMessage: text('error_message'),
});

/**
 * Type for inserting new bridge transactions
 */
export type InsertBridgeTransaction = typeof bridgeTransactions.$inferInsert;

/**
 * Type for selecting bridge transactions
 */
export type SelectBridgeTransaction = typeof bridgeTransactions.$inferSelect;
