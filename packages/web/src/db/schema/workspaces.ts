import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  boolean,
  uniqueIndex,
  index,
  text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { companies } from './companies';

export const workspaces = pgTable(
  'workspaces',
  {
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

    // KYC and Banking Fields - copied from users table for workspace-level KYC
    alignCustomerId: text('align_customer_id'),
    kycProvider: text('kyc_provider', { enum: ['align', 'other'] }),
    kycStatus: text('kyc_status', {
      enum: ['none', 'pending', 'approved', 'rejected'],
    }).default('none'),
    kycFlowLink: text('kyc_flow_link'),
    kycSubStatus: text('kyc_sub_status'),
    kycMarkedDone: boolean('kyc_marked_done').default(false).notNull(),
    kycNotificationSent: timestamp('kyc_notification_sent', {
      withTimezone: true,
    }),
    kycNotificationStatus: text('kyc_notification_status', {
      enum: ['pending', 'sent', 'failed'],
    }),
    alignVirtualAccountId: text('align_virtual_account_id'),

    // Entity Information - who the workspace represents
    beneficiaryType: text('beneficiary_type', {
      enum: ['individual', 'business'],
    }),
    companyName: text('company_name'),
    firstName: text('first_name'),
    lastName: text('last_name'),

    // Workspace Type - personal or business workspace
    workspaceType: text('workspace_type', {
      enum: ['personal', 'business'],
    }).default('business'),
  },
  (table) => ({
    alignCustomerIdx: uniqueIndex('workspaces_align_customer_id_idx').on(
      table.alignCustomerId,
    ),
    kycStatusIdx: index('workspaces_kyc_status_idx').on(table.kycStatus),
    alignVirtualAccountIdx: index('workspaces_align_virtual_account_idx').on(
      table.alignVirtualAccountId,
    ),
  }),
);

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
    role: varchar('role', { length: 50 }).notNull().default('member'),
    joinedAt: timestamp('joined_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
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
    addAsSafeOwner: boolean('add_as_safe_owner').default(false),
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

export const workspaceMembersExtended = pgTable('workspace_members_extended', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id')
    .notNull()
    .references(() => workspaceMembers.id, { onDelete: 'cascade' }),
  canViewInbox: boolean('can_view_inbox').default(true),
  canEditExpenses: boolean('can_edit_expenses').default(false),
  canViewCompanyData: boolean('can_view_company_data').default(true),
});

export const workspacesRelations = relations(workspaces, ({ many, one }) => ({
  members: many(workspaceMembers),
  creator: one(users, {
    fields: [workspaces.createdBy],
    references: [users.privyDid],
  }),
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

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type WorkspaceInvite = typeof workspaceInvites.$inferSelect;
export type NewWorkspaceInvite = typeof workspaceInvites.$inferInsert;
export type WorkspaceMemberExtended =
  typeof workspaceMembersExtended.$inferSelect;
export type NewWorkspaceMemberExtended =
  typeof workspaceMembersExtended.$inferInsert;
