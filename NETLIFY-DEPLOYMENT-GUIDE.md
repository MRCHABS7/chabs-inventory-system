# 🚀 NETLIFY DEPLOYMENT GUIDE

## PART 3: DEPLOY TO NETLIFY

### STEP 7: Prepare Your Code for Deployment

1. **Build Test (Local)**
   ```bash
   npm run build
   ```
   ✅ Should complete without errors

2. **Commit Your Code**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment with Supabase"
   git push
   ```

### STEP 8: Deploy to Netlify

1. **Go to Netlify**
   - Open: https://netlify.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your repository
   - Click "Deploy site"

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

### STEP 9: Add Environment Variables to Netlify

1. **Go to Site Settings**
   - In your Netlify dashboard
   - Click "Site settings"
   - Click "Environment variables"

2. **Add These Variables:**
   ```
   NEXT_PUBLIC_APP_NAME = CHABS
   NEXT_PUBLIC_VERSION = 2.0.0
   NEXT_PUBLIC_ENVIRONMENT = production
   NEXT_PUBLIC_STORAGE_MODE = hybrid
   NEXT_PUBLIC_ENABLE_SYNC = true
   NEXT_PUBLIC_SYNC_INTERVAL = 30000
   NEXT_PUBLIC_SUPABASE_URL = [YOUR SUPABASE URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [YOUR SUPABASE KEY]
   NODE_ENV = production
   ```

3. **Redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

### STEP 10: Test Your Live Site

1. **Check Deployment**
   - Wait for "Published" status
   - Click on your site URL

2. **Test Features**
   - Login with any email/password
   - Add a product
   - Create a customer
   - Generate a quotation

### STEP 11: Custom Domain (Optional)

1. **Buy Domain** (from any registrar)
2. **Add to Netlify**
   - Site settings → Domain management
   - Add custom domain
   - Follow DNS instructions
3. **SSL Certificate** (automatic)

---

## 🎉 YOUR SITE IS LIVE!

Your CHABS Inventory System will be available at:
- **Netlify URL**: https://your-site-name.netlify.app
- **Custom Domain**: https://yourdomain.com (if added)

## 📊 What You Get:

✅ **Professional inventory management system**
✅ **Cloud database with Supabase**
✅ **Automatic backups**
✅ **Mobile-responsive design**
✅ **PDF generation for quotes/invoices**
✅ **Real-time data sync**
✅ **Free hosting on Netlify**
✅ **SSL certificate included**

## 🔧 Troubleshooting:

- **Build fails**: Check environment variables
- **Site loads but no data**: Verify Supabase connection
- **404 errors**: Check netlify.toml redirects
- **Slow loading**: Enable Netlify's asset optimization