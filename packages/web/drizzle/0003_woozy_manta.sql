ALTER TABLE "user_requests" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "request_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "wallet_address" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "amount" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "currency" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "status" SET DEFAULT 'db_pending';--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "client" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "invoice_data" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "share_token" SET DATA TYPE text;