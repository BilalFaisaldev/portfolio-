-- ==========================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) LOCKDOWN PATCH
-- Paste this entire SQL into your Supabase SQL Editor and click "RUN"
-- This ensures ONLY authenticated Admin users can Edit/Delete/Insert,
-- while public visitors can only View portfolio and Submit inquiries.
-- ==========================================================================

-- 1. Enable RLS on all tables
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing permissive policies
DROP POLICY IF EXISTS "Public can read personal_info" ON personal_info;
DROP POLICY IF EXISTS "Public can read projects" ON projects;
DROP POLICY IF EXISTS "Public can read services" ON services;
DROP POLICY IF EXISTS "Public can read process_steps" ON process_steps;
DROP POLICY IF EXISTS "Public can read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can submit messages" ON messages;

DROP POLICY IF EXISTS "Anon full access personal_info" ON personal_info;
DROP POLICY IF EXISTS "Anon full access projects" ON projects;
DROP POLICY IF EXISTS "Anon full access services" ON services;
DROP POLICY IF EXISTS "Anon full access process_steps" ON process_steps;
DROP POLICY IF EXISTS "Anon full access testimonials" ON testimonials;
DROP POLICY IF EXISTS "Anon full access messages" ON messages;

DROP POLICY IF EXISTS "Authenticated admin manage personal_info" ON personal_info;
DROP POLICY IF EXISTS "Authenticated admin manage projects" ON projects;
DROP POLICY IF EXISTS "Authenticated admin manage services" ON services;
DROP POLICY IF EXISTS "Authenticated admin manage process_steps" ON process_steps;
DROP POLICY IF EXISTS "Authenticated admin manage testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated admin manage messages" ON messages;

-- ==========================================================================
-- 3. PUBLIC POLICIES (Read-Only for visitors, Insert-Only for contact form)
-- ==========================================================================

-- Public can read portfolio data
CREATE POLICY "Public can read personal_info" 
  ON personal_info FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Public can read projects" 
  ON projects FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Public can read services" 
  ON services FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Public can read process_steps" 
  ON process_steps FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Public can read testimonials" 
  ON testimonials FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Public can ONLY submit messages (Visitors CANNOT read other people's messages!)
CREATE POLICY "Public can submit messages" 
  ON messages FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- ==========================================================================
-- 4. AUTHENTICATED ADMIN POLICIES (Full CRUD access for logged-in admin)
-- ==========================================================================

-- Admin full control on personal info
CREATE POLICY "Authenticated admin manage personal_info" 
  ON personal_info FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Admin full control on projects
CREATE POLICY "Authenticated admin manage projects" 
  ON projects FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Admin full control on services
CREATE POLICY "Authenticated admin manage services" 
  ON services FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Admin full control on process steps
CREATE POLICY "Authenticated admin manage process_steps" 
  ON process_steps FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Admin full control on testimonials
CREATE POLICY "Authenticated admin manage testimonials" 
  ON testimonials FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Admin full control on messages (Read, Delete, Mark as Read)
CREATE POLICY "Authenticated admin manage messages" 
  ON messages FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);
