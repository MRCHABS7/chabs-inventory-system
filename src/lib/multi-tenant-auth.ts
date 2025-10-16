import type { Tenant, TenantUser, UserRole, Permission, SystemAdmin } from './types-multi-tenant';

// Multi-tenant authentication and authorization
export class MultiTenantAuth {
  private static instance: MultiTenantAuth;
  
  static getInstance(): MultiTenantAuth {
    if (!MultiTenantAuth.instance) {
      MultiTenantAuth.instance = new MultiTenantAuth();
    }
    return MultiTenantAuth.instance;
  }

  // Get current tenant from subdomain or domain
  getCurrentTenant(): Tenant | null {
    if (typeof window === 'undefined') return null;
    
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Check if it's a custom domain or subdomain
    const tenants = this.getTenants();
    return tenants.find(t => 
      t.domain === hostname || 
      t.domain === subdomain
    ) || null;
  }

  // Check if user has permission for specific action
  hasPermission(user: TenantUser, resource: string, action: string): boolean {
    // Super admin has all permissions
    if (this.isSuperAdmin(user.email)) return true;
    
    // Check user's direct permissions
    const permission = user.permissions.find(p => p.resource === resource);
    if (permission?.actions.includes(action as any)) return true;
    
    // Check role permissions
    const role = this.getUserRole(user.tenantId, user.role.id);
    if (!role) return false;
    
    const rolePermission = role.permissions.find(p => p.resource === resource);
    return rolePermission?.actions.includes(action as any) || false;
  }

  // Check if tenant has feature enabled
  hasFeature(tenant: Tenant, feature: keyof Tenant['features']): boolean {
    return tenant.features[feature] === true;
  }

  // Check usage limits
  checkUsageLimit(tenant: Tenant, resource: string, currentCount: number): boolean {
    const limits = tenant.features;
    
    switch (resource) {
      case 'products':
        return currentCount < limits.maxProducts;
      case 'customers':
        return currentCount < limits.maxCustomers;
      case 'orders':
        return currentCount < limits.maxOrders;
      case 'users':
        return tenant.currentUsers < tenant.maxUsers;
      default:
        return true;
    }
  }

  // Default roles for new tenants
  getDefaultRoles(tenantId: string): UserRole[] {
    return [
      {
        id: `${tenantId}_admin`,
        name: 'Administrator',
        description: 'Full access to all features',
        tenantId,
        isSystemRole: true,
        permissions: [
          { resource: '*', actions: ['create', 'read', 'update', 'delete', 'export', 'import'] }
        ]
      },
      {
        id: `${tenantId}_manager`,
        name: 'Manager',
        description: 'Manage operations and view reports',
        tenantId,
        isSystemRole: true,
        permissions: [
          { resource: 'products', actions: ['create', 'read', 'update', 'export'] },
          { resource: 'customers', actions: ['create', 'read', 'update', 'export'] },
          { resource: 'orders', actions: ['create', 'read', 'update', 'export'] },
          { resource: 'quotations', actions: ['create', 'read', 'update', 'export'] },
          { resource: 'reports', actions: ['read', 'export'] }
        ]
      },
      {
        id: `${tenantId}_sales`,
        name: 'Sales',
        description: 'Manage customers and quotations',
        tenantId,
        isSystemRole: true,
        permissions: [
          { resource: 'customers', actions: ['create', 'read', 'update'] },
          { resource: 'quotations', actions: ['create', 'read', 'update'] },
          { resource: 'orders', actions: ['read', 'update'] },
          { resource: 'products', actions: ['read'] }
        ]
      },
      {
        id: `${tenantId}_warehouse`,
        name: 'Warehouse',
        description: 'Manage inventory and orders',
        tenantId,
        isSystemRole: true,
        permissions: [
          { resource: 'products', actions: ['read', 'update'] },
          { resource: 'inventory', actions: ['create', 'read', 'update'] },
          { resource: 'orders', actions: ['read', 'update'] },
          { resource: 'warehouse', actions: ['create', 'read', 'update'] }
        ]
      }
    ];
  }

  // Subscription plans
  getSubscriptionPlans(): import('./types-multi-tenant').SubscriptionPlan[] {
    return [
      {
        id: 'starter',
        name: 'Starter',
        price: 299,
        currency: 'ZAR',
        interval: 'monthly' as const,
        maxUsers: 3,
        description: 'Perfect for small businesses',
        features: {
          quotations: true,
          orders: true,
          inventory: true,
          customers: true,
          suppliers: true,
          multiLocation: false,
          bom: false,
          externalProcessing: false,
          automation: false,
          emailIntegration: true,
          barcodeScanning: false,
          apiAccess: false,
          webhooks: false,
          basicReports: true,
          advancedReports: false,
          customReports: false,
          maxProducts: 500,
          maxCustomers: 100,
          maxOrders: 1000,
          storageLimit: 1024 // 1GB
        },
        isActive: true
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 599,
        currency: 'ZAR',
        interval: 'monthly' as const,
        maxUsers: 10,
        description: 'For growing businesses',
        features: {
          quotations: true,
          orders: true,
          inventory: true,
          customers: true,
          suppliers: true,
          multiLocation: true,
          bom: true,
          externalProcessing: true,
          automation: true,
          emailIntegration: true,
          barcodeScanning: true,
          apiAccess: true,
          webhooks: false,
          basicReports: true,
          advancedReports: true,
          customReports: false,
          maxProducts: 5000,
          maxCustomers: 1000,
          maxOrders: 10000,
          storageLimit: 5120 // 5GB
        },
        isActive: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 1299,
        currency: 'ZAR',
        interval: 'monthly' as const,
        maxUsers: -1, // Unlimited
        description: 'For large organizations',
        features: {
          quotations: true,
          orders: true,
          inventory: true,
          customers: true,
          suppliers: true,
          multiLocation: true,
          bom: true,
          externalProcessing: true,
          automation: true,
          emailIntegration: true,
          barcodeScanning: true,
          apiAccess: true,
          webhooks: true,
          basicReports: true,
          advancedReports: true,
          customReports: true,
          maxProducts: -1, // Unlimited
          maxCustomers: -1, // Unlimited
          maxOrders: -1, // Unlimited
          storageLimit: -1 // Unlimited
        },
        isActive: true
      }
    ];
  }

  // Helper methods (would connect to database in production)
  private getTenants(): Tenant[] {
    const stored = localStorage.getItem('tenants');
    return stored ? JSON.parse(stored) : [];
  }

  private getUserRole(tenantId: string, roleId: string): UserRole | null {
    const roles = this.getTenantRoles(tenantId);
    return roles.find(r => r.id === roleId) || null;
  }

  private getTenantRoles(tenantId: string): UserRole[] {
    const stored = localStorage.getItem(`roles_${tenantId}`);
    return stored ? JSON.parse(stored) : this.getDefaultRoles(tenantId);
  }

  private isSuperAdmin(email: string): boolean {
    const admins = this.getSystemAdmins();
    return admins.some(a => a.email === email && a.isSuperAdmin);
  }

  private getSystemAdmins(): SystemAdmin[] {
    const stored = localStorage.getItem('system_admins');
    return stored ? JSON.parse(stored) : [];
  }
}