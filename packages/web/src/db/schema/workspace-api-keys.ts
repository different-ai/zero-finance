import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  text,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workspaces } from './workspaces';

/**
 * Workspace API Keys table
 *
 * Stores hashed API keys for workspace-level access.
 * Keys are used for MCP (Model Context Protocol) integrations
 * allowing AI agents to propose transfers on behalf of users.
 *
 * Key format: zf_live_xxxxxxxxxxxxxxxxxxxx (32 random chars)
 * Only the hash is stored, the raw key is shown once on creation.
 */
export const workspaceApiKeys = pgTable(
  'workspace_api_keys',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),

    // Key identification
    name: varchar('name', { length: 255 }).notNull(), // User-friendly name, e.g., "Claude Desktop"
    keyPrefix: varchar('key_prefix', { length: 12 }).notNull(), // First 8 chars for identification, e.g., "zf_live_"
    keyHash: text('key_hash').notNull(), // SHA-256 hash of the full key

    // Metadata
    createdBy: varchar('created_by', { length: 255 }).notNull(), // Privy DID of creator
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }), // null = never expires

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }), // null = active
  },
  (table) => {
    return {
      workspaceIdx: index('workspace_api_keys_workspace_idx').on(
        table.workspaceId,
      ),
      keyHashIdx: index('workspace_api_keys_hash_idx').on(table.keyHash),
    };
  },
);

export const workspaceApiKeysRelations = relations(
  workspaceApiKeys,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceApiKeys.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

export type WorkspaceApiKey = typeof workspaceApiKeys.$inferSelect;
export type NewWorkspaceApiKey = typeof workspaceApiKeys.$inferInsert;
