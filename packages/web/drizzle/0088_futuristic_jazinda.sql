ALTER TABLE "retro_invoices" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "retro_invoices" CASCADE;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '942d9f7d-314c-4ad9-a0d7-ff2afa79ec89';--> statement-breakpoint
ALTER TABLE "user_requests" ADD COLUMN "sender_company_id" uuid;--> statement-breakpoint
ALTER TABLE "user_requests" ADD COLUMN "recipient_company_id" uuid;--> statement-breakpoint
ALTER TABLE "user_requests" ADD CONSTRAINT "user_requests_sender_company_id_companies_id_fk" FOREIGN KEY ("sender_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_requests" ADD CONSTRAINT "user_requests_recipient_company_id_companies_id_fk" FOREIGN KEY ("recipient_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;