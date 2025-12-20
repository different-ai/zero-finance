ALTER TABLE "offramp_transfers" ADD COLUMN "proposed_by_agent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "offramp_transfers" ADD COLUMN "agent_proposal_message" text;
