ALTER TABLE "earn_deposits" ALTER COLUMN "assets_deposited" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "earn_deposits" ALTER COLUMN "shares_received" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "earn_withdrawals" ALTER COLUMN "assets_withdrawn" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "earn_withdrawals" ALTER COLUMN "shares_burned" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "incoming_deposits" ALTER COLUMN "amount" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "incoming_deposits" ALTER COLUMN "swept_amount" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "platform_totals" ALTER COLUMN "total_deposited" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
