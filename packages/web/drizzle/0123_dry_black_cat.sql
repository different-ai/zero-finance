CREATE TABLE "processed_email_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"processed_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_processed_email_messages_unique" ON "processed_email_messages" USING btree ("message_id","workspace_id");--> statement-breakpoint
CREATE INDEX "idx_processed_email_messages_expires" ON "processed_email_messages" USING btree ("expires_at");