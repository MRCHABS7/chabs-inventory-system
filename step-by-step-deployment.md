# 🚀 Step-by-Step Deployment Guide

## STEP 2: GitHub Setup (5 minutes)

### 2.1 Create New GitHub Repository
1. **Go to GitHub**: https://github.com
2. **Sign in** with your account
3. **Click the green "New" button** (top left)
4. **Repository name**: `chabs-inventory-system-v2`
5. **Description**: `CHABS Inventory Management System with Enhanced Search`
6. **Set to Public** (or Private if you prefer)
7. **DON'T check** "Add a README file" (we already have one)
8. **Click "Create repository"**

### 2.2 Connect Your Local Code to GitHub
Open your terminal in the project folder and run these commands:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/chabs-inventory-system-v2.git

# Rename branch to main
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### 2.3 Verify Upload
- Refresh your GitHub repository page
- You should see all your files uploaded
- Check that you have 180+ files including src/ folder

---

## STEP 3: Supabase Database Setup (10 minutes)

### 3.1 Create New Supabase Project
1. **Go to Supabase**: https://supabase.com
2. **Sign in** with your account
3. **Click "New Project"**
4. **Organization**: Select your organization
5. **Project Name**: `chabs-inventory-v2`
6. **Database Password**: Create a strong password (save it!)
7. **Region**: Choose closest to you
8. **Click "Create new project"**
9. **Wait 2-3 minutes** for setup to complete

### 3.2 Get Your Supabase Credentials
1. **In your new project dashboard**
2. **Click "Settings"** (left sidebar)
3. **Click "API"**
4. **Copy these values**:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3.3 Setup Database Tables
1. **Click "SQL Editor"** (left sidebar)
2. **Click "New Query"**
3. **Copy the entire contents** of `supabase-setup-simple.sql`
4. **Paste into the query editor**
5. **Click "Run"** (bottom right)
6. **Verify**: You should see "Success. No rows returned"

---

## STEP 4: Update Environment Variables (2 minutes)

### 4.1 Update Your Local .env.local File
Open `.env.local` and update these lines with your NEW Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_NEW_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
NEXT_PUBLIC_ENVIRONMENT=production
```

### 4.2 Test Supabase Connection
```bash
node simple-supabase-test.js
```
**Expected output**: `✅ HTTP Status: 200`

---

## STEP 5: Netlify Deployment (5 minutes)

### 5.1 Deploy to Netlify
1. **Go to Netlify**: https://netlify.com
2. **Sign in** with your account (use GitHub login if possible)
3. **Click "Add new site"**
4. **Click "Import an existing project"**
5. **Click "Deploy with GitHub"**
6. **Authorize Netlify** to access your GitHub
7. **Select your repository**: `chabs-inventory-system-v2`
8. **Build settings** (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `.next`
9. **Click "Deploy site"**

### 5.2 Wait for Initial Deploy
- **Watch the deploy log** (it will take 3-5 minutes)
- **You'll see**: "Site deploy in progress..."
- **Wait for**: "Site is live" ✅

### 5.3 Add Environment Variables to Netlify
1. **In Netlify dashboard**, click your site name
2. **Click "Site settings"**
3. **Click "Environment variables"** (left sidebar)
4. **Click "Add a variable"** and add each of these:

```
NEXT_PUBLIC_APP_NAME = CHABS
NEXT_PUBLIC_VERSION = 2.0.0
NEXT_PUBLIC_ENVIRONMENT = production
NEXT_PUBLIC_STORAGE_MODE = hybrid
NEXT_PUBLIC_ENABLE_SYNC = true
NEXT_PUBLIC_SYNC_INTERVAL = 30000
NEXT_PUBLIC_SUPABASE_URL = [YOUR NEW SUPABASE URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [YOUR NEW SUPABASE KEY]
NODE_ENV = production
```

### 5.4 Redeploy with Environment Variables
1. **Click "Deploys"** tab
2. **Click "Trigger deploy"**
3. **Click "Deploy site"**
4. **Wait for completion** (2-3 minutes)

---

## STEP 6: Test Your Live Site (3 minutes)

### 6.1 Access Your Site
- **Click your site URL** (something like `https://amazing-name-123456.netlify.app`)
- **You should see**: CHABS login page

### 6.2 Test Basic Functionality
1. **Login**: Use any email/password (e.g., `admin@test.com` / `password`)
2. **Go to Products**: Click "View All" button
3. **Add a product**: Test the form
4. **Go to Customers**: Click "View All" button
5. **Test search**: Type "h" in product search

### 6.3 Test New Search Features
1. **Products page**: Try "View All" and search functionality
2. **Customers page**: Try "View All" and search
3. **Quotations page**: Try "View All" and search
4. **Quote builder**: Test product search with partial names

---

## 🎉 SUCCESS! Your Site is Live

**Your CHABS system is now deployed with enhanced search functionality!**

**Site URL**: `https://your-site-name.netlify.app`

---

## 🆘 If Something Goes Wrong

### Build Fails:
```bash
# Run this locally to check for errors
npm run build
```

### Site Loads but No Data:
- Check Supabase credentials in Netlify environment variables
- Verify database tables were created

### Search Not Working:
- Check browser console for JavaScript errors
- Verify all environment variables are set

---

## 📞 Next Steps After Deployment

1. **Bookmark your site URL**
2. **Test all the new search features**
3. **Add some sample data**
4. **Share with users**
5. **Monitor usage in Netlify analytics**

**Total time**: ~25 minutes
**Cost**: $0 (everything is free tier)