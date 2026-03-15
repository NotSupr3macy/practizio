-- Migration 006: Security - Enable RLS on all tables
-- This locks down all tables so only authorized users can access their own data.
-- The MCP endpoint and admin dashboard use createAdminClient() (service role key)
-- which bypasses RLS by design.

-- ============================================
-- PRACTICES TABLE
-- ============================================
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;

-- Business owners can read their own practice
CREATE POLICY "Users can view own practice" ON practices
  FOR SELECT USING (user_id = auth.uid());

-- Business owners can update their own practice
CREATE POLICY "Users can update own practice" ON practices
  FOR UPDATE USING (user_id = auth.uid());

-- Business owners can insert their own practice (during onboarding)
CREATE POLICY "Users can insert own practice" ON practices
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Public read for active practices (directory listing)
-- This allows the directory page (client-side) to show active businesses
CREATE POLICY "Public can view active practices" ON practices
  FOR SELECT USING (is_active = true);

-- ============================================
-- SERVICES TABLE
-- ============================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Business owners can CRUD their own services
CREATE POLICY "Users can view own services" ON services
  FOR SELECT USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own services" ON services
  FOR INSERT WITH CHECK (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own services" ON services
  FOR UPDATE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own services" ON services
  FOR DELETE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

-- ============================================
-- AVAILABILITY TABLE
-- ============================================
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own availability" ON availability
  FOR SELECT USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own availability" ON availability
  FOR INSERT WITH CHECK (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own availability" ON availability
  FOR UPDATE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own availability" ON availability
  FOR DELETE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

-- ============================================
-- PROVIDERS TABLE
-- ============================================
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own providers" ON providers
  FOR SELECT USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own providers" ON providers
  FOR INSERT WITH CHECK (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own providers" ON providers
  FOR UPDATE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own providers" ON providers
  FOR DELETE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Business owners can view their own appointments
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

-- Business owners can update their own appointments (status changes, etc.)
CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

-- No public INSERT policy — appointments are created via MCP (service role)
-- No public DELETE policy — appointments managed via MCP or dashboard

-- ============================================
-- AI_QUERIES TABLE (audit log)
-- ============================================
ALTER TABLE ai_queries ENABLE ROW LEVEL SECURITY;

-- Business owners can view their own AI query logs
CREATE POLICY "Users can view own ai_queries" ON ai_queries
  FOR SELECT USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

-- No public INSERT — only service role (MCP endpoint) writes here

-- ============================================
-- CATALOG_ITEMS TABLE
-- ============================================
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own catalog_items" ON catalog_items
  FOR SELECT USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own catalog_items" ON catalog_items
  FOR INSERT WITH CHECK (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own catalog_items" ON catalog_items
  FOR UPDATE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own catalog_items" ON catalog_items
  FOR DELETE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

-- ============================================
-- ORDERS TABLE
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (
    practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid())
  );

-- No public INSERT — orders created via MCP (service role)

-- ============================================
-- ORDER_ITEMS TABLE
-- ============================================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order_items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE practice_id IN (
        SELECT id FROM practices WHERE user_id = auth.uid()
      )
    )
  );

-- No public INSERT/UPDATE/DELETE — managed via MCP (service role)
