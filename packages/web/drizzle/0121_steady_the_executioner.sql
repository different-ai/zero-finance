CREATE TABLE "ai_email_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_email" text NOT NULL,
	"thread_id" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"creator_user_id" text NOT NULL,
	"state" text DEFAULT 'active' NOT NULL,
	"pending_action" jsonb,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"extracted_data" jsonb,
	"invoice_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_email_sessions" ADD CONSTRAINT "ai_email_sessions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ai_email_sessions_lookup" ON "ai_email_sessions" USING btree ("sender_email","thread_id");--> statement-breakpoint
CREATE INDEX "idx_ai_email_sessions_workspace" ON "ai_email_sessions" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_ai_email_sessions_expires" ON "ai_email_sessions" USING btree ("expires_at");