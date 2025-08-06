ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '7dfb2f19-4fa7-4c6d-a76e-7cb021230e2f';--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "deleted_at" timestamp with time zone;