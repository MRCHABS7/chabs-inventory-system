-- Fix RLS Performance Issues
-- Run this in your Supabase SQL Editor to fix the warnings

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can access customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can access products" ON products;
DROP POLICY IF EXISTS "Authenticated users can access quotations" ON quotations;
DROP POLICY IF EXISTS "Authenticated users can access orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can access suppliers" ON suppliers;

-- Create optimized policies using select auth.<function>()
CREATE POLICY "Enable all for authenticated users" ON customers
  FOR ALL USING (
    (SELECT auth.uid()) IS NOT NULL
  );

CREATE POLICY "Enable all for authenticated users" ON products
  FOR ALL USING (
    (SELECT auth.uid()) IS NOT NULL
  );

CREATE POLICY "Enable all for authenticated users" ON quotations
  FOR ALL USING (
    (SELECT auth.uid()) IS NOT NULL
  );

CREATE POLICY "Enable all for authenticated users" ON orders
  FOR ALL USING (
    (SELECT auth.uid()) IS NOT NULL
  );

CREATE POLICY "Enable all for authenticated users" ON suppliers
  FOR ALL USING (
    (SELECT auth.uid()) IS NOT NULL
  );

-- Enable leaked password protection
-- Go to: Authentication > Settings > Enable "Leaked Password Protection"
-- Or run this if you have access:
-- This setting is typically enabled via the Supabase Dashboard UI
