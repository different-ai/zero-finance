CREATE TABLE "user_features" (
	"id" text PRIMARY KEY NOT NULL,
	"user_privy_did" text NOT NULL,
	"feature_name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"purchase_source" text DEFAULT 'polar',
	"purchase_reference" text,
	"activated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '7a5d7137-27a1-43fe-8ba5-636e30b4e1b4';--> statement-breakpoint
ALTER TABLE "user_features" ADD CONSTRAINT "user_features_user_privy_did_users_privy_did_fk" FOREIGN KEY ("user_privy_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_feature_unique_idx" ON "user_features" USING btree ("user_privy_did","feature_name");--> statement-breakpoint
CREATE INDEX "user_features_user_did_idx" ON "user_features" USING btree ("user_privy_did");