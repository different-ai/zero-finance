CREATE TABLE "workspace_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"key_prefix" varchar(12) NOT NULL,
	"key_hash" text NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"last_used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "workspace_api_keys" ADD CONSTRAINT "workspace_api_keys_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workspace_api_keys_workspace_idx" ON "workspace_api_keys" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_api_keys_hash_idx" ON "workspace_api_keys" USING btree ("key_hash");
