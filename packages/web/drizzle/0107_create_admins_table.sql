CREATE TABLE IF NOT EXISTS "admins" (
	"privy_did" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"added_by" text,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'cfeee46d-5402-4d8e-b101-a3ee7acf8143';--> statement-breakpoint
INSERT INTO "admins" ("privy_did", "added_by", "notes") VALUES ('did:privy:cmexesoyx0010ju0bznhrnklw', NULL, 'Initial admin - Benjamin');
