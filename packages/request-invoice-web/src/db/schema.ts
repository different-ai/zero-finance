import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const ephemeralKeysTable = pgTable("ephemeral_keys", {
  token: varchar("token", { length: 255 }).primaryKey(),
  privateKey: text("private_key").notNull(),
  publicKey: text("public_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Type inference
export type EphemeralKey = typeof ephemeralKeysTable.$inferSelect;
export type NewEphemeralKey = typeof ephemeralKeysTable.$inferInsert; 