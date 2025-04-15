ALTER TABLE "ephemeral_keys" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ephemeral_keys" CASCADE;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'b48ae8dd-e5f1-4baf-861a-1b30816a2e1b';--> statement-breakpoint
ALTER TABLE "user_requests" DROP COLUMN "share_token";