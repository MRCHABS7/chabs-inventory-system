/**
 * Enhanced Local Storage System with Advanced Features
 * Optimized for testing, debugging, and development
 */

import { 
  Product, Order, Customer, Supplier, Quotation, User, 
  StockMovement, AutomationRule, SupplierPrice 
} from './types';

// Storage configuration
const STORAGE_CONFIG = {
  prefix: 'chabs_v2_',
  version: '2.0.0',
  enableBackup: true,
  enableCompression: false, // Set to true for large datasets
  enableEncryption: false, // Set to true for sensitive data
  maxBackups: 5,
  autoBackupInterval: 300000, // 5 minutes
};

// Storage keys
const KEYS = {
  products: `${STORAGE_CONFIG.prefix}products`,
  orders: `${STORAGE_CONFIG.prefix}orders`,
  customers: `${STORAGE_CONFIG.prefix}customers`,
  suppliers: `${STORAGE_CONFIG.prefix}suppliers`,
  quotations: `${STORAGE_CONFIG.prefix}quotations`,
  users: `${STORAGE_CONFIG.prefix}users`,
  stockMovements: `${STORAGE_CONFIG.prefix}stock_movements`,
  automationRules: `${STORAGE_CONFIG.prefix}automation_rules`,
  supplierPrices: `${STORAGE_CONFIG.prefix}supplier_prices`,
  settings: `${STORAGE_CONFIG.prefix}settings`,
  metadata: `${STORAGE_CONFIG.prefix}metadata`,
  backups: `${STORAGE_CONFIG.prefix}backups`,
};

// Enhanced storage utilities
class EnhancedStorage {
  private static instance: EnhancedStorage;
  private backupTimer: NodeJS.Timeout | null = null;

  static getInstance(): EnhancedStorage {
    if (!EnhancedStorage.instance) {
      EnhancedStorage.instance = new EnhancedStorage();
    }
    return EnhancedStorage.instance;
  }

  constructor() {
    this.initializeStorage();
    this.startAutoBackup();
  }

  private initializeStorage() {
    // Initialize metadata
    const metadata = this.getMetadata() as any;
    if (!metadata.version || metadata.version !== STORAGE_CONFIG.version) {
      this.setMetadata({
        version: STORAGE_CONFIG.version,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        totalRecords: 0,
        lastBackup: null,
      });
    }

    // Initialize default data if empty
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default admin user if no users exist
    const users = this.getUsers();
    if (users.length === 0) {
      this.createUser({
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@chabs.com',
        password: process.env.ADMIN_PASSWORD || 'defaultpass',
        role: 'admin',
        username: 'Administrator'
      });
      
      this.createUser({
        email: process.env.NEXT_PUBLIC_WAREHOUSE_EMAIL || 'warehouse@chabs.com',
        password: process.env.WAREHOUSE_PASSWORD || 'defaultpass',
        role: 'warehouse',
        username: 'Warehouse Manager'
      });
    }

    // Create sample data if empty
    if (this.getProducts().length === 0) {
      this.createSampleData();
    }
  }

  private createSampleData() {
    // Sample products
    const sampleProducts = [
      {
        name: 'Laptop Computer',
        sku: 'LAP001',
        description: 'High-performance business laptop',
        costPrice: 8000,
        sellingPrice: 12000,
        stock: 25,
        minimumStock: 5,
        maximumStock: 100,
        category: 'Electronics',
        location: 'A1-001'
      },
      {
        name: 'Office Chair',
        sku: 'CHR001',
        description: 'Ergonomic office chair with lumbar support',
        costPrice: 1500,
        sellingPrice: 2500,
        stock: 15,
        minimumStock: 3,
        maximumStock: 50,
        category: 'Furniture',
        location: 'B2-015'
      },
      {
        name: 'Wireless Mouse',
        sku: 'MOU001',
        description: 'Bluetooth wireless mouse',
        costPrice: 200,
        sellingPrice: 350,
        stock: 50,
        minimumStock: 10,
        maximumStock: 200,
        category: 'Accessories',
        location: 'A1-025'
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));

    // Sample customers
    const sampleCustomers = [
      {
        name: 'ABC Corporation',
        email: 'contact@abc-corp.com',
        phone: '+27 11 123 4567',
        address: '123 Business Street, Johannesburg, 2000'
      },
      {
        name: 'XYZ Enterprises',
        email: 'info@xyz-ent.co.za',
        phone: '+27 21 987 6543',
        address: '456 Commerce Ave, Cape Town, 8000'
      }
    ];

    sampleCustomers.forEach(customer => this.createCustomer(customer));

    // Sample suppliers
    const sampleSuppliers = [
      {
        name: 'Tech Distributors SA',
        email: 'sales@techsupply.co.za',
        phone: '+27 11 555 0123',
        address: '789 Industrial Road, Midrand, 1685',
        contactPerson: 'John Smith',
        paymentTerms: 'Net 30'
      }
    ];

    sampleSuppliers.forEach(supplier => this.createSupplier(supplier));
  }

  // Enhanced CRUD operations with validation and logging
  private validateData<T>(data: T, requiredFields: string[]): boolean {
    for (const field of requiredFields) {
      if (!(data as any)[field]) {
        console.warn(`Validation failed: Missing required field '${field}'`);
        return false;
      }
    }
    return true;
  }

  private logOperation(operation: string, entity: string, id?: string) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${operation} ${entity}${id ? ` (ID: ${id})` : ''}`);
  }

  // Generic storage methods
  private setItem<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      const serialized = JSON.stringify(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, serialized);
      }
      this.updateMetadata();
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      throw new Error(`Storage operation failed for ${key}`);
    }
  }

  private getItem<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return [];
    }
  }

  // Metadata management
  private getMetadata() {
    return this.getItem(KEYS.metadata)[0] || {};
  }

  private setMetadata(metadata: any) {
    this.setItem(KEYS.metadata, [{ ...metadata, lastUpdated: new Date().toISOString() }]);
  }

  private updateMetadata() {
    const metadata = this.getMetadata();
    const totalRecords = Object.keys(KEYS).reduce((total, key) => {
      if (key !== 'metadata' && key !== 'backups') {
        return total + this.getItem(KEYS[key as keyof typeof KEYS]).length;
      }
      return total;
    }, 0);

    this.setMetadata({
      ...metadata,
      totalRecords,
      lastUpdated: new Date().toISOString()
    });
  }

  // Product operations
  createProduct(productData: Partial<Product>): Product {
    if (!this.validateData(productData, ['name', 'sku', 'costPrice', 'sellingPrice'])) {
      throw new Error('Invalid product data');
    }

    const products = this.getProducts();
    
    // Check for duplicate SKU
    if (products.some(p => p.sku === productData.sku)) {
      throw new Error(`Product with SKU '${productData.sku}' already exists`);
    }

    const product: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      stock: 0,
      minimumStock: 5,
      maximumStock: 100,
      category: 'General',
      location: 'TBD',
      ...productData
    } as Product;

    products.push(product);
    this.setItem(KEYS.products, products);
    this.logOperation('CREATE', 'Product', product.id);
    
    return product;
  }

  getProducts(): Product[] {
    return this.getItem<Product>(KEYS.products);
  }

  updateProduct(id: string, updates: Partial<Product>): Product {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error(`Product with ID '${id}' not found`);
    }

    products[index] = { ...products[index], ...updates };
    this.setItem(KEYS.products, products);
    this.logOperation('UPDATE', 'Product', id);
    
    return products[index];
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      throw new Error(`Product with ID '${id}' not found`);
    }

    this.setItem(KEYS.products, filteredProducts);
    this.logOperation('DELETE', 'Product', id);
    
    return true;
  }

  // Customer operations
  createCustomer(customerData: Partial<Customer>): Customer {
    if (!this.validateData(customerData, ['name'])) {
      throw new Error('Invalid customer data');
    }

    const customers = this.getCustomers();
    const customer: Customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      email: '',
      phone: '',
      address: '',
      ...customerData
    } as Customer;

    customers.push(customer);
    this.setItem(KEYS.customers, customers);
    this.logOperation('CREATE', 'Customer', customer.id);
    
    return customer;
  }

  getCustomers(): Customer[] {
    return this.getItem<Customer>(KEYS.customers);
  }

  // Order operations
  createOrder(orderData: Partial<Order>): Order {
    if (!this.validateData(orderData, ['customerId', 'items'])) {
      throw new Error('Invalid order data');
    }

    const orders = this.getOrders();
    const orderNumber = `ORD-${Date.now()}`;
    
    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'pending',
      total: 0,
      items: [],
      ...orderData
    } as Order;

    // Calculate total
    order.total = order.items.reduce((sum, item) => sum + item.total, 0);

    orders.push(order);
    this.setItem(KEYS.orders, orders);
    this.logOperation('CREATE', 'Order', order.id);
    
    return order;
  }

  getOrders(): Order[] {
    return this.getItem<Order>(KEYS.orders);
  }

  // User operations
  createUser(userData: { email: string; password: string; role: 'admin' | 'warehouse'; username?: string }): User {
    const users = this.getUsers();
    
    // Check for duplicate email
    if (users.some(u => u.email === userData.email)) {
      throw new Error(`User with email '${userData.email}' already exists`);
    }

    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      password: userData.password, // In production, this should be hashed
      role: userData.role,
      firstName: '',
      lastName: '',
      permissions: [],
      createdAt: new Date().toISOString()
    };

    users.push(user);
    this.setItem(KEYS.users, users);
    this.logOperation('CREATE', 'User', user.id);
    
    return user;
  }

  getUsers(): User[] {
    return this.getItem<User>(KEYS.users);
  }

  // Supplier operations
  createSupplier(supplierData: Partial<Supplier>): Supplier {
    if (!this.validateData(supplierData, ['name'])) {
      throw new Error('Invalid supplier data');
    }

    const suppliers = this.getSuppliers();
    const supplier: Supplier = {
      id: `supp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      email: '',
      phone: '',
      address: '',
      ...supplierData
    } as Supplier;

    suppliers.push(supplier);
    this.setItem(KEYS.suppliers, suppliers);
    this.logOperation('CREATE', 'Supplier', supplier.id);
    
    return supplier;
  }

  getSuppliers(): Supplier[] {
    return this.getItem<Supplier>(KEYS.suppliers);
  }

  // Backup and restore operations
  createBackup(): string {
    const timestamp = new Date().toISOString();
    const backupId = `backup_${Date.now()}`;
    
    const backup = {
      id: backupId,
      timestamp,
      version: STORAGE_CONFIG.version,
      data: {
        products: this.getProducts(),
        orders: this.getOrders(),
        customers: this.getCustomers(),
        suppliers: this.getSuppliers(),
        users: this.getUsers(),
        metadata: this.getMetadata()
      }
    };

    const backups = this.getItem(KEYS.backups);
    backups.push(backup);

    // Keep only the latest backups
    if (backups.length > STORAGE_CONFIG.maxBackups) {
      backups.splice(0, backups.length - STORAGE_CONFIG.maxBackups);
    }

    this.setItem(KEYS.backups, backups);
    this.logOperation('CREATE', 'Backup', backupId);
    
    return backupId;
  }

  getBackups() {
    return this.getItem(KEYS.backups);
  }

  restoreBackup(backupId: string): boolean {
    const backups = this.getBackups();
    const backup = backups.find((b: any) => b.id === backupId);
    
    if (!backup) {
      throw new Error(`Backup with ID '${backupId}' not found`);
    }

    // Restore all data
    const backupData = backup as any;
    this.setItem(KEYS.products, backupData.data.products);
    this.setItem(KEYS.orders, backupData.data.orders);
    this.setItem(KEYS.customers, backupData.data.customers);
    this.setItem(KEYS.suppliers, backupData.data.suppliers);
    this.setItem(KEYS.users, backupData.data.users);
    
    this.logOperation('RESTORE', 'Backup', backupId);
    
    return true;
  }

  // Auto backup
  private startAutoBackup() {
    if (STORAGE_CONFIG.enableBackup && STORAGE_CONFIG.autoBackupInterval > 0) {
      this.backupTimer = setInterval(() => {
        this.createBackup();
        console.log('Auto backup created');
      }, STORAGE_CONFIG.autoBackupInterval);
    }
  }

  stopAutoBackup() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
    }
  }

  // Data export/import
  exportData(): string {
    const data = {
      version: STORAGE_CONFIG.version,
      timestamp: new Date().toISOString(),
      products: this.getProducts(),
      orders: this.getOrders(),
      customers: this.getCustomers(),
      suppliers: this.getSuppliers(),
      metadata: this.getMetadata()
    };

    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.version !== STORAGE_CONFIG.version) {
        console.warn(`Version mismatch: Expected ${STORAGE_CONFIG.version}, got ${data.version}`);
      }

      // Import data
      if (data.products) this.setItem(KEYS.products, data.products);
      if (data.orders) this.setItem(KEYS.orders, data.orders);
      if (data.customers) this.setItem(KEYS.customers, data.customers);
      if (data.suppliers) this.setItem(KEYS.suppliers, data.suppliers);

      this.logOperation('IMPORT', 'Data');
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  // Storage statistics
  getStorageStats() {
    const stats = {
      version: STORAGE_CONFIG.version,
      totalRecords: 0,
      storageSize: 0,
      entities: {} as Record<string, number>
    };

    Object.entries(KEYS).forEach(([entity, key]) => {
      if (entity !== 'metadata' && entity !== 'backups') {
        const items = this.getItem(key);
        stats.entities[entity] = items.length;
        stats.totalRecords += items.length;
        
        const size = new Blob([JSON.stringify(items)]).size;
        stats.storageSize += size;
      }
    });

    return stats;
  }

  // Clear all data (for testing)
  clearAllData(): boolean {
    Object.values(KEYS).forEach(key => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    });
    
    this.logOperation('CLEAR', 'All Data');
    this.initializeStorage();
    
    return true;
  }
}

// Export singleton instance
export const storage = EnhancedStorage.getInstance();

// Export individual functions for backward compatibility
export const createProduct = (data: Partial<Product>) => storage.createProduct(data);
export const getProducts = () => storage.getProducts();
export const updateProduct = (id: string, updates: Partial<Product>) => storage.updateProduct(id, updates);
export const deleteProduct = (id: string) => storage.deleteProduct(id);

export const createCustomer = (data: Partial<Customer>) => storage.createCustomer(data);
export const getCustomers = () => storage.getCustomers();

export const createOrder = (data: Partial<Order>) => storage.createOrder(data);
export const getOrders = () => storage.getOrders();

export const createSupplier = (data: Partial<Supplier>) => storage.createSupplier(data);
export const getSuppliers = () => storage.getSuppliers();

export const getUsers = () => storage.getUsers();
export const createUser = (data: { email: string; password: string; role: 'admin' | 'warehouse'; username?: string }) => storage.createUser(data);

// Export utility functions
export const createBackup = () => storage.createBackup();
export const getBackups = () => storage.getBackups();
export const restoreBackup = (id: string) => storage.restoreBackup(id);
export const exportData = () => storage.exportData();
export const importData = (data: string) => storage.importData(data);
export const getStorageStats = () => storage.getStorageStats();
export const clearAllData = () => storage.clearAllData();

export default storage;