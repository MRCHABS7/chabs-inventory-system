// Stable storage functions for CHABS Inventory System
import { v4 as uuid } from 'uuid';
import type { Customer, Product, Quotation, Order, Supplier, PurchaseOrder, AutomationRule, StockMovement, SupplierPrice, CompanyDetails, PickingSlipRecord, ExternalProcessingOrder, CustomerPrice, BackorderItem, SystemSettings, ID } from './types';

const KEY = {
  customers: 'chabs_customers',
  products: 'chabs_products',
  quotations: 'chabs_quotations',
  orders: 'chabs_orders',
  suppliers: 'chabs_suppliers',
  purchaseOrders: 'chabs_purchase_orders',
  automationRules: 'chabs_automation_rules',
  stockMovements: 'chabs_stock_movements',
  customerPrices: 'chabs_customer_prices',
  supplierPrices: 'chabs_supplier_prices',
  company: 'chabs_company',
  pickingSlips: 'chabs_picking_slips',
  externalProcessingOrders: 'chabs_external_processing_orders',
  backorders: 'chabs_backorders'
} as const;

const get = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const set = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore errors
  }
};

// Customers
export const listCustomers = (): Customer[] => get<Customer[]>(KEY.customers, []);
export const createCustomer = (c: Omit<Customer, 'id'>): Customer => {
  const all = listCustomers();
  const next: Customer = { ...c, id: uuid() };
  set(KEY.customers, [next, ...all]);
  return next;
};
export const deleteCustomer = (id: ID) => {
  const all = listCustomers().filter(c => c.id !== id);
  set(KEY.customers, all);
};

// Products
export const listProducts = (): Product[] => get<Product[]>(KEY.products, []);
export const createProduct = (p: Omit<Product, 'id'>): Product => {
  const all = listProducts();
  const next: Product = { 
    ...p, 
    id: uuid(),
    sellingPrice: typeof p.sellingPrice === 'number' ? p.sellingPrice : parseFloat(String(p.sellingPrice)) || 0,
    costPrice: typeof p.costPrice === 'number' ? p.costPrice : parseFloat(String(p.costPrice)) || 0,
    stock: typeof p.stock === 'number' ? p.stock : parseInt(String(p.stock)) || 0,
    reservedStock: 0,
    availableStock: typeof p.stock === 'number' ? p.stock : parseInt(String(p.stock)) || 0
  };
  set(KEY.products, [next, ...all]);
  return next;
};
export const updateProduct = (id: ID, patch: Partial<Product>): Product | null => {
  const all = listProducts();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
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
  const updated = { ...all[idx], ...patch };
  all[idx] = updated;
  set(KEY.quotations, all);
  return updated;
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
  const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  set(KEY.orders, all);
  return updated;
};

// Suppliers
export const listSuppliers = (): Supplier[] => get<Supplier[]>(KEY.suppliers, []);
export const createSupplier = (s: Omit<Supplier, 'id' | 'createdAt'>): Supplier => {
  const all = listSuppliers();
  const next: Supplier = { ...s, id: uuid(), createdAt: new Date().toISOString() };
  set(KEY.suppliers, [next, ...all]);
  return next;
};
export const deleteSupplier = (id: ID) => {
  const all = listSuppliers().filter(s => s.id !== id);
  set(KEY.suppliers, all);
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
  const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  set(KEY.purchaseOrders, all);
  return updated;
};

// Stock Movements
export const createStockMovement = (sm: Omit<StockMovement, 'id' | 'createdAt'>): StockMovement => {
  const all = get<StockMovement[]>(KEY.stockMovements, []);
  const next: StockMovement = { ...sm, id: uuid(), createdAt: new Date().toISOString() };
  set(KEY.stockMovements, [next, ...all]);
  return next;
};

export const listStockMovements = (): StockMovement[] => get<StockMovement[]>(KEY.stockMovements, []);

// Supplier Prices
export const listSupplierPrices = (): SupplierPrice[] => get<SupplierPrice[]>(KEY.supplierPrices, []);

const getBestSupplierPrice = (productId: ID): SupplierPrice | null => {
  const prices = listSupplierPrices().filter(p => p.productId === productId);
  if (prices.length === 0) return null;
  return prices.reduce((best, current) => 
    current.price < best.price ? current : best
  );
};

// Company
export const getCompany = (): CompanyDetails => get<CompanyDetails>(KEY.company, { 
  name: 'CHABS Inventory', 
  currency: 'R', 
  taxRate: 15,
  theme: 'auto',
  systemSettings: {
    categories: ['Hardware', 'Tools', 'Materials', 'Equipment', 'Consumables', 'Parts'],
    finishes: ['Raw', 'Painted', 'Galvanized', 'Powder Coated', 'Anodized', 'Chrome Plated'],
    units: ['piece', 'box', 'carton', 'kg', 'meter', 'liter', 'set'],
    paymentTerms: ['Net 30', 'Net 60', 'COD', 'Prepaid', 'Net 15'],
    priorities: ['Low', 'Medium', 'High', 'Urgent'],
    processTypes: ['Painting', 'Coating', 'Assembly', 'Machining', 'Welding', 'Finishing']
  }
});

export const getSystemSettings = () => {
  const company = getCompany();
  return company.systemSettings || {
    categories: ['Hardware', 'Tools', 'Materials', 'Equipment', 'Consumables', 'Parts'],
    finishes: ['Raw', 'Painted', 'Galvanized', 'Powder Coated', 'Anodized', 'Chrome Plated'],
    units: ['piece', 'box', 'carton', 'kg', 'meter', 'liter', 'set'],
    paymentTerms: ['Net 30', 'Net 60', 'COD', 'Prepaid', 'Net 15'],
    priorities: ['Low', 'Medium', 'High', 'Urgent'],
    processTypes: ['Painting', 'Coating', 'Assembly', 'Machining', 'Welding', 'Finishing']
  };
};

export const updateSystemSettings = (settings: Partial<import('./types').SystemSettings>) => {
  const company = getCompany();
  const updatedCompany = {
    ...company,
    systemSettings: {
      ...getSystemSettings(),
      ...settings
    }
  };
  setCompany(updatedCompany);
};

export const setCompany = (c: CompanyDetails) => set(KEY.company, c);

// Email simulation function
export const sendQuotationEmail = async (quotation: Quotation, customerEmail: string, company: CompanyDetails) => {
  // In a real application, this would integrate with an email service like SendGrid, Mailgun, etc.
  console.log(`Sending quotation ${quotation.quoteNumber} to ${customerEmail}`);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success (in real app, handle actual email sending errors)
  return { success: true, message: 'Email sent successfully' };
};

// Automation Rules
export const listAutomationRules = (): AutomationRule[] => get<AutomationRule[]>(KEY.automationRules, []);
export const createAutomationRule = (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'triggerCount'>): AutomationRule => {
  const all = listAutomationRules();
  const next: AutomationRule = { 
    ...rule, 
    id: uuid(), 
    createdAt: new Date().toISOString(),
    triggerCount: 0
  };
  set(KEY.automationRules, [next, ...all]);
  return next;
};
export const updateAutomationRule = (id: ID, patch: Partial<AutomationRule>): AutomationRule | null => {
  const all = listAutomationRules();
  const idx = all.findIndex(rule => rule.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch };
  all[idx] = updated;
  set(KEY.automationRules, all);
  return updated;
};
export const deleteAutomationRule = (id: ID) => {
  const all = listAutomationRules().filter(rule => rule.id !== id);
  set(KEY.automationRules, all);
};

// Customer Price History
export const listCustomerPrices = (): CustomerPrice[] => get<CustomerPrice[]>(KEY.customerPrices, []);
export const createCustomerPrice = (price: Omit<CustomerPrice, 'id' | 'createdAt' | 'updatedAt'>): CustomerPrice => {
  const all = listCustomerPrices();
  const next: CustomerPrice = { 
    ...price, 
    id: uuid(), 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  set(KEY.customerPrices, [next, ...all]);
  return next;
};

export const getCustomerPriceHistory = (customerId: ID, productId: ID): CustomerPrice[] => {
  return listCustomerPrices()
    .filter(cp => cp.customerId === customerId && cp.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getCustomerPrices = (customerId: ID): CustomerPrice[] => {
  return listCustomerPrices().filter(cp => cp.customerId === customerId);
};

export const saveCustomerPrice = (cp: Omit<CustomerPrice, 'id'>): CustomerPrice => {
  const all = listCustomerPrices();
  // Remove existing price for same customer/product combination
  const filtered = all.filter(existing => 
    !(existing.customerId === cp.customerId && existing.productId === cp.productId)
  );
  const next: CustomerPrice = { ...cp, id: uuid() };
  set(KEY.customerPrices, [next, ...filtered]);
  return next;
};

export const getLastQuotedPrice = (customerId: ID, productId: ID): number | null => {
  const history = getCustomerPriceHistory(customerId, productId);
  return history.length > 0 ? history[0].unitPrice : null;
};

// Helper functions
export const autoGeneratePurchaseOrders = () => [];
export const checkAutomationRules = () => {};

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

// Picking Slip Tracking

export const listPickingSlips = (): PickingSlipRecord[] => get<PickingSlipRecord[]>(KEY.pickingSlips, []);

export const recordPickingSlipPrint = (orderId: ID, printedBy: string): PickingSlipRecord => {
  const all = listPickingSlips();
  const existingRecord = all.find(p => p.orderId === orderId);
  
  if (existingRecord) {
    // Update existing record
    existingRecord.printCount += 1;
    existingRecord.printedAt = new Date().toISOString();
    existingRecord.printedBy = printedBy;
    set(KEY.pickingSlips, all);
    return existingRecord;
  } else {
    // Create new record
    const newRecord: PickingSlipRecord = {
      id: uuid(),
      orderId,
      printedBy,
      printedAt: new Date().toISOString(),
      printCount: 1
    };
    set(KEY.pickingSlips, [newRecord, ...all]);
    return newRecord;
  }
};

export const getPickingSlipRecord = (orderId: ID): PickingSlipRecord | null => {
  return listPickingSlips().find(p => p.orderId === orderId) || null;
};

export const getPickingSlipStats = () => {
  const records = listPickingSlips();
  const totalPrints = records.reduce((sum, record) => sum + record.printCount, 0);
  const uniqueOrders = records.length;
  const recentPrints = records.filter(r => {
    const printDate = new Date(r.printedAt);
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    return printDate > dayAgo;
  }).length;
  
  return {
    totalPrints,
    uniqueOrders,
    recentPrints,
    averagePrintsPerOrder: uniqueOrders > 0 ? totalPrints / uniqueOrders : 0
  };
};

// External Processing Orders
export const listExternalProcessingOrders = (): ExternalProcessingOrder[] => get<ExternalProcessingOrder[]>(KEY.externalProcessingOrders, []);

export const createExternalProcessingOrder = (order: Omit<ExternalProcessingOrder, 'id' | 'createdAt' | 'updatedAt'>): ExternalProcessingOrder => {
  const all = listExternalProcessingOrders();
  const newOrder: ExternalProcessingOrder = {
    ...order,
    id: uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  set(KEY.externalProcessingOrders, [newOrder, ...all]);
  return newOrder;
};

export const updateExternalProcessingOrder = (id: ID, patch: Partial<ExternalProcessingOrder>): ExternalProcessingOrder | null => {
  const all = listExternalProcessingOrders();
  const idx = all.findIndex(order => order.id === id);
  if (idx === -1) return null;
  
  const updated = { 
    ...all[idx], 
    ...patch, 
    updatedAt: new Date().toISOString() 
  };
  all[idx] = updated;
  set(KEY.externalProcessingOrders, all);
  return updated;
};

export const deleteExternalProcessingOrder = (id: ID) => {
  const all = listExternalProcessingOrders().filter(order => order.id !== id);
  set(KEY.externalProcessingOrders, all);
};

export const getExternalProcessingOrdersByProduct = (productId: ID): ExternalProcessingOrder[] => {
  return listExternalProcessingOrders().filter(order => order.productId === productId);
};

export const getExternalProcessingOrdersByStatus = (status: ExternalProcessingOrder['status']): ExternalProcessingOrder[] => {
  return listExternalProcessingOrders().filter(order => order.status === status);
};

export const getExternalProcessingStats = () => {
  const orders = listExternalProcessingOrders();
  const totalOrders = orders.length;
  const inProgress = orders.filter(o => ['sent', 'in_progress', 'quality_check'].includes(o.status)).length;
  const completed = orders.filter(o => o.status === 'completed').length;
  const overdue = orders.filter(o => {
    if (!o.expectedReturn) return false;
    return new Date(o.expectedReturn) < new Date() && !['completed', 'returned'].includes(o.status);
  }).length;
  
  const totalCost = orders.reduce((sum, order) => sum + order.cost, 0);
  const avgLeadTime = orders.filter(o => o.actualReturn && o.sentDate).reduce((sum, order) => {
    const sent = new Date(order.sentDate!);
    const returned = new Date(order.actualReturn!);
    const days = Math.ceil((returned.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0) / orders.filter(o => o.actualReturn && o.sentDate).length || 0;
  
  return {
    totalOrders,
    inProgress,
    completed,
    overdue,
    totalCost,
    avgLeadTime: Math.round(avgLeadTime)
  };
};



// Backorders
export const listBackorderItems = (): import('./types').BackorderItem[] => get<import('./types').BackorderItem[]>(KEY.backorders, []);

export const createBackorderItem = (bo: Omit<import('./types').BackorderItem, 'id'>): import('./types').BackorderItem => {
  const all = listBackorderItems();
  const next: import('./types').BackorderItem = { ...bo, id: uuid() };
  set(KEY.backorders, [next, ...all]);
  return next;
};

export const updateBackorderItem = (id: ID, patch: Partial<import('./types').BackorderItem>): import('./types').BackorderItem | null => {
  const all = listBackorderItems();
  const idx = all.findIndex(bo => bo.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  set(KEY.backorders, all);
  return updated;
};

export const deleteBackorderItem = (id: ID) => {
  const all = listBackorderItems().filter(bo => bo.id !== id);
  set(KEY.backorders, all);
};

export const getCustomerBackorders = (customerId: ID): import('./types').BackorderItem[] => {
  return listBackorderItems().filter(bo => bo.customerId === customerId);
};

export const getProductBackorders = (productId: ID): import('./types').BackorderItem[] => {
  return listBackorderItems().filter(bo => bo.productId === productId);
};

// Add function to get customer pricing history
export const getCustomerPricing = (productId: string): any[] => {
  const quotations = listQuotations();
  const customers = listCustomers();
  const pricing: any[] = [];
  
  quotations.forEach(quote => {
    const customer = customers.find(c => c.id === quote.customerId);
    quote.items.forEach(item => {
      if (item.productId === productId) {
        pricing.push({
          customerName: customer?.name || 'Unknown',
          price: item.unitPrice,
          date: new Date(quote.createdAt).toLocaleDateString()
        });
      }
    });
  });
  
  return pricing.slice(0, 10); // Return last 10 pricing records
};

// Add function to save quotation with new structure
export const saveQuotation = (quotation: Quotation): Quotation => {
  const quotations = listQuotations();
  const existingIndex = quotations.findIndex(q => q.id === quotation.id);
  
  if (existingIndex >= 0) {
    quotations[existingIndex] = quotation;
  } else {
    quotations.push(quotation);
  }
  
  set(KEY.quotations, quotations);
  return quotation;
};

// Legacy functions for compatibility
export const getCustomers = listCustomers;
export const getProducts = listProducts;
export const getQuotations = listQuotations;
export const listBackorders = listBackorderItems;