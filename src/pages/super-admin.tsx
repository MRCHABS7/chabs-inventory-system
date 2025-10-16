import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import TenantSetup from '../components/TenantSetup';
import type { Tenant, SystemAdmin } from '../lib/types-multi-tenant';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is super admin
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(currentUser);
    const superAdmins = ['admin@chabs.com', 'support@chabs.com']; // Your control emails
    
    if (!superAdmins.includes(user.email)) {
      router.push('/dashboard');
      return;
    }

    setIsAuthorized(true);
    loadTenants();
  }, [router]);

  const loadTenants = () => {
    const stored = localStorage.getItem('tenants');
    setTenants(stored ? JSON.parse(stored) : []);
  };

  const toggleTenantStatus = (tenantId: string) => {
    const updated = tenants.map(t => 
      t.id === tenantId ? { ...t, isActive: !t.isActive } : t
    );
    setTenants(updated);
    localStorage.setItem('tenants', JSON.stringify(updated));
  };

  const deleteTenant = (tenantId: string) => {
    if (!confirm('Are you sure? This will permanently delete all company data!')) return;
    
    const updated = tenants.filter(t => t.id !== tenantId);
    setTenants(updated);
    localStorage.setItem('tenants', JSON.stringify(updated));
    
    // Clean up tenant data
    localStorage.removeItem(`users_${tenantId}`);
    localStorage.removeItem(`roles_${tenantId}`);
    localStorage.removeItem(`products_${tenantId}`);
    localStorage.removeItem(`customers_${tenantId}`);
  };

  const getTotalRevenue = () => {
    return tenants.reduce((sum, t) => {
      const planPrices = { starter: 299, professional: 599, enterprise: 1299 };
      return sum + (t.isActive ? planPrices[t.plan] : 0);
    }, 0);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600">Super Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all companies and system settings</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">R{getTotalRevenue().toLocaleString()}</div>
            <div className="text-sm text-gray-500">Monthly Revenue</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'companies', label: '🏢 Companies' },
              { id: 'create', label: '➕ Create Company' },
              { id: 'billing', label: '💳 Billing' },
              { id: 'system', label: '⚙️ System' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{tenants.length}</div>
                <div className="text-sm text-gray-600">Total Companies</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{tenants.filter(t => t.isActive).length}</div>
                <div className="text-sm text-gray-600">Active Companies</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {tenants.reduce((sum, t) => sum + t.currentUsers, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">R{getTotalRevenue().toLocaleString()}</div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Companies</h3>
              <div className="space-y-3">
                {tenants.slice(-5).reverse().map(tenant => (
                  <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-sm text-gray-500">{tenant.domain}.chabs.app</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium capitalize">{tenant.plan}</div>
                      <div className="text-xs text-gray-500">{new Date(tenant.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Plan</th>
                      <th>Users</th>
                      <th>Revenue</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map(tenant => {
                      const planPrices = { starter: 299, professional: 599, enterprise: 1299 };
                      return (
                        <tr key={tenant.id}>
                          <td>
                            <div>
                              <div className="font-medium">{tenant.name}</div>
                              <div className="text-sm text-gray-500">{tenant.domain}.chabs.app</div>
                            </div>
                          </td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tenant.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                              tenant.plan === 'professional' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {tenant.plan}
                            </span>
                          </td>
                          <td>{tenant.currentUsers}/{tenant.maxUsers === -1 ? '∞' : tenant.maxUsers}</td>
                          <td>R{planPrices[tenant.plan]}/month</td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {tenant.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td>{new Date(tenant.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleTenantStatus(tenant.id)}
                                className={`btn text-xs px-2 py-1 ${
                                  tenant.isActive ? 'btn-warning' : 'btn-success'
                                }`}
                              >
                                {tenant.isActive ? 'Suspend' : 'Activate'}
                              </button>
                              <button
                                onClick={() => window.open(`https://${tenant.domain}.chabs.app`, '_blank')}
                                className="btn btn-secondary text-xs px-2 py-1"
                              >
                                Visit
                              </button>
                              <button
                                onClick={() => deleteTenant(tenant.id)}
                                className="btn btn-danger text-xs px-2 py-1"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Create Company Tab */}
        {activeTab === 'create' && <TenantSetup />}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {['starter', 'professional', 'enterprise'].map(plan => {
                const planTenants = tenants.filter(t => t.plan === plan && t.isActive);
                const planPrices = { starter: 299, professional: 599, enterprise: 1299 };
                const revenue = planTenants.length * planPrices[plan as keyof typeof planPrices];
                
                return (
                  <div key={plan} className="card p-6">
                    <h3 className="text-lg font-semibold capitalize mb-4">{plan} Plan</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Active Companies:</span>
                        <span className="font-medium">{planTenants.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price per Company:</span>
                        <span className="font-medium">R{planPrices[plan as keyof typeof planPrices]}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>Monthly Revenue:</span>
                        <span className="font-bold text-green-600">R{revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                {tenants.filter(t => t.isActive).map(tenant => {
                  const planPrices = { starter: 299, professional: 599, enterprise: 1299 };
                  return (
                    <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{tenant.plan} Plan</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">R{planPrices[tenant.plan]}/month</div>
                        <div className="text-sm text-gray-500">Next billing: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Maintenance Mode</div>
                    <div className="text-sm text-gray-500">Temporarily disable new signups</div>
                  </div>
                  <button className="btn btn-secondary">Enable</button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Backup Database</div>
                    <div className="text-sm text-gray-500">Create system backup</div>
                  </div>
                  <button className="btn btn-primary">Backup Now</button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">System Logs</div>
                    <div className="text-sm text-gray-500">View system activity logs</div>
                  </div>
                  <button className="btn btn-secondary">View Logs</button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Global Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Default Trial Period (days)</label>
                  <input type="number" className="input w-32" defaultValue="14" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Support Email</label>
                  <input type="email" className="input" defaultValue="support@chabs.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">System Announcement</label>
                  <textarea className="input" rows={3} placeholder="System-wide announcement for all companies"></textarea>
                </div>
                
                <button className="btn btn-primary">Save Settings</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}