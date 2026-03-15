-- Migration: Add order-based business support
-- Run this in Supabase SQL Editor

-- Add interaction_type to practices
ALTER TABLE practices ADD COLUMN IF NOT EXISTS interaction_type text DEFAULT 'appointment' CHECK (interaction_type IN ('appointment', 'order', 'hybrid'));

-- Catalog items (menu items, products, etc.)
CREATE TABLE IF NOT EXISTS catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id uuid REFERENCES practices ON DELETE CASCADE NOT NULL,
  category text,
  name text NOT NULL,
  description text,
  price integer NOT NULL, -- cents
  image_url text,
  is_available boolean DEFAULT true,
  options jsonb DEFAULT '[]', -- e.g. [{"name": "Size", "choices": ["Small", "Medium", "Large"]}]
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_catalog_items_practice_id ON catalog_items(practice_id);
CREATE INDEX IF NOT EXISTS idx_catalog_items_category ON catalog_items(category);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id uuid REFERENCES practices ON DELETE CASCADE NOT NULL,
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  subtotal integer DEFAULT 0, -- cents
  tax integer DEFAULT 0,
  total integer DEFAULT 0,
  notes text,
  ordered_by text DEFAULT 'ai_agent' CHECK (ordered_by IN ('ai_agent', 'human', 'online')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_practice_id ON orders(practice_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Order line items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders ON DELETE CASCADE NOT NULL,
  catalog_item_id uuid REFERENCES catalog_items ON DELETE SET NULL,
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price integer NOT NULL, -- cents
  options jsonb DEFAULT '{}', -- selected options e.g. {"Size": "Large"}
  notes text
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
