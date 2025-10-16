import { useState } from 'react';
import type { Tenant, SubscriptionPlan } from '../lib/types-multi-tenant';
import { MultiTenantAuth } from '../lib/multi-tenant-auth';

export default function TenantSetup() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [tenantData, setTenantData] = useState({
    name: '',
    domain: '',
    adminEmail: '',
    adminName: '',
    adminPassword: ''
  });

  const auth = MultiTenantAuth.getInstance();
  const plans = auth.getSubscriptionPlans();

  const createTenant = async () => {
    if (!selectedPlan) return;

    const tenant: Tenant = {
      id: `tenant_${Date.now()}`,
      name: tenantData.name,
      domain: tenantData.domain,
      plan: selectedPlan.id as any,
      features: selectedPlan.features,
      settings: {
        branding: {
          allowCustomBranding: selectedPlan.id !== 'starter',
          allowLogoUpload: selectedPlan.id !== 'starter',
          allowColorCustomization: true
        },
        security: {
          enforceSSO: selectedPlan.id === 'enterprise',
          requireMFA: selectedPlan.id === 'enterprise',
          sessionTimeout: 480, // 8 hours
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: selectedPlan.id === 'enterprise',
            maxAge: selectedPlan.id === 'enterprise' ? 90 : 365
          }
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: selectedPlan.id !== 'starter',
          webhookNotifications: selectedPlan.features.webhooks
        }
      },
      createdAt: new Date().toISOString(),
      isActive: true,
      maxUsers: selectedPlan.maxUsers,
      currentUsers: 1
    };

    // Save tenant (in production, this would be an API call)
    const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
    tenants.push(tenant);
    localStorage.setItem('tenants', JSON.stringify(tenants));

    // Create default roles
    const roles = auth.getDefaultRoles(tenant.id);
    localStorage.setItem(`roles_${tenant.id}`, JSON.stringify(roles));

    alert(`Tenant "${tenant.name}" created successfully! Domain: ${tenant.domain}`);
    setStep(1);
    setTenantData({ name: '', domain: '', adminEmail: '', adminName: '', adminPassword: '' });
    setSelectedPlan(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Setup New Company
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a new company instance with custom features and permissions
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {num}
            </div>
            {num < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step > num ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Plan */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center mb-6">Choose Subscription Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`card p-6 cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id 
                    ? 'border-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">
                    R{plan.price}
                    <span className="text-sm text-gray-500">/{plan.interval}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="text-left space-y-2">
                    <div className="text-sm">
                      <strong>Users:</strong> {plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers}
                    </div>
                    <div className="text-sm">
                      <strong>Products:</strong> {plan.features.maxProducts === -1 ? 'Unlimited' : plan.features.maxProducts.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <strong>Storage:</strong> {plan.features.storageLimit === -1 ? 'Unlimited' : `${plan.features.storageLimit / 1024}GB`}
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="text-xs space-y-1">
                        {plan.features.multiLocation && <div>✓ Multi-Location</div>}
                        {plan.features.bom && <div>✓ Bill of Materials</div>}
                        {plan.features.automation && <div>✓ Automation</div>}
                        {plan.features.apiAccess && <div>✓ API Access</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedPlan}
              className="btn btn-primary px-8"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Company Details */}
      {step === 2 && (
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-center mb-6">Company Details</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Company Name</label>
            <input
              type="text"
              value={tenantData.name}
              onChange={(e) => setTenantData(prev => ({ ...prev, name: e.target.value }))}
              className="input"
              placeholder="Your Company Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subdomain</label>
            <div className="flex">
              <input
                type="text"
                value={tenantData.domain}
                onChange={(e) => setTenantData(prev => ({ ...prev, domain: e.target.value.toLowerCase() }))}
                className="input rounded-r-none"
                placeholder="yourcompany"
                required
              />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm">
                .chabs.app
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Admin Name</label>
            <input
              type="text"
              value={tenantData.adminName}
              onChange={(e) => setTenantData(prev => ({ ...prev, adminName: e.target.value }))}
              className="input"
              placeholder="Administrator Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Admin Email</label>
            <input
              type="email"
              value={tenantData.adminEmail}
              onChange={(e) => setTenantData(prev => ({ ...prev, adminEmail: e.target.value }))}
              className="input"
              placeholder="admin@yourcompany.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Admin Password</label>
            <input
              type="password"
              value={tenantData.adminPassword}
              onChange={(e) => setTenantData(prev => ({ ...prev, adminPassword: e.target.value }))}
              className="input"
              placeholder="Strong password"
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep(1)}
              className="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!tenantData.name || !tenantData.domain || !tenantData.adminEmail}
              className="btn btn-primary flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Create */}
      {step === 3 && selectedPlan && (
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-center mb-6">Review & Create</h2>
          
          <div className="card p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Plan:</span>
              <span>{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Company:</span>
              <span>{tenantData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Domain:</span>
              <span>{tenantData.domain}.chabs.app</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Admin:</span>
              <span>{tenantData.adminEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Monthly Cost:</span>
              <span className="text-lg font-bold">R{selectedPlan.price}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Features Included:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>✓ {selectedPlan.maxUsers === -1 ? 'Unlimited' : selectedPlan.maxUsers} Users</div>
              <div>✓ {selectedPlan.features.maxProducts === -1 ? 'Unlimited' : selectedPlan.features.maxProducts.toLocaleString()} Products</div>
              <div>✓ Email Integration</div>
              {selectedPlan.features.multiLocation && <div>✓ Multi-Location Support</div>}
              {selectedPlan.features.bom && <div>✓ Bill of Materials</div>}
              {selectedPlan.features.automation && <div>✓ Automation Rules</div>}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep(2)}
              className="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={createTenant}
              className="btn btn-primary flex-1"
            >
              Create Company
            </button>
          </div>
        </div>
      )}
    </div>
  );
}