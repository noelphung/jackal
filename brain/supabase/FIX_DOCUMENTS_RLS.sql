-- FIX: Secure documents table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/azxkbejpckpwvwoyljpg/sql

-- Step 1: Enable RLS (might already be enabled)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON documents;
DROP POLICY IF EXISTS "Public read access" ON documents;
DROP POLICY IF EXISTS "Allow public read" ON documents;
DROP POLICY IF EXISTS "Allow anonymous access" ON documents;

-- Step 3: Create restrictive policies (authenticated users only)
CREATE POLICY "Authenticated read documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (true);

-- Step 4: Explicitly deny anon access
REVOKE ALL ON documents FROM anon;
GRANT SELECT ON documents TO authenticated;
GRANT INSERT ON documents TO authenticated;
GRANT UPDATE ON documents TO authenticated;
GRANT DELETE ON documents TO authenticated;
