CREATE TABLE "user_funding_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_privy_did" text NOT NULL,
	"source_currency" text,
	"source_bank_name" text,
	"source_bank_address" text,
	"source_bank_routing_number" text,
	"source_bank_account_number" text,
	"source_bank_beneficiary_name" text,
	"source_bank_beneficiary_address" text,
	"source_payment_rail" text,
	"source_payment_rails" text[],
	"destination_currency" text,
	"destination_payment_rail" text,
	"destination_address" varchar(42),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD CONSTRAINT "user_funding_sources_user_privy_did_users_privy_did_fk" FOREIGN KEY ("user_privy_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;