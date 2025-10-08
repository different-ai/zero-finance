import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Admins table - stores authorized admin users
 * Access to admin panel is granted only to users in this table
 */
export const admins = pgTable('admins', {
  privyDid: text('privy_did').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  addedBy: text('added_by'), // Privy DID of admin who added this admin
  notes: text('notes'), // Optional notes about this admin
});

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
