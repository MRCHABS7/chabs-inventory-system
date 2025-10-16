export type ID = string;

export interface Customer {
  id: ID;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  contactPerson?: string;
  taxNumber?: string;
  paymentTerms?: string;
  creditLimit?: number;
  priceLevel?: 'standard' | 'wholesale' | 'vip' | 'custom';
  discount?: number; // default discount percentage
  createdAt: string;
}

export interface CustomerPrice {
  id: ID;
  customerId: ID;
  productId: ID;
  unitPrice: number;
  unit?: string;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: ID;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  paymentTerms?: string;
  externalProcesses?: ExternalProcess[];
  createdAt: string;
}

export interface SupplierPrice {
  id: ID;
  supplierId: ID;
  productId: ID;
  price: number;
  minimumQuantity: number;
  leadTime: number; // days
  currency: string;
  validUntil?: string;
  createdAt: string;
}

export interface BOMItem {
  id: ID;
  productId: ID; // component product
  quantity: number;
  unit: string;
  costPrice: number;
}

export interface Product {
  id: ID;
  name: string;
  sku: string;
  description?: string;
  category: string;
  unit: string;
  alternativeUnits?: string[]; // e.g., ['piece', 'box', 'carton']
  costPrice: number;
  sellingPrice: number;
  markup: number; // percentage
  stock: number;
  reservedStock?: number; // stock reserved for orders
  availableStock?: number; // stock - reservedStock
  minimumStock: number;
  maximumStock: number;
  location?: string;
  barcode?: string;
  bomItems?: BOMItem[]; // Bill of Materials
  externalProcessing?: ExternalProcess[]; // External suppliers for processing
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  productId: ID;
  quantity: number;
  unitPrice: number;
  unit?: string;
  discount: number; // percentage
  total: number;
  customPrice?: boolean; // indicates if this is a custom price for this customer
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'shipped' | 'delivered' | 'cancelled';

export interface Quotation {
  id: ID;
  quoteNumber: string;
  customerId: ID;
  customerName: string;
  projectName: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  validUntil: string;
  createdAt: string;
  status: QuoteStatus;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  terms?: string;
  convertedToOrder?: boolean;
  orderId?: ID;
  partialOrderItems?: QuoteItem[]; // Items that were ordered from this quote
  emailSent?: boolean;
  emailSentAt?: string;
  customerDetails?: {
    name: string;
    company?: string;
    contactPerson?: string;
    email?: string;
    alternativeEmails?: string[];
    phone?: string;
    address?: string;
  };
  companyDetails?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    contactPerson?: string;
    contactEmail?: string;
  };
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface PickingSlipRecord {
  id: ID;
  orderId: ID;
  printedBy: string; // user email or name
  printedAt: string;
  printCount: number;
}

export interface OrderItem extends QuoteItem {
  preparedQuantity?: number;
  backorderQuantity?: number;
  availableStock?: number;
  preparationStatus?: 'pending' | 'partial' | 'complete' | 'backorder';
  preparedBy?: string;
  preparedAt?: string;
  notes?: string;
}

export interface Order {
  id: ID;
  orderNumber: string;
  quotationId?: ID;
  quoteNumber?: string;
  customerId: ID;
  items: OrderItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: OrderStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expectedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  warehouseNotes?: string;
  warehouseInstructions?: string;
  trackingNumber?: string;
  pickingSlips?: PickingSlipRecord[];
  hasBackorders?: boolean;
  preparationProgress?: number; // percentage
}

export interface BackorderItem {
  id: ID;
  customerId: ID;
  orderId: ID;
  productId: ID;
  quantity: number;
  unitPrice: number;
  unit?: string;
  expectedDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'ordered' | 'partial' | 'fulfilled' | 'cancelled';
  supplierOrderId?: ID;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface StockMovement {
  id: ID;
  productId: ID;
  type: 'in' | 'out' | 'adjustment' | 'reserved' | 'unreserved';
  quantity: number;
  reason: string;
  reference?: string; // order number, supplier invoice, etc.
  orderId?: ID;
  customerId?: ID;
  createdAt: string;
  createdBy: string;
  location?: string;
  batchNumber?: string;
}

export interface SystemSettings {
  categories: string[];
  finishes: string[];
  units: string[];
  paymentTerms: string[];
  priorities: string[];
  processTypes: string[];
}

export interface CompanyDetails {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  taxNumber?: string;
  currency: string;
  taxRate: number;
  theme?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  brandingStyle?: 'modern' | 'professional' | 'minimal' | 'corporate';
  logoPosition?: 'left' | 'center' | 'right';
  headerStyle?: 'gradient' | 'solid' | 'transparent';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  fontFamily?: 'inter' | 'roboto' | 'opensans' | 'poppins' | 'montserrat';
  systemSettings?: SystemSettings;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'warehouse' | 'orders' | 'system' | 'inventory' | 'business' | 'external_processing';
  actionUrl?: string;
  metadata?: any;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  autoExpire?: boolean;
  expiresAt?: string;
}

export interface User {
  id: ID;
  email: string;
  password: string;
  role: 'admin' | 'warehouse';
  firstName: string;
  lastName: string;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface PurchaseOrderItem {
  productId: ID;
  quantity: number;
  unitPrice: number;
  total: number;
  received?: number;
  receivedDate?: string;
}

export type PurchaseOrderStatus = 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled';

export interface PurchaseOrder {
  id: ID;
  poNumber: string;
  supplierId: ID;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  autoGenerated?: boolean;
  triggerReason?: string;
}

export interface AutomationRule {
  id: ID;
  name: string;
  type: 'reorder_point' | 'low_stock' | 'supplier_price' | 'demand_forecast';
  isActive: boolean;
  conditions: {
    productIds?: ID[];
    stockLevel?: number;
    priceThreshold?: number;
    timeframe?: number;
  };
  actions: {
    createPO?: boolean;
    sendAlert?: boolean;
    updatePricing?: boolean;
    notifyUsers?: ID[];
  };
  lastTriggered?: string;
  triggerCount: number;
  createdAt: string;
}



export interface Subscription {
  id: ID;
  plan: 'starter' | 'professional' | 'enterprise' | 'ai_premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  features: string[];
  maxUsers: number;
  maxProducts: number;
  maxOrders: number;
  aiFeatures: boolean;
  automationRules: number;
}

export interface ProfitAnalysis {
  productId: ID;
  costPrice: number;
  sellingPrice: number;
  markup: number;
  profit: number;
  profitMargin: number;
  bestSupplierPrice?: number;
  bestSupplierId?: ID;
}

export interface DemandForecast {
  productId: ID;
  period: string;
  predictedDemand: number;
  confidence: number;
  factors: string[];
  recommendedStock: number;
  createdAt: string;
}

export interface ExternalProcess {
  id: ID;
  supplierId: ID;
  processType: string; // e.g., 'painting', 'coating', 'assembly'
  description?: string;
  leadTime: number; // days
  costPerUnit: number;
  minimumQuantity: number;
}

export interface ExternalProcessingOrder {
  id: ID;
  productId: ID;
  externalProcessId: ID;
  quantity: number;
  status: 'pending' | 'sent' | 'in_progress' | 'quality_check' | 'completed' | 'returned' | 'rejected';
  sentDate?: string;
  expectedReturn?: string;
  actualReturn?: string;
  cost: number;
  notes?: string;
  paintingDetails?: {
    color?: string;
    finish?: string; // e.g., 'matte', 'gloss', 'satin'
    coats?: number;
    dryingTime?: number; // hours
    qualityGrade?: 'A' | 'B' | 'C' | 'Rejected';
  };
  trackingNumber?: string;
  supplierReference?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  currentLocation?: string; // e.g., "ABC Painting - Booth 3"
}

export interface StockMovementExtended extends StockMovement {
  userId: ID;
  userName: string;
  location?: string;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface UserSession {
  id: ID;
  email: string;
  role: 'admin' | 'warehouse';
  firstName?: string;
  lastName?: string;
  permissions: string[];
  theme?: 'light' | 'dark' | 'auto';
}
