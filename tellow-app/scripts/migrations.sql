-- Run this in Supabase → SQL Editor before running the seed script or launching the app

-- 1. Add phone_number column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- 2. Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  contact_user_id  UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contact_user_id)
);

-- 3. Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies — users can only manage their own contacts
CREATE POLICY "contacts_select" ON contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "contacts_insert" ON contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contacts_delete" ON contacts
  FOR DELETE USING (auth.uid() = user_id);
