-- ── BRIDGE YEAR SUBSCRIBERS ────────────────────────────────
-- Captures emails from the .by-capture banner above the apprentice grid.
-- Anon clients can INSERT only; reads gated to service_role.
CREATE TABLE IF NOT EXISTS bridge_year_subscribers (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE bridge_year_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bridge_year_subscribers_insert" ON bridge_year_subscribers;
CREATE POLICY "bridge_year_subscribers_insert" ON bridge_year_subscribers FOR INSERT WITH CHECK (true);
