import { useState, useEffect } from 'react';
import { useBranding } from '../contexts/BrandingContext';

export default function BrandingSettings() {
  const { branding, updateBranding } = useBranding();
  const [previewSettings, setPreviewSettings] = useState(branding);
  const [activeTab, setActiveTab] = useState('colors');

  useEffect(() => {
    setPreviewSettings(branding);
  }, [branding]);

  const handlePreviewChange = (field: string, value: string) => {
    setPreviewSettings(prev => ({ ...prev, [field]: value }));
  };

  const applySettings = () => {
    updateBranding(previewSettings);
    alert('Settings applied successfully!');
  };

  const resetSettings = () => {
    setPreviewSettings(branding);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Settings Panel */}
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Branding Settings</h2>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6">
            {[
              { id: 'colors', label: 'Colors', icon: '🎨' },
              { id: 'company', label: 'Company', icon: '🏢' },
              { id: 'typography', label: 'Typography', icon: '📝' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={previewSettings.primaryColor}
                    onChange={(e) => handlePreviewChange('primaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={previewSettings.primaryColor}
                    onChange={(e) => handlePreviewChange('primaryColor', e.target.value)}
                    className="input flex-1 font-mono"
                    placeholder="#8B5CF6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Secondary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={previewSettings.secondaryColor}
                    onChange={(e) => handlePreviewChange('secondaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={previewSettings.secondaryColor}
                    onChange={(e) => handlePreviewChange('secondaryColor', e.target.value)}
                    className="input flex-1 font-mono"
                    placeholder="#EC4899"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Accent Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={previewSettings.accentColor}
                    onChange={(e) => handlePreviewChange('accentColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={previewSettings.accentColor}
                    onChange={(e) => handlePreviewChange('accentColor', e.target.value)}
                    className="input flex-1 font-mono"
                    placeholder="#F59E0B"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  value={previewSettings.companyName}
                  onChange={(e) => handlePreviewChange('companyName', e.target.value)}
                  className="input"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Email</label>
                <input
                  type="email"
                  value={previewSettings.companyEmail}
                  onChange={(e) => handlePreviewChange('companyEmail', e.target.value)}
                  className="input"
                  placeholder="info@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Phone</label>
                <input
                  type="tel"
                  value={previewSettings.companyPhone}
                  onChange={(e) => handlePreviewChange('companyPhone', e.target.value)}
                  className="input"
                  placeholder="+27 11 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Address</label>
                <textarea
                  value={previewSettings.companyAddress}
                  onChange={(e) => handlePreviewChange('companyAddress', e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="123 Business Street, City, Province, Postal Code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Membership Text</label>
                <input
                  type="text"
                  value={previewSettings.membershipText}
                  onChange={(e) => handlePreviewChange('membershipText', e.target.value)}
                  className="input"
                  placeholder="MEMBER OF THE GALVANISING ASSOCIATION OF SOUTH AFRICA"
                />
                <p className="text-xs text-gray-500 mt-1">This text appears at the bottom of quotations</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quotation Notes</label>
                <textarea
                  value={previewSettings.quotationNotes}
                  onChange={(e) => handlePreviewChange('quotationNotes', e.target.value)}
                  className="input"
                  rows={5}
                  placeholder="Default terms and conditions for quotations"
                />
                <p className="text-xs text-gray-500 mt-1">These notes appear in the quotation template</p>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Font Family</label>
                <select
                  value={previewSettings.fontFamily}
                  onChange={(e) => handlePreviewChange('fontFamily', e.target.value)}
                  className="input"
                >
                  <option value="Inter">Inter (Default)</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Roboto">Roboto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Logo URL</label>
                <input
                  type="url"
                  value={previewSettings.logoUrl || ''}
                  onChange={(e) => handlePreviewChange('logoUrl', e.target.value)}
                  className="input"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={applySettings}
              className="btn btn-primary flex-1"
            >
              Apply Settings
            </button>
            <button
              onClick={resetSettings}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
          
          {/* Dashboard Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Dashboard Preview</h4>
            <div 
              className="p-4 rounded-lg border-2"
              style={{ 
                borderColor: previewSettings.primaryColor,
                fontFamily: previewSettings.fontFamily 
              }}
            >
              <div 
                className="text-lg font-bold mb-2"
                style={{ color: previewSettings.primaryColor }}
              >
                {previewSettings.companyName || 'Company Name'}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="p-3 rounded-lg text-white text-center"
                  style={{ backgroundColor: previewSettings.primaryColor }}
                >
                  <div className="text-xl font-bold">156</div>
                  <div className="text-sm">Active Orders</div>
                </div>
                <div 
                  className="p-3 rounded-lg text-white text-center"
                  style={{ backgroundColor: previewSettings.secondaryColor }}
                >
                  <div className="text-xl font-bold">R47,892</div>
                  <div className="text-sm">Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quotation Preview */}
          <div>
            <h4 className="text-sm font-medium mb-3">Quotation Preview</h4>
            <div 
              className="border-2 text-xs"
              style={{ 
                borderColor: previewSettings.primaryColor,
                fontFamily: previewSettings.fontFamily 
              }}
            >
              {/* Header */}
              <div className="flex border-b-2" style={{ borderColor: previewSettings.primaryColor }}>
                <div className="flex-1 p-3">
                  <div 
                    className="font-bold text-sm mb-1"
                    style={{ color: previewSettings.primaryColor }}
                  >
                    {previewSettings.companyName?.toUpperCase() || 'COMPANY NAME'}
                  </div>
                  <div className="text-xs">
                    {previewSettings.companyAddress && `${previewSettings.companyAddress.split(',')[0]}`}<br/>
                    {previewSettings.companyPhone && `Tel: ${previewSettings.companyPhone}`}<br/>
                    {previewSettings.companyEmail && `Email: ${previewSettings.companyEmail}`}
                  </div>
                </div>
                <div className="flex-1 p-3 text-center border-l-2" style={{ borderColor: previewSettings.primaryColor }}>
                  <div 
                    className="text-lg font-bold mb-1"
                    style={{ color: previewSettings.primaryColor }}
                  >
                    QUOTATION
                  </div>
                  <div className="text-xs">
                    {previewSettings.companyPhone && `Tel: ${previewSettings.companyPhone}`}
                  </div>
                </div>
              </div>

              {/* Sample Content */}
              <div className="flex border-b-2" style={{ borderColor: previewSettings.primaryColor }}>
                <div className="flex-1 p-3">
                  <div className="font-bold text-xs mb-1">CUSTOMER: Sample Customer</div>
                  <div className="text-xs">EMAIL: customer@example.com</div>
                </div>
                <div className="flex-1 p-3 text-right border-l-2" style={{ borderColor: previewSettings.primaryColor }}>
                  <div className="text-xs"><strong>QUOTE #: QUO-001</strong></div>
                  <div className="text-xs"><strong>DATE: {new Date().toLocaleDateString()}</strong></div>
                </div>
              </div>

              {/* Sample Items */}
              <table className="w-full text-xs">
                <thead style={{ backgroundColor: previewSettings.primaryColor, color: 'white' }}>
                  <tr>
                    <th className="p-2 text-center">QTY</th>
                    <th className="p-2 text-left">DESCRIPTION</th>
                    <th className="p-2 text-right">UNIT PRICE</th>
                    <th className="p-2 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-center border-b">5</td>
                    <td className="p-2 border-b">Sample Product</td>
                    <td className="p-2 text-right border-b">R100.00</td>
                    <td className="p-2 text-right border-b">R500.00</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex">
                <div className="flex-1 p-3">
                  <div className="text-xs font-bold">Notes:</div>
                  <div className="text-xs">Sample quotation terms and conditions.</div>
                </div>
                <div className="w-48 border-l-2" style={{ borderColor: previewSettings.primaryColor }}>
                  <div className="flex justify-between p-2 border-b text-xs">
                    <span>SUB TOT:</span>
                    <span>R 500.00</span>
                  </div>
                  <div className="flex justify-between p-2 border-b text-xs">
                    <span>VAT:</span>
                    <span>R 75.00</span>
                  </div>
                  <div 
                    className="flex justify-between p-2 text-xs font-bold text-white"
                    style={{ backgroundColor: previewSettings.primaryColor }}
                  >
                    <span>TOTAL:</span>
                    <span>R 575.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}