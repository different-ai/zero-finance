CREATE TABLE "incoming_deposits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_did" text NOT NULL,
	"safe_address" varchar(42) NOT NULL,
	"tx_hash" varchar(66) NOT NULL,
	"from_address" varchar(42) NOT NULL,
	"token_address" varchar(42) NOT NULL,
	"amount" bigint NOT NULL,
	"block_number" bigint NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"swept" boolean DEFAULT false NOT NULL,
	"swept_amount" bigint,
	"swept_percentage" integer,
	"swept_tx_hash" varchar(66),
	"swept_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "incoming_deposits_tx_hash_unique" UNIQUE("tx_hash")
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '04c97b7b-06ff-4223-b83b-a28da8310f43';--> statement-breakpoint
ALTER TABLE "incoming_deposits" ADD CONSTRAINT "incoming_deposits_user_did_users_privy_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "incoming_deposits_safe_address_idx" ON "incoming_deposits" USING btree ("safe_address");--> statement-breakpoint
CREATE INDEX "incoming_deposits_tx_hash_idx" ON "incoming_deposits" USING btree ("tx_hash");--> statement-breakpoint
CREATE INDEX "incoming_deposits_user_did_idx" ON "incoming_deposits" USING btree ("user_did");--> statement-breakpoint
CREATE INDEX "incoming_deposits_swept_idx" ON "incoming_deposits" USING btree ("swept");--> statement-breakpoint
CREATE INDEX "incoming_deposits_timestamp_idx" ON "incoming_deposits" USING btree ("timestamp");