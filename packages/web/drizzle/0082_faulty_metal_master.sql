CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"owner_privy_did" text NOT NULL,
	"settings" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_invite_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"token" text NOT NULL,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"used_count" integer DEFAULT 0,
	CONSTRAINT "company_invite_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "company_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"user_privy_did" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_company_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"data_key" text NOT NULL,
	"data_value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '0074f76c-e993-45b4-ae50-519a1693f182';--> statement-breakpoint
ALTER TABLE "retro_invoices" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "company_invite_links" ADD CONSTRAINT "company_invite_links_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_company_data" ADD CONSTRAINT "shared_company_data_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "companies_owner_idx" ON "companies" USING btree ("owner_privy_did");--> statement-breakpoint
CREATE UNIQUE INDEX "company_invite_links_token_idx" ON "company_invite_links" USING btree ("token");--> statement-breakpoint
CREATE INDEX "company_invite_links_company_idx" ON "company_invite_links" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "company_members_company_user_idx" ON "company_members" USING btree ("company_id","user_privy_did");--> statement-breakpoint
CREATE INDEX "company_members_user_idx" ON "company_members" USING btree ("user_privy_did");--> statement-breakpoint
CREATE UNIQUE INDEX "shared_company_data_company_key_idx" ON "shared_company_data" USING btree ("company_id","data_key");--> statement-breakpoint
ALTER TABLE "retro_invoices" ADD CONSTRAINT "retro_invoices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;