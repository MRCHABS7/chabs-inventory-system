import { v4 as uuid } from 'uuid';
import type { Customer, Product, Quotation, CompanyDetails, User, ID, Supplier, Order, StockMovement, SupplierPrice, PurchaseOrder, AutomationRule, DemandForecast } from './types';

const KEY = {
  customers: 'chabs_customers',
  products: 'chabs_products',
  quotations: 'chabs_quotations',
  orders: 'chabs_orders',
  suppliers: 'chabs_suppliers',
  supplierPrices: 'chabs_supplier_prices',
  stockMovements: 'chabs_stock_movements',
  purchaseOrders: 'chabs_purchase_orders',
  automationRules: 'chabs_automation_rules',
  demandForecasts: 'chabs_demand_forecasts',
  company: 'chabs_company',
  users: 'chabs_users',
  session: 'chabs_session'
} as const;

const get = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const set = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Customers
export const listCustomers = (): Customer[] => get<Customer[]>(KEY.customers, []);
export const createCustomer = (c: Omit<Customer, 'id'>): Customer => {
  const all = listCustomers();
  const next: Customer = { ...c, id: uuid() };
  set(KEY.customers, [next, ...all]);
  return next;
};
export const updateCustomer = (id: ID, patch: Partial<Customer>): Customer | null => {
  const all = listCustomers();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch } as Customer;
  all[idx] = updated;
  set(KEY.customers, all);
  return updated;
};
export const deleteCustomer = (id: ID) => {
  const all = listCustomers().filter(c => c.id !== id);
  set(KEY.customers, all);
};

// Products
export const listProducts = (): Product[] => get<Product[]>(KEY.products, []);
export const createProduct = (p: Omit<Product, 'id'>): Product => {
  const all = listProducts();
  const next: Product = { ...p, id: uuid() };
  set(KEY.products, [next, ...all]);
  return next;
};
export const updateProduct = (id: ID, patch: Partial<Product>): Product | null => {
  const all = listProducts();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch } as Product;
  all[idx] = updated;
  set(KEY.products, all);
  return updated;
};
export const deleteProduct = (id: ID) => {
  const all = listProducts().filter(p => p.id !== id);
  set(KEY.products, all);
};

// Quotations
export const listQuotations = (): Quotation[] => get<Quotation[]>(KEY.quotations, []);
export const createQuotation = (q: Omit<Quotation, 'id' | 'createdAt'>): Quotation => {
  const all = listQuotations();
  const next: Quotation = { ...q, id: uuid(), createdAt: new Date().toISOString() };
  set(KEY.quotations, [next, ...all]);
  return next;
};
export const updateQuotation = (id: ID, patch: Partial<Quotation>): Quotation | null => {
  const all = listQuotations();
  const idx = all.findIndex(q => q.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch } as Quotation;
  all[idx] = updated;
  set(KEY.quotations, all);
  return updated;
};
export const deleteQuotation = (id: ID) => {
  const all = listQuotations().filter(q => q.id !== id);
  set(KEY.quotations, all);
};

// Company
export const getCompany = (): CompanyDetails => get<CompanyDetails>(KEY.company, { 
  name: 'Your Company', 
  currency: 'ZAR', 
  taxRate: 0 
});
export const setCompany = (c: CompanyDetails) => set(KEY.company, c);

// Auth (very simple localStorage auth)
export const listUsers = (): User[] => get<User[]>(KEY.users, []);
export const upsertUser = (u: User) => {
  const users = listUsers();
  const idx = users.findIndex(x => x.email === u.email);
  if (idx === -1) users.push(u); else users[idx] = u;
  set(KEY.users, users);
};
export const loginLocal = (email: string, password: string, role: User['role']) => {
  // For demo purposes, accept any non-empty credentials
  if (!email.trim() || !password.trim()) {
    return false;
  }
  
  const users = listUsers();
  const existing = users.find(u => u.email === email);
  
  if (!existing) {
    // Create new user with provided credentials
    upsertUser({ 
      id: email,
      email, 
      password, 
      role,
      firstName: '',
      lastName: '',
      permissions: [],
      createdAt: new Date().toISOString()
    });
  } else {
    // For demo: always accept login for existing users, update their role if needed
    if (existing.role !== role) {
      upsertUser({ 
        id: existing.id,
        email, 
        password: existing.password, 
        role,
        firstName: existing.firstName,
        lastName: existing.lastName,
        permissions: existing.permissions,
        createdAt: existing.createdAt
      });
    }
  }
  
  set(KEY.session, { email, role });
  return true;
};
export const logoutLocal = () => set(KEY.session, null);
export const currentSession = (): User | null => {
  const session = get<{email: string, role: string} | null>(KEY.session, null);
  if (!session) return null;
  
  // Get full user data from users list
  const users = listUsers();
  const user = users.find(u => u.email === session.email);
  return user || null;
};

// Suppliers

export const listSuppliers = (): Supplier[] => get<Supplier[]>(KEY.suppliers, []);
export const createSupplier = (s: Omit<Supplier, 'id' | 'createdAt'>): Supplier => {
  const all = listSuppliers();
  const next: Supplier = { ...s, id: uuid(), createdAt: new Date().toISOString() };
  set(KEY.suppliers, [next, ...all]);
  return next;
};
export const updateSupplier = (id: ID, patch: Partial<Supplier>): Supplier | null => {
  const all = listSuppliers();
  const idx = all.findIndex(s => s.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch } as Supplier;
  all[idx] = updated;
  set(KEY.suppliers, all);
  return updated;
};
export const deleteSupplier = (id: ID) => {
  const all = listSuppliers().filter(s => s.id !== id);
  set(KEY.suppliers, all);
};

// Orders
export const listOrders = (): Order[] => get<Order[]>(KEY.orders, []);
export const createOrder = (o: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
  const all = listOrders();
  const orderNumber = `ORD-${Date.now()}`;
  const next: Order = { 
    ...o, 
    id: uuid(), 
    orderNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  set(KEY.orders, [next, ...all]);
  return next;
};
export const updateOrder = (id: ID, patch: Partial<Order>): Order | null => {
  const all = listOrders();
  const idx = all.findIndex(o => o.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() } as Order;
  all[idx] = updated;
  set(KEY.orders, all);
  return updated;
};
export const deleteOrder = (id: ID) => {
  const all = listOrders().filter(o => o.id !== id);
  set(KEY.orders, all);
};

// Stock Movements
export const listStockMovements = (): StockMovement[] => get<StockMovement[]>(KEY.stockMovements, []);
export const createStockMovement = (sm: Omit<StockMovement, 'id' | 'createdAt'>): StockMovement => {
  const all = listStockMovements();
  const next: StockMovement = { ...sm, id: uuid(), createdAt: new Date().toISOString() };
  set(KEY.stockMovements, [next, ...all]);
  return next;
};

// Supplier Prices
export const listSupplierPrices = (): SupplierPrice[] => get<SupplierPrice[]>(KEY.supplierPrices, []);
export const createSupplierPrice = (sp: Omit<SupplierPrice, 'id' | 'createdAt'>): SupplierPrice => {
  const all = listSupplierPrices();
  const next: SupplierPrice = { ...sp, id: uuid(), createdAt: new Date().toISOString() };
  set(KEY.supplierPrices, [next, ...all]);
  return next;
};
export const updateSupplierPrice = (id: ID, patch: Partial<SupplierPrice>): SupplierPrice | null => {
  const all = listSupplierPrices();
  const idx = all.findIndex(sp => sp.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch } as SupplierPrice;
  all[idx] = updated;
  set(KEY.supplierPrices, all);
  return updated;
};
export const deleteSupplierPrice = (id: ID) => {
  const all = listSupplierPrices().filter(sp => sp.id !== id);
  set(KEY.supplierPrices, all);
};

// Helper functions for business logic
export const getBestSupplierPrice = (productId: ID): { supplierId: ID; price: number } | null => {
  const prices = listSupplierPrices().filter(sp => sp.productId === productId);
  if (prices.length === 0) return null;
  
  const best = prices.reduce((min, current) => 
    current.price < min.price ? current : min
  );
  
  return { supplierId: best.supplierId, price: best.price };
};

export const calculateProfitAnalysis = (productId: ID, sellingPrice: number) => {
  const product = listProducts().find(p => p.id === productId);
  if (!product) return null;
  
  const bestPrice = getBestSupplierPrice(productId);
  const costPrice = bestPrice?.price || product.costPrice;
  const profit = sellingPrice - costPrice;
  const profitMargin = (profit / sellingPrice) * 100;
  const markup = (profit / costPrice) * 100;
  
  return {
    productId,
    costPrice,
    sellingPrice,
    markup,
    profit,
    profitMargin,
    bestSupplierPrice: bestPrice?.price,
    bestSupplierId: bestPrice?.supplierId
  };
};

export const convertQuotationToOrder = (quotationId: ID): Order | null => {
  const quotation = listQuotations().find(q => q.id === quotationId);
  if (!quotation) return null;
  
  const order = createOrder({
    orderNumber: `ORD-${Date.now()}`,
    quotationId,
    customerId: quotation.customerId,
    items: quotation.items,
    subtotal: quotation.subtotal,
    taxRate: quotation.taxRate,
    taxAmount: quotation.taxAmount,
    total: quotation.total,
    status: 'pending',
    priority: 'medium'
  });
  
  // Mark quotation as converted
  updateQuotation(quotationId, { convertedToOrder: true, orderId: order.id });
  
  return order;
};

// Purchase Orders
export const listPurchaseOrders = (): PurchaseOrder[] => get<PurchaseOrder[]>(KEY.purchaseOrders, []);
export const createPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'updatedAt'>): PurchaseOrder => {
  const all = listPurchaseOrders();
  const poNumber = `PO-${Date.now()}`;
  const next: PurchaseOrder = { 
    ...po, 
    id: uuid(), 
    poNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  set(KEY.purchaseOrders, [next, ...all]);
  return next;
};
export const updatePurchaseOrder = (id: ID, patch: Partial<PurchaseOrder>): PurchaseOrder | null => {
  const all = listPurchaseOrders();
  const idx = all.findIndex(po => po.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() } as PurchaseOrder;
  all[idx] = updated;
  set(KEY.purchaseOrders, all);
  return updated;
};
export const deletePurchaseOrder = (id: ID) => {
  const all = listPurchaseOrders().filter(po => po.id !== id);
  set(KEY.purchaseOrders, all);
};

// Automation Rules
export const listAutomationRules = (): AutomationRule[] => get<AutomationRule[]>(KEY.automationRules, []);
export const createAutomationRule = (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'triggerCount'>): AutomationRule => {
  const all = listAutomationRules();
  const next: AutomationRule = { 
    ...rule, 
    id: uuid(), 
    triggerCount: 0,
    createdAt: new Date().toISOString()
  };
  set(KEY.automationRules, [next, ...all]);
  return next;
};
export const updateAutomationRule = (id: ID, patch: Partial<AutomationRule>): AutomationRule | null => {
  const all = listAutomationRules();
  const idx = all.findIndex(rule => rule.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch } as AutomationRule;
  all[idx] = updated;
  set(KEY.automationRules, all);
  return updated;
};
export const deleteAutomationRule = (id: ID) => {
  const all = listAutomationRules().filter(rule => rule.id !== id);
  set(KEY.automationRules, all);
};



// Demand Forecasts
export const listDemandForecasts = (): DemandForecast[] => get<DemandForecast[]>(KEY.demandForecasts, []);
export const createDemandForecast = (forecast: Omit<DemandForecast, 'id' | 'createdAt'>): DemandForecast => {
  const all = listDemandForecasts();
  const next: DemandForecast = { 
    ...forecast, 
    createdAt: new Date().toISOString()
  };
  set(KEY.demandForecasts, [next, ...all]);
  return next;
};

// Advanced Business Logic & Automation
export const checkAutomationRules = () => {
  const rules = listAutomationRules().filter(rule => rule.isActive);
  const products = listProducts();
  const suppliers = listSuppliers();
  const supplierPrices = listSupplierPrices();
  
  rules.forEach(rule => {
    switch (rule.type) {
      case 'reorder_point':
        checkReorderPoints(rule, products, suppliers, supplierPrices);
        break;
      case 'low_stock':
        checkLowStock(rule, products);
        break;
      case 'supplier_price':
        checkSupplierPrices(rule, supplierPrices);
        break;
    }
  });
};

const checkReorderPoints = (rule: AutomationRule, products: Product[], suppliers: Supplier[], supplierPrices: SupplierPrice[]) => {
  const lowStockProducts = products.filter(p => 
    p.stock <= p.minimumStock && 
    (!rule.conditions.productIds || rule.conditions.productIds.includes(p.id))
  );
  
  lowStockProducts.forEach(product => {
    if (rule.actions.createPO) {
      const bestPrice = getBestSupplierPrice(product.id);
      if (bestPrice) {
        const supplier = suppliers.find(s => s.id === bestPrice.supplierId);
        if (supplier) {
          const reorderQuantity = Math.max(product.maximumStock - product.stock, product.minimumStock * 2);
          
          createPurchaseOrder({
            supplierId: supplier.id,
            items: [{
              productId: product.id,
              quantity: reorderQuantity,
              unitPrice: bestPrice.price,
              total: reorderQuantity * bestPrice.price
            }],
            subtotal: reorderQuantity * bestPrice.price,
            taxRate: 0,
            taxAmount: 0,
            total: reorderQuantity * bestPrice.price,
            status: 'draft',
            orderDate: new Date().toISOString(),
            createdBy: 'automation',
            autoGenerated: true,
            triggerReason: `Low stock alert: ${product.name} (${product.stock} remaining)`
          });
          
          // Update rule trigger count
          updateAutomationRule(rule.id, {
            triggerCount: rule.triggerCount + 1,
            lastTriggered: new Date().toISOString()
          });
        }
      }
    }
  });
};

const checkLowStock = (rule: AutomationRule, products: Product[]) => {
  const lowStockProducts = products.filter(p => 
    p.stock <= (rule.conditions.stockLevel || p.minimumStock)
  );
  
  if (lowStockProducts.length > 0 && rule.actions.sendAlert) {
    // In a real app, this would send notifications
    console.log(`Low stock alert: ${lowStockProducts.length} products below threshold`);
    
    updateAutomationRule(rule.id, {
      triggerCount: rule.triggerCount + 1,
      lastTriggered: new Date().toISOString()
    });
  }
};

const checkSupplierPrices = (rule: AutomationRule, supplierPrices: SupplierPrice[]) => {
  // Check for price changes or better deals
  const recentPrices = supplierPrices.filter(sp => {
    const priceDate = new Date(sp.createdAt);
    const daysSince = (Date.now() - priceDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= (rule.conditions.timeframe || 30);
  });
  
  if (recentPrices.length > 0) {
    updateAutomationRule(rule.id, {
      triggerCount: rule.triggerCount + 1,
      lastTriggered: new Date().toISOString()
    });
  }
};

// Advanced Features (Mock implementations for future integration)
export const generateDemandForecast = (productId: ID): DemandForecast => {
  const product = listProducts().find(p => p.id === productId);
  const orders = listOrders();
  
  // Mock AI prediction - in real implementation, this would use ML models
  const historicalSales = orders.flatMap(o => o.items.filter(i => i.productId === productId));
  const avgDemand = historicalSales.length > 0 
    ? historicalSales.reduce((sum, item) => sum + item.quantity, 0) / historicalSales.length 
    : 10;
  
  const forecast: DemandForecast = {
    productId,
    period: 'next_30_days',
    predictedDemand: Math.round(avgDemand * 1.2), // Mock 20% growth prediction
    confidence: 75,
    factors: ['Historical sales', 'Seasonal trends', 'Market conditions'],
    recommendedStock: Math.round(avgDemand * 1.5),
    createdAt: new Date().toISOString()
  };
  
  return createDemandForecast(forecast);
};



export const autoGeneratePurchaseOrders = (): PurchaseOrder[] => {
  const products = listProducts();
  const suppliers = listSuppliers();
  const supplierPrices = listSupplierPrices();
  const generatedPOs: PurchaseOrder[] = [];
  
  // Group low stock products by best supplier
  const lowStockProducts = products.filter(p => p.stock <= p.minimumStock);
  const supplierGroups: { [supplierId: string]: Product[] } = {};
  
  lowStockProducts.forEach(product => {
    const bestPrice = getBestSupplierPrice(product.id);
    if (bestPrice) {
      if (!supplierGroups[bestPrice.supplierId]) {
        supplierGroups[bestPrice.supplierId] = [];
      }
      supplierGroups[bestPrice.supplierId].push(product);
    }
  });
  
  // Create POs for each supplier group
  Object.entries(supplierGroups).forEach(([supplierId, products]) => {
    const items = products.map(product => {
      const bestPrice = getBestSupplierPrice(product.id);
      const reorderQuantity = Math.max(product.maximumStock - product.stock, product.minimumStock * 2);
      
      return {
        productId: product.id,
        quantity: reorderQuantity,
        unitPrice: bestPrice?.price || product.costPrice,
        total: reorderQuantity * (bestPrice?.price || product.costPrice)
      };
    });
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    
    const po = createPurchaseOrder({
      supplierId,
      items,
      subtotal,
      taxRate: 0,
      taxAmount: 0,
      total: subtotal,
      status: 'draft',
      orderDate: new Date().toISOString(),
      createdBy: 'ai_automation',
      autoGenerated: true,
      triggerReason: `AI-generated PO for ${products.length} low-stock products`
    });
    
    generatedPOs.push(po);
  });
  
  return generatedPOs;
};