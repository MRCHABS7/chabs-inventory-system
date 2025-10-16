# CHABS Inventory Management System

A comprehensive business management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Customer Management** - Complete customer database
- **Product Inventory** - SKU tracking, stock levels, categories  
- **Quotation System** - Professional quotes with PDF export
- **Order Management** - Convert quotes to orders, track status
- **Purchase Orders** - Supplier management and ordering
- **Warehouse Management** - Stock movements, locations, picking lists
- **Email Integration** - Send quotes and orders via email
- **User Management** - Multi-user with role-based access
- **Dark/Light Themes** - Modern, accessible interface

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Login:**
   - Email: `admin@chabs.com`
   - Password: `admin123`

## Deployment

### GitHub + Supabase + Netlify

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/yourusername/chabs-inventory.git
   git push -u origin main
   ```

2. **Setup Supabase:**
   - Create project at [supabase.com](https://supabase.com)
   - Run SQL from `supabase-setup.sql`
   - Get your URL and API key

3. **Deploy to Netlify:**
   - Connect GitHub repo at [netlify.com](https://netlify.com)
   - Add environment variables:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
     ```

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Netlify
- **PDF Generation:** jsPDF
- **Authentication:** JWT-based

## License

MIT License