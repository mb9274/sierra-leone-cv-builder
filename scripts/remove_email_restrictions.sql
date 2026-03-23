-- Remove any email restrictions from authentication
-- This script ensures all users can sign up with any email

-- First, let's check if there are any restrictive RLS policies
SELECT policyname, definition FROM pg_policies WHERE tablename = 'users';

-- If there are restrictive policies, remove them
DO $$ 
BEGIN
    -- Remove any policies that restrict email domains
    DELETE FROM pg_policies WHERE tablename = 'users' AND definition LIKE '%email%';
    
    -- Ensure users table allows all sign-ups
    DROP POLICY IF EXISTS "users_insert_policy";
    DROP POLICY IF EXISTS "users_update_policy";
    DROP POLICY IF EXISTS "users_delete_policy";
    
    -- Create permissive policies that allow all users
    CREATE POLICY "users_insert_policy" ON users
    FOR INSERT
    TO PUBLIC
    WITH CHECK (true);
    
    CREATE POLICY "users_update_policy" ON users
    FOR UPDATE
    TO PUBLIC
    USING (auth.uid() = id)
    WITH CHECK (true);
    
    CREATE POLICY "users_delete_policy" ON users
    FOR DELETE
    TO PUBLIC
    USING (auth.uid() = id)
    WITH CHECK (true);
    
    RAISE NOTICE 'Email restrictions removed. All users can now sign up.';
END $$;

-- Also ensure auth.users table has no restrictions
DO $$
BEGIN
    -- Drop any restrictive policies on auth.users
    DROP POLICY IF EXISTS "auth.users_insert_policy";
    DROP POLICY IF EXISTS "auth.users_update_policy"; 
    DROP POLICY IF EXISTS "auth.users_delete_policy";
    
    -- Create permissive policies
    CREATE POLICY "auth.users_insert_policy" ON auth.users
    FOR INSERT
    TO PUBLIC
    WITH CHECK (true);
    
    CREATE POLICY "auth.users_update_policy" ON auth.users
    FOR UPDATE
    TO PUBLIC
    USING (auth.uid() = id)
    WITH CHECK (true);
    
    CREATE POLICY "auth.users_delete_policy" ON auth.users
    FOR DELETE
    TO PUBLIC
    USING (auth.uid() = id)
    WITH CHECK (true);
    
    RAISE NOTICE 'Auth.users restrictions removed. All users can now sign up.';
END $$;

-- Grant necessary permissions
GRANT ALL ON users TO PUBLIC;
GRANT ALL ON auth.users TO PUBLIC;

COMMIT;
