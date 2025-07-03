ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'fc7adade-078c-4c0e-9dd0-037afba32858';--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "categories" text[];