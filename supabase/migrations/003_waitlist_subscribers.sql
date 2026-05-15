-- ── WAITLIST SUBSCRIBERS ────────────────────────────────
-- Captures name + email + school from the waitlist-mode landing.
-- Anon clients can INSERT only; reads gated to service_role.
CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  email       text NOT NULL,
  school      text NOT NULL,
  lang        text,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS waitlist_subscribers_email_idx ON waitlist_subscribers (email);

ALTER TABLE waitlist_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "waitlist_subscribers_insert" ON waitlist_subscribers;
CREATE POLICY "waitlist_subscribers_insert" ON waitlist_subscribers FOR INSERT WITH CHECK (true);
