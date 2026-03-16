-- Credentials table for storing OAuth tokens and API keys
CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  booking_system TEXT NOT NULL,
  credential_type TEXT NOT NULL DEFAULT 'oauth' CHECK (credential_type IN ('oauth', 'api_key')),
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  api_key_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  calendar_id TEXT, -- e.g. Google Calendar ID to create events on
  is_valid BOOLEAN DEFAULT true,
  last_validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, booking_system)
);

-- Add external_id to appointments for linking to Google Calendar events etc.
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS external_id TEXT;

-- RLS
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own credentials"
  ON credentials FOR ALL
  USING (practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid()));
