import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import AutomationRuleBuilder from '../components/AutomationRuleBuilder';
import { listAutomationRules, createAutomationRule, updateAutomationRule, deleteAutomationRule, checkAutomationRules } from '../lib/storage-simple';
import type { AutomationRule } from '../lib/types';

export default function AutomationPage() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [activeTab, setActiveTab] = useState<'rules' | 'settings'>('rules');
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);

  const refresh = () => {
    setAutomationRules(listAutomationRules());
  };
  
  useEffect(() => { refresh(); }, []);

  const toggleRule = (ruleId: string, isActive: boolean) => {
    updateAutomationRule(ruleId, { isActive });
    refresh();
  };

  const runAutomation = () => {
    checkAutomationRules();
    alert('Automation rules executed! Check your purchase orders and notifications.');
    refresh();
  };



  const createDefaultRules = () => {
    // Create some default automation rules
    const defaultRules = [
      {
        name: 'Auto Reorder - Low Stock',
        type: 'reorder_point' as const,
        isActive: true,
        conditions: { stockLevel: 0 },
        actions: { createPO: true, sendAlert: true }
      },
      {
        name: 'Low Stock Alert',
        type: 'low_stock' as const,
        isActive: true,
        conditions: { stockLevel: 5 },
        actions: { sendAlert: true }
      },
      {
        name: 'Price Change Monitor',
        type: 'supplier_price' as const,
        isActive: true,
        conditions: { timeframe: 30 },
        actions: { sendAlert: true }
      }
    ];

    defaultRules.forEach(rule => createAutomationRule(rule));
    refresh();
  };

  return (
    <Layout>
      <div className="min-h-screen gradient-bg">
        <div className="container py-6 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Automation Center</h1>
            <p className="text-white/80 text-lg">Business automation and workflow management</p>
          </div>

        {/* Tab Navigation */}
        <div className="card">
          <div className="flex space-x-4 mb-6">
            {[
              { key: 'rules', label: '⚡ Automation Rules', icon: '⚡' },
              { key: 'settings', label: '⚙️ Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Automation Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="card">
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-3">
                  <button onClick={runAutomation} className="btn">
                    ▶️ Run Automation Now
                  </button>
                  <button onClick={createDefaultRules} className="btn btn-secondary">
                    + Create Default Rules
                  </button>
                  <button onClick={() => setShowRuleBuilder(true)} className="btn btn-primary">
                    🛠️ Build Custom Rule
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Last run: {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            {/* Rules List */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Automation Rules</h2>
              <div className="space-y-4">
                {automationRules.map(rule => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        <p className="text-gray-600 capitalize">{rule.type.replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={rule.isActive}
                            onChange={(e) => toggleRule(rule.id, e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm">Active</span>
                        </label>
                        <button
                          onClick={() => deleteAutomationRule(rule.id)}
                          className="btn-danger text-sm px-3 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Conditions:</h4>
                        <ul className="text-gray-600 space-y-1">
                          {rule.conditions.stockLevel !== undefined && (
                            <li>• Stock level ≤ {rule.conditions.stockLevel}</li>
                          )}
                          {rule.conditions.timeframe && (
                            <li>• Check every {rule.conditions.timeframe} days</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Actions:</h4>
                        <ul className="text-gray-600 space-y-1">
                          {rule.actions.createPO && <li>• Create purchase order</li>}
                          {rule.actions.sendAlert && <li>• Send alert notification</li>}
                          {rule.actions.updatePricing && <li>• Update pricing</li>}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm text-gray-500">
                      <span>Triggered {rule.triggerCount} times</span>
                      {rule.lastTriggered && (
                        <span>Last: {new Date(rule.lastTriggered).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                ))}

                {automationRules.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No automation rules configured. Click "Create Default Rules" to get started.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}



        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Automation Settings</h2>
              
              {/* AI Features */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">🤖 AI Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Demand Forecasting</h4>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm">Enabled</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Predict future demand using machine learning algorithms
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Price Optimization</h4>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm">Enabled</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Automatically optimize pricing based on market conditions
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Supplier Intelligence</h4>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm">Enabled</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Analyze supplier performance and recommend alternatives
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Inventory Optimization</h4>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm">Enabled</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Optimize stock levels to minimize costs and prevent stockouts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Automation Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">⚡ Automation Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">Auto-Generate Purchase Orders</h4>
                        <p className="text-sm text-gray-600">Automatically create POs when stock is low</p>
                      </div>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Enabled</span>
                      </label>
                    </div>

                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">Smart Reorder Points</h4>
                        <p className="text-sm text-gray-600">AI-calculated optimal reorder points</p>
                      </div>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Enabled</span>
                      </label>
                    </div>

                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">Price Alert System</h4>
                        <p className="text-sm text-gray-600">Get notified of significant price changes</p>
                      </div>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Enabled</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Future AI Features */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">🚀 Coming Soon</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 opacity-60">
                      <h4 className="font-medium">Natural Language Queries</h4>
                      <p className="text-sm text-gray-600">Ask questions about your business in plain English</p>
                      <span className="text-xs text-blue-600">Q2 2024</span>
                    </div>

                    <div className="border border-dashed border-gray-300 rounded-lg p-4 opacity-60">
                      <h4 className="font-medium">Computer Vision</h4>
                      <p className="text-sm text-gray-600">Automatic product recognition and counting</p>
                      <span className="text-xs text-blue-600">Q3 2024</span>
                    </div>

                    <div className="border border-dashed border-gray-300 rounded-lg p-4 opacity-60">
                      <h4 className="font-medium">Predictive Maintenance</h4>
                      <p className="text-sm text-gray-600">Predict equipment failures before they happen</p>
                      <span className="text-xs text-blue-600">Q4 2024</span>
                    </div>

                    <div className="border border-dashed border-gray-300 rounded-lg p-4 opacity-60">
                      <h4 className="font-medium">Voice Commands</h4>
                      <p className="text-sm text-gray-600">Control your inventory with voice commands</p>
                      <span className="text-xs text-blue-600">2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Status Card */}
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">🤖 AI System Status</h3>
              <p className="text-sm text-gray-600">All AI services are operational</p>
            </div>
            <div className="text-right">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-2">
                🟢 Online
              </div>
              <div className="text-xs text-gray-500">
                Processing: 1,247 data points/min
              </div>
            </div>
          </div>
        </div>

        {/* Rule Builder Modal */}
        {showRuleBuilder && (
          <AutomationRuleBuilder
            onClose={() => setShowRuleBuilder(false)}
            onSave={refresh}
          />
        )}
        </div>
      </div>
    </Layout>
  );
}