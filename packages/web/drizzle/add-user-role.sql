-- Add user role to differentiate between startups and contractors
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_role text DEFAULT 'startup' CHECK (user_role IN ('startup', 'contractor'));

-- Add invite code used for contractor onboarding
ALTER TABLE users ADD COLUMN IF NOT EXISTS contractor_invite_code text;

-- Add index for faster contractor lookups
CREATE INDEX IF NOT EXISTS idx_users_user_role ON users(user_role);
CREATE INDEX IF NOT EXISTS idx_users_contractor_invite_code ON users(contractor_invite_code);