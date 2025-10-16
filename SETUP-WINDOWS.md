# 🚀 Windows Setup Guide

## Step 1: Install Git
1. **Download Git**: Go to [git-scm.com](https://git-scm.com/download/win)
2. **Install**: Run the installer with default settings
3. **Restart**: Close and reopen your terminal/PowerShell

## Step 2: Verify Installation
```bash
git --version
```

## Step 3: Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 4: Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit - CHABS Inventory System"
```

## Step 5: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `chabs-inventory-system` (recommended)
4. Make it **Public** (required for free Vercel)
5. Don't initialize with README (we already have files)
6. Click "Create repository"

## Step 6: Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/chabs-inventory-system.git
git branch -M main
git push -u origin main
```

## Step 7: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Import Project"
4. Select your `chabs-inventory-system` repository
5. Click "Deploy"

## Step 8: Set Up Supabase
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create new project
3. Name it: `chabs-inventory`
4. Wait for database to initialize (2-3 minutes)
5. Go to Settings → API
6. Copy your URL and anon key

## Step 9: Add Environment Variables to Vercel
1. In Vercel dashboard → Your project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
3. Redeploy your project

## Step 10: Set Up Database Tables
In Supabase SQL Editor, run:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2) DEFAULT 0,
  selling_price DECIMAL(10,2) DEFAULT 0,
  markup DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id),
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms TEXT,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quotations table
CREATE TABLE quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  items JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Purchase Orders table
CREATE TABLE purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  auto_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎉 You're Live!
Your app will be available at: `https://your-project-name.vercel.app`

## 🌐 Add Custom Domain Later
1. Buy domain from any registrar
2. In Vercel: Settings → Domains → Add domain
3. Follow DNS instructions
4. SSL automatically configured!

## 💡 Need Help?
- **Git issues**: Make sure Git is installed and restart terminal
- **GitHub**: Repository must be public for free Vercel
- **Supabase**: Wait for database initialization to complete
- **Vercel**: Environment variables are case-sensitive