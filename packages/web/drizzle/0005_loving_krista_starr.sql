CREATE TABLE "user_funding_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_privy_did" text NOT NULL,
	"source_account_type" text NOT NULL,
	"source_currency" text,
	"source_bank_name" text,
	"source_bank_address" text,
	"source_bank_beneficiary_name" text,
	"source_bank_beneficiary_address" text,
	"source_iban" text,
	"source_bic_swift" text,
	"source_routing_number" text,
	"source_account_number" text,
	"source_sort_code" text,
	"source_payment_rail" text,
	"source_payment_rails" text[],
	"destination_currency" text,
	"destination_payment_rail" text,
	"destination_address" varchar(42),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_safes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_did" text NOT NULL,
	"safe_address" varchar(42) NOT NULL,
	"safe_type" text NOT NULL,
	"allocation_percentage" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"privy_did" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD CONSTRAINT "user_funding_sources_user_privy_did_users_privy_did_fk" FOREIGN KEY ("user_privy_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_safes" ADD CONSTRAINT "user_safes_user_did_users_privy_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("privy_did") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_funding_sources_user_did_idx" ON "user_funding_sources" USING btree ("user_privy_did");--> statement-breakpoint
CREATE UNIQUE INDEX "user_safe_type_unique_idx" ON "user_safes" USING btree ("user_did","safe_type");