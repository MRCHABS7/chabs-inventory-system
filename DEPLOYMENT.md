# 🚀 Deployment Guide

## Quick Deployment Steps

### 1. Push to GitHub
```bash
git remote add origin https://github.com/yourusername/chabs-inventory.git
git push -u origin main
```

### 2. Setup Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Run SQL from `supabase-setup.sql` in SQL Editor
3. Get your Project URL and API Key from Settings → API

### 3. Deploy to Netlify
1. Connect GitHub repo at [netlify.com](https://netlify.com)
2. Add environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   NEXT_PUBLIC_APP_NAME=CHABS
   NEXT_PUBLIC_VERSION=2.0.0
   NEXT_PUBLIC_ENVIRONMENT=production
   NEXT_PUBLIC_STORAGE_MODE=hybrid
   NODE_ENV=production
   ```
3. Deploy!

### 4. Test
- Login: admin@chabs.com / admin123
- Test all features work

## Local Development
```bash
npm install
npm run dev
```

Your CHABS system will be live in minutes! 🎉