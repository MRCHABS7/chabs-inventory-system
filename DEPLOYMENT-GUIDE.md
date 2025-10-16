# 🚀 CHABS Deployment Guide

## Quick Deployment Options

### Option 1: Netlify (Recommended)

#### A. Automatic Deployment via GitHub
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/chabs-inventory.git
   git push -u origin main
   ```

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings are already configured in `netlify.toml`
   - Click "Deploy site"

#### B. Manual Deployment
1. **Build the project:**
   ```bash
   node deploy.js
   ```

2. **Upload to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder to Netlify

### Option 2: Vercel
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 3: Static Hosting (GitHub Pages, etc.)
1. **Build:**
   ```bash
   npm run deploy
   ```

2. **Upload the `out` folder** to your static hosting provider

## Environment Variables for Production

Set these in your hosting platform:

```env
NEXT_PUBLIC_APP_NAME=CHABS
NEXT_PUBLIC_VERSION=2.0.0
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_STORAGE_MODE=hybrid
NEXT_PUBLIC_ENABLE_SYNC=true
NEXT_PUBLIC_SYNC_INTERVAL=30000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Pre-Deployment Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] Export successful (`npm run export`)
- [ ] Environment variables configured
- [ ] Supabase database setup (if using)
- [ ] Domain configured (optional)

## Post-Deployment Steps

1. **Test the application:**
   - Login with: admin@chabs.com / admin123
   - Test key features: customers, products, quotations

2. **Configure email (optional):**
   - Go to Settings → Email
   - Configure SMTP, SendGrid, or Mailgun

3. **Setup users:**
   - Create additional user accounts
   - Configure roles and permissions

## Troubleshooting

### Build Issues
- Clear cache: `rm -rf .next out`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Runtime Issues
- Check browser console for errors
- Verify environment variables
- Check Supabase connection

### Performance
- Enable caching headers (already configured)
- Use CDN for static assets
- Monitor Core Web Vitals

## Support

- 📧 Email: support@chabs.com
- 📖 Documentation: Check README.md
- 🐛 Issues: Create GitHub issue

---

**Your CHABS Inventory Management System is ready for deployment! 🎉**