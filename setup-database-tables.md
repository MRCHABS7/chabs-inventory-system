# 📊 DATABASE SETUP INSTRUCTIONS

## After updating your Supabase credentials:

### 1. Go to Supabase SQL Editor
- Open your Supabase project dashboard
- Click "SQL Editor" in the left sidebar
- Click "New query"

### 2. Copy Database Setup Script
- Open the file: `supabase-setup-simple.sql`
- Copy ALL the content (Ctrl+A, Ctrl+C)

### 3. Run the Script
- Paste the content into Supabase SQL Editor
- Click "Run" (bottom right corner)
- Wait for "Success. No rows returned" message

### 4. Verify Tables Created
- Go to "Table Editor" in left sidebar
- You should see these tables:
  - products
  - customers
  - suppliers
  - orders
  - quotations
  - purchase_orders
  - (and their related tables)

## ✅ Success Indicators:
- "Success. No rows returned" message in SQL Editor
- Tables visible in Table Editor
- Sample data inserted (2 products, 1 customer)

## ❌ If You Get Errors:
- Make sure you copied the ENTIRE script
- Check that your Supabase project is fully initialized
- Try running the script in smaller chunks if needed