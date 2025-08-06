CREATE TABLE "client_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_privy_did" text NOT NULL,
	"name" text NOT NULL,
	"business_name" text,
	"email" text NOT NULL,
	"address" text,
	"city" text,
	"postal_code" text,
	"country" text,
	"tax_id" text,
	"notes" text,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'f717da82-d473-4337-80a8-de8b604563ed';--> statement-breakpoint
CREATE INDEX "client_profiles_user_idx" ON "client_profiles" USING btree ("user_privy_did");--> statement-breakpoint
CREATE INDEX "client_profiles_email_idx" ON "client_profiles" USING btree ("email");