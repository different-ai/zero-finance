CREATE TABLE "user_classification_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"prompt" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '509a392f-ba3c-4ee9-ab11-0c97d5974d06';--> statement-breakpoint
ALTER TABLE "user_classification_settings" ADD CONSTRAINT "user_classification_settings_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_classification_settings_user_id_idx" ON "user_classification_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_classification_settings_priority_idx" ON "user_classification_settings" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "user_classification_settings_enabled_idx" ON "user_classification_settings" USING btree ("enabled");