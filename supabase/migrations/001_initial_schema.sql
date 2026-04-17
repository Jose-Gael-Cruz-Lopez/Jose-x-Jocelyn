-- ============================================================
-- Jose x Jocelyn — Full Schema + RLS
-- Run this ONCE in Supabase Studio > SQL Editor
-- ============================================================

-- ── 1. SUBSCRIBERS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email               text UNIQUE NOT NULL,
  name                text,
  source              text,         -- 'home_modal' | 'article_rejection' | etc.
  interests           text[],       -- home modal checkboxes
  confirmed           boolean DEFAULT false,
  confirmation_token  text DEFAULT encode(gen_random_bytes(32), 'hex'),
  subscribed_at       timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscribers_insert" ON subscribers FOR INSERT WITH CHECK (true);
-- No public SELECT — subscriber list is private


-- ── 2. OPPORTUNITIES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunities (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role            text NOT NULL,
  company         text NOT NULL,
  role_type       text,             -- 'internship' | 'full-time' | 'contract'
  link            text NOT NULL,
  deadline        date,
  eligibility     text,
  why             text,
  submitted_by    text,             -- email
  status          text DEFAULT 'pending',  -- 'pending' | 'approved' | 'featured'
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opportunities_insert" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "opportunities_read_approved" ON opportunities FOR SELECT
  USING (status IN ('approved', 'featured'));


-- ── 3. COFFEE CHAT PROFILES ────────────────────────────────
CREATE TABLE IF NOT EXISTS coffee_chat_profiles (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text NOT NULL,
  pronouns        text,
  email           text NOT NULL,
  linkedin_url    text NOT NULL,
  role_title      text NOT NULL,    -- renamed from current_role (reserved keyword)
  location        text,
  role_function   text[],
  identity_tags   text[],
  topics          text,
  capacity        text,
  public_profile  boolean DEFAULT true,
  consented_at    timestamptz,
  status          text DEFAULT 'pending',
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE coffee_chat_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coffee_chat_insert" ON coffee_chat_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "coffee_chat_read_approved" ON coffee_chat_profiles FOR SELECT
  USING (status = 'approved' AND public_profile = true);


-- ── 4. RESUME SUBMISSIONS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS resume_submissions (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  handle           text NOT NULL,
  email            text NOT NULL,
  linkedin_url     text,
  role_title       text,
  role_type        text,
  stage            text,
  target_companies text,            -- comma-separated string
  background_tags  text[],
  file_name        text,
  allow_download   boolean DEFAULT false,
  story            text,
  allow_annotation boolean DEFAULT false,
  status           text DEFAULT 'pending',
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE resume_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resumes_insert" ON resume_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "resumes_read_approved" ON resume_submissions FOR SELECT
  USING (status IN ('approved', 'featured'));


-- ── 5. TEMPLATE REQUESTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS template_requests (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  request     text NOT NULL,
  email       text,
  category    text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE template_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "template_requests_insert" ON template_requests FOR INSERT WITH CHECK (true);
-- Private — no public SELECT


-- ── 6. BRIDGE YEAR SUGGESTIONS ─────────────────────────────
CREATE TABLE IF NOT EXISTS bridge_year_suggestions (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  program_name  text NOT NULL,
  company       text NOT NULL,
  link          text,
  why           text,
  email         text,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE bridge_year_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bridge_year_insert" ON bridge_year_suggestions FOR INSERT WITH CHECK (true);


-- ── 7. INTERVIEW PREP REQUESTS ─────────────────────────────
CREATE TABLE IF NOT EXISTS interview_prep_requests (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description     text NOT NULL,
  stage           text,
  interview_type  text,
  help_needed     text,
  email           text,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE interview_prep_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "interview_prep_insert" ON interview_prep_requests FOR INSERT WITH CHECK (true);


-- ── 8. PANEL SUGGESTIONS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS panel_suggestions (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  topic         text NOT NULL,
  why_helpful   text NOT NULL,
  stage         text,
  category      text,
  email         text,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE panel_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "panel_suggestions_insert" ON panel_suggestions FOR INSERT WITH CHECK (true);


-- ── 9. PANELISTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS panelists (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  email         text NOT NULL,
  linkedin_url  text,
  role_title    text NOT NULL,      -- renamed from current_role (reserved keyword)
  topic         text,
  interested_in text,
  notes         text,
  status        text DEFAULT 'pending',
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE panelists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "panelists_insert" ON panelists FOR INSERT WITH CHECK (true);


-- ── 10. LINKEDIN EPISODE REQUESTS ─────────────────────────
CREATE TABLE IF NOT EXISTS linkedin_episode_requests (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  topic       text NOT NULL,
  email       text,
  category    text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE linkedin_episode_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "linkedin_requests_insert" ON linkedin_episode_requests FOR INSERT WITH CHECK (true);


-- ── STORAGE BUCKET ─────────────────────────────────────────
-- Run this separately if the bucket doesn't exist yet
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: anyone can upload to pending/, no public download
CREATE POLICY "resume_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = 'pending'
  );

-- Only service_role (you, in Studio) can read/move files
CREATE POLICY "resume_admin_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND auth.role() = 'service_role'
  );
