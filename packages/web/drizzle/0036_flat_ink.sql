ALTER TABLE "company_profiles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "company_profiles" CASCADE;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '551c4ee3-b947-4ded-8f0a-5c60cc6deb53';
