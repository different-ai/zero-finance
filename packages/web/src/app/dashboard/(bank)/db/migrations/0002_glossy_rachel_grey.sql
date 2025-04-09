ALTER TABLE "user_funding_sources" ADD COLUMN "source_account_type" text NOT NULL DEFAULT 'unknown';--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD COLUMN "source_iban" text;--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD COLUMN "source_bic_swift" text;--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD COLUMN "source_routing_number" text;--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD COLUMN "source_account_number" text;--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD COLUMN "source_sort_code" text;--> statement-breakpoint
CREATE INDEX "user_funding_sources_user_did_idx" ON "user_funding_sources" USING btree ("user_privy_did");--> statement-breakpoint
ALTER TABLE "user_funding_sources" DROP COLUMN "source_bank_routing_number";--> statement-breakpoint
ALTER TABLE "user_funding_sources" DROP COLUMN "source_bank_account_number";