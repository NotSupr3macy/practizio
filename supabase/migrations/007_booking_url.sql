-- Add booking_url column to practices table
ALTER TABLE practices ADD COLUMN IF NOT EXISTS booking_url text;
