-- 009: Connection gate tables + practice columns

-- Integration requests (users requesting unsupported booking systems)
CREATE TABLE IF NOT EXISTS integration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  booking_system_name TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Email sequences (drip campaigns)
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
  sequence_name TEXT NOT NULL,
  current_step INTEGER DEFAULT 0,
  last_sent_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  stopped_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, sequence_name)
);

-- New columns on practices
ALTER TABLE practices ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
ALTER TABLE practices ADD COLUMN IF NOT EXISTS skip_connection_count INTEGER DEFAULT 0;

-- RLS for integration_requests
ALTER TABLE integration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own integration requests"
  ON integration_requests FOR ALL
  USING (practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid()));

-- RLS for email_sequences
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email sequences"
  ON email_sequences FOR SELECT
  USING (practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid()));
