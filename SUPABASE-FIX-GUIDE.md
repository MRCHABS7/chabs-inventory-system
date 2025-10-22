# Fix Supabase Security Issues

## Issues Found:
1. **Auth RLS Initialization Plan** - Performance warnings on all tables
2. **Leaked Password Protection Disabled** - Security warning

## How to Fix:

### Step 1: Fix RLS Performance Issues

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `supabase-rls-fix.sql`
5. Click **Run** or press `Ctrl+Enter`

### Step 2: Enable Leaked Password Protection

1. In Supabase Dashboard, go to **Authentication** (left sidebar)
2. Click on **Settings** tab
3. Scroll down to **Security and Protection**
4. Find **Leaked Password Protection**
5. Toggle it **ON**
6. Click **Save**

### Step 3: Verify Fixes

1. Go back to your IDE
2. Click **Refresh** in the warnings panel
3. All warnings should be resolved

## What Changed?

The RLS policies now use `(SELECT auth.uid()) IS NOT NULL` instead of `auth.role() = 'authenticated'`. This prevents re-evaluation on each row and improves performance.

## Alternative: Public Access (Not Recommended for Production)

If you want to disable RLS temporarily for testing:

```sql
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
```

**WARNING:** Only use this for local development. Never disable RLS in production!
