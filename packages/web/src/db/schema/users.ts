import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    privyDid: text('privy_did').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    companyName: text('company_name'),
    beneficiaryType: text('beneficiary_type', {
      enum: ['individual', 'business'],
    }),
    alignCustomerId: text('align_customer_id').unique(),
    kycProvider: text('kyc_provider', { enum: ['align', 'other'] }),
    kycStatus: text('kyc_status', {
      enum: ['none', 'pending', 'approved', 'rejected'],
    }).default('none'),
    kycFlowLink: text('kyc_flow_link'),
    alignVirtualAccountId: text('align_virtual_account_id'),
    kycMarkedDone: boolean('kyc_marked_done').default(false).notNull(),
    kycSubStatus: text('kyc_sub_status'),
    kycNotificationSent: timestamp('kyc_notification_sent', {
      withTimezone: true,
    }),
    kycNotificationStatus: text('kyc_notification_status', {
      enum: ['pending', 'sent', 'failed'],
    }),
    loopsContactSynced: boolean('loops_contact_synced')
      .default(false)
      .notNull(),
    userRole: text('user_role', {
      enum: ['startup', 'contractor'],
    })
      .default('startup')
      .notNull(),
    contractorInviteCode: text('contractor_invite_code'),
    primaryWorkspaceId: uuid('primary_workspace_id').notNull(),
  },
  (table) => ({
    primaryWorkspaceIdx: index('users_primary_workspace_idx').on(
      table.primaryWorkspaceId,
    ),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
