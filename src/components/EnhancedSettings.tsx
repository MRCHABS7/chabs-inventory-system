import { useState, useEffect } from 'react';
import { me } from '../lib/auth-simple';

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  component: React.ReactNode;
}

export default function EnhancedSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'CHABS',
      timezone: 'Africa/Johannesburg',
      currency: 'ZAR',
      language: 'en',
      dateFormat: 'DD/MM/YYYY'
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      lowStockAlerts: true,
      orderUpdates: true,
      systemMaintenance: false
    },
    inventory: {
      autoReorder: false,
      reorderThreshold: 10,
      defaultMarkup: 30,
      trackSerialNumbers: false,
      enableBarcodes: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      auditLogging: true,
      ipWhitelist: ''
    },
    integrations: {
      accounting: 'none',
      shipping: 'none',
      payment: 'none',
      crm: 'none'
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      cloudBackup: false
    }
  });

  const user = me();

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      icon: '⚙️',
      description: 'Basic system configuration',
      component: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={settings.general.companyName}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, companyName: e.target.value }
                })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.general.timezone}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, timezone: e.target.value }
                })}
                className="input w-full"
              >
                <option value="Africa/Johannesburg">South Africa (SAST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="Europe/London">London</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={settings.general.currency}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, currency: e.target.value }
                })}
                className="input w-full"
              >
                <option value="ZAR">South African Rand (R)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                value={settings.general.dateFormat}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, dateFormat: e.target.value }
                })}
                className="input w-full"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: '🔔',
      description: 'Alert and notification preferences',
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {key === 'emailAlerts' && 'Receive notifications via email'}
                    {key === 'pushNotifications' && 'Browser push notifications'}
                    {key === 'lowStockAlerts' && 'Alert when products are running low'}
                    {key === 'orderUpdates' && 'Notifications for order status changes'}
                    {key === 'systemMaintenance' && 'System maintenance notifications'}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, [key]: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </label>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      icon: '📦',
      description: 'Inventory and stock management settings',
      component: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Reorder Threshold</label>
              <input
                type="number"
                value={settings.inventory.reorderThreshold}
                onChange={(e) => setSettings({
                  ...settings,
                  inventory: { ...settings.inventory, reorderThreshold: parseInt(e.target.value) || 0 }
                })}
                className="input w-full"
                min="0"
              />
              <p className="text-sm text-gray-600 mt-1">Default minimum stock level for new products</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Markup (%)</label>
              <input
                type="number"
                value={settings.inventory.defaultMarkup}
                onChange={(e) => setSettings({
                  ...settings,
                  inventory: { ...settings.inventory, defaultMarkup: parseInt(e.target.value) || 0 }
                })}
                className="input w-full"
                min="0"
                max="1000"
              />
              <p className="text-sm text-gray-600 mt-1">Default markup percentage for pricing</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Auto Reorder</div>
                <div className="text-sm text-gray-600">Automatically create purchase orders when stock is low</div>
              </div>
              <input
                type="checkbox"
                checked={settings.inventory.autoReorder}
                onChange={(e) => setSettings({
                  ...settings,
                  inventory: { ...settings.inventory, autoReorder: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600"
              />
            </label>
            
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Track Serial Numbers</div>
                <div className="text-sm text-gray-600">Enable serial number tracking for products</div>
              </div>
              <input
                type="checkbox"
                checked={settings.inventory.trackSerialNumbers}
                onChange={(e) => setSettings({
                  ...settings,
                  inventory: { ...settings.inventory, trackSerialNumbers: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600"
              />
            </label>
            
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Enable Barcodes</div>
                <div className="text-sm text-gray-600">Use barcode scanning for inventory management</div>
              </div>
              <input
                type="checkbox"
                checked={settings.inventory.enableBarcodes}
                onChange={(e) => setSettings({
                  ...settings,
                  inventory: { ...settings.inventory, enableBarcodes: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600"
              />
            </label>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security & Access',
      icon: '🔒',
      description: 'Security and access control settings',
      component: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, sessionTimeout: parseInt(e.target.value) || 30 }
                })}
                className="input w-full"
                min="5"
                max="480"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, passwordExpiry: parseInt(e.target.value) || 90 }
                })}
                className="input w-full"
                min="30"
                max="365"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
            <textarea
              value={settings.security.ipWhitelist}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, ipWhitelist: e.target.value }
              })}
              className="input w-full h-24"
              placeholder="Enter IP addresses, one per line (optional)"
            />
            <p className="text-sm text-gray-600 mt-1">Leave empty to allow access from any IP</p>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600">Require 2FA for all user logins</div>
              </div>
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, twoFactorAuth: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600"
              />
            </label>
            
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Audit Logging</div>
                <div className="text-sm text-gray-600">Log all user actions for security auditing</div>
              </div>
              <input
                type="checkbox"
                checked={settings.security.auditLogging}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, auditLogging: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600"
              />
            </label>
          </div>
        </div>
      )
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: '🔗',
      description: 'Third-party service integrations',
      component: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(settings.integrations).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key} Integration
                </label>
                <select
                  value={value}
                  onChange={(e) => setSettings({
                    ...settings,
                    integrations: { ...settings.integrations, [key]: e.target.value }
                  })}
                  className="input w-full"
                >
                  <option value="none">None</option>
                  {key === 'accounting' && (
                    <>
                      <option value="quickbooks">QuickBooks</option>
                      <option value="xero">Xero</option>
                      <option value="sage">Sage</option>
                    </>
                  )}
                  {key === 'shipping' && (
                    <>
                      <option value="fedex">FedEx</option>
                      <option value="ups">UPS</option>
                      <option value="dhl">DHL</option>
                      <option value="postnet">PostNet</option>
                    </>
                  )}
                  {key === 'payment' && (
                    <>
                      <option value="payfast">PayFast</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                    </>
                  )}
                  {key === 'crm' && (
                    <>
                      <option value="salesforce">Salesforce</option>
                      <option value="hubspot">HubSpot</option>
                      <option value="pipedrive">Pipedrive</option>
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🚀 Coming Soon</h4>
            <p className="text-sm text-blue-700">
              Advanced integrations with popular business tools are coming soon. 
              Contact support to request specific integrations.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'backup',
      title: 'Backup & Recovery',
      icon: '💾',
      description: 'Data backup and recovery settings',
      component: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select
                value={settings.backup.backupFrequency}
                onChange={(e) => setSettings({
                  ...settings,
                  backup: { ...settings.backup, backupFrequency: e.target.value }
                })}
                className="input w-full"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
              <input
                type="number"
                value={settings.backup.retentionDays}
                onChange={(e) => setSettings({
                  ...settings,
                  backup: { ...settings.backup, retentionDays: parseInt(e.target.value) || 30 }
                })}
                className="input w-full"
                min="1"
                max="365"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Automatic Backup</div>
                <div className="text-sm text-gray-600">Enable automatic data backups</div>
              </div>
              <input
                type="checkbox"
                checked={settings.backup.autoBackup}
                onChange={(e) => setSettings({
                  ...settings,
                  backup: { ...settings.backup, autoBackup: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600"
              />
            </label>
            
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Cloud Backup</div>
                <div className="text-sm text-gray-600">Store backups in cloud storage</div>
              </div>
              <input
                type="checkbox"
                checked={settings.backup.cloudBackup}
                onChange={(e) => setSettings({
                  ...settings,
                  backup: { ...settings.backup, cloudBackup: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600"
              />
            </label>
          </div>
          
          <div className="flex space-x-3">
            <button className="btn btn-primary">
              📥 Create Backup Now
            </button>
            <button className="btn btn-secondary">
              📤 Restore from Backup
            </button>
            <button className="btn btn-secondary">
              📋 View Backup History
            </button>
          </div>
        </div>
      )
    }
  ];

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('chabs_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset to default settings
      setSettings({
        general: {
          companyName: 'CHABS',
          timezone: 'Africa/Johannesburg',
          currency: 'ZAR',
          language: 'en',
          dateFormat: 'DD/MM/YYYY'
        },
        notifications: {
          emailAlerts: true,
          pushNotifications: true,
          lowStockAlerts: true,
          orderUpdates: true,
          systemMaintenance: false
        },
        inventory: {
          autoReorder: false,
          reorderThreshold: 10,
          defaultMarkup: 30,
          trackSerialNumbers: false,
          enableBarcodes: true
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          passwordExpiry: 90,
          auditLogging: true,
          ipWhitelist: ''
        },
        integrations: {
          accounting: 'none',
          shipping: 'none',
          payment: 'none',
          crm: 'none'
        },
        backup: {
          autoBackup: true,
          backupFrequency: 'daily',
          retentionDays: 30,
          cloudBackup: false
        }
      });
    }
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chabs_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ⚙️ System Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your CHABS system preferences and integrations
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleResetSettings}
              className="btn btn-secondary"
            >
              🔄 Reset to Defaults
            </button>
            <button
              onClick={handleSaveSettings}
              className="btn btn-primary"
            >
              💾 Save Settings
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Settings Categories</h3>
            </div>
            <nav className="space-y-1 p-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{section.icon}</span>
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {sections.find(s => s.id === activeSection)?.component}
          </div>
        </div>
      </div>
    </div>
  );
}