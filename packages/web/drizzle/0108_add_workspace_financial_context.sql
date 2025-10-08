-- Migration: Add KYC and banking fields to workspaces table
-- This enables workspace-level KYC instead of user-level KYC
-- Phase 1: Additive only - no deletions from users table

-- Add KYC and banking fields to workspaces
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "align_customer_id" text;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "kyc_provider" text;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "kyc_status" text DEFAULT 'none';
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "kyc_flow_link" text;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "kyc_sub_status" text;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "kyc_marked_done" boolean DEFAULT false NOT NULL;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "kyc_notification_sent" timestamp with time zone;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "kyc_notification_status" text;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "align_virtual_account_id" text;

-- Add entity information fields
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "beneficiary_type" text;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "company_name" text;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "first_name" text;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "last_name" text;

-- Add workspace type field
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "workspace_type" text DEFAULT 'business';

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS "workspaces_align_customer_id_idx" ON "workspaces" USING btree ("align_customer_id") WHERE "align_customer_id" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "workspaces_kyc_status_idx" ON "workspaces" USING btree ("kyc_status");
CREATE INDEX IF NOT EXISTS "workspaces_align_virtual_account_idx" ON "workspaces" USING btree ("align_virtual_account_id") WHERE "align_virtual_account_id" IS NOT NULL;

-- Add check constraints for enums
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_kyc_provider_check" CHECK (kyc_provider IS NULL OR kyc_provider IN ('align', 'other'));
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_kyc_status_check" CHECK (kyc_status IS NULL OR kyc_status IN ('none', 'pending', 'approved', 'rejected'));
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_kyc_notification_status_check" CHECK (kyc_notification_status IS NULL OR kyc_notification_status IN ('pending', 'sent', 'failed'));
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_beneficiary_type_check" CHECK (beneficiary_type IS NULL OR beneficiary_type IN ('individual', 'business'));
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_workspace_type_check" CHECK (workspace_type IS NULL OR workspace_type IN ('personal', 'business'));
