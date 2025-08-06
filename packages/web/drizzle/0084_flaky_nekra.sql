ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'c291815c-34ad-4a85-ac20-de0fd92329a7';--> statement-breakpoint
ALTER TABLE "user_requests" ADD COLUMN "company_id" uuid;