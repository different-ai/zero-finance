ALTER TABLE "offramp_transfers" ADD COLUMN "linked_invoice_id" text;--> statement-breakpoint
CREATE INDEX "offramp_transfers_linked_invoice_idx" ON "offramp_transfers" USING btree ("linked_invoice_id");--> statement-breakpoint
ALTER TABLE "offramp_transfers" ADD CONSTRAINT "offramp_transfers_linked_invoice_id_user_requests_id_fk" FOREIGN KEY ("linked_invoice_id") REFERENCES "public"."user_requests"("id") ON DELETE set null ON UPDATE no action;
