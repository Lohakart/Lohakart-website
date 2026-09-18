-- =====================================================
-- Fix Recycling Request Deletion for Admin
-- =====================================================
-- Problem: Admin cannot delete recycling requests
-- Solution: Add DELETE policy for authenticated users (admins)
-- =====================================================

-- Step 1: Check current RLS policies on recycling_requests table
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'recycling_requests';

-- Step 2: Drop existing DELETE policy if it exists
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON recycling_requests;
DROP POLICY IF EXISTS "Admins can delete recycling requests" ON recycling_requests;

-- Step 3: Create DELETE policy for authenticated users (including admins)
CREATE POLICY "Enable delete for authenticated users"
ON recycling_requests
FOR DELETE
TO authenticated
USING (true);

-- Alternative: If you want to restrict to only admin users
-- Uncomment the following and comment out the above policy if you have an is_admin column

-- CREATE POLICY "Admins can delete recycling requests"
-- ON recycling_requests
-- FOR DELETE
-- TO authenticated
-- USING (
--   auth.uid() IN (
--     SELECT user_id FROM user_roles WHERE role = 'admin'
--   )
-- );

-- Step 4: Verify the new policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'recycling_requests'
ORDER BY policyname;

-- =====================================================
-- IMPORTANT: Run this SQL in Supabase SQL Editor
-- Path: Supabase Dashboard > SQL Editor > New Query
-- =====================================================
