ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '8f290038-e1b4-455f-a45d-2710d234a546';--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "amount" SET DATA TYPE bigint USING (amount::numeric * 100)::bigint;--> statement-breakpoint
ALTER TABLE "user_requests" ADD COLUMN "currency_decimals" integer;