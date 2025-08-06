ALTER TABLE "client_profiles" RENAME TO "company_clients";--> statement-breakpoint
DROP INDEX "client_profiles_user_idx";--> statement-breakpoint
DROP INDEX "client_profiles_email_idx";--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '16e3a4f4-bf83-4519-9ede-65231d9bd494';--> statement-breakpoint
ALTER TABLE "company_clients" ADD COLUMN "client_company_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "company_clients" ADD COLUMN "last_used_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "postal_code" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "payment_address" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "preferred_network" text DEFAULT 'solana';--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "preferred_currency" text DEFAULT 'USDC';--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "tax_id" text;--> statement-breakpoint
ALTER TABLE "company_clients" ADD CONSTRAINT "company_clients_client_company_id_companies_id_fk" FOREIGN KEY ("client_company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "company_clients_user_client_idx" ON "company_clients" USING btree ("user_privy_did","client_company_id");--> statement-breakpoint
CREATE INDEX "company_clients_user_idx" ON "company_clients" USING btree ("user_privy_did");--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "business_name";--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "postal_code";--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "country";--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "tax_id";--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "is_default";--> statement-breakpoint
ALTER TABLE "company_clients" DROP COLUMN "updated_at";