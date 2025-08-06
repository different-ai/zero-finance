CREATE TABLE "user_invoice_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_privy_did" text NOT NULL,
	"default_seller_name" text,
	"default_seller_email" text,
	"default_seller_address" text,
	"default_seller_city" text,
	"default_seller_postal_code" text,
	"default_seller_country" text,
	"default_payment_terms" text,
	"default_currency" text,
	"default_payment_type" text,
	"default_network" text,
	"default_notes" text,
	"default_terms" text,
	"profile_name" text DEFAULT 'Default',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '7cd58126-49de-4dee-bbac-ef535b883839';--> statement-breakpoint
ALTER TABLE "user_invoice_preferences" ADD CONSTRAINT "user_invoice_preferences_user_privy_did_users_privy_did_fk" FOREIGN KEY ("user_privy_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_invoice_prefs_user_id_idx" ON "user_invoice_preferences" USING btree ("user_privy_did");--> statement-breakpoint
CREATE INDEX "user_invoice_prefs_active_idx" ON "user_invoice_preferences" USING btree ("is_active");