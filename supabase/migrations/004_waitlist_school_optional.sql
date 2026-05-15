-- ── WAITLIST: make `school` optional ────────────────────
-- The waitlist form now collects "school or occupation" as an optional field,
-- so allow NULL in the column.
ALTER TABLE waitlist_subscribers ALTER COLUMN school DROP NOT NULL;
