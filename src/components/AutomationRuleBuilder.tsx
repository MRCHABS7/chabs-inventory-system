import { useState } from 'react';
import { createAutomationRule } from '../lib/storage-simple';
import type { AutomationRule } from '../lib/types';

interface AutomationRuleBuilderProps {
  onClose: () => void;
  onSave: () => void;
}

export default function AutomationRuleBuilder({ onClose, onSave }: AutomationRuleBuilderProps) {
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState<'low_stock' | 'reorder_point' | 'supplier_price' | 'demand_forecast'>('low_stock');
  const [conditions, setConditions] = useState({
    stockLevel: 5,
    timeframe: 30,
    priceChange: 10,
    priceThreshold: 10
  });
  const [actions, setActions] = useState({
    sendAlert: true,
    createPO: false,
    updatePricing: false,
    sendEmail: false
  });
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {

    if (!ruleName.trim()) {
      alert('Please enter a rule name');
      return;
    }

    const rule = {
      name: ruleName,
      type: ruleType,
      isActive,
      conditions: {
        stockLevel: ruleType === 'low_stock' || ruleType === 'reorder_point' ? conditions.stockLevel : undefined,
        timeframe: ruleType === 'supplier_price' || ruleType === 'demand_forecast' ? conditions.timeframe : undefined,
        priceThreshold: ruleType === 'supplier_price' ? conditions.priceChange : undefined
      },
      actions
    };

    createAutomationRule(rule);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ⚡ Create Automation Rule
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Rule Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rule Name
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g., Auto Reorder Low Stock Items"
                className="input w-full"
              />
            </div>

            {/* Rule Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rule Type
              </label>
              <select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value as any)}
                className="input w-full"
              >
                <option value="low_stock">Low Stock Alert</option>
                <option value="reorder_point">Automatic Reorder</option>
                <option value="supplier_price">Price Change Monitor</option>
                <option value="demand_forecast">Demand Forecast Alert</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {ruleType === 'low_stock' && 'Send alerts when products reach minimum stock levels'}
                {ruleType === 'reorder_point' && 'Automatically create purchase orders when stock is low'}
                {ruleType === 'supplier_price' && 'Monitor supplier price changes and alert on significant changes'}
                {ruleType === 'demand_forecast' && 'Use AI to predict demand and alert on potential stockouts'}
              </p>
            </div>

            {/* Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Conditions
              </label>
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {(ruleType === 'low_stock' || ruleType === 'reorder_point') && (
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Stock Level Threshold
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={conditions.stockLevel}
                        onChange={(e) => setConditions({ ...conditions, stockLevel: parseInt(e.target.value) || 0 })}
                        className="input w-20"
                        min="0"
                      />
                      <span className="text-sm text-gray-600">units or less</span>
                    </div>
                  </div>
                )}

                {(ruleType === 'supplier_price' || ruleType === 'demand_forecast') && (
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Check Frequency
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={conditions.timeframe}
                        onChange={(e) => setConditions({ ...conditions, timeframe: parseInt(e.target.value) || 1 })}
                        className="input w-20"
                        min="1"
                      />
                      <span className="text-sm text-gray-600">days</span>
                    </div>
                  </div>
                )}

                {ruleType === 'supplier_price' && (
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Price Change Threshold
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={conditions.priceChange}
                        onChange={(e) => setConditions({ ...conditions, priceChange: parseInt(e.target.value) || 0, priceThreshold: parseInt(e.target.value) || 0 })}
                        className="input w-20"
                        min="0"
                      />
                      <span className="text-sm text-gray-600">% change</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Actions to Take
              </label>
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={actions.sendAlert}
                    onChange={(e) => setActions({ ...actions, sendAlert: e.target.checked })}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Send Alert Notification</div>
                    <div className="text-sm text-gray-600">Show notification in the system</div>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={actions.createPO}
                    onChange={(e) => setActions({ ...actions, createPO: e.target.checked })}
                    className="mr-3"
                    disabled={ruleType === 'supplier_price'}
                  />
                  <div>
                    <div className="font-medium">Create Purchase Order</div>
                    <div className="text-sm text-gray-600">Automatically generate PO for reordering</div>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={actions.sendEmail}
                    onChange={(e) => setActions({ ...actions, sendEmail: e.target.checked })}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Send Email Alert</div>
                    <div className="text-sm text-gray-600">Email notification to administrators</div>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={actions.updatePricing}
                    onChange={(e) => setActions({ ...actions, updatePricing: e.target.checked })}
                    className="mr-3"
                    disabled={ruleType !== 'supplier_price'}
                  />
                  <div>
                    <div className="font-medium">Update Pricing</div>
                    <div className="text-sm text-gray-600">Automatically adjust prices based on supplier changes</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Rule Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Activate Rule Immediately</div>
                  <div className="text-sm text-gray-600">Start monitoring and executing this rule right away</div>
                </div>
              </label>
            </div>

            {/* Preview */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Rule Preview</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>{ruleName || 'Unnamed Rule'}</strong> will{' '}
                {ruleType === 'low_stock' && `monitor products and alert when stock reaches ${conditions.stockLevel} units or less`}
                {ruleType === 'reorder_point' && `automatically create purchase orders when stock reaches ${conditions.stockLevel} units or less`}
                {ruleType === 'supplier_price' && `check supplier prices every ${conditions.timeframe} days and alert on changes of ${conditions.priceChange}% or more`}
                {ruleType === 'demand_forecast' && `analyze demand patterns every ${conditions.timeframe} days and predict potential stockouts`}
                . Actions: {Object.entries(actions).filter(([_, enabled]) => enabled).map(([action]) => action.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')}.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
            >
              Create Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}