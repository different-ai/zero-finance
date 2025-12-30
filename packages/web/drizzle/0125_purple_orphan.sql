ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");