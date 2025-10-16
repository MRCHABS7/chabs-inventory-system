# 🚀 FRESH SUPABASE SETUP - STEP BY STEP

## STEP 1: Create New Supabase Project

1. **Go to Supabase**
   - Open: https://supabase.com
   - Click "Sign in" (or "Start your project" if new user)

2. **Create New Project**
   - Click "New Project" (green button)
   - Fill in details:
     - **Organization**: Select your organization
     - **Project name**: `chabs-inventory-system`
     - **Database password**: Create strong password (SAVE THIS!)
     - **Region**: Choose closest to your location
     - **Pricing plan**: Free
   - Click "Create new project"
   - ⏳ Wait 2-3 minutes for setup

## STEP 2: Get Your Fresh Credentials

1. **Go to Settings → API**
   - In left sidebar, click "Settings"
   - Click "API"

2. **Copy These Values:**
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc... (very long string)
   ```

## STEP 3: Update Your .env.local File

Replace the values in your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key-here
```

## STEP 4: Set Up Database Tables

1. **Go to SQL Editor**
   - In left sidebar, click "SQL Editor"
   - Click "New query"

2. **Run Database Setup**
   - Copy the entire contents of `supabase-setup-simple.sql`
   - Paste into the SQL Editor
   - Click "Run" (bottom right)
   - Wait for "Success" message

## STEP 5: Test Connection

Run this command to test:
```bash
node simple-supabase-test.js
```

You should see:
```
✅ HTTP Status: 200
🎉 Supabase connection successful!
```

---

**Once you have fresh Supabase credentials, we'll continue with the deployment!**