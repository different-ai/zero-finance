import { pgTable, text, timestamp, varchar, uuid, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const ephemeralKeysTable = pgTable("ephemeral_keys", {
  token: varchar("token", { length: 255 }).primaryKey(),
  privateKey: text("private_key").notNull(),
  publicKey: text("public_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const userWalletsTable = pgTable("user_wallets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull().unique(),
  privateKey: text("private_key").notNull(),
  publicKey: text("public_key").notNull(),
  network: varchar("network", { length: 50 }).notNull().default("gnosis"),
  isDefault: boolean("is_default").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfilesTable = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  paymentAddress: varchar("payment_address", { length: 255 }),
  businessName: varchar("business_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  defaultWalletId: uuid("default_wallet_id").references(() => userWalletsTable.id),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRequestsTable = pgTable("user_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: varchar("request_id", { length: 255 }).notNull().unique(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  walletAddress: varchar("wallet_address", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("seller"), // "seller" or "buyer"
  description: varchar("description", { length: 255 }),
  amount: varchar("amount", { length: 50 }),
  currency: varchar("currency", { length: 20 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // "pending" or "paid"
  client: varchar("client", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations between tables
export const userProfilesRelations = relations(userProfilesTable, ({ one }) => ({
  defaultWallet: one(userWalletsTable, {
    fields: [userProfilesTable.defaultWalletId],
    references: [userWalletsTable.id],
  }),
}));

export const userWalletsRelations = relations(userWalletsTable, ({ many }) => ({
  profiles: many(userProfilesTable),
}));

// Type inference
export type EphemeralKey = typeof ephemeralKeysTable.$inferSelect;
export type NewEphemeralKey = typeof ephemeralKeysTable.$inferInsert;

export type UserWallet = typeof userWalletsTable.$inferSelect;
export type NewUserWallet = typeof userWalletsTable.$inferInsert;

export type UserProfile = typeof userProfilesTable.$inferSelect;
export type NewUserProfile = typeof userProfilesTable.$inferInsert;

export const companyProfilesTable = pgTable("company_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => userProfilesTable.id),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  // Contact information
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 255 }),
  // Business details
  taxRegistration: varchar("tax_registration", { length: 100 }),
  registrationNumber: varchar("registration_number", { length: 100 }),
  industryType: varchar("industry_type", { length: 100 }),
  // Address
  streetAddress: varchar("street_address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  postalCode: varchar("postal_code", { length: 50 }),
  country: varchar("country", { length: 100 }),
  // Logo and branding
  logoUrl: varchar("logo_url", { length: 500 }),
  brandColor: varchar("brand_color", { length: 50 }),
  // Additional information
  isDefault: boolean("is_default").default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations for company profiles
export const companyProfilesRelations = relations(companyProfilesTable, ({ one }) => ({
  userProfile: one(userProfilesTable, {
    fields: [companyProfilesTable.userId],
    references: [userProfilesTable.id],
  }),
}));

export type UserRequest = typeof userRequestsTable.$inferSelect;
export type NewUserRequest = typeof userRequestsTable.$inferInsert;

export type CompanyProfile = typeof companyProfilesTable.$inferSelect;
export type NewCompanyProfile = typeof companyProfilesTable.$inferInsert;
