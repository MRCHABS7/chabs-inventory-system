# CHABS INVENTORY SYSTEM - COMPLETE TECHNICAL MANUAL

## 🎯 **OVERVIEW**

This is your complete technical guide for the CHABS Inventory Management System. This manual contains everything you need to know to maintain, troubleshoot, and modify your system, even if you're new to programming.

**IMPORTANT**: This manual is designed to be accessible from within your deployed application, ensuring you always have access to technical guidance.

---

## 📋 **TABLE OF CONTENTS**

1. [System Architecture](#system-architecture)
2. [File Structure Guide](#file-structure-guide)
3. [Programming Basics](#programming-basics)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [How to Make Changes](#how-to-make-changes)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Deployment & Updates](#deployment--updates)
8. [Database Management](#database-management)
9. [Security & Backup](#security--backup)
10. [Performance Optimization](#performance-optimization)
11. [Development Tools](#development-tools)
12. [Getting Help](#getting-help)
13. [Quick Reference](#quick-reference)

---

## 🏗️ **SYSTEM ARCHITECTURE**

### **Technology Stack**
- **Frontend**: Next.js (React framework)
- **Language**: TypeScript (JavaScript with types)
- **Styling**: Tailwind CSS
- **Storage**: Local Storage + Enhanced Storage Options
- **PDF Generation**: Built-in PDF components
- **Authentication**: Simple JWT-based system

### **How It Works**
```
User Interface (React Components)
        ↓
Business Logic (TypeScript functions)
        ↓
Data Storage (Multiple Options)
        ↓
Browser Database (IndexedDB/LocalStorage)
```

---

## 📁 **FILE STRUCTURE GUIDE**

### **Root Directory**
```
quotation-system/
├── src/                    # All source code
├── public/                 # Static files (images, etc.)
├── .next/                  # Build output (auto-generated)
├── node_modules/           # Dependencies (auto-generated)
├── package.json            # Project configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Styling configuration
└── next.config.js         # Next.js configuration
```

*[Content continues in additional files...]*
### **Sour
ce Code Structure**
```
src/
├── pages/                  # Website pages
│   ├── index.tsx          # Home page
│   ├── dashboard.tsx      # Main dashboard
│   ├── products.tsx       # Products management
│   ├── customers.tsx      # Customer management
│   ├── quotations.tsx     # Quote management
│   ├── orders.tsx         # Order management
│   ├── suppliers.tsx      # Supplier management
│   ├── warehouse.tsx      # Warehouse management
│   ├── reports.tsx        # Reports and analytics
│   ├── automation.tsx     # Automation rules
│   ├── purchase-orders.tsx # Purchase orders
│   ├── external-suppliers.tsx # External suppliers
│   ├── external-processing.tsx # External processing
│   ├── warehouse-dashboard.tsx # Warehouse dashboard
│   ├── admin-dashboard.tsx # Admin dashboard
│   ├── profile.tsx        # User profile
│   ├── demo.tsx           # Demo page
│   ├── technical-manual.tsx # This technical manual
│   └── settings.tsx       # System settings
├── components/             # Reusable UI components
│   ├── Layout.tsx         # Main page layout
│   ├── Navigation.tsx     # Menu system
│   ├── Dashboard.tsx      # Dashboard components
│   ├── QuoteBuilder.tsx   # Quote creation form
│   ├── ProductForm.tsx    # Product management form
│   ├── OrderForm.tsx      # Order creation form
│   ├── SupplierForm.tsx   # Supplier management form
│   ├── PurchaseOrderForm.tsx # Purchase order form
│   ├── LoginForm.tsx      # User authentication
│   ├── LoginForm-simple.tsx # Simple authentication
│   ├── Settings.tsx       # Settings components
│   ├── BrandingSettings.tsx # Company branding
│   ├── EmailSettings.tsx  # Email configuration
│   ├── NotificationCenter.tsx # Notifications
│   ├── WarehouseManager.tsx # Warehouse operations
│   ├── ExternalSupplierManager.tsx # External suppliers
│   ├── ExternalProcessingManager.tsx # External processing
│   ├── AutomationRuleBuilder.tsx # Automation rules
│   ├── AdvancedReports.tsx # Advanced reporting
│   ├── AnalyticsDashboard.tsx # Analytics
│   ├── PerformanceMonitor.tsx # Performance monitoring
│   ├── SystemHealthMonitor.tsx # System health
│   ├── InventoryAlerts.tsx # Inventory alerts
│   ├── SmartDashboard.tsx # Smart dashboard
│   ├── EnhancedSettings.tsx # Enhanced settings
│   ├── DashboardCustomizer.tsx # Dashboard customization
│   ├── ProfessionalQuotePDF.tsx # PDF generation
│   ├── PickingSlipPDF.tsx # Picking slip PDF
│   ├── DataExportImport.tsx # Data import/export
│   ├── SearchAndFilter.tsx # Search functionality
│   ├── AuditTrail.tsx     # Audit logging
│   ├── BarcodeScanner.tsx # Barcode scanning
│   ├── MultiLanguageSupport.tsx # Multi-language
│   ├── AccessibilityProvider.tsx # Accessibility
│   ├── LoadingSpinner.tsx # Loading indicators
│   └── StorageManager.tsx # Storage management
├── lib/                    # Business logic & utilities
│   ├── types.ts           # Data structure definitions
│   ├── storage.ts         # Main storage operations
│   ├── storage-simple.ts  # Simple storage operations
│   ├── storage-enhanced.ts # Enhanced storage
│   ├── storage-hybrid.ts  # Hybrid storage
│   ├── storage-cloud.ts   # Cloud storage
│   ├── auth-simple.ts     # Simple authentication
│   ├── email.ts           # Email functionality
│   ├── notifications.ts   # Notification system
│   └── supabase.ts        # Supabase integration
├── contexts/               # Global state management
│   ├── ThemeContext.tsx   # Dark/light mode
│   └── BrandingContext.tsx # Company branding
└── styles/                 # Styling files
    └── globals.css        # Global styles
```

---

## 💻 **PROGRAMMING BASICS**

### **Understanding TypeScript/JavaScript**

#### **Variables - Storing Information**
```typescript
// Different types of data you can store
const companyName = "CHABS";           // String (text)
const totalAmount = 1500.50;           // Number
const isActive = true;                 // Boolean (true/false)
const products = ["Item1", "Item2"];   // Array (list)
const customer = {                     // Object (structured data)
  id: "1",
  name: "John Doe",
  email: "john@example.com"
};

// Variables can change (let) or stay the same (const)
let currentUser = "admin";  // Can be changed later
const apiUrl = "https://api.example.com";  // Cannot be changed
```

#### **Functions - Reusable Code Blocks**
```typescript
// A function that calculates tax
function calculateTax(amount: number): number {
  return amount * 0.15; // 15% VAT
}

// Using the function
const subtotal = 1000;
const tax = calculateTax(subtotal); // Returns 150
const total = subtotal + tax; // 1150

// Arrow function (modern way)
const calculateDiscount = (amount: number, percentage: number) => {
  return amount * (percentage / 100);
};

// Function with multiple parameters
function createProduct(name: string, price: number, category: string) {
  return {
    id: Date.now().toString(), // Simple ID generation
    name: name,
    price: price,
    category: category,
    createdAt: new Date()
  };
}
```

#### **Objects - Structured Data**
```typescript
// A product object
const product = {
  id: "1",
  name: "Widget",
  price: 100,
  stock: 50,
  category: "Electronics",
  supplier: {
    name: "ABC Corp",
    contact: "supplier@abc.com"
  }
};

// Accessing properties
console.log(product.name);           // "Widget"
console.log(product.supplier.name);  // "ABC Corp"

// Modifying properties
product.stock = 45;  // Update stock
product.price = 95;  // Update price

// Adding new properties
product.description = "A useful widget";
```

#### **Arrays - Lists of Data**
```typescript
// List of products
const products = [
  { id: "1", name: "Widget", price: 100 },
  { id: "2", name: "Gadget", price: 200 },
  { id: "3", name: "Tool", price: 50 }
];

// Finding items
const widget = products.find(p => p.name === "Widget");
const expensiveProducts = products.filter(p => p.price > 75);

// Adding items
products.push({ id: "4", name: "Device", price: 300 });

// Removing items
const index = products.findIndex(p => p.id === "2");
products.splice(index, 1); // Remove Gadget

// Looping through items
products.forEach(product => {
  console.log(`${product.name}: $${product.price}`);
});

// Transforming data
const productNames = products.map(p => p.name);
const totalValue = products.reduce((sum, p) => sum + p.price, 0);
```

### **React Components - Building User Interfaces**

#### **Basic Component Structure**
```typescript
import { useState } from 'react';

export default function ProductCard() {
  // State (data that can change)
  const [quantity, setQuantity] = useState(1);
  const [isSelected, setIsSelected] = useState(false);
  
  // Function to handle events
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };
  
  const handleSelect = () => {
    setIsSelected(!isSelected);
  };
  
  // What the component displays (JSX)
  return (
    <div className={`border rounded p-4 ${isSelected ? 'bg-blue-50' : ''}`}>
      <h3 className="font-bold">Product Name</h3>
      <p className="text-gray-600">Price: $100</p>
      
      <div className="flex items-center gap-2 mt-2">
        <button 
          onClick={() => handleQuantityChange(quantity - 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span>{quantity}</span>
        <button 
          onClick={() => handleQuantityChange(quantity + 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>
      
      <button 
        onClick={handleSelect}
        className={`mt-2 px-4 py-2 rounded ${
          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        {isSelected ? 'Selected' : 'Select'}
      </button>
    </div>
  );
}
```

#### **Component Props - Passing Data**
```typescript
// Component that receives data from parent
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
  onSelect: (productId: string) => void;
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-gray-600">Price: R{product.price}</p>
      <p className="text-sm">Stock: {product.stock}</p>
      
      <button 
        onClick={() => onSelect(product.id)}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}

// Using the component in a parent
function ProductList() {
  const products = [
    { id: "1", name: "Widget", price: 100, stock: 50 },
    { id: "2", name: "Gadget", price: 200, stock: 25 }
  ];
  
  const handleProductSelect = (productId: string) => {
    console.log(`Selected product: ${productId}`);
    // Add to cart logic here
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product} 
          onSelect={handleProductSelect}
        />
      ))}
    </div>
  );
}
```

#### **State Management - Managing Data**
```typescript
import { useState, useEffect } from 'react';

function InventoryManager() {
  // Multiple state variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load data when component starts
  useEffect(() => {
    loadProducts();
  }, []); // Empty array means run once
  
  // Load data when search term changes
  useEffect(() => {
    if (searchTerm) {
      searchProducts(searchTerm);
    } else {
      loadProducts();
    }
  }, [searchTerm]); // Run when searchTerm changes
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get products from storage
      const storedProducts = localStorage.getItem('products');
      const productList = storedProducts ? JSON.parse(storedProducts) : [];
      
      setProducts(productList);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const addProduct = (newProduct) => {
    // Add to current list
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    
    // Save to storage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };
  
  const updateProduct = (productId, changes) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, ...changes }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };
  
  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };
  
  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  
  return (
    <div>
      <input 
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded px-3 py-2 mb-4"
      />
      
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded p-4">
            <h3>{product.name}</h3>
            <p>R{product.price}</p>
            <button 
              onClick={() => updateProduct(product.id, { stock: product.stock - 1 })}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Sell One
            </button>
            <button 
              onClick={() => deleteProduct(product.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **Data Flow - How Information Moves**

#### **Understanding Data Flow**
```
User Action (Click button)
        ↓
Event Handler (Function runs)
        ↓
State Update (Data changes)
        ↓
Component Re-render (UI updates)
        ↓
Storage Update (Data saved)
```

#### **Example: Adding a Product**
```typescript
function ProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    
    // 1. Validate input
    if (!name || !price) {
      alert('Please fill in all fields');
      return;
    }
    
    // 2. Create new product
    const newProduct = {
      id: Date.now().toString(),
      name: name,
      price: parseFloat(price),
      createdAt: new Date().toISOString()
    };
    
    // 3. Update state
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    
    // 4. Save to storage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // 5. Clear form
    setName('');
    setPrice('');
    
    // 6. Show success message
    alert('Product added successfully!');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Product Name</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Price</label>
        <input 
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      
      <button 
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Product
      </button>
    </form>
  );
}
```

---

## 🔧 **COMMON ISSUES & SOLUTIONS**

### **Build Errors**

#### **"Cannot find module" Error**
```bash
# Problem: Missing dependency
Error: Cannot resolve module 'react'

# Solution: Install the missing package
npm install react
npm install @types/react  # For TypeScript types

# If still having issues, try:
rm -rf node_modules package-lock.json
npm install
```

#### **TypeScript Errors**
```typescript
// Problem: Type mismatch
// Error: Type 'string' is not assignable to type 'number'
const price: number = "100"; // ❌ Wrong

// Solutions:
const price: number = 100;           // ✅ Use correct type
const price: number = parseInt("100"); // ✅ Convert string to number
const price: number = parseFloat("100.50"); // ✅ For decimals
const price = "100"; // ✅ Let TypeScript infer the type

// Problem: Object might be undefined
// Error: Object is possibly 'undefined'
const name = customer.name; // ❌ If customer might be undefined

// Solutions:
const name = customer?.name; // ✅ Optional chaining
const name = customer?.name || 'Unknown'; // ✅ With default value
if (customer) {
  const name = customer.name; // ✅ Check first
}
```

#### **Import/Export Errors**
```typescript
// Problem: Incorrect import
import QuoteBuilder from './QuoteBuilder'; // ❌ If it's not default export

// Check how the component is exported:
// If exported as: export default QuoteBuilder
import QuoteBuilder from './QuoteBuilder'; // ✅ Default import

// If exported as: export { QuoteBuilder }
import { QuoteBuilder } from './QuoteBuilder'; // ✅ Named import

// If exported as: export const QuoteBuilder = ...
import { QuoteBuilder } from './QuoteBuilder'; // ✅ Named import

// Problem: File path errors
import Component from './component'; // ❌ Wrong case
import Component from './Component'; // ✅ Correct case (case-sensitive)
import Component from '../components/Component'; // ✅ Correct path
```

### **Runtime Errors**

#### **"Cannot read property of undefined"**
```typescript
// Problem: Accessing property of undefined object
const name = customer.name; // ❌ If customer is undefined

// Solutions:
const name = customer?.name || 'Unknown'; // ✅ Safe access with default
const name = customer && customer.name; // ✅ Check existence first

// For arrays:
const firstProduct = products[0].name; // ❌ If products is empty

// Solutions:
const firstProduct = products[0]?.name; // ✅ Safe access
const firstProduct = products.length > 0 ? products[0].name : 'No products'; // ✅ Check length
```

#### **State Update Issues**
```typescript
// Problem: Direct state mutation
products.push(newProduct); // ❌ Don't modify state directly
setProducts(products); // ❌ React won't detect the change

// Solutions:
setProducts([...products, newProduct]); // ✅ Create new array
setProducts(products.concat(newProduct)); // ✅ Alternative method

// For objects:
customer.name = 'New Name'; // ❌ Don't modify directly
setCustomer(customer); // ❌ React won't detect change

// Solutions:
setCustomer({ ...customer, name: 'New Name' }); // ✅ Create new object
setCustomer(prev => ({ ...prev, name: 'New Name' })); // ✅ Using function
```

#### **Infinite Re-render Loops**
```typescript
// Problem: useEffect without dependencies
useEffect(() => {
  setCount(count + 1); // ❌ This will run forever
});

// Solution: Add dependencies
useEffect(() => {
  // This runs only once when component mounts
  loadInitialData();
}, []); // ✅ Empty dependency array

useEffect(() => {
  // This runs when searchTerm changes
  searchProducts(searchTerm);
}, [searchTerm]); // ✅ Specific dependency

// Problem: Object/array in dependency
const config = { apiUrl: 'https://api.com' };
useEffect(() => {
  fetchData(config);
}, [config]); // ❌ Object recreated every render

// Solution: Use useMemo or move outside component
const config = useMemo(() => ({ apiUrl: 'https://api.com' }), []);
useEffect(() => {
  fetchData(config);
}, [config]); // ✅ Stable reference
```

### **Styling Issues**

#### **CSS Not Applying**
```typescript
// Problem: Incorrect class names
<div className="btn-primary"> // ❌ If class doesn't exist

// Solutions:
// 1. Use Tailwind classes
<div className="bg-blue-500 text-white px-4 py-2 rounded"> // ✅ Tailwind

// 2. Add custom CSS to globals.css
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

// 3. Use inline styles for testing
<div style={{ backgroundColor: 'blue', color: 'white' }}> // ✅ Inline
```

#### **Responsive Design Issues**
```typescript
// Problem: Not responsive
<div className="w-96"> // ❌ Fixed width

// Solutions:
<div className="w-full max-w-md"> // ✅ Responsive width
<div className="w-full sm:w-1/2 lg:w-1/3"> // ✅ Breakpoint-specific

// Grid layouts:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> // ✅ Responsive grid
```

### **Data Storage Issues**

#### **LocalStorage Quota Exceeded**
```typescript
// Problem: Too much data in localStorage
localStorage.setItem('products', JSON.stringify(largeArray)); // ❌ Might fail

// Solutions:
try {
  localStorage.setItem('products', JSON.stringify(products));
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    alert('Storage quota exceeded. Please clear some data.');
    // Implement data cleanup or pagination
  }
}

// Better approach: Implement data pagination
const ITEMS_PER_PAGE = 100;
const paginateData = (data, page = 1) => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  return data.slice(start, start + ITEMS_PER_PAGE);
};
```

#### **Data Corruption**
```typescript
// Problem: Invalid JSON in storage
const products = JSON.parse(localStorage.getItem('products')); // ❌ Might crash

// Solution: Safe parsing with error handling
function safeGetStorageItem(key, defaultValue = []) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Usage:
const products = safeGetStorageItem('products', []);
const customers = safeGetStorageItem('customers', []);
```

---

## ✏️ **HOW TO MAKE CHANGES**

### **Changing Text and Labels**

#### **Page Titles**
```typescript
// In any page file (e.g., src/pages/dashboard.tsx)
<h1 className="text-2xl font-bold">Dashboard</h1> 
// Change "Dashboard" to whatever you want

// In the browser tab title:
<Head>
  <title>CHABS - Dashboard</title> // Change this
</Head>
```

#### **Button Labels**
```typescript
// In any component
<button className="btn btn-primary">
  Save Product // Change this text to anything
</button>

// With dynamic text:
const buttonText = isEditing ? 'Update Product' : 'Add Product';
<button className="btn btn-primary">
  {buttonText}
</button>
```

#### **Menu Items**
```typescript
// In src/components/Navigation.tsx
const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/products', label: 'Products', icon: '📦' }, // Change 'Products' to 'Items'
  { href: '/customers', label: 'Customers', icon: '👥' }, // Change to 'Clients'
  // Add new menu items:
  { href: '/my-new-page', label: 'My New Page', icon: '🆕' },
];
```

#### **Form Labels**
```typescript
// In any form component
<label className="block text-sm font-medium text-gray-700">
  Product Name // Change this label
</label>
<input 
  type="text"
  placeholder="Enter product name" // Change this placeholder
  className="mt-1 block w-full rounded-md border-gray-300"
/>
```

### **Changing Colors and Styling**

#### **Global Colors**
```css
/* In src/styles/globals.css */
:root {
  --primary: #3b82f6;    /* Change primary color (blue) */
  --secondary: #6b7280;  /* Change secondary color (gray) */
  --success: #10b981;    /* Change success color (green) */
  --warning: #f59e0b;    /* Change warning color (yellow) */
  --danger: #ef4444;     /* Change danger color (red) */
}

/* Custom button styles */
.btn-primary {
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #2563eb; /* Darker shade for hover */
}
```

#### **Component Colors**
```typescript
// Change Tailwind classes
<div className="bg-blue-500"> // Change to bg-red-500 for red
<div className="text-gray-800"> // Change to text-blue-800 for blue text
<div className="border-green-300"> // Change border color

// Multiple color variations:
<button className="bg-blue-500 hover:bg-blue-600 text-white">Blue Button</button>
<button className="bg-green-500 hover:bg-green-600 text-white">Green Button</button>
<button className="bg-red-500 hover:bg-red-600 text-white">Red Button</button>
<button className="bg-purple-500 hover:bg-purple-600 text-white">Purple Button</button>
```

#### **Dark Mode Colors**
```typescript
// Components automatically support dark mode with these classes:
<div className="bg-white dark:bg-gray-800"> // White in light, dark gray in dark mode
<div className="text-gray-900 dark:text-white"> // Dark text in light, white in dark
<div className="border-gray-200 dark:border-gray-700"> // Light border in light, darker in dark
```

### **Adding New Fields to Forms**

#### **Step-by-Step Process**

**Step 1: Update the Data Type**
```typescript
// In src/lib/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  // Add your new field here:
  description?: string;  // Optional field
  weight?: number;       // Another optional field
  isActive: boolean;     // Required field
}
```

**Step 2: Update the Form Component**
```typescript
// In src/components/ProductForm.tsx
function ProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  // Add state for new fields:
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // Add input fields in the JSX:
  return (
    <form>
      {/* Existing fields... */}
      
      {/* New description field */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
          rows={3}
          placeholder="Product description..."
        />
      </div>
      
      {/* New weight field */}
      <div>
        <label className="block text-sm font-medium">Weight (kg)</label>
        <input 
          type="number"
          step="0.01"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
          placeholder="0.00"
        />
      </div>
      
      {/* New active status field */}
      <div>
        <label className="flex items-center">
          <input 
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
          Product is active
        </label>
      </div>
    </form>
  );
}
```

**Step 3: Update the Save Function**
```typescript
// In the same component, update the save function
const handleSubmit = (e) => {
  e.preventDefault();
  
  const product = {
    id: Date.now().toString(),
    name,
    price: parseFloat(price),
    stock: parseInt(stock),
    category,
    // Include new fields:
    description,
    weight: weight ? parseFloat(weight) : undefined,
    isActive,
    createdAt: new Date().toISOString()
  };
  
  // Save logic remains the same
  saveProduct(product);
};
```

**Step 4: Update Display Components**
```typescript
// In product list/card components, show new fields:
function ProductCard({ product }) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-gray-600">R{product.price}</p>
      
      {/* Show new fields */}
      {product.description && (
        <p className="text-sm text-gray-500 mt-2">{product.description}</p>
      )}
      
      {product.weight && (
        <p className="text-xs text-gray-400">Weight: {product.weight}kg</p>
      )}
      
      <span className={`inline-block px-2 py-1 text-xs rounded ${
        product.isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {product.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
}
```

### **Adding New Pages**

#### **Step 1: Create the Page File**
```typescript
// Create src/pages/my-new-page.tsx
import Layout from '../components/Layout';
import { me } from '../lib/auth-simple';

export default function MyNewPage() {
  const user = me();
  
  if (!user) {
    return <div>Please log in to access this page.</div>;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My New Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p>This is my new page content!</p>
          
          {/* Add your content here */}
          <div className="mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Do Something
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

#### **Step 2: Add to Navigation**
```typescript
// In src/components/Navigation.tsx, add to menuItems array:
const menuItems = [
  // ... existing items
  { href: '/my-new-page', label: 'My New Page', icon: '🆕' },
];
```

#### **Step 3: Add Page Logic (if needed)**
```typescript
// If your page needs to manage data:
import { useState, useEffect } from 'react';

export default function MyNewPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load data when page opens
    loadMyData();
  }, []);
  
  const loadMyData = () => {
    try {
      const stored = localStorage.getItem('my-data');
      const myData = stored ? JSON.parse(stored) : [];
      setData(myData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const addNewItem = (item) => {
    const updatedData = [...data, item];
    setData(updatedData);
    localStorage.setItem('my-data', JSON.stringify(updatedData));
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My New Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
            {/* Add form here */}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">My Items</h2>
            {data.length === 0 ? (
              <p className="text-gray-500">No items yet.</p>
            ) : (
              <ul className="space-y-2">
                {data.map((item, index) => (
                  <li key={index} className="border-b pb-2">
                    {item.name || item.title || JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

### **Modifying Calculations**

#### **Tax Calculations**
```typescript
// In quote/order calculations, find this pattern:
const TAX_RATE = 15; // Change from 15% to whatever you need
const taxAmount = subtotal * (TAX_RATE / 100);

// For different tax rates by product category:
const getTaxRate = (category: string) => {
  switch (category) {
    case 'food': return 0;     // 0% for food
    case 'books': return 0;    // 0% for books
    case 'luxury': return 25;  // 25% for luxury items
    default: return 15;        // 15% for everything else
  }
};

// Usage in calculations:
const calculateItemTax = (item) => {
  const taxRate = getTaxRate(item.category);
  return item.price * item.quantity * (taxRate / 100);
};
```

#### **Discount Logic**
```typescript
// In src/components/QuoteBuilder.tsx
// Percentage discount:
const discountAmount = subtotal * (discount / 100);

// Fixed amount discount:
const discountAmount = discount;

// Tiered discounts:
const calculateDiscount = (subtotal: number) => {
  if (subtotal >= 10000) return subtotal * 0.15;      // 15% for orders over R10,000
  if (subtotal >= 5000) return subtotal * 0.10;       // 10% for orders over R5,000
  if (subtotal >= 1000) return subtotal * 0.05;       // 5% for orders over R1,000
  return 0; // No discount for smaller orders
};

// Customer-specific discounts:
const getCustomerDiscount = (customer) => {
  switch (customer.type) {
    case 'vip': return 20;        // 20% for VIP customers
    case 'wholesale': return 15;  // 15% for wholesale
    case 'regular': return 5;     // 5% for regular customers
    default: return 0;
  }
};
```

#### **Pricing Rules**
```typescript
// Dynamic pricing based on quantity:
const calculatePrice = (basePrice: number, quantity: number) => {
  if (quantity >= 100) return basePrice * 0.8;  // 20% discount for 100+
  if (quantity >= 50) return basePrice * 0.9;   // 10% discount for 50+
  if (quantity >= 10) return basePrice * 0.95;  // 5% discount for 10+
  return basePrice; // No discount for small quantities
};

// Seasonal pricing:
const getSeasonalMultiplier = () => {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 11 || month <= 1) return 1.1; // 10% increase in winter
  if (month >= 6 && month <= 8) return 0.9;  // 10% decrease in summer
  return 1.0; // Normal price
};

// Usage:
const finalPrice = basePrice * getSeasonalMultiplier();
```

---

*[Content continues in next part due to length...]*## 🚨
 **TROUBLESHOOTING GUIDE**

### **Application Won't Start**

#### **Check Node.js Version**
```bash
# Check your versions
node --version  # Should be 16.0.0 or higher
npm --version   # Should be 8.0.0 or higher

# If outdated, download from nodejs.org and install
# Then restart your terminal and try again
```

#### **Clear Cache and Reinstall Dependencies**
```bash
# Step 1: Delete node_modules and package-lock.json
# Windows:
rmdir /s node_modules
del package-lock.json

# Mac/Linux:
rm -rf node_modules package-lock.json

# Step 2: Clear npm cache
npm cache clean --force

# Step 3: Reinstall dependencies
npm install

# Step 4: Try starting again
npm run dev
```

#### **Port Already in Use**
```bash
# If you see "Port 3000 is already in use"

# Option 1: Use a different port
npm run dev -- -p 3001  # Use port 3001 instead

# Option 2: Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
# Note the PID number, then:
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Then try npm run dev again
```

#### **Permission Errors**
```bash
# If you get permission errors on Windows:
# Run Command Prompt as Administrator, then:
npm install -g npm@latest

# On Mac/Linux, if you get permission errors:
sudo npm install -g npm@latest

# Better solution: Use a Node version manager
# Windows: Install nvm-windows
# Mac/Linux: Install nvm
```

### **Build Failures**

#### **TypeScript Errors**
```bash
# Check for type errors without building
npx tsc --noEmit

# Common TypeScript fixes:

# 1. Add type annotations
const items: Product[] = [];
const total: number = 0;
const isActive: boolean = true;

# 2. Use optional chaining
const name = customer?.name;
const address = customer?.address?.street;

# 3. Provide default values
const total = order?.total || 0;
const items = products || [];

# 4. Type assertions (use carefully)
const element = document.getElementById('myId') as HTMLInputElement;

# 5. Fix import/export issues
// If you see "Module not found"
// Check the file path and spelling
import Component from './Component'; // Correct case
import { namedExport } from './utils'; // Named import
```

#### **Missing Dependencies**
```bash
# Install common missing packages
npm install @types/react @types/node
npm install react react-dom
npm install next

# If you see "Cannot resolve module 'X'"
npm install X

# Update all packages to latest versions
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

#### **Build Optimization Issues**
```bash
# If build is slow or fails due to memory issues
# Increase Node.js memory limit
set NODE_OPTIONS=--max-old-space-size=4096  # Windows
export NODE_OPTIONS=--max-old-space-size=4096  # Mac/Linux

# Then try building again
npm run build
```

### **Runtime Errors**

#### **White Screen of Death**
```typescript
// Check browser console (F12) for errors
// Common causes and fixes:

// 1. JavaScript errors
console.error('Check for any red errors in console');

// 2. Missing authentication
// Make sure user is logged in
const user = me();
if (!user) {
  // Redirect to login or show login form
}

// 3. Data loading issues
// Add error boundaries to catch component errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

// Wrap your app:
<ErrorBoundary>
  <MyApp />
</ErrorBoundary>
```

#### **Data Not Loading**
```typescript
// Debug data loading issues:

// 1. Check if data exists in storage
console.log('Products:', localStorage.getItem('products'));
console.log('Customers:', localStorage.getItem('customers'));

// 2. Verify data format
try {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  console.log('Parsed products:', products);
} catch (error) {
  console.error('Invalid JSON in storage:', error);
  // Clear corrupted data
  localStorage.removeItem('products');
}

// 3. Add loading states
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('products');
      const productList = stored ? JSON.parse(stored) : [];
      setProducts(productList);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (products.length === 0) return <div>No products found</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

#### **Forms Not Submitting**
```typescript
// Common form issues and fixes:

// 1. Prevent default form submission
const handleSubmit = (e) => {
  e.preventDefault(); // ✅ Always add this
  // Your form logic here
};

// 2. Check form validation
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!name.trim()) {
    alert('Name is required');
    return;
  }
  
  if (!price || price <= 0) {
    alert('Valid price is required');
    return;
  }
  
  // Process form
  saveProduct({ name, price });
};

// 3. Debug form state
const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Form data:', { name, price, category });
  // Check if all values are what you expect
};
```

### **Performance Issues**

#### **Slow Loading**
```typescript
// 1. Check for large datasets
const products = getProducts(); // If this returns 10,000+ items
console.log('Product count:', products.length);

// Solution: Add pagination
const ITEMS_PER_PAGE = 50;
const [currentPage, setCurrentPage] = useState(1);

const paginatedProducts = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  return products.slice(start, start + ITEMS_PER_PAGE);
}, [products, currentPage]);

// 2. Optimize re-renders with React.memo
const ProductCard = React.memo(({ product }) => {
  return (
    <div className="border rounded p-4">
      <h3>{product.name}</h3>
      <p>R{product.price}</p>
    </div>
  );
});

// 3. Use useMemo for expensive calculations
const totalValue = useMemo(() => {
  return products.reduce((sum, product) => 
    sum + (product.price * product.stock), 0
  );
}, [products]); // Only recalculate when products change
```

#### **Memory Issues**
```typescript
// 1. Clean up event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle window resize
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// 2. Cancel async operations
useEffect(() => {
  let cancelled = false;
  
  const loadData = async () => {
    const data = await fetchData();
    if (!cancelled) {
      setData(data);
    }
  };
  
  loadData();
  
  return () => {
    cancelled = true;
  };
}, []);

// 3. Limit data in memory
const MAX_ITEMS = 1000;
const addProduct = (newProduct) => {
  setProducts(prev => {
    const updated = [...prev, newProduct];
    // Keep only the most recent items
    return updated.slice(-MAX_ITEMS);
  });
};
```

### **Data Issues**

#### **Lost Data**
```typescript
// Data recovery strategies:

// 1. Check browser storage
console.log('All localStorage keys:', Object.keys(localStorage));
console.log('All data:', localStorage);

// 2. Export data before it's lost
function exportAllData() {
  const data = {
    products: localStorage.getItem('products'),
    customers: localStorage.getItem('customers'),
    quotations: localStorage.getItem('quotations'),
    orders: localStorage.getItem('orders'),
    suppliers: localStorage.getItem('suppliers'),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], 
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chabs-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

// 3. Set up automatic backups
useEffect(() => {
  const backupInterval = setInterval(() => {
    exportAllData();
  }, 24 * 60 * 60 * 1000); // Daily backup
  
  return () => clearInterval(backupInterval);
}, []);
```

#### **Corrupted Data**
```typescript
// Fix corrupted data:

// 1. Safe data loading with validation
function loadProducts() {
  try {
    const stored = localStorage.getItem('products');
    if (!stored) return [];
    
    const products = JSON.parse(stored);
    
    // Validate data structure
    if (!Array.isArray(products)) {
      throw new Error('Products data is not an array');
    }
    
    // Validate each product
    const validProducts = products.filter(product => {
      return product && 
             typeof product.id === 'string' && 
             typeof product.name === 'string' && 
             typeof product.price === 'number';
    });
    
    if (validProducts.length !== products.length) {
      console.warn(`Filtered out ${products.length - validProducts.length} invalid products`);
      // Save cleaned data
      localStorage.setItem('products', JSON.stringify(validProducts));
    }
    
    return validProducts;
  } catch (error) {
    console.error('Error loading products:', error);
    // Clear corrupted data
    localStorage.removeItem('products');
    return [];
  }
}

// 2. Data migration for structure changes
function migrateData() {
  const version = localStorage.getItem('dataVersion') || '1.0';
  
  if (version === '1.0') {
    // Migrate from version 1.0 to 2.0
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const migratedProducts = products.map(product => ({
      ...product,
      // Add new fields with defaults
      category: product.category || 'General',
      isActive: product.isActive !== undefined ? product.isActive : true,
      createdAt: product.createdAt || new Date().toISOString()
    }));
    
    localStorage.setItem('products', JSON.stringify(migratedProducts));
    localStorage.setItem('dataVersion', '2.0');
  }
}

// Run migration on app start
useEffect(() => {
  migrateData();
}, []);
```

#### **Sync Issues Between Tabs**
```typescript
// Keep data synchronized between browser tabs:

useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === 'products') {
      // Reload products when changed in another tab
      const newProducts = e.newValue ? JSON.parse(e.newValue) : [];
      setProducts(newProducts);
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);

// Or use a custom hook for synchronized storage:
function useSyncedStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  
  const setSyncedValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: JSON.stringify(newValue)
    }));
  };
  
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : defaultValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);
  
  return [value, setSyncedValue];
}
```

---

## 🚀 **DEPLOYMENT & UPDATES**

### **Preparing for Deployment**

#### **Pre-deployment Checklist**
```bash
# 1. Test build locally
npm run build

# If successful, you'll see:
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Finalizing page optimization

# 2. Check for errors
npm run lint

# 3. Test the built application
npm start  # This runs the production build locally

# 4. Check all pages work
# Visit each page in your browser to ensure they load correctly
```

#### **Environment Variables**
```bash
# Create .env.local for local development
NEXT_PUBLIC_APP_NAME=CHABS Inventory
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
NEXT_PUBLIC_VERSION=1.0.0

# For production, set these in your hosting platform
# Never put sensitive data in NEXT_PUBLIC_ variables
```

#### **Build Optimization**
```javascript
// In next.config.js, add optimizations:
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimize images
  images: {
    domains: ['your-domain.com'],
  },
  
  // Compress output
  compress: true,
  
  // Remove console.logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
```

### **Deployment Platforms**

#### **Vercel (Recommended for Next.js)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy your application
vercel

# Follow the prompts:
# ? Set up and deploy "~/your-project"? [Y/n] y
# ? Which scope do you want to deploy to? Your Name
# ? Link to existing project? [y/N] n
# ? What's your project's name? chabs-inventory
# ? In which directory is your code located? ./

# Your app will be deployed and you'll get a URL like:
# https://chabs-inventory-abc123.vercel.app

# For production deployment:
vercel --prod
```

#### **Netlify**
```bash
# Build for static export (if needed)
npm run build

# Option 1: Drag and drop
# 1. Go to netlify.com
# 2. Drag your .next folder to the deploy area
# 3. Your site will be live

# Option 2: Git integration
# 1. Push your code to GitHub
# 2. Connect GitHub to Netlify
# 3. Set build command: npm run build
# 4. Set publish directory: .next
# 5. Deploy automatically on git push
```

#### **Traditional Web Hosting**
```bash
# Build the application
npm run build

# Upload these files to your web server:
# - .next/ folder (entire folder)
# - public/ folder (entire folder)
# - package.json
# - next.config.js

# On your server, install Node.js and run:
npm install --production
npm start

# Or use PM2 for process management:
npm install -g pm2
pm2 start npm --name "chabs-inventory" -- start
pm2 save
pm2 startup
```

#### **Docker Deployment**
```dockerfile
# Create Dockerfile in your project root:
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

```bash
# Build and run Docker container:
docker build -t chabs-inventory .
docker run -p 3000:3000 chabs-inventory
```

### **Updating After Deployment**

#### **Code Changes Workflow**
```bash
# 1. Make your changes locally
# Edit files as needed

# 2. Test the changes
npm run dev
# Test all functionality in browser

# 3. Build to ensure no errors
npm run build
# Fix any build errors

# 4. Commit changes (if using Git)
git add .
git commit -m "Description of changes"
git push

# 5. Deploy the update
# For Vercel:
vercel --prod

# For Netlify:
# Push to GitHub (if connected) or drag new build

# For traditional hosting:
# Upload new files and restart server
```

#### **Database Migration**
```typescript
// If you change data structure, create migration function:
function migrateDataV2() {
  const currentVersion = localStorage.getItem('dataVersion') || '1.0';
  
  if (currentVersion === '1.0') {
    console.log('Migrating data from v1.0 to v2.0...');
    
    // Migrate products
    const oldProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const newProducts = oldProducts.map(product => ({
      ...product,
      // Add new fields with default values
      description: product.description || '',
      weight: product.weight || 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
      updatedAt: new Date().toISOString()
    }));
    
    localStorage.setItem('products', JSON.stringify(newProducts));
    localStorage.setItem('dataVersion', '2.0');
    
    console.log('Migration completed successfully');
  }
}

// Run migration on app startup
useEffect(() => {
  migrateDataV2();
}, []);
```

#### **Rollback Strategy**
```typescript
// Create backup before updates
function createBackupBeforeUpdate() {
  const backup = {
    products: localStorage.getItem('products'),
    customers: localStorage.getItem('customers'),
    quotations: localStorage.getItem('quotations'),
    orders: localStorage.getItem('orders'),
    timestamp: new Date().toISOString(),
    version: localStorage.getItem('dataVersion') || '1.0'
  };
  
  localStorage.setItem('backup_' + Date.now(), JSON.stringify(backup));
  
  // Keep only last 5 backups
  const backupKeys = Object.keys(localStorage)
    .filter(key => key.startsWith('backup_'))
    .sort()
    .reverse();
    
  if (backupKeys.length > 5) {
    backupKeys.slice(5).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Restore from backup
function restoreFromBackup(backupKey) {
  try {
    const backup = JSON.parse(localStorage.getItem(backupKey));
    
    Object.keys(backup).forEach(key => {
      if (key !== 'timestamp' && key !== 'version') {
        localStorage.setItem(key, backup[key]);
      }
    });
    
    localStorage.setItem('dataVersion', backup.version);
    
    alert('Data restored successfully. Please refresh the page.');
  } catch (error) {
    console.error('Failed to restore backup:', error);
    alert('Failed to restore backup');
  }
}
```

---

## 💾 **DATABASE MANAGEMENT**

### **Understanding Local Storage**

#### **How Data is Stored**
```typescript
// Your data is stored in the browser as JSON strings
// Location: Browser > Developer Tools > Application > Local Storage

// Data structure example:
{
  "products": "[{\"id\":\"1\",\"name\":\"Widget\",\"price\":100}]",
  "customers": "[{\"id\":\"1\",\"name\":\"John Doe\",\"email\":\"john@example.com\"}]",
  "quotations": "[{\"id\":\"1\",\"total\":1000,\"items\":[]}]",
  "orders": "[{\"id\":\"1\",\"status\":\"pending\",\"total\":500}]",
  "suppliers": "[{\"id\":\"1\",\"name\":\"ABC Corp\",\"contact\":\"abc@corp.com\"}]",
  "dataVersion": "2.0",
  "lastBackup": "2024-01-15T10:30:00.000Z"
}

// Storage limits:
// - Most browsers: 5-10MB per domain
// - Mobile browsers: May be less
// - Data persists until manually cleared
```

#### **Data Access Patterns**
```typescript
// Safe data loading with error handling
function safeGetStorageItem(key: string, defaultValue: any = []) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    const parsed = JSON.parse(item);
    
    // Validate data type
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
      console.warn(`Expected array for ${key}, got ${typeof parsed}`);
      return defaultValue;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Safe data saving
function safeSetStorageItem(key: string, value: any) {
  try {
    const serialized = JSON.stringify(value);
    
    // Check size before saving (rough estimate)
    const sizeInBytes = new Blob([serialized]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 5) {
      console.warn(`Large data size for ${key}: ${sizeInMB.toFixed(2)}MB`);
    }
    
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some data or export to free up space.');
    } else {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
    return false;
  }
}

// Usage examples:
const products = safeGetStorageItem('products', []);
const customers = safeGetStorageItem('customers', []);
const settings = safeGetStorageItem('settings', {});

safeSetStorageItem('products', updatedProducts);
```

### **Backup and Restore**

#### **Comprehensive Backup System**
```typescript
// Complete backup function
function createFullBackup() {
  const backupData = {
    // Core business data
    products: safeGetStorageItem('products', []),
    customers: safeGetStorageItem('customers', []),
    quotations: safeGetStorageItem('quotations', []),
    orders: safeGetStorageItem('orders', []),
    suppliers: safeGetStorageItem('suppliers', []),
    
    // System data
    settings: safeGetStorageItem('settings', {}),
    userPreferences: safeGetStorageItem('userPreferences', {}),
    
    // Metadata
    backupDate: new Date().toISOString(),
    version: safeGetStorageItem('dataVersion', '1.0'),
    appVersion: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    
    // Statistics for verification
    stats: {
      productCount: safeGetStorageItem('products', []).length,
      customerCount: safeGetStorageItem('customers', []).length,
      quotationCount: safeGetStorageItem('quotations', []).length,
      orderCount: safeGetStorageItem('orders', []).length,
    }
  };
  
  // Create downloadable file
  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chabs-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Save backup reference
  const backupRef = {
    date: backupData.backupDate,
    stats: backupData.stats,
    filename: a.download
  };
  
  const backupHistory = safeGetStorageItem('backupHistory', []);
  backupHistory.unshift(backupRef);
  
  // Keep only last 10 backup references
  if (backupHistory.length > 10) {
    backupHistory.splice(10);
  }
  
  safeSetStorageItem('backupHistory', backupHistory);
  safeSetStorageItem('lastBackup', backupData.backupDate);
  
  return backupData;
}

// Restore from backup file
function restoreFromBackup(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        // Validate backup structure
        if (!backupData.backupDate || !backupData.version) {
          throw new Error('Invalid backup file format');
        }
        
        // Confirm restore
        const confirmMessage = `
          Restore backup from ${new Date(backupData.backupDate).toLocaleString()}?
          
          This will replace all current data:
          - Products: ${backupData.stats?.productCount || 0}
          - Customers: ${backupData.stats?.customerCount || 0}
          - Quotations: ${backupData.stats?.quotationCount || 0}
          - Orders: ${backupData.stats?.orderCount || 0}
          
          Current data will be lost. Continue?
        `;
        
        if (!confirm(confirmMessage)) {
          reject(new Error('Restore cancelled by user'));
          return;
        }
        
        // Create backup of current data before restore
        const currentBackup = createFullBackup();
        
        // Restore data
        Object.keys(backupData).forEach(key => {
          if (key !== 'backupDate' && key !== 'version' && key !== 'appVersion' && key !== 'stats') {
            safeSetStorageItem(key, backupData[key]);
          }
        });
        
        // Update version info
        safeSetStorageItem('dataVersion', backupData.version);
        safeSetStorageItem('restoredFrom', backupData.backupDate);
        
        resolve(backupData);
        
        // Refresh page to reload all data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read backup file'));
    };
    
    reader.readAsText(file);
  });
}

// Automatic backup scheduler
function setupAutomaticBackups() {
  const lastBackup = safeGetStorageItem('lastBackup', null);
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  if (!lastBackup || new Date(lastBackup) < oneDayAgo) {
    // Create automatic backup
    createFullBackup();
    console.log('Automatic backup created');
  }
  
  // Set up daily backup check
  const checkInterval = setInterval(() => {
    const lastBackup = safeGetStorageItem('lastBackup', null);
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    if (!lastBackup || new Date(lastBackup) < oneDayAgo) {
      createFullBackup();
      console.log('Scheduled backup created');
    }
  }, 60 * 60 * 1000); // Check every hour
  
  return () => clearInterval(checkInterval);
}
```

#### **Data Validation and Integrity**
```typescript
// Comprehensive data validation
function validateAllData() {
  const issues: string[] = [];
  
  // Validate products
  const products = safeGetStorageItem('products', []);
  products.forEach((product: any, index: number) => {
    if (!product.id) issues.push(`Product ${index} missing ID`);
    if (!product.name) issues.push(`Product ${index} missing name`);
    if (typeof product.price !== 'number' || product.price < 0) {
      issues.push(`Product ${index} has invalid price: ${product.price}`);
    }
    if (typeof product.stock !== 'number' || product.stock < 0) {
      issues.push(`Product ${index} has invalid stock: ${product.stock}`);
    }
  });
  
  // Validate customers
  const customers = safeGetStorageItem('customers', []);
  customers.forEach((customer: any, index: number) => {
    if (!customer.id) issues.push(`Customer ${index} missing ID`);
    if (!customer.name) issues.push(`Customer ${index} missing name`);
    if (customer.email && !isValidEmail(customer.email)) {
      issues.push(`Customer ${index} has invalid email: ${customer.email}`);
    }
  });
  
  // Validate quotations
  const quotations = safeGetStorageItem('quotations', []);
  quotations.forEach((quote: any, index: number) => {
    if (!quote.id) issues.push(`Quotation ${index} missing ID`);
    if (!quote.customerId) issues.push(`Quotation ${index} missing customer ID`);
    if (!Array.isArray(quote.items)) issues.push(`Quotation ${index} items is not an array`);
    if (typeof quote.total !== 'number') issues.push(`Quotation ${index} has invalid total`);
  });
  
  // Validate orders
  const orders = safeGetStorageItem('orders', []);
  orders.forEach((order: any, index: number) => {
    if (!order.id) issues.push(`Order ${index} missing ID`);
    if (!order.customerId) issues.push(`Order ${index} missing customer ID`);
    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(order.status)) {
      issues.push(`Order ${index} has invalid status: ${order.status}`);
    }
  });
  
  return issues;
}

// Helper function for email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Data repair functions
function repairData() {
  let repairCount = 0;
  
  // Repair products
  const products = safeGetStorageItem('products', []);
  const repairedProducts = products.map((product: any) => {
    const repaired = { ...product };
    
    if (!repaired.id) {
      repaired.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      repairCount++;
    }
    
    if (typeof repaired.price !== 'number' || repaired.price < 0) {
      repaired.price = 0;
      repairCount++;
    }
    
    if (typeof repaired.stock !== 'number' || repaired.stock < 0) {
      repaired.stock = 0;
      repairCount++;
    }
    
    if (!repaired.name) {
      repaired.name = 'Unnamed Product';
      repairCount++;
    }
    
    return repaired;
  });
  
  if (repairCount > 0) {
    safeSetStorageItem('products', repairedProducts);
  }
  
  // Similar repair logic for other data types...
  
  return repairCount;
}

// Data cleanup functions
function cleanupOldData() {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 12); // Keep 12 months
  
  // Clean old quotations
  const quotations = safeGetStorageItem('quotations', []);
  const activeQuotations = quotations.filter((quote: any) => {
    const quoteDate = new Date(quote.createdAt || quote.date);
    return quoteDate > cutoffDate || quote.status === 'accepted';
  });
  
  if (activeQuotations.length !== quotations.length) {
    safeSetStorageItem('quotations', activeQuotations);
    console.log(`Cleaned up ${quotations.length - activeQuotations.length} old quotations`);
  }
  
  // Clean old backup references
  const backupHistory = safeGetStorageItem('backupHistory', []);
  const recentBackups = backupHistory.slice(0, 5); // Keep only 5 most recent
  
  if (recentBackups.length !== backupHistory.length) {
    safeSetStorageItem('backupHistory', recentBackups);
  }
}
```

---

*[Content continues in next part...]*