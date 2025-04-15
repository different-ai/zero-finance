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
CREATE TABLE "company_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"website" varchar(255),
	"tax_registration" varchar(100),
	"registration_number" varchar(100),
	"industry_type" varchar(100),
	"street_address" varchar(255),
	"city" varchar(100),
	"region" varchar(100),
	"postal_code" varchar(50),
	"country" varchar(100),
	"logo_url" varchar(500),
	"brand_color" varchar(50),
	"is_default" boolean DEFAULT true,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ephemeral_keys" (
	"token" varchar(255) PRIMARY KEY NOT NULL,
	"private_key" text NOT NULL,
	"public_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"payment_address" varchar(255),
	"primary_safe_address" varchar(42),
	"business_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"default_wallet_id" uuid,
	"has_completed_onboarding" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "user_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"wallet_address" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'seller' NOT NULL,
	"description" varchar(255),
	"amount" varchar(50),
	"currency" varchar(20),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"client" varchar(255),
	"invoice_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_requests_request_id_unique" UNIQUE("request_id")
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
CREATE TABLE "user_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"private_key" text NOT NULL,
	"public_key" text NOT NULL,
	"network" varchar(50) DEFAULT 'gnosis' NOT NULL,
	"is_default" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_wallets_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"privy_did" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "allocation_states" ADD CONSTRAINT "allocation_states_user_safe_id_user_safes_id_fk" FOREIGN KEY ("user_safe_id") REFERENCES "public"."user_safes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_profiles" ADD CONSTRAINT "company_profiles_user_id_user_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD CONSTRAINT "user_funding_sources_user_privy_did_users_privy_did_fk" FOREIGN KEY ("user_privy_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_default_wallet_id_user_wallets_id_fk" FOREIGN KEY ("default_wallet_id") REFERENCES "public"."user_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_safes" ADD CONSTRAINT "user_safes_user_did_users_privy_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("privy_did") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_funding_sources_user_did_idx" ON "user_funding_sources" USING btree ("user_privy_did");--> statement-breakpoint
CREATE UNIQUE INDEX "user_safe_type_unique_idx" ON "user_safes" USING btree ("user_did","safe_type");