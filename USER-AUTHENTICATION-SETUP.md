# 🔐 User Authentication Setup Guide

## What Changed
Your system now supports **real user accounts** with individual login credentials instead of demo accounts.

## Setup Steps

### 1. Enable Email Authentication in Supabase
1. Go to your Supabase project dashboard
2. Click **Authentication** → **Settings**
3. Make sure **Enable email confirmations** is turned ON
4. Set your **Site URL** to your Netlify domain (e.g., `https://your-site.netlify.app`)

### 2. Update Database (Run in Supabase SQL Editor)
```sql
-- Update policies for authenticated users
DROP POLICY IF EXISTS "Allow all operations" ON customers;
DROP POLICY IF EXISTS "Allow all operations" ON products;
DROP POLICY IF EXISTS "Allow all operations" ON quotations;
DROP POLICY IF EXISTS "Allow all operations" ON orders;
DROP POLICY IF EXISTS "Allow all operations" ON suppliers;

CREATE POLICY "Authenticated users can access customers" ON customers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access quotations" ON quotations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access suppliers" ON suppliers FOR ALL USING (auth.role() = 'authenticated');
```

### 3. Deploy Changes
```bash
git add .
git commit -m "Added user authentication system"
git push origin main
```

### 4. Create Your Admin Account
1. Visit your live site
2. Click **"Don't have an account? Sign up"**
3. Create account with:
   - Your email
   - Strong password
   - Role: **Admin**
4. Check your email and verify account

### 5. Make Yourself Admin (Optional)
Run this in Supabase SQL Editor (replace with your email):
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}' 
WHERE email = 'your-email@example.com';
```

## How It Works Now

### For Users:
- **Sign Up**: New users create accounts with email/password
- **Sign In**: Users login with their credentials
- **Roles**: Admin, Manager, or User access levels
- **Security**: All data requires authentication

### For You (Admin):
- **User Management**: See all registered users
- **Role Control**: Assign user roles and permissions
- **Data Security**: Each user has secure access to business data

## User Roles
- **Admin**: Full system access, user management
- **Manager**: Business operations, reports, settings
- **User**: Basic access to customers, products, quotes

Your system is now ready for multiple users with secure authentication! 🎉