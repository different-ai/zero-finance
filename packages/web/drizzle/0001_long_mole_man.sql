ALTER TABLE "user_profiles" RENAME COLUMN "clerk_id" TO "privy_did";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_clerk_id_unique";--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_privy_did_unique" UNIQUE("privy_did");