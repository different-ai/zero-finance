CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"payment_address" varchar(255),
	"business_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"default_wallet_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_clerk_id_unique" UNIQUE("clerk_id")
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
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_default_wallet_id_user_wallets_id_fk" FOREIGN KEY ("default_wallet_id") REFERENCES "public"."user_wallets"("id") ON DELETE no action ON UPDATE no action;