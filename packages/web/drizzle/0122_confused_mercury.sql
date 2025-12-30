CREATE TABLE "transaction_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_type" text NOT NULL,
	"transaction_id" text NOT NULL,
	"blob_url" text NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"uploaded_by" text NOT NULL,
	"upload_source" text DEFAULT 'manual' NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "transaction_attachments" ADD CONSTRAINT "transaction_attachments_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tx_attachments_tx_lookup_idx" ON "transaction_attachments" USING btree ("transaction_type","transaction_id");--> statement-breakpoint
CREATE INDEX "tx_attachments_workspace_idx" ON "transaction_attachments" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "tx_attachments_active_idx" ON "transaction_attachments" USING btree ("workspace_id","deleted_at");