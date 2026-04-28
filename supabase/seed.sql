-- =============================================================================
-- supabase/seed.sql — seed data for local dev and CI.
-- =============================================================================
-- This file is executed AFTER all migrations on `supabase db reset`.
-- Use it to create test users, fixtures, sample rows, etc.
--
-- For production: do NOT add real data here. Production is seeded by FORGE
-- runbook (`runbooks/provision-internal-app.md` step 2 — healthcheck row).
-- =============================================================================

-- Healthcheck table (mirrored on production by the provisioning runbook).
CREATE TABLE IF NOT EXISTS healthcheck (
  id INT PRIMARY KEY DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO healthcheck (id) VALUES (1) ON CONFLICT DO NOTHING;
