-- ============================================================
-- Jose x Jocelyn — Full Schema + RLS
-- Run this ONCE in Supabase Studio > SQL Editor
-- Safe to re-run: uses IF NOT EXISTS + DROP POLICY IF EXISTS
-- ============================================================

-- ── 1. SUBSCRIBERS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email               text UNIQUE NOT NULL,
  name                text,
  source              text,
  interests           text[],
  confirmed           boolean DEFAULT false,
  confirmation_token  text DEFAULT encode(gen_random_bytes(32), 'hex'),
  subscribed_at       timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "subscribers_insert" ON subscribers;
CREATE POLICY "subscribers_insert" ON subscribers FOR INSERT WITH CHECK (true);


-- ── 2. OPPORTUNITIES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunities (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role            text NOT NULL,
  company         text NOT NULL,
  role_type       text,
  link            text NOT NULL,
  deadline        date,
  eligibility     text,
  why             text,
  submitted_by    text,
  status          text DEFAULT 'pending',
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "opportunities_insert" ON opportunities;
DROP POLICY IF EXISTS "opportunities_read_approved" ON opportunities;
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
  role_title      text NOT NULL,
  location        text,
  role_function   text[],
  identity_tags   text[],
  topics          text,
  capacity        text,
  avatar_url      text,
  public_profile  boolean DEFAULT true,
  consented_at    timestamptz,
  status          text DEFAULT 'pending',
  created_at      timestamptz DEFAULT now()
);

-- For databases that already have the table without avatar_url, add it.
DO $$ BEGIN
  ALTER TABLE coffee_chat_profiles ADD COLUMN avatar_url text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Track when a profile was actually approved (vs. when it was submitted).
DO $$ BEGIN
  ALTER TABLE coffee_chat_profiles ADD COLUMN approved_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Allow admins to feature specific profiles so they sort to the top of the directory.
DO $$ BEGIN
  ALTER TABLE coffee_chat_profiles ADD COLUMN featured boolean DEFAULT false NOT NULL;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Auto-set approved_at the first time status flips to 'approved'.
CREATE OR REPLACE FUNCTION coffee_chat_set_approved_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') AND NEW.approved_at IS NULL THEN
    NEW.approved_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS coffee_chat_approved_at_trigger ON coffee_chat_profiles;
CREATE TRIGGER coffee_chat_approved_at_trigger
  BEFORE UPDATE ON coffee_chat_profiles
  FOR EACH ROW
  EXECUTE FUNCTION coffee_chat_set_approved_at();

-- Prevent duplicate submissions per email. Skips silently if the constraint already
-- exists, or if duplicates would prevent it. UNIQUE constraints raise duplicate_table
-- (42P07) on re-creation because they own an implicit index — catch that too.
DO $$ BEGIN
  ALTER TABLE coffee_chat_profiles ADD CONSTRAINT coffee_chat_email_unique UNIQUE (email);
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN duplicate_table THEN NULL;
  WHEN unique_violation THEN
    RAISE NOTICE 'Could not add unique constraint on coffee_chat_profiles.email — existing duplicates must be cleaned up first';
END $$;

ALTER TABLE coffee_chat_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "coffee_chat_insert" ON coffee_chat_profiles;
DROP POLICY IF EXISTS "coffee_chat_read_approved" ON coffee_chat_profiles;
CREATE POLICY "coffee_chat_insert" ON coffee_chat_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "coffee_chat_read_approved" ON coffee_chat_profiles FOR SELECT
  USING (status = 'approved' AND public_profile = true);

-- Defense in depth: revoke broad SELECT and re-grant only non-sensitive columns to anon/auth.
-- The `email` column is intentionally excluded so it cannot be queried by the public client.
REVOKE SELECT ON coffee_chat_profiles FROM anon, authenticated;
GRANT SELECT (
  id, name, pronouns, linkedin_url, role_title, location,
  role_function, identity_tags, topics, capacity, avatar_url,
  public_profile, status, created_at, approved_at, featured
) ON coffee_chat_profiles TO anon, authenticated;
GRANT INSERT ON coffee_chat_profiles TO anon, authenticated;


-- ── 3a. COFFEE CHAT ADMIN ──────────────────────────────────
-- Allow-list of admin emails. Authenticated users matching this list can
-- moderate coffee chat submissions via the SECURITY DEFINER RPCs below.
CREATE TABLE IF NOT EXISTS coffee_chat_admins (
  email     text PRIMARY KEY,
  added_at  timestamptz DEFAULT now()
);

ALTER TABLE coffee_chat_admins ENABLE ROW LEVEL SECURITY;

-- Authenticated users can check whether *they themselves* are an admin (for the UI gate),
-- but cannot enumerate other admins.
DROP POLICY IF EXISTS "coffee_chat_admins_self_check" ON coffee_chat_admins;
CREATE POLICY "coffee_chat_admins_self_check" ON coffee_chat_admins
  FOR SELECT TO authenticated
  USING (lower(email) = lower(auth.jwt() ->> 'email'));

-- Helper used by the RPCs below.
CREATE OR REPLACE FUNCTION is_coffee_chat_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM coffee_chat_admins
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- List pending submissions — bypasses column grants so admins see email.
CREATE OR REPLACE FUNCTION admin_list_pending_coffee_chat_profiles()
RETURNS TABLE (
  id uuid, name text, pronouns text, email text, linkedin_url text,
  role_title text, location text, role_function text[], identity_tags text[],
  topics text, capacity text, avatar_url text, created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_coffee_chat_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
    SELECT p.id, p.name, p.pronouns, p.email, p.linkedin_url,
           p.role_title, p.location, p.role_function, p.identity_tags,
           p.topics, p.capacity, p.avatar_url, p.created_at
    FROM coffee_chat_profiles p
    WHERE p.status = 'pending'
    ORDER BY p.created_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_approve_coffee_chat_profile(profile_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_coffee_chat_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;
  UPDATE coffee_chat_profiles SET status = 'approved' WHERE id = profile_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_reject_coffee_chat_profile(profile_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_coffee_chat_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;
  UPDATE coffee_chat_profiles SET status = 'rejected' WHERE id = profile_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_set_featured_coffee_chat_profile(profile_id uuid, is_featured boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_coffee_chat_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;
  UPDATE coffee_chat_profiles SET featured = is_featured WHERE id = profile_id;
END;
$$;

GRANT EXECUTE ON FUNCTION is_coffee_chat_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_list_pending_coffee_chat_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_approve_coffee_chat_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_reject_coffee_chat_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_set_featured_coffee_chat_profile(uuid, boolean) TO authenticated;


-- ── 4. RESUME SUBMISSIONS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS resume_submissions (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  handle           text NOT NULL,
  email            text NOT NULL,
  linkedin_url     text,
  role_title       text,
  role_type        text,
  stage            text,
  target_companies text,
  background_tags  text[],
  file_name        text,
  allow_download   boolean DEFAULT false,
  story            text,
  allow_annotation boolean DEFAULT false,
  status           text DEFAULT 'pending',
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE resume_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "resumes_insert" ON resume_submissions;
DROP POLICY IF EXISTS "resumes_read_approved" ON resume_submissions;
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
DROP POLICY IF EXISTS "template_requests_insert" ON template_requests;
CREATE POLICY "template_requests_insert" ON template_requests FOR INSERT WITH CHECK (true);


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
DROP POLICY IF EXISTS "bridge_year_insert" ON bridge_year_suggestions;
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
DROP POLICY IF EXISTS "interview_prep_insert" ON interview_prep_requests;
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
DROP POLICY IF EXISTS "panel_suggestions_insert" ON panel_suggestions;
CREATE POLICY "panel_suggestions_insert" ON panel_suggestions FOR INSERT WITH CHECK (true);


-- ── 9. PANELISTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS panelists (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  email         text NOT NULL,
  linkedin_url  text,
  role_title    text NOT NULL,
  topic         text,
  interested_in text,
  notes         text,
  status        text DEFAULT 'pending',
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE panelists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "panelists_insert" ON panelists;
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
DROP POLICY IF EXISTS "linkedin_requests_insert" ON linkedin_episode_requests;
CREATE POLICY "linkedin_requests_insert" ON linkedin_episode_requests FOR INSERT WITH CHECK (true);


-- ── STORAGE BUCKETS ────────────────────────────────────────
-- Resumes: private bucket — admins only via service_role
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Avatars: public read so coffee chat profile photos render anywhere
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "resume_upload" ON storage.objects;
DROP POLICY IF EXISTS "resume_admin_select" ON storage.objects;
DROP POLICY IF EXISTS "avatar_upload" ON storage.objects;
DROP POLICY IF EXISTS "avatar_public_read" ON storage.objects;

CREATE POLICY "resume_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = 'pending'
  );

CREATE POLICY "resume_admin_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND auth.role() = 'service_role'
  );

-- Anyone can upload an avatar during the coffee-chat sign-up flow
CREATE POLICY "avatar_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- Public read so <img src> works without auth
CREATE POLICY "avatar_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
