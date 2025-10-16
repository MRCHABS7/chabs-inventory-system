# 🚀 Deployment Guide

## Quick Deploy (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create new project
3. Wait for database to initialize
4. Go to Settings → API
5. Copy your URL and anon key

### 2. Deploy to Vercel
1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
5. Deploy!

### 3. Set Up Database Tables
Run these SQL commands in Supabase SQL Editor:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table  
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_id UUID,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add more tables as needed...
```

## 🌐 Custom Domain Setup

### Add Your Domain (Free on Vercel)
1. **Buy domain** from any registrar (Namecheap, GoDaddy, etc.)
2. **In Vercel**: Project → Settings → Domains
3. **Add domain**: Enter your domain name
4. **Update DNS**: Follow Vercel's instructions
5. **SSL**: Automatically configured

### Professional URLs:
- `yourbusiness.com` - Main application
- `api.yourbusiness.com` - API endpoint (if needed)
- `staging.yourbusiness.com` - Testing environment

## 📈 Scaling Path

### Free Tier Limits:
- **Users**: ~10,000 monthly active users
- **Database**: 500MB storage
- **Bandwidth**: 100GB/month
- **Custom Domain**: ✅ Included FREE

### When to Upgrade:
- **Pro ($45/month total)**: 100,000+ users, 8GB database
- **Enterprise**: Custom pricing for millions of users

### Total Costs:
- **Free tier**: $10-15/year (just domain cost)
- **Pro tier**: $45/month + domain
- **Enterprise**: Custom pricing

### Migration Strategy:
1. **Start**: Free tier (perfect for MVP)
2. **Growth**: Pro tier (handles most businesses)  
3. **Scale**: Enterprise (unlimited growth)

Your app is designed to scale seamlessly - just upgrade your plan when needed!