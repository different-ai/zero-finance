ALTER TABLE "user_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_settings" CASCADE;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'dd228dfa-7093-49d0-a5a2-ec62b88fb22c';--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "has_completed_onboarding";