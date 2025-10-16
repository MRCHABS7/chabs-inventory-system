# 🚀 SUPABASE SETUP GUIDE

## Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login (free)
3. Click "New Project"
4. Choose organization and region
5. Set database password (save this!)
6. Wait 2 minutes for setup

### 2. Get Your Credentials
1. Go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public key**

### 3. Update Your Environment
Edit your `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Database Tables
1. Go to **SQL Editor** in Supabase
2. Copy the contents of `supabase-setup.sql`
3. Paste and click **Run**
4. Wait for "Success" message

### 5. Enable Authentication (Optional)
1. Go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Set **Site URL** to your Netlify domain
4. Add **Redirect URLs** for your domain

### 6. Test Your Setup
1. Run `npm run dev`
2. Your app now has cloud database backup!
3. Data syncs between local storage and Supabase

## 🎯 What You Get

### Free Tier Includes:
- **500MB database** storage
- **5GB bandwidth** per month
- **50MB file** storage
- **100,000 monthly** active users
- **Unlimited API** requests

### Features:
- ✅ **Real-time sync** across devices
- ✅ **Automatic backups**
- ✅ **User authentication**
- ✅ **Row-level security**
- ✅ **REST API** auto-generated
- ✅ **Dashboard** for data management

## 🔄 How It Works

Your app uses **hybrid storage**:
- **Local Storage**: Fast, works offline
- **Supabase**: Cloud backup, sync across devices
- **Automatic sync**: Best of both worlds

## 🛠️ Advanced Configuration

### Custom Domain
Add your custom domain in:
- **Settings** → **General** → **Custom domains**

### Email Templates
Customize in:
- **Authentication** → **Email Templates**

### Database Backups
Automatic daily backups included in free tier.

### API Access
Your database is accessible via:
- REST API: `https://your-project.supabase.co/rest/v1/`
- GraphQL: Available as extension

## 🚨 Security Notes

### Row Level Security (RLS)
- Already enabled on all tables
- Only authenticated users can access data
- Customize policies in SQL Editor

### Environment Variables
- Never commit `.env.local` to git
- Use Netlify environment variables for production

### API Keys
- **anon key**: Safe for client-side use
- **service_role key**: Server-side only (keep secret!)

## 📊 Monitoring

### Usage Dashboard
Monitor your usage in:
- **Settings** → **Usage**

### Logs
View real-time logs in:
- **Logs** → **API Logs**

## 🆘 Troubleshooting

### Connection Issues
```bash
# Test connection
curl https://your-project.supabase.co/rest/v1/products \
  -H "apikey: your-anon-key"
```

### Common Errors
- **401 Unauthorized**: Check your API key
- **404 Not Found**: Verify your project URL
- **403 Forbidden**: Check RLS policies

### Support
- [Supabase Docs](https://supabase.com/docs)
- [Community Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase)

---

**Your system is now enterprise-ready with cloud database backup!** 🎉