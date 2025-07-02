CREATE TABLE "platform_totals" (
	"token" text PRIMARY KEY NOT NULL,
	"total_deposited" bigint NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "allocation_states" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "allocation_states" CASCADE;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '1a0cd387-2442-4bf1-81dc-234a140faff7';