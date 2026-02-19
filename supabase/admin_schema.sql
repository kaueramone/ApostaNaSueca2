-- Add 'role' and 'is_banned' columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- Create policy for Admin to update profiles (if not using Service Role in server actions)
-- For now, we rely on Server Actions using Service Role (createClient with admin rights? No, usually we use standard client + RLS or Service Role).
-- Since I don't have Service Role key in env for 'createClient', I must rely on RLS or the user being an admin.
-- Let's assume the user running the dashboard IS an admin in RLS.

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update profiles"
ON profiles
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Policy: Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
ON transactions
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Initial Admin Setup (You need to run this manually for your user)
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
