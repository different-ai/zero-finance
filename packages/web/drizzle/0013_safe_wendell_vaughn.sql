CREATE TABLE "user_destination_bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"account_name" text NOT NULL,
	"bank_name" text NOT NULL,
	"account_holder_type" text NOT NULL,
	"account_holder_first_name" text,
	"account_holder_last_name" text,
	"account_holder_business_name" text,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"street_line_1" text NOT NULL,
	"street_line_2" text,
	"postal_code" text NOT NULL,
	"account_type" text NOT NULL,
	"account_number" text,
	"routing_number" text,
	"iban_number" text,
	"bic_swift" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '73f47468-0585-4d6f-a561-5eafda740352';--> statement-breakpoint
ALTER TABLE "user_destination_bank_accounts" ADD CONSTRAINT "user_destination_bank_accounts_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_dest_bank_accounts_user_id_idx" ON "user_destination_bank_accounts" USING btree ("user_id");