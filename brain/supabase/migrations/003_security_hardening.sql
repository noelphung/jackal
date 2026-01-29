-- 003: Security Hardening
-- Fix documents table RLS, add user_id, tighten all policies

-- Add user_id to documents table (nullable for migration, will make required later)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS user_id UUID;

-- Enable RLS on documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Drop any existing permissive policies on documents
DROP POLICY IF EXISTS "Public read access" ON documents;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON documents;

-- Documents policies - authenticated users only
CREATE POLICY "Authenticated users can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (true);

-- Block anon access completely
CREATE POLICY "Anon cannot access documents"
  ON documents FOR ALL
  TO anon
  USING (false);

-- Verify RLS is enabled on ALL sensitive tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('settings', 'api_keys', 'projects', 'tasks', 'activity_log', 'documents')
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
  END LOOP;
END $$;

-- Add rate limiting function (for future use)
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_action TEXT,
  p_limit INTEGER DEFAULT 100,
  p_window_seconds INTEGER DEFAULT 3600
)
RETURNS BOOLEAN AS $$
DECLARE
  action_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO action_count
  FROM activity_log
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at > NOW() - (p_window_seconds || ' seconds')::INTERVAL;
  
  RETURN action_count < p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit function for sensitive operations
CREATE OR REPLACE FUNCTION audit_sensitive_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
  VALUES (
    auth.uid(),
    TG_OP || '_' || TG_TABLE_NAME,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('operation', TG_OP, 'timestamp', NOW())
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to api_keys table (most sensitive)
DROP TRIGGER IF EXISTS audit_api_keys_access ON api_keys;
CREATE TRIGGER audit_api_keys_access
  AFTER INSERT OR UPDATE OR DELETE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_access();

-- Revoke direct table access from anon role (belt and suspenders)
REVOKE ALL ON api_keys FROM anon;
REVOKE ALL ON settings FROM anon;

-- Grant only necessary permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON api_keys TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON documents TO authenticated;
GRANT SELECT, INSERT ON activity_log TO authenticated;
