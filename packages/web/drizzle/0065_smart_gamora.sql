ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '4c87bf74-739a-4954-921f-619398292f55';

-- Add 'done' as a valid status for inbox_cards
-- First, drop any existing constraint if it exists
ALTER TABLE "inbox_cards" DROP CONSTRAINT IF EXISTS "inbox_cards_status_check";

-- Add the new constraint with 'done' included
ALTER TABLE "inbox_cards" ADD CONSTRAINT "inbox_cards_status_check" 
CHECK ("status" IN ('pending', 'executed', 'dismissed', 'auto', 'snoozed', 'error', 'seen', 'done'));