ALTER TABLE "workspaces" ADD COLUMN "ai_email_handle" text;--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_ai_email_handle_idx" ON "workspaces" USING btree ("ai_email_handle");