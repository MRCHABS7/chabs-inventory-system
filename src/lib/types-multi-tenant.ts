// Multi-tenant system types
export interface Tenant {
  id: string;
  name: string;
  domain: string; // subdomain or custom domain
  plan: 'starter' | 'professional' | 'enterprise';
  features: TenantFeatures;
  settings: TenantSettings;
  createdAt: string;
  isActive: boolean;
  maxUsers: number;
  currentUsers: number;
}

export interface TenantFeatures {
  // Core Features
  quotations: boolean;
  orders: boolean;
  inventory: boolean;
  customers: boolean;
  suppliers: boolean;
  
  // Advanced Features
  multiLocation: boolean;
  bom: boolean;
  externalProcessing: boolean;
  automation: boolean;
  
  // Integrations
  emailIntegration: boolean;
  barcodeScanning: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  
  // Reporting
  basicReports: boolean;
  advancedReports: boolean;
  customReports: boolean;
  
  // Limits
  maxProducts: number;
  maxCustomers: number;
  maxOrders: number;
  storageLimit: number; // in MB
}

export interface TenantSettings {
  branding: {
    allowCustomBranding: boolean;
    allowLogoUpload: boolean;
    allowColorCustomization: boolean;
  };
  security: {
    enforceSSO: boolean;
    requireMFA: boolean;
    sessionTimeout: number; // minutes
    passwordPolicy: PasswordPolicy;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    webhookNotifications: boolean;
  };
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // days
}

// Enhanced User with tenant context
export interface TenantUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean; // Cannot be deleted
  tenantId: string;
}

export interface Permission {
  resource: string; // 'products', 'customers', 'orders', etc.
  actions: PermissionAction[];
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'export' | 'import';

// System Admin types
export interface SystemAdmin {
  id: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: TenantFeatures;
  maxUsers: number;
  description: string;
  isActive: boolean;
}