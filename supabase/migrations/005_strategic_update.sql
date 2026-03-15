-- Migration 005: Strategic Product Update
-- Adds leads table for concierge setup and search_appearances for tracking

-- ============================================
-- LEADS TABLE (concierge setup & waitlist)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  booking_system TEXT DEFAULT 'unknown',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'setup_in_progress', 'setup_complete', 'not_interested')),
  referral_source TEXT,
  referred_by_slug TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admin queries
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);

-- RLS: Allow anonymous inserts (for the public form), admin reads via service role
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (public form)
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Only service role can read/update leads (admin dashboard uses service role)
-- No SELECT/UPDATE policy for anon = admin-only access via service role key

-- ============================================
-- SEARCH APPEARANCES TABLE (AI discovery tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS search_appearances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  query_text TEXT,
  agent_identifier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_appearances_practice ON search_appearances(practice_id);
CREATE INDEX idx_search_appearances_created ON search_appearances(created_at DESC);
CREATE INDEX idx_search_appearances_practice_month ON search_appearances(practice_id, created_at);

ALTER TABLE search_appearances ENABLE ROW LEVEL SECURITY;

-- Practices can read their own search appearances
CREATE POLICY "Users can view own search appearances" ON search_appearances
  FOR SELECT USING (
    practice_id IN (
      SELECT id FROM practices WHERE user_id = auth.uid()
    )
  );

-- Service role inserts (from API routes)
-- No INSERT policy for anon = only service role can insert
