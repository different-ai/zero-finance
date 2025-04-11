ALTER TABLE "user_requests" DROP CONSTRAINT "user_requests_request_id_unique";--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "request_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "wallet_address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_requests" ADD COLUMN "share_token" varchar(255);