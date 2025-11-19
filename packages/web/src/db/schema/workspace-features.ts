import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workspaces } from './workspaces';

/**
 * Workspace Features table - Track which features workspaces have access to
 * This allows admin-controlled feature activation per workspace
 */
export const workspaceFeatures = pgTable(
  'workspace_features',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    featureName: text('feature_name', {
      enum: ['multi_chain'],
    }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    grantedBy: text('granted_by'), // Admin who granted the feature
    grantSource: text('grant_source', {
      enum: ['admin', 'manual', 'promo', 'subscription'],
    }).default('admin'),
    grantReference: text('grant_reference'), // Reference to why it was granted
    activatedAt: timestamp('activated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }), // null means no expiration
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
      // Ensure a workspace can only have one active feature of each type
      workspaceFeatureUniqueIdx: uniqueIndex('workspace_feature_unique_idx').on(
        table.workspaceId,
        table.featureName,
      ),
      workspaceIdIdx: index('workspace_features_workspace_id_idx').on(
        table.workspaceId,
      ),
      featureNameIdx: index('workspace_features_feature_name_idx').on(
        table.featureName,
      ),
      isActiveIdx: index('workspace_features_is_active_idx').on(table.isActive),
    };
  },
);

export const workspaceFeaturesRelations = relations(
  workspaceFeatures,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceFeatures.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

export type WorkspaceFeature = typeof workspaceFeatures.$inferSelect;
export type NewWorkspaceFeature = typeof workspaceFeatures.$inferInsert;

// Feature name type for type safety
export type WorkspaceFeatureName = NonNullable<
  NewWorkspaceFeature['featureName']
>;
