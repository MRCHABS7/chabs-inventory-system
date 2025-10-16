# 🌐 NETLIFY ENVIRONMENT VARIABLES SETUP

## After Deploying to Netlify

### 1. Access Site Settings
1. Go to your Netlify dashboard
2. Click on your deployed site
3. Go to **Site settings** → **Environment variables**

### 2. Add These Variables

Click **Add variable** for each:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=CHABS
NEXT_PUBLIC_VERSION=2.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# Storage Configuration
NEXT_PUBLIC_STORAGE_MODE=hybrid
NEXT_PUBLIC_ENABLE_SYNC=true
NEXT_PUBLIC_SYNC_INTERVAL=30000

# Supabase Configuration (replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Production Settings
NODE_ENV=production
```

### 3. Redeploy
After adding variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy**
3. Your site will rebuild with the new environment variables

### 4. Test Your Live Site
- Your live site now has cloud database integration
- Data syncs between local storage and Supabase
- Works offline and online

## 🎯 Quick Summary

**Your deployment stack:**
- **Frontend**: Netlify (free, no restrictions)
- **Database**: Supabase (free tier)
- **Storage**: Hybrid (local + cloud)
- **Domain**: Custom domain supported
- **SSL**: Automatic HTTPS

**Perfect for small companies!** 🚀