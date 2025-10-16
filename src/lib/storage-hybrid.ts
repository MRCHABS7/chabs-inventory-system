/**
 * Hybrid Storage System - Seamlessly switch between Local and Cloud Storage
 * Perfect for development, testing, and production environments
 */

import { 
  Product, Order, Customer, Supplier, Quotation, User, 
  StockMovement, AutomationRule, SupplierPrice 
} from './types';

// Storage providers
import * as LocalStorage from './storage-enhanced';
import * as CloudStorage from './storage-cloud';

// Configuration
const STORAGE_MODE = process.env.NEXT_PUBLIC_STORAGE_MODE || 'local'; // 'local' | 'cloud' | 'hybrid'
const ENABLE_SYNC = process.env.NEXT_PUBLIC_ENABLE_SYNC === 'true';
const SYNC_INTERVAL = parseInt(process.env.NEXT_PUBLIC_SYNC_INTERVAL || '30000'); // 30 seconds

interface StorageProvider {
  // Product operations
  createProduct(data: Partial<Product>): Promise<Product> | Product;
  getProducts(): Promise<Product[]> | Product[];
  updateProduct(id: string, updates: Partial<Product>): Promise<Product> | Product;
  deleteProduct(id: string): Promise<boolean> | boolean;

  // Customer operations
  createCustomer(data: Partial<Customer>): Promise<Customer> | Customer;
  getCustomers(): Promise<Customer[]> | Customer[];

  // Order operations
  createOrder(data: Partial<Order>): Promise<Order> | Order;
  getOrders(): Promise<Order[]> | Order[];

  // Supplier operations
  createSupplier(data: Partial<Supplier>): Promise<Supplier> | Supplier;
  getSuppliers(): Promise<Supplier[]> | Supplier[];

  // User operations
  getUsers(): Promise<User[]> | User[];
  createUser(data: { email: string; password: string; role: 'admin' | 'warehouse'; username?: string }): Promise<User> | User;
}

class HybridStorage {
  private static instance: HybridStorage;
  private primaryProvider!: StorageProvider;
  private secondaryProvider?: StorageProvider;
  private syncTimer?: NodeJS.Timeout;
  private isOnline: boolean = true;

  static getInstance(): HybridStorage {
    if (!HybridStorage.instance) {
      HybridStorage.instance = new HybridStorage();
    }
    return HybridStorage.instance;
  }

  constructor() {
    this.initializeProviders();
    this.setupNetworkDetection();
    if (ENABLE_SYNC) {
      this.startSync();
    }
  }

  private initializeProviders() {
    switch (STORAGE_MODE) {
      case 'cloud':
        this.primaryProvider = CloudStorage;
        this.secondaryProvider = LocalStorage;
        break;
      case 'hybrid':
        this.primaryProvider = this.isOnline ? CloudStorage : LocalStorage;
        this.secondaryProvider = this.isOnline ? LocalStorage : CloudStorage;
        break;
      default: // 'local'
        this.primaryProvider = LocalStorage;
        this.secondaryProvider = CloudStorage;
        break;
    }

    console.log(`Storage initialized: Primary=${STORAGE_MODE}, Sync=${ENABLE_SYNC}`);
  }

  private setupNetworkDetection() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      
      window.addEventListener('online', () => {
        this.isOnline = true;
        console.log('Network: Online - Switching to cloud storage');
        if (STORAGE_MODE === 'hybrid') {
          this.switchToCloudStorage();
        }
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        console.log('Network: Offline - Switching to local storage');
        if (STORAGE_MODE === 'hybrid') {
          this.switchToLocalStorage();
        }
      });
    }
  }

  private switchToCloudStorage() {
    this.primaryProvider = CloudStorage;
    this.secondaryProvider = LocalStorage;
    this.syncToCloud();
  }

  private switchToLocalStorage() {
    this.primaryProvider = LocalStorage;
    this.secondaryProvider = CloudStorage;
  }

  private async syncToCloud() {
    if (!this.isOnline || !this.secondaryProvider) return;

    try {
      console.log('Syncing local data to cloud...');
      
      // Get local data
      const localProducts = await this.makeAsync(LocalStorage.getProducts());
      const localCustomers = await this.makeAsync(LocalStorage.getCustomers());
      const localOrders = await this.makeAsync(LocalStorage.getOrders());
      const localSuppliers = await this.makeAsync(LocalStorage.getSuppliers());

      // Sync to cloud (this would need implementation in cloud storage)
      // For now, we'll just log the sync operation
      console.log(`Syncing ${localProducts.length} products, ${localCustomers.length} customers, ${localOrders.length} orders, ${localSuppliers.length} suppliers`);
      
    } catch (error) {
      console.error('Sync to cloud failed:', error);
    }
  }

  private startSync() {
    this.syncTimer = setInterval(() => {
      if (STORAGE_MODE === 'hybrid' && this.isOnline) {
        this.syncToCloud();
      }
    }, SYNC_INTERVAL);
  }

  private stopSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = undefined;
    }
  }

  // Utility to make sync operations async-compatible
  private async makeAsync<T>(operation: T | Promise<T>): Promise<T> {
    return Promise.resolve(operation);
  }

  // Generic operation handler with fallback
  private async executeOperation<T>(
    operation: (provider: StorageProvider) => T | Promise<T>,
    fallbackOperation?: (provider: StorageProvider) => T | Promise<T>
  ): Promise<T> {
    try {
      const result = await this.makeAsync(operation(this.primaryProvider));
      return result;
    } catch (error) {
      console.warn('Primary storage operation failed:', error);
      
      if (this.secondaryProvider && fallbackOperation) {
        try {
          console.log('Attempting fallback to secondary storage...');
          const result = await this.makeAsync(fallbackOperation(this.secondaryProvider));
          return result;
        } catch (fallbackError) {
          console.error('Secondary storage operation also failed:', fallbackError);
          throw fallbackError;
        }
      }
      
      throw error;
    }
  }

  // Product operations
  async createProduct(data: Partial<Product>): Promise<Product> {
    return this.executeOperation(
      (provider) => provider.createProduct(data),
      (provider) => provider.createProduct(data)
    );
  }

  async getProducts(): Promise<Product[]> {
    return this.executeOperation(
      (provider) => provider.getProducts(),
      (provider) => provider.getProducts()
    );
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return this.executeOperation(
      (provider) => provider.updateProduct(id, updates),
      (provider) => provider.updateProduct(id, updates)
    );
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.executeOperation(
      (provider) => provider.deleteProduct(id),
      (provider) => provider.deleteProduct(id)
    );
  }

  // Customer operations
  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return this.executeOperation(
      (provider) => provider.createCustomer(data),
      (provider) => provider.createCustomer(data)
    );
  }

  async getCustomers(): Promise<Customer[]> {
    return this.executeOperation(
      (provider) => provider.getCustomers(),
      (provider) => provider.getCustomers()
    );
  }

  // Order operations
  async createOrder(data: Partial<Order>): Promise<Order> {
    return this.executeOperation(
      (provider) => provider.createOrder(data),
      (provider) => provider.createOrder(data)
    );
  }

  async getOrders(): Promise<Order[]> {
    return this.executeOperation(
      (provider) => provider.getOrders(),
      (provider) => provider.getOrders()
    );
  }

  // Supplier operations
  async createSupplier(data: Partial<Supplier>): Promise<Supplier> {
    return this.executeOperation(
      (provider) => provider.createSupplier(data),
      (provider) => provider.createSupplier(data)
    );
  }

  async getSuppliers(): Promise<Supplier[]> {
    return this.executeOperation(
      (provider) => provider.getSuppliers(),
      (provider) => provider.getSuppliers()
    );
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return this.executeOperation(
      (provider) => provider.getUsers(),
      (provider) => provider.getUsers()
    );
  }

  async createUser(data: { email: string; password: string; role: 'admin' | 'warehouse'; username?: string }): Promise<User> {
    return this.executeOperation(
      (provider) => provider.createUser(data),
      (provider) => provider.createUser(data)
    );
  }

  // Storage management
  getStorageInfo() {
    return {
      mode: STORAGE_MODE,
      isOnline: this.isOnline,
      primaryProvider: this.primaryProvider === LocalStorage ? 'local' : 'cloud',
      secondaryProvider: this.secondaryProvider === LocalStorage ? 'local' : 'cloud',
      syncEnabled: ENABLE_SYNC,
      syncInterval: SYNC_INTERVAL
    };
  }

  async switchStorageMode(mode: 'local' | 'cloud' | 'hybrid') {
    console.log(`Switching storage mode to: ${mode}`);
    
    // Update environment variable (for current session)
    if (typeof window !== 'undefined') {
      (window as any).NEXT_PUBLIC_STORAGE_MODE = mode;
    }
    
    // Reinitialize providers
    this.initializeProviders();
    
    return this.getStorageInfo();
  }

  // Backup and sync operations
  async createBackup(): Promise<string> {
    if (this.primaryProvider === LocalStorage) {
      return LocalStorage.createBackup();
    } else {
      // For cloud storage, implement cloud backup
      throw new Error('Cloud backup not implemented yet');
    }
  }

  async exportData(): Promise<string> {
    if (this.primaryProvider === LocalStorage) {
      return LocalStorage.exportData();
    } else {
      // For cloud storage, implement cloud export
      throw new Error('Cloud export not implemented yet');
    }
  }

  async importData(data: string): Promise<boolean> {
    if (this.primaryProvider === LocalStorage) {
      return LocalStorage.importData(data);
    } else {
      // For cloud storage, implement cloud import
      throw new Error('Cloud import not implemented yet');
    }
  }

  async getStorageStats() {
    if (this.primaryProvider === LocalStorage) {
      return LocalStorage.getStorageStats();
    } else {
      // For cloud storage, implement cloud stats
      return {
        version: '2.0.0',
        totalRecords: 0,
        storageSize: 0,
        entities: {}
      };
    }
  }

  // Cleanup
  destroy() {
    this.stopSync();
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    }
  }
}

// Export singleton instance
export const hybridStorage = HybridStorage.getInstance();

// Export wrapper functions that work with both sync and async operations
export const createProduct = async (data: Partial<Product>) => hybridStorage.createProduct(data);
export const getProducts = async () => hybridStorage.getProducts();
export const updateProduct = async (id: string, updates: Partial<Product>) => hybridStorage.updateProduct(id, updates);
export const deleteProduct = async (id: string) => hybridStorage.deleteProduct(id);

export const createCustomer = async (data: Partial<Customer>) => hybridStorage.createCustomer(data);
export const getCustomers = async () => hybridStorage.getCustomers();

export const createOrder = async (data: Partial<Order>) => hybridStorage.createOrder(data);
export const getOrders = async () => hybridStorage.getOrders();

export const createSupplier = async (data: Partial<Supplier>) => hybridStorage.createSupplier(data);
export const getSuppliers = async () => hybridStorage.getSuppliers();

export const getUsers = async () => hybridStorage.getUsers();
export const createUser = async (data: { email: string; password: string; role: 'admin' | 'warehouse'; username?: string }) => hybridStorage.createUser(data);

// Export utility functions
export const getStorageInfo = () => hybridStorage.getStorageInfo();
export const switchStorageMode = (mode: 'local' | 'cloud' | 'hybrid') => hybridStorage.switchStorageMode(mode);
export const createBackup = async () => hybridStorage.createBackup();
export const exportData = async () => hybridStorage.exportData();
export const importData = async (data: string) => hybridStorage.importData(data);
export const getStorageStats = async () => hybridStorage.getStorageStats();

export default hybridStorage;