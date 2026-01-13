import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workspaces } from './workspaces';

const largeNumeric = (name: string) =>
  numeric(name, { precision: 78, scale: 0 }).$type<string>();

export const vaultAssets = pgTable(
  'vault_assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    address: text('address').notNull(),
    chainId: integer('chain_id').notNull(),
    symbol: text('symbol').notNull(),
    decimals: integer('decimals').notNull(),
    name: text('name'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    chainAddressIdx: uniqueIndex('vault_assets_chain_address_idx').on(
      table.chainId,
      table.address,
    ),
  }),
);

export const vaults = pgTable(
  'vaults',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    displayName: text('display_name'),
    address: text('address').notNull(),
    chainId: integer('chain_id').notNull(),
    assetId: uuid('asset_id').references(() => vaultAssets.id),
    protocol: text('protocol').notNull(),
    riskTier: text('risk_tier').notNull(),
    curator: text('curator').notNull(),
    appUrl: text('app_url'),
    isInsured: boolean('is_insured').notNull().default(false),
    isPrimary: boolean('is_primary').notNull().default(false),
    status: text('status').notNull().default('active'),
    sandboxOnly: boolean('sandbox_only').notNull().default(false),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    chainIdx: index('vaults_chain_idx').on(table.chainId),
    insuredIdx: index('vaults_insured_idx').on(table.isInsured),
    statusIdx: index('vaults_status_idx').on(table.status),
    sandboxIdx: index('vaults_sandbox_idx').on(table.sandboxOnly),
  }),
);

export const vaultInsurance = pgTable(
  'vault_insurance',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    vaultId: text('vault_id')
      .notNull()
      .references(() => vaults.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(),
    coverageUsd: largeNumeric('coverage_usd'),
    coverageCurrency: text('coverage_currency').notNull().default('USD'),
    policyUrl: text('policy_url'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    vaultIdx: uniqueIndex('vault_insurance_vault_idx').on(table.vaultId),
  }),
);

export const sandboxTokens = pgTable(
  'sandbox_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    symbol: text('symbol').notNull(),
    name: text('name'),
    address: text('address').notNull(),
    chainId: integer('chain_id').notNull(),
    decimals: integer('decimals').notNull(),
    faucetEnabled: boolean('faucet_enabled').notNull().default(true),
    maxDailyMint: largeNumeric('max_daily_mint'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    chainAddressIdx: uniqueIndex('sandbox_tokens_chain_address_idx').on(
      table.chainId,
      table.address,
    ),
  }),
);

export const sandboxFaucetEvents = pgTable(
  'sandbox_faucet_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    tokenId: uuid('token_id')
      .notNull()
      .references(() => sandboxTokens.id),
    recipientAddress: text('recipient_address').notNull(),
    amount: largeNumeric('amount').notNull(),
    txHash: text('tx_hash'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    workspaceIdx: index('sandbox_faucet_events_workspace_idx').on(
      table.workspaceId,
    ),
    recipientIdx: index('sandbox_faucet_events_recipient_idx').on(
      table.recipientAddress,
    ),
    tokenIdx: index('sandbox_faucet_events_token_idx').on(table.tokenId),
  }),
);

export const webhookEndpoints = pgTable(
  'webhook_endpoints',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    secret: text('secret').notNull(),
    events: jsonb('events').$type<string[]>().notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    workspaceIdx: index('webhook_endpoints_workspace_idx').on(
      table.workspaceId,
    ),
    activeIdx: index('webhook_endpoints_active_idx').on(table.isActive),
  }),
);

export const webhookDeliveries = pgTable(
  'webhook_deliveries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    endpointId: uuid('endpoint_id')
      .notNull()
      .references(() => webhookEndpoints.id, { onDelete: 'cascade' }),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').notNull(),
    status: text('status').notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    nextRetryAt: timestamp('next_retry_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    workspaceIdx: index('webhook_deliveries_workspace_idx').on(
      table.workspaceId,
    ),
    endpointIdx: index('webhook_deliveries_endpoint_idx').on(table.endpointId),
    statusIdx: index('webhook_deliveries_status_idx').on(table.status),
  }),
);

export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, {
      onDelete: 'set null',
    }),
    actor: text('actor'),
    eventType: text('event_type').notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    workspaceIdx: index('audit_events_workspace_idx').on(table.workspaceId),
    eventIdx: index('audit_events_event_type_idx').on(table.eventType),
  }),
);

export const vaultAssetsRelations = relations(vaultAssets, ({ many }) => ({
  vaults: many(vaults),
}));

export const vaultsRelations = relations(vaults, ({ one }) => ({
  asset: one(vaultAssets, {
    fields: [vaults.assetId],
    references: [vaultAssets.id],
  }),
  insurance: one(vaultInsurance, {
    fields: [vaults.id],
    references: [vaultInsurance.vaultId],
  }),
}));

export const vaultInsuranceRelations = relations(vaultInsurance, ({ one }) => ({
  vault: one(vaults, {
    fields: [vaultInsurance.vaultId],
    references: [vaults.id],
  }),
}));

export const sandboxTokensRelations = relations(sandboxTokens, ({ many }) => ({
  faucetEvents: many(sandboxFaucetEvents),
}));

export const sandboxFaucetEventsRelations = relations(
  sandboxFaucetEvents,
  ({ one }) => ({
    token: one(sandboxTokens, {
      fields: [sandboxFaucetEvents.tokenId],
      references: [sandboxTokens.id],
    }),
    workspace: one(workspaces, {
      fields: [sandboxFaucetEvents.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

export const webhookEndpointsRelations = relations(
  webhookEndpoints,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [webhookEndpoints.workspaceId],
      references: [workspaces.id],
    }),
    deliveries: many(webhookDeliveries),
  }),
);

export const webhookDeliveriesRelations = relations(
  webhookDeliveries,
  ({ one }) => ({
    endpoint: one(webhookEndpoints, {
      fields: [webhookDeliveries.endpointId],
      references: [webhookEndpoints.id],
    }),
    workspace: one(workspaces, {
      fields: [webhookDeliveries.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [auditEvents.workspaceId],
    references: [workspaces.id],
  }),
}));

export type VaultAsset = typeof vaultAssets.$inferSelect;
export type NewVaultAsset = typeof vaultAssets.$inferInsert;
export type Vault = typeof vaults.$inferSelect;
export type NewVault = typeof vaults.$inferInsert;
export type VaultInsurance = typeof vaultInsurance.$inferSelect;
export type NewVaultInsurance = typeof vaultInsurance.$inferInsert;
export type SandboxToken = typeof sandboxTokens.$inferSelect;
export type NewSandboxToken = typeof sandboxTokens.$inferInsert;
export type SandboxFaucetEvent = typeof sandboxFaucetEvents.$inferSelect;
export type NewSandboxFaucetEvent = typeof sandboxFaucetEvents.$inferInsert;
export type WebhookEndpoint = typeof webhookEndpoints.$inferSelect;
export type NewWebhookEndpoint = typeof webhookEndpoints.$inferInsert;
export type WebhookDelivery = typeof webhookDeliveries.$inferSelect;
export type NewWebhookDelivery = typeof webhookDeliveries.$inferInsert;
export type AuditEvent = typeof auditEvents.$inferSelect;
export type NewAuditEvent = typeof auditEvents.$inferInsert;
