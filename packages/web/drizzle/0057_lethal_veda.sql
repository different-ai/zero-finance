CREATE TABLE "earn_withdrawals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_did" text NOT NULL,
	"safe_address" varchar(42) NOT NULL,
	"vault_address" varchar(42) NOT NULL,
	"token_address" varchar(42) NOT NULL,
	"assets_withdrawn" bigint NOT NULL,
	"shares_burned" bigint NOT NULL,
	"tx_hash" varchar(66) NOT NULL,
	"user_op_hash" varchar(66),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	CONSTRAINT "earn_withdrawals_tx_hash_unique" UNIQUE("tx_hash")
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '6617f678-3a32-4d9c-bd35-ace00ff4b733';--> statement-breakpoint
ALTER TABLE "earn_withdrawals" ADD CONSTRAINT "earn_withdrawals_user_did_users_privy_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "earn_withdrawals_safe_address_idx" ON "earn_withdrawals" USING btree ("safe_address");--> statement-breakpoint
CREATE INDEX "earn_withdrawals_vault_address_idx" ON "earn_withdrawals" USING btree ("vault_address");--> statement-breakpoint
CREATE INDEX "earn_withdrawals_user_did_idx" ON "earn_withdrawals" USING btree ("user_did");--> statement-breakpoint
CREATE INDEX "earn_withdrawals_status_idx" ON "earn_withdrawals" USING btree ("status");