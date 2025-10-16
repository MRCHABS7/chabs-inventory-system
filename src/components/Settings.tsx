import { useEffect, useState } from 'react';
import { getCompany, setCompany } from '../lib/storage-simple';
import { useTheme } from '../contexts/ThemeContext';
import EmailSettings from './EmailSettings';
import BrandingSettings from './BrandingSettings';
import SystemSettingsManager from './SystemSettingsManager';
import type { CompanyDetails } from '../lib/types';

export default function Settings() {
  const [c, setC] = useState<CompanyDetails>({ 
    name: '', 
    currency: 'ZAR', 
    taxRate: 0,
    theme: 'auto'
  });
  
  const [activeTab, setActiveTab] = useState<'company' | 'email' | 'appearance' | 'branding' | 'system'>('company');
  const { theme, setTheme } = useTheme();

  useEffect(() => { 
    const company = getCompany();
    setC(company);
    if (company.theme) {
      setTheme(company.theme);
    }
  }, [setTheme]);

  const save = () => { 
    const updatedCompany = { ...c, theme };
    setCompany(updatedCompany); 
    alert('Settings saved successfully!'); 
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    setC({ ...c, theme: newTheme });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your company settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'company', label: 'Company' },
            { id: 'branding', label: 'Branding & Templates' },
            { id: 'appearance', label: 'Theme' },
            { id: 'email', label: 'Email' },
            { id: 'system', label: 'System Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'company' && (
        <div className="space-y-6">
          {/* Company Details */}
          <div className="card space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          Company Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
            <input 
              className="input" 
              placeholder="Enter company name" 
              value={c.name} 
              onChange={e => setC({ ...c, name: e.target.value })} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax Number</label>
            <input 
              className="input" 
              placeholder="Tax/VAT number" 
              value={c.taxNumber ?? ''} 
              onChange={e => setC({ ...c, taxNumber: e.target.value })} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
          <textarea 
            className="input min-h-[80px]" 
            placeholder="Company address" 
            value={c.address ?? ''} 
            onChange={e => setC({ ...c, address: e.target.value })} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input 
              className="input" 
              placeholder="Phone number" 
              value={c.phone ?? ''} 
              onChange={e => setC({ ...c, phone: e.target.value })} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input 
              className="input" 
              type="email"
              placeholder="Company email" 
              value={c.email ?? ''} 
              onChange={e => setC({ ...c, email: e.target.value })} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
          <input 
            className="input" 
            placeholder="https://yourcompany.com" 
            value={c.website ?? ''} 
            onChange={e => setC({ ...c, website: e.target.value })} 
          />
        </div>
      </div>

      {/* Financial Settings */}
      <div className="card space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          Financial Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
            <select 
              className="input" 
              value={c.currency} 
              onChange={e => setC({ ...c, currency: e.target.value })}
            >
              <option value="ZAR">South African Rand (ZAR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Tax Rate (%)</label>
            <input 
              className="input" 
              type="number"
              step="0.01"
              placeholder="15.00" 
              value={c.taxRate} 
              onChange={e => setC({ ...c, taxRate: parseFloat(e.target.value) || 0 })} 
            />
          </div>
        </div>
      </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="btn btn-primary px-8" type="button" onClick={save}>
              Save Company Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === 'email' && <EmailSettings />}

      {activeTab === 'branding' && <BrandingSettings />}

      {activeTab === 'system' && <SystemSettingsManager />}

      {activeTab === 'appearance' && (
        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              Theme Settings
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'light' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-2">Light</div>
                  <div className="text-sm font-medium">Light</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-2">Dark</div>
                  <div className="text-sm font-medium">Dark</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleThemeChange('auto')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'auto' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-2">Auto</div>
                  <div className="text-sm font-medium">Auto</div>
                </button>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">Color Scheme</h4>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                The system uses a modern purple and pink gradient theme that adapts to your selected mode.
                The auto mode will switch between light and dark based on your system preferences.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="btn btn-primary px-8" type="button" onClick={save}>
              Save Appearance Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

