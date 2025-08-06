CREATE TABLE "escrow_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"invoice_number" varchar(255) NOT NULL,
	"sender_name" varchar(255) NOT NULL,
	"sender_email" varchar(255) NOT NULL,
	"recipient_name" varchar(255) NOT NULL,
	"recipient_email" varchar(255) NOT NULL,
	"amount" bigint NOT NULL,
	"currency" varchar(10) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"due_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"escrow_tx_hash" varchar(255),
	"release_tx_hash" varchar(255),
	"shareable_link" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "invoice_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_privy_did" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"template_data" jsonb,
	"usage_count" integer DEFAULT 0,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "retro_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_privy_did" text DEFAULT 'public' NOT NULL,
	"token" text NOT NULL,
	"company_name" text NOT NULL,
	"company_email" text NOT NULL,
	"contractor_name" text NOT NULL,
	"contractor_email" text NOT NULL,
	"project_description" text,
	"total_amount" numeric(10, 2),
	"date_range" jsonb,
	"notes" text,
	"invoice_data" jsonb DEFAULT '{}',
	"contractor_details" jsonb,
	"business_details" jsonb,
	"payments" jsonb,
	"services" jsonb,
	"compliance" jsonb,
	"status" text DEFAULT 'pending',
	"share_token" text,
	"batching_strategy" text DEFAULT 'individual',
	"pdf_url" text,
	"pdf_generated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finalized_at" timestamp with time zone,
	CONSTRAINT "retro_invoices_token_unique" UNIQUE("token"),
	CONSTRAINT "retro_invoices_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '0121a89a-fac6-40d9-8791-c958a6639193';--> statement-breakpoint
ALTER TABLE "invoice_templates" ADD CONSTRAINT "invoice_templates_user_privy_did_users_privy_did_fk" FOREIGN KEY ("user_privy_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "escrow_invoices_user_id_idx" ON "escrow_invoices" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "escrow_invoices_status_idx" ON "escrow_invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "escrow_invoices_invoice_number_idx" ON "escrow_invoices" USING btree ("invoice_number");--> statement-breakpoint
CREATE INDEX "invoice_templates_user_id_idx" ON "invoice_templates" USING btree ("user_privy_did");--> statement-breakpoint
CREATE INDEX "invoice_templates_name_idx" ON "invoice_templates" USING btree ("name");--> statement-breakpoint
CREATE INDEX "retro_invoices_user_id_idx" ON "retro_invoices" USING btree ("user_privy_did");--> statement-breakpoint
CREATE INDEX "retro_invoices_status_idx" ON "retro_invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "retro_invoices_token_idx" ON "retro_invoices" USING btree ("token");--> statement-breakpoint
CREATE INDEX "retro_invoices_share_token_idx" ON "retro_invoices" USING btree ("share_token");