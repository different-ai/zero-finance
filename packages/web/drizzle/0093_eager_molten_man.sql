CREATE TABLE "cli_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"name" text NOT NULL,
	"last_used" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cli_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '30d3f302-8a17-4ed9-bedf-82dd4fa5a062';--> statement-breakpoint
ALTER TABLE "cli_tokens" ADD CONSTRAINT "cli_tokens_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cli_tokens_user_id_idx" ON "cli_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cli_tokens_token_hash_idx" ON "cli_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "cli_tokens_expires_at_idx" ON "cli_tokens" USING btree ("expires_at");