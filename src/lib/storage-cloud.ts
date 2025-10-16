/**
 * Cloud Storage Implementation using Supabase
 * Production-ready database storage with real-time capabilities
 */

import { createClient } from '@supabase/supabase-js';
import { 
  Product, Order, Customer, Supplier, Quotation, User, 
  StockMovement, AutomationRule, SupplierPrice 
} from './types';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Database table names
const TABLES = {
  products: 'products',
  orders: 'orders',
  order_items: 'order_items',
  customers: 'customers',
  suppliers: 'suppliers',
  quotations: 'quotations',
  quotation_items: 'quotation_items',
  users: 'users',
  stock_movements: 'stock_movements',
  automation_rules: 'automation_rules',
  ai_insights: 'ai_insights',
  supplier_prices: 'supplier_prices',
};

class CloudStorage {
  private static instance: CloudStorage;

  static getInstance(): CloudStorage {
    if (!CloudStorage.instance) {
      CloudStorage.instance = new CloudStorage();
    }
    return CloudStorage.instance;
  }

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase not configured. Cloud storage will not be available.');
      return;
    }

    try {
      // Test connection
      const { data, error } = await supabase.from(TABLES.products).select('count').limit(1);
      if (error) {
        console.error('Supabase connection failed:', error);
      } else {
        console.log('Supabase connected successfully');
      }
    } catch (error) {
      console.error('Failed to initialize cloud storage:', error);
    }
  }

  // Generic error handler
  private handleError(error: any, operation: string) {
    console.error(`Cloud storage ${operation} failed:`, error);
    throw new Error(`${operation} failed: ${error.message}`);
  }

  // Product operations
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const product = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        stock: 0,
        category: 'General',
        location: 'TBD',
        ...productData,
        cost_price: productData.costPrice,
        selling_price: productData.sellingPrice,
        minimum_stock: productData.minimumStock || 5,
        maximum_stock: productData.maximumStock || 100,
      };

      const { data, error } = await supabase
        .from(TABLES.products)
        .insert([product])
        .select()
        .single();

      if (error) this.handleError(error, 'Create product');

      // Convert snake_case back to camelCase
      return this.convertProductFromDb(data);
    } catch (error) {
      this.handleError(error, 'Create product');
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.products)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) this.handleError(error, 'Get products');

      return data ? data.map(this.convertProductFromDb) : [];
    } catch (error) {
      this.handleError(error, 'Get products');
      return [];
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const dbUpdates = {
        ...updates,
        cost_price: updates.costPrice,
        selling_price: updates.sellingPrice,
        minimum_stock: updates.minimumStock,
        maximum_stock: updates.maximumStock,
      };

      const { data, error } = await supabase
        .from(TABLES.products)
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) this.handleError(error, 'Update product');

      return this.convertProductFromDb(data);
    } catch (error) {
      this.handleError(error, 'Update product');
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.products)
        .delete()
        .eq('id', id);

      if (error) this.handleError(error, 'Delete product');

      return true;
    } catch (error) {
      this.handleError(error, 'Delete product');
      return false;
    }
  }

  // Customer operations
  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      const customer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        email: '',
        phone: '',
        address: '',
        ...customerData,
      };

      const { data, error } = await supabase
        .from(TABLES.customers)
        .insert([customer])
        .select()
        .single();

      if (error) this.handleError(error, 'Create customer');

      return this.convertCustomerFromDb(data);
    } catch (error) {
      this.handleError(error, 'Create customer');
      throw error;
    }
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.customers)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) this.handleError(error, 'Get customers');

      return data ? data.map(this.convertCustomerFromDb) : [];
    } catch (error) {
      this.handleError(error, 'Get customers');
      return [];
    }
  }

  // Order operations
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const orderNumber = `ORD-${Date.now()}`;
      const order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order_number: orderNumber,
        created_at: new Date().toISOString(),
        status: 'pending',
        total: 0,
        customer_id: orderData.customerId,
        ...orderData,
      };

      // Calculate total
      if (orderData.items) {
        order.total = orderData.items.reduce((sum, item) => sum + item.total, 0);
      }

      const { data, error } = await supabase
        .from(TABLES.orders)
        .insert([order])
        .select()
        .single();

      if (error) this.handleError(error, 'Create order');

      // Insert order items
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: data.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.total,
        }));

        const { error: itemsError } = await supabase
          .from(TABLES.order_items)
          .insert(orderItems);

        if (itemsError) this.handleError(itemsError, 'Create order items');
      }

      return this.convertOrderFromDb(data, orderData.items || []);
    } catch (error) {
      this.handleError(error, 'Create order');
      throw error;
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const { data: orders, error } = await supabase
        .from(TABLES.orders)
        .select(`
          *,
          order_items (
            product_id,
            quantity,
            price,
            total
          )
        `)
        .order('created_at', { ascending: false });

      if (error) this.handleError(error, 'Get orders');

      return orders ? orders.map(order => this.convertOrderFromDb(order, order.order_items || [])) : [];
    } catch (error) {
      this.handleError(error, 'Get orders');
      return [];
    }
  }

  // Supplier operations
  async createSupplier(supplierData: Partial<Supplier>): Promise<Supplier> {
    try {
      const supplier = {
        id: `supp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        email: '',
        phone: '',
        address: '',
        contact_person: supplierData.contactPerson,
        payment_terms: supplierData.paymentTerms,
        ...supplierData,
      };

      const { data, error } = await supabase
        .from(TABLES.suppliers)
        .insert([supplier])
        .select()
        .single();

      if (error) this.handleError(error, 'Create supplier');

      return this.convertSupplierFromDb(data);
    } catch (error) {
      this.handleError(error, 'Create supplier');
      throw error;
    }
  }

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.suppliers)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) this.handleError(error, 'Get suppliers');

      return data ? data.map(this.convertSupplierFromDb) : [];
    } catch (error) {
      this.handleError(error, 'Get suppliers');
      return [];
    }
  }

  // User operations
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.users)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) this.handleError(error, 'Get users');

      return data ? data.map(this.convertUserFromDb) : [];
    } catch (error) {
      this.handleError(error, 'Get users');
      return [];
    }
  }

  async createUser(userData: { email: string; password: string; role: 'admin' | 'warehouse'; username?: string }): Promise<User> {
    try {
      const user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        password: userData.password, // In production, this should be hashed
        role: userData.role,
        username: userData.username || userData.email.split('@')[0],
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.users)
        .insert([user])
        .select()
        .single();

      if (error) this.handleError(error, 'Create user');

      return this.convertUserFromDb(data);
    } catch (error) {
      this.handleError(error, 'Create user');
      throw error;
    }
  }

  // Data conversion helpers (snake_case <-> camelCase)
  private convertProductFromDb(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      sku: dbProduct.sku,
      description: dbProduct.description,
      category: dbProduct.category,
      unit: dbProduct.unit || 'EA',
      costPrice: dbProduct.cost_price,
      sellingPrice: dbProduct.selling_price,
      markup: dbProduct.markup || 0,
      stock: dbProduct.stock,
      minimumStock: dbProduct.minimum_stock,
      maximumStock: dbProduct.maximum_stock,
      location: dbProduct.location,
      barcode: dbProduct.barcode,
      createdAt: dbProduct.created_at,
      updatedAt: dbProduct.updated_at || dbProduct.created_at,
    };
  }

  private convertCustomerFromDb(dbCustomer: any): Customer {
    return {
      id: dbCustomer.id,
      name: dbCustomer.name,
      email: dbCustomer.email,
      phone: dbCustomer.phone,
      address: dbCustomer.address,
      createdAt: dbCustomer.created_at,
    };
  }

  private convertOrderFromDb(dbOrder: any, items: any[]): Order {
    return {
      id: dbOrder.id,
      orderNumber: dbOrder.order_number,
      quotationId: dbOrder.quotation_id,
      customerId: dbOrder.customer_id,
      items: items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.price,
        discount: item.discount || 0,
        total: item.total,
      })),
      subtotal: dbOrder.subtotal || dbOrder.total,
      taxRate: dbOrder.tax_rate || 0,
      taxAmount: dbOrder.tax_amount || 0,
      total: dbOrder.total,
      status: dbOrder.status,
      priority: dbOrder.priority || 'medium',
      expectedDelivery: dbOrder.expected_delivery,
      actualDelivery: dbOrder.actual_delivery,
      createdAt: dbOrder.created_at,
      updatedAt: dbOrder.updated_at || dbOrder.created_at,
      notes: dbOrder.notes,
      warehouseNotes: dbOrder.warehouse_notes,
      trackingNumber: dbOrder.tracking_number,
    };
  }

  private convertSupplierFromDb(dbSupplier: any): Supplier {
    return {
      id: dbSupplier.id,
      name: dbSupplier.name,
      email: dbSupplier.email,
      phone: dbSupplier.phone,
      address: dbSupplier.address,
      contactPerson: dbSupplier.contact_person,
      paymentTerms: dbSupplier.payment_terms,
      createdAt: dbSupplier.created_at,
    };
  }

  private convertUserFromDb(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      password: dbUser.password,
      role: dbUser.role,
      firstName: dbUser.first_name || '',
      lastName: dbUser.last_name || '',
      permissions: dbUser.permissions || [],
      createdAt: dbUser.created_at,
      lastLogin: dbUser.last_login,
    };
  }

  // Real-time subscriptions
  subscribeToProducts(callback: (products: Product[]) => void) {
    return supabase
      .channel('products')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.products }, () => {
        this.getProducts().then(callback);
      })
      .subscribe();
  }

  subscribeToOrders(callback: (orders: Order[]) => void) {
    return supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.orders }, () => {
        this.getOrders().then(callback);
      })
      .subscribe();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from(TABLES.products).select('count').limit(1);
      return !error;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const cloudStorage = CloudStorage.getInstance();

// Export individual functions
export const createProduct = (data: Partial<Product>) => cloudStorage.createProduct(data);
export const getProducts = () => cloudStorage.getProducts();
export const updateProduct = (id: string, updates: Partial<Product>) => cloudStorage.updateProduct(id, updates);
export const deleteProduct = (id: string) => cloudStorage.deleteProduct(id);

export const createCustomer = (data: Partial<Customer>) => cloudStorage.createCustomer(data);
export const getCustomers = () => cloudStorage.getCustomers();

export const createOrder = (data: Partial<Order>) => cloudStorage.createOrder(data);
export const getOrders = () => cloudStorage.getOrders();

export const createSupplier = (data: Partial<Supplier>) => cloudStorage.createSupplier(data);
export const getSuppliers = () => cloudStorage.getSuppliers();

export const getUsers = () => cloudStorage.getUsers();
export const createUser = (data: { email: string; password: string; role: 'admin' | 'warehouse'; username?: string }) => cloudStorage.createUser(data);

// Export utility functions
export const subscribeToProducts = (callback: (products: Product[]) => void) => cloudStorage.subscribeToProducts(callback);
export const subscribeToOrders = (callback: (orders: Order[]) => void) => cloudStorage.subscribeToOrders(callback);
export const healthCheck = () => cloudStorage.healthCheck();

export default cloudStorage;