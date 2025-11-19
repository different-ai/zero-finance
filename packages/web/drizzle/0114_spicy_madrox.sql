DROP INDEX "user_safe_type_unique_idx";--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '658afa8b-532d-4364-a87c-c8432d217126';--> statement-breakpoint
ALTER TABLE "earn_deposits" ADD COLUMN "chain_id" integer DEFAULT 8453 NOT NULL;--> statement-breakpoint
ALTER TABLE "earn_withdrawals" ADD COLUMN "chain_id" integer DEFAULT 8453 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_safes" ADD COLUMN "chain_id" integer DEFAULT 8453 NOT NULL;--> statement-breakpoint
CREATE INDEX "earn_deposits_chain_id_idx" ON "earn_deposits" USING btree ("chain_id");--> statement-breakpoint
CREATE INDEX "earn_withdrawals_chain_id_idx" ON "earn_withdrawals" USING btree ("chain_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_safe_type_chain_unique_idx" ON "user_safes" USING btree ("user_did","safe_type","chain_id");--> statement-breakpoint
CREATE INDEX "user_safes_chain_id_idx" ON "user_safes" USING btree ("chain_id");--> statement-breakpoint
CREATE INDEX "user_safes_user_chain_idx" ON "user_safes" USING btree ("user_did","chain_id");