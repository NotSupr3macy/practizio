-- Add booking_url column to practices table
ALTER TABLE practices ADD COLUMN IF NOT EXISTS booking_url text;

-- Add show_price column to services table (was missing, causing service insert failures)
ALTER TABLE services ADD COLUMN IF NOT EXISTS show_price boolean DEFAULT true;
