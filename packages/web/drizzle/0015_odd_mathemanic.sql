CREATE TABLE "allocation_strategies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_did" text NOT NULL,
	"destination_safe_type" text NOT NULL,
	"percentage" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '39a29f74-b2d0-4a3d-8152-eec3070efa00';--> statement-breakpoint
ALTER TABLE "allocation_strategies" ADD CONSTRAINT "allocation_strategies_user_did_users_privy_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_strategy_type_unique_idx" ON "allocation_strategies" USING btree ("user_did","destination_safe_type");