-- Migration: Make practices table industry-agnostic
-- Run this in Supabase SQL Editor

-- Add new columns
ALTER TABLE practices ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE practices ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE practices ADD COLUMN IF NOT EXISTS additional_info jsonb DEFAULT '{}';
ALTER TABLE practices ADD COLUMN IF NOT EXISTS booking_system_type text DEFAULT 'internal';
ALTER TABLE practices ADD COLUMN IF NOT EXISTS booking_system_connected boolean DEFAULT false;
ALTER TABLE practices ADD COLUMN IF NOT EXISTS business_rules jsonb;

-- Update plan check constraint to support new tiers
ALTER TABLE practices DROP CONSTRAINT IF EXISTS practices_plan_check;
ALTER TABLE practices ADD CONSTRAINT practices_plan_check CHECK (plan IN ('free', 'starter', 'growth'));
-- Update existing rows to valid plan
UPDATE practices SET plan = 'free' WHERE plan NOT IN ('free', 'starter', 'growth');

-- Drop old practice_type constraint (now using free-text industry)
ALTER TABLE practices DROP CONSTRAINT IF EXISTS practices_practice_type_check;

-- Add new columns to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show'));
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS provider_name text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS booking_source text DEFAULT 'ai_agent';

-- Copy existing patient data to customer columns
UPDATE appointments SET customer_name = patient_name WHERE customer_name IS NULL;
UPDATE appointments SET customer_email = patient_email WHERE customer_email IS NULL;
UPDATE appointments SET customer_phone = patient_phone WHERE customer_phone IS NULL;

-- Index for industry search
CREATE INDEX IF NOT EXISTS idx_practices_industry ON practices(industry);
