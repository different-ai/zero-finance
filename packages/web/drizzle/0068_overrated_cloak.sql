CREATE TABLE "card_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" text NOT NULL,
	"user_id" text NOT NULL,
	"action_type" text NOT NULL,
	"actor" text DEFAULT 'human' NOT NULL,
	"actor_details" jsonb,
	"previous_value" jsonb,
	"new_value" jsonb,
	"details" jsonb,
	"status" text DEFAULT 'success' NOT NULL,
	"error_message" text,
	"metadata" jsonb,
	"performed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '8bc27218-1f45-49e6-b94d-513f53f0582b';--> statement-breakpoint
ALTER TABLE "card_actions" ADD CONSTRAINT "card_actions_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "card_actions_card_id_idx" ON "card_actions" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "card_actions_user_id_idx" ON "card_actions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "card_actions_action_type_idx" ON "card_actions" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "card_actions_performed_at_idx" ON "card_actions" USING btree ("performed_at");--> statement-breakpoint
CREATE INDEX "card_actions_card_performed_idx" ON "card_actions" USING btree ("card_id","performed_at");