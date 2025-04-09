CREATE TABLE "allocation_states" (
	"user_safe_id" text NOT NULL,
	"last_checked_usdc_balance" text DEFAULT '0' NOT NULL,
	"total_deposited" text DEFAULT '0' NOT NULL,
	"allocated_tax" text DEFAULT '0' NOT NULL,
	"allocated_liquidity" text DEFAULT '0' NOT NULL,
	"allocated_yield" text DEFAULT '0' NOT NULL,
	"pending_deposit_amount" text DEFAULT '0' NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "allocation_states_user_safe_id_pk" PRIMARY KEY("user_safe_id")
);
--> statement-breakpoint
CREATE TABLE "user_safes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_did" text NOT NULL,
	"safe_address" varchar(42) NOT NULL,
	"safe_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"privy_did" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "allocation_states" ADD CONSTRAINT "allocation_states_user_safe_id_user_safes_id_fk" FOREIGN KEY ("user_safe_id") REFERENCES "public"."user_safes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_safes" ADD CONSTRAINT "user_safes_user_did_users_privy_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("privy_did") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_safe_type_unique_idx" ON "user_safes" USING btree ("user_did","safe_type");