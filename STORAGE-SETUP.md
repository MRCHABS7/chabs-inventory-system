# CHABS Storage System Setup Guide

## 🎯 Overview

CHABS now supports three storage modes:
1. **Local Storage** - Perfect for development and testing
2. **Cloud Storage** - Production-ready with Supabase
3. **Hybrid Mode** - Automatically switches between local and cloud

## 🚀 Quick Start

### Option 1: Enhanced Local Storage (Recommended for Testing)

```bash
# No setup required! Just use the system as-is
npm run dev
```

**Features:**
- ✅ Automatic backups every 5 minutes
- ✅ Data export/import functionality
- ✅ Sample data generation
- ✅ Advanced validation and logging
- ✅ Storage statistics and monitoring

### Option 2: Cloud Storage with Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your URL and anon key

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_STORAGE_MODE=cloud
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Create Database Tables**
   Run this SQL in your Supabase SQL editor:
   ```sql
   -- Products table
   CREATE TABLE products (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     sku TEXT UNIQUE NOT NULL,
     description TEXT,
     cost_price DECIMAL(10,2) NOT NULL,
     selling_price DECIMAL(10,2) NOT NULL,
     stock INTEGER DEFAULT 0,
     minimum_stock INTEGER DEFAULT 5,
     maximum_stock INTEGER DEFAULT 100,
     category TEXT DEFAULT 'General',
     location TEXT DEFAULT 'TBD',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Customers table
   CREATE TABLE customers (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT,
     phone TEXT,
     address TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Orders table
   CREATE TABLE orders (
     id TEXT PRIMARY KEY,
     order_number TEXT UNIQUE NOT NULL,
     customer_id TEXT REFERENCES customers(id),
     status TEXT DEFAULT 'pending',
     total DECIMAL(10,2) DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Order items table
   CREATE TABLE order_items (
     id SERIAL PRIMARY KEY,
     order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
     product_id TEXT REFERENCES products(id),
     quantity INTEGER NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     total DECIMAL(10,2) NOT NULL
   );

   -- Suppliers table
   CREATE TABLE suppliers (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT,
     phone TEXT,
     address TEXT,
     contact_person TEXT,
     payment_terms TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Users table
   CREATE TABLE users (
     id TEXT PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     role TEXT NOT NULL CHECK (role IN ('admin', 'warehouse')),
     username TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Option 3: Hybrid Mode (Best of Both Worlds)

```env
NEXT_PUBLIC_STORAGE_MODE=hybrid
NEXT_PUBLIC_ENABLE_SYNC=true
NEXT_PUBLIC_SYNC_INTERVAL=30000
```

**How it works:**
- 🌐 **Online**: Uses cloud storage with local backup
- 📱 **Offline**: Automatically switches to local storage
- 🔄 **Sync**: Automatically syncs data when back online

## 🎛️ Storage Manager Interface

Access the Storage Manager through:
1. Admin Settings → Storage Configuration
2. Or add `<StorageManager />` to any page

**Features:**
- Switch between storage modes instantly
- View storage statistics and health
- Create backups and export data
- Import data from JSON files
- Monitor sync status and network connectivity

## 🔧 Advanced Configuration

### Environment Variables

```env
# Storage Configuration
NEXT_PUBLIC_STORAGE_MODE=local          # local | cloud | hybrid
NEXT_PUBLIC_ENABLE_SYNC=false           # Enable auto-sync
NEXT_PUBLIC_SYNC_INTERVAL=30000         # Sync every 30 seconds

# Supabase (Cloud Storage)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# App Configuration
NEXT_PUBLIC_APP_NAME=CHABS
NEXT_PUBLIC_VERSION=2.0.0
```

### Programmatic Usage

```typescript
import { hybridStorage, switchStorageMode, getStorageInfo } from '@/lib/storage-hybrid';

// Switch storage modes
await switchStorageMode('cloud');

// Get current storage info
const info = getStorageInfo();
console.log(info.mode, info.isOnline, info.primaryProvider);

// Use storage (works with any mode)
const products = await hybridStorage.getProducts();
const newProduct = await hybridStorage.createProduct({
  name: 'New Product',
  sku: 'NP001',
  costPrice: 100,
  sellingPrice: 150
});
```

## 📊 Storage Comparison

| Feature | Local Storage | Cloud Storage | Hybrid Mode |
|---------|---------------|---------------|-------------|
| **Setup Time** | ⚡ Instant | 🕐 5-10 minutes | 🕐 5-10 minutes |
| **Multi-user** | ❌ Single user | ✅ Multi-user | ✅ Multi-user |
| **Offline Support** | ✅ Always works | ❌ Requires internet | ✅ Auto-fallback |
| **Real-time Sync** | ❌ No sync | ✅ Real-time | ✅ When online |
| **Data Backup** | ✅ Local backups | ✅ Cloud backups | ✅ Both |
| **Performance** | ⚡ Instant | 🌐 Network dependent | ⚡ Best of both |
| **Cost** | 🆓 Free | 💰 Supabase pricing | 💰 Supabase pricing |

## 🎯 Recommendations

### For Development & Testing
**Use Enhanced Local Storage** ✅
- Zero setup required
- All features work immediately
- Perfect for learning and prototyping
- Advanced backup and export features

### For Production
**Use Hybrid Mode** 🚀
- Best user experience
- Works online and offline
- Automatic failover
- Real-time collaboration when online

### For Team Collaboration
**Use Cloud Storage** ☁️
- Multiple users can work simultaneously
- Real-time data synchronization
- Centralized data management
- Professional deployment ready

## 🔍 Troubleshooting

### Local Storage Issues
```javascript
// Clear all data and reset
import { clearAllData } from '@/lib/storage-enhanced';
clearAllData();
```

### Cloud Storage Issues
```javascript
// Check cloud connection
import { healthCheck } from '@/lib/storage-cloud';
const isHealthy = await healthCheck();
```

### Hybrid Mode Issues
```javascript
// Check storage info
import { getStorageInfo } from '@/lib/storage-hybrid';
const info = getStorageInfo();
console.log('Current mode:', info.mode);
console.log('Is online:', info.isOnline);
console.log('Primary provider:', info.primaryProvider);
```

## 🎉 Next Steps

1. **Start with Local Storage** - Get familiar with all features
2. **Test Advanced Features** - Try backups, exports, and imports
3. **Set up Cloud Storage** - When ready for production
4. **Enable Hybrid Mode** - For the best user experience

Your CHABS system now has enterprise-grade storage capabilities! 🚀