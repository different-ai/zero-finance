CREATE TABLE "earn_deposits" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_did" text NOT NULL,
	"safe_address" varchar(42) NOT NULL,
	"vault_address" varchar(42) NOT NULL,
	"token_address" varchar(42) NOT NULL,
	"assets_deposited" bigint NOT NULL,
	"shares_received" bigint NOT NULL,
	"tx_hash" varchar(66) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "earn_deposits_tx_hash_unique" UNIQUE("tx_hash")
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '706127cc-246f-4b16-9eef-0cc123fe839e';--> statement-breakpoint
ALTER TABLE "earn_deposits" ADD CONSTRAINT "earn_deposits_user_did_users_privy_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "earn_safe_address_idx" ON "earn_deposits" USING btree ("safe_address");--> statement-breakpoint
CREATE INDEX "earn_vault_address_idx" ON "earn_deposits" USING btree ("vault_address");--> statement-breakpoint
CREATE INDEX "earn_user_did_idx" ON "earn_deposits" USING btree ("user_did");