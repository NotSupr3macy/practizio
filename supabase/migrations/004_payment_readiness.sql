-- ---------------------------------------------------------------------------
-- 004: Payment Readiness
-- Adds pricing data to services, payment fields to practices & appointments
-- ---------------------------------------------------------------------------

-- Services: add pricing JSONB column
ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing JSONB DEFAULT '{
  "price": null,
  "currency": "USD",
  "priceType": "fixed",
  "depositRequired": false,
  "depositAmount": null,
  "paymentTiming": "at_service"
}'::jsonb;

-- Practices: add payment-related columns
ALTER TABLE practices ADD COLUMN IF NOT EXISTS payment_url TEXT DEFAULT NULL;
ALTER TABLE practices ADD COLUMN IF NOT EXISTS default_hold_minutes INTEGER DEFAULT 15;
ALTER TABLE practices ADD COLUMN IF NOT EXISTS stripe_connect_account_id TEXT DEFAULT NULL;

-- Appointments: add payment tracking columns
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_required BOOLEAN DEFAULT FALSE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2) DEFAULT NULL;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) DEFAULT NULL;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_url TEXT DEFAULT NULL;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_deadline TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS booking_status VARCHAR(20) DEFAULT 'confirmed';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT NULL;

-- booking_status: 'confirmed', 'pending_payment', 'pending_approval', 'payment_expired', 'cancelled'
-- payment_status: NULL (no payment needed), 'pending', 'completed', 'expired', 'refunded'
