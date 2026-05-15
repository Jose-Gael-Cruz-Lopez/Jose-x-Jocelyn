-- ============================================================
-- Jose x Jocelyn — Admin Queries
-- Run any of these in Supabase Dashboard → SQL Editor
-- ============================================================


-- ══════════════════════════════════════════════════════════════
-- DASHBOARD: See everything at a glance
-- ══════════════════════════════════════════════════════════════

-- Count of pending items across every table (run this first)
SELECT
  'subscribers'           AS table_name, COUNT(*) AS total, NULL AS pending FROM subscribers
UNION ALL
SELECT 'coffee_chat_profiles',          COUNT(*), COUNT(*) FILTER (WHERE status = 'pending') FROM coffee_chat_profiles
UNION ALL
SELECT 'opportunities',                 COUNT(*), COUNT(*) FILTER (WHERE status = 'pending') FROM opportunities
UNION ALL
SELECT 'resume_submissions',            COUNT(*), COUNT(*) FILTER (WHERE status = 'pending') FROM resume_submissions
UNION ALL
SELECT 'panelists',                     COUNT(*), COUNT(*) FILTER (WHERE status = 'pending') FROM panelists
UNION ALL
SELECT 'template_requests',             COUNT(*), NULL FROM template_requests
UNION ALL
SELECT 'bridge_year_suggestions',       COUNT(*), NULL FROM bridge_year_suggestions
UNION ALL
SELECT 'interview_prep_requests',       COUNT(*), NULL FROM interview_prep_requests
UNION ALL
SELECT 'panel_suggestions',             COUNT(*), NULL FROM panel_suggestions
UNION ALL
SELECT 'linkedin_episode_requests',     COUNT(*), NULL FROM linkedin_episode_requests
ORDER BY pending DESC NULLS LAST;


-- ══════════════════════════════════════════════════════════════
-- 1. SUBSCRIBERS
-- ══════════════════════════════════════════════════════════════

-- View all subscribers (newest first)
SELECT id, name, email, interests, source, confirmed, subscribed_at
FROM subscribers
ORDER BY subscribed_at DESC;

-- View unconfirmed subscribers
SELECT id, name, email, subscribed_at
FROM subscribers
WHERE confirmed = false
ORDER BY subscribed_at DESC;

-- Manually confirm a subscriber (if email confirmation is bypassed)
UPDATE subscribers SET confirmed = true WHERE email = 'someone@example.com';

-- Delete a subscriber (unsubscribe)
DELETE FROM subscribers WHERE email = 'someone@example.com';

-- Export subscriber list for email tools (copy result as CSV)
SELECT name, email, interests, subscribed_at
FROM subscribers
WHERE confirmed = true
ORDER BY subscribed_at DESC;


-- ══════════════════════════════════════════════════════════════
-- 2. COFFEE CHAT PROFILES
-- ══════════════════════════════════════════════════════════════

-- View all pending applications (review queue)
SELECT id, name, email, role_title, location, role_function, identity_tags, capacity, created_at
FROM coffee_chat_profiles
WHERE status = 'pending'
ORDER BY created_at ASC;

-- View full detail of one application (paste the id from above)
SELECT *
FROM coffee_chat_profiles
WHERE id = 'PASTE-ID-HERE';

-- Approve a profile (goes live on the site immediately)
UPDATE coffee_chat_profiles
SET status = 'approved', public_profile = true
WHERE id = 'PASTE-ID-HERE';

-- Reject a profile
UPDATE coffee_chat_profiles
SET status = 'rejected'
WHERE id = 'PASTE-ID-HERE';

-- Approve all pending profiles at once (use carefully)
UPDATE coffee_chat_profiles
SET status = 'approved', public_profile = true
WHERE status = 'pending';

-- Hide an approved profile without rejecting it
UPDATE coffee_chat_profiles
SET public_profile = false
WHERE id = 'PASTE-ID-HERE';

-- View all live profiles
SELECT id, name, role_title, location, status, public_profile, created_at
FROM coffee_chat_profiles
WHERE status = 'approved' AND public_profile = true
ORDER BY created_at DESC;

-- Delete a profile (permanent)
DELETE FROM coffee_chat_profiles WHERE id = 'PASTE-ID-HERE';


-- ══════════════════════════════════════════════════════════════
-- 3. OPPORTUNITIES
-- ══════════════════════════════════════════════════════════════

-- View all pending submissions (review queue)
SELECT id, role, company, role_type, link, deadline, submitted_by, created_at
FROM opportunities
WHERE status = 'pending'
ORDER BY created_at ASC;

-- View full detail of one submission
SELECT *
FROM opportunities
WHERE id = 'PASTE-ID-HERE';

-- Approve an opportunity (goes live in the board)
UPDATE opportunities
SET status = 'approved'
WHERE id = 'PASTE-ID-HERE';

-- Feature an opportunity (shows in the Featured strip at the top)
UPDATE opportunities
SET status = 'featured'
WHERE id = 'PASTE-ID-HERE';

-- Demote a featured opportunity back to approved
UPDATE opportunities
SET status = 'approved'
WHERE id = 'PASTE-ID-HERE';

-- Reject a submission
UPDATE opportunities
SET status = 'rejected'
WHERE id = 'PASTE-ID-HERE';

-- View all live opportunities
SELECT id, role, company, role_type, status, deadline, created_at
FROM opportunities
WHERE status IN ('approved', 'featured')
ORDER BY status DESC, created_at DESC;

-- Archive expired opportunities (past their deadline)
UPDATE opportunities
SET status = 'rejected'
WHERE status IN ('approved', 'featured')
  AND deadline < CURRENT_DATE;


-- ══════════════════════════════════════════════════════════════
-- 4. RESUME SUBMISSIONS
-- ══════════════════════════════════════════════════════════════

-- View all pending resume submissions
SELECT id, handle, role_title, stage, target_companies, background_tags, allow_download, allow_annotation, created_at
FROM resume_submissions
WHERE status = 'pending'
ORDER BY created_at ASC;

-- View full detail
SELECT *
FROM resume_submissions
WHERE id = 'PASTE-ID-HERE';

-- Approve a resume (shows in the Resume Reviews page)
UPDATE resume_submissions
SET status = 'approved'
WHERE id = 'PASTE-ID-HERE';

-- Feature a resume (shows with the J&J annotation badge)
UPDATE resume_submissions
SET status = 'featured'
WHERE id = 'PASTE-ID-HERE';

-- Reject
UPDATE resume_submissions
SET status = 'rejected'
WHERE id = 'PASTE-ID-HERE';

-- View all live resumes
SELECT id, handle, role_title, stage, status, allow_download, created_at
FROM resume_submissions
WHERE status IN ('approved', 'featured')
ORDER BY status DESC, created_at DESC;


-- ══════════════════════════════════════════════════════════════
-- 5. PANELISTS
-- ══════════════════════════════════════════════════════════════

-- View all pending panelist applications
SELECT id, name, email, role_title, topic, interested_in, created_at
FROM panelists
WHERE status = 'pending'
ORDER BY created_at ASC;

-- View full detail
SELECT *
FROM panelists
WHERE id = 'PASTE-ID-HERE';

-- Approve a panelist
UPDATE panelists
SET status = 'approved'
WHERE id = 'PASTE-ID-HERE';

-- Reject
UPDATE panelists
SET status = 'rejected'
WHERE id = 'PASTE-ID-HERE';

-- View all approved panelists
SELECT id, name, role_title, topic, email, created_at
FROM panelists
WHERE status = 'approved'
ORDER BY created_at DESC;


-- ══════════════════════════════════════════════════════════════
-- 6. INBOUND REQUESTS (read-only — no approval needed)
-- ══════════════════════════════════════════════════════════════

-- Template requests (from Career Templates page)
SELECT id, request, email, category, created_at
FROM template_requests
ORDER BY created_at DESC
LIMIT 50;

-- Bridge Year program suggestions
SELECT id, program_name, company, link, why, email, created_at
FROM bridge_year_suggestions
ORDER BY created_at DESC
LIMIT 50;

-- Interview Prep requests
SELECT id, description, stage, interview_type, help_needed, email, created_at
FROM interview_prep_requests
ORDER BY created_at DESC
LIMIT 50;

-- Panel topic suggestions
SELECT id, topic, why_helpful, stage, category, email, created_at
FROM panel_suggestions
ORDER BY created_at DESC
LIMIT 50;

-- LinkedIn episode requests
SELECT id, topic, email, category, created_at
FROM linkedin_episode_requests
ORDER BY created_at DESC
LIMIT 50;


-- ══════════════════════════════════════════════════════════════
-- UTILITY: Weekly review (run every Monday)
-- ══════════════════════════════════════════════════════════════

-- Everything submitted in the last 7 days
SELECT 'subscriber'       AS type, name AS label, email,       created_at FROM subscribers          WHERE subscribed_at > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'coffee_chat',              name,           email,       created_at FROM coffee_chat_profiles  WHERE created_at   > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'opportunity',              role,           submitted_by,created_at FROM opportunities         WHERE created_at   > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'resume',                   handle,         NULL,        created_at FROM resume_submissions     WHERE created_at   > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'panelist',                 name,           email,       created_at FROM panelists              WHERE created_at   > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'template_request',         request,        email,       created_at FROM template_requests      WHERE created_at   > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'bridge_suggestion',        program_name,   email,       created_at FROM bridge_year_suggestions WHERE created_at  > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
