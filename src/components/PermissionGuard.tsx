import { ReactNode } from 'react';
import { MultiTenantAuth } from '../lib/multi-tenant-auth';
import type { TenantUser } from '../lib/types-multi-tenant';

interface PermissionGuardProps {
  children: ReactNode;
  resource: string;
  action: string;
  user: TenantUser | null;
  fallback?: ReactNode;
  feature?: string;
}

export default function PermissionGuard({ 
  children, 
  resource, 
  action, 
  user, 
  fallback = null,
  feature 
}: PermissionGuardProps) {
  const auth = MultiTenantAuth.getInstance();
  const tenant = auth.getCurrentTenant();

  // Check if user is authenticated
  if (!user || !tenant) {
    return <>{fallback}</>;
  }

  // Check feature availability for tenant
  if (feature && !auth.hasFeature(tenant, feature as any)) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <div className="text-yellow-600 mr-3">🔒</div>
          <div>
            <h3 className="font-medium text-yellow-800">Feature Not Available</h3>
            <p className="text-sm text-yellow-700">
              This feature is not included in your current plan. 
              <button className="underline ml-1">Upgrade your plan</button> to access this feature.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check user permissions
  if (!auth.hasPermission(user, resource, action)) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <div className="text-red-600 mr-3">⛔</div>
          <div>
            <h3 className="font-medium text-red-800">Access Denied</h3>
            <p className="text-sm text-red-700">
              You don't have permission to {action} {resource}. 
              Contact your administrator for access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for checking permissions in components
export function usePermissions() {
  const auth = MultiTenantAuth.getInstance();
  const tenant = auth.getCurrentTenant();

  return {
    hasPermission: (user: TenantUser | null, resource: string, action: string) => {
      if (!user || !tenant) return false;
      return auth.hasPermission(user, resource, action);
    },
    hasFeature: (feature: string) => {
      if (!tenant) return false;
      return auth.hasFeature(tenant, feature as any);
    },
    checkUsageLimit: (resource: string, currentCount: number) => {
      if (!tenant) return false;
      return auth.checkUsageLimit(tenant, resource, currentCount);
    },
    tenant
  };
}