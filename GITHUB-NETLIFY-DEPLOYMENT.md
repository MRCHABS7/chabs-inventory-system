# 🚀 GitHub + Netlify Deployment Guide

## Step 1: Push to GitHub

### Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Repository name: `chabs-inventory-system`
4. Description: `CHABS Inventory Management System v2.0.0`
5. Set to **Public** or **Private**
6. **Don't** initialize with README (we already have files)
7. Click "Create repository"

### Push Your Code
```bash
# Add all files
git add .

# Commit
git commit -m "CHABS v2.0.0 - Complete inventory management system"

# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/chabs-inventory-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Netlify

### Connect GitHub to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub
5. Select your `chabs-inventory-system` repository

### Configure Build Settings
Netlify will auto-detect your settings from `netlify.toml`, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: `18`

### Set Environment Variables
In Netlify dashboard, go to **Site settings → Environment variables**:

```env
NEXT_PUBLIC_APP_NAME=CHABS
NEXT_PUBLIC_VERSION=2.0.0
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_STORAGE_MODE=hybrid
NEXT_PUBLIC_ENABLE_SYNC=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=production
```

### Deploy
1. Click "Deploy site"
2. Wait for build to complete (2-3 minutes)
3. Your site will be live at `https://random-name-123.netlify.app`

### Custom Domain (Optional)
1. Go to **Site settings → Domain management**
2. Click "Add custom domain"
3. Enter your domain (e.g., `chabs-inventory.com`)
4. Follow DNS configuration instructions

## Step 3: Automatic Deployments

Now every time you push to GitHub:
1. Netlify automatically detects changes
2. Builds your project
3. Deploys the updated version
4. Your site updates automatically!

## Step 4: Test Your Deployment

Visit your Netlify URL and test:
1. **Login**: admin@chabs.com / admin123
2. **Dashboard**: Check all widgets load
3. **Customers**: Add a new customer
4. **Products**: Add a new product
5. **Quotations**: Create a quote
6. **Database**: Verify data saves to Supabase

## 🎉 You're Live!

Your CHABS system is now:
- ✅ Hosted on Netlify
- ✅ Code managed on GitHub
- ✅ Database on Supabase
- ✅ Auto-deployments enabled
- ✅ SSL certificate included
- ✅ CDN optimized

## Quick Commands Reference

```bash
# Make changes and deploy
git add .
git commit -m "Your update message"
git push

# Check deployment status
# Visit your Netlify dashboard

# View logs
# Check Netlify build logs for any issues
```

## Troubleshooting

### Build Fails
- Check Netlify build logs
- Verify environment variables
- Test build locally: `npm run build`

### App Doesn't Load
- Check browser console
- Verify Supabase credentials
- Check network requests

### Database Issues
- Verify Supabase connection
- Check RLS policies
- Review SQL setup

---

**Your CHABS Inventory Management System is now live! 🚀**