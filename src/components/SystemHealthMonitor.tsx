import { useState, useEffect } from 'react';
import { listProducts, listOrders, listCustomers, listAutomationRules } from '../lib/storage-simple';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    action?: string;
  }>;
  metrics: {
    dataIntegrity: number;
    performance: number;
    security: number;
    automation: number;
  };
}

export default function SystemHealthMonitor() {
  const [health, setHealth] = useState<SystemHealth>({
    status: 'healthy',
    score: 100,
    issues: [],
    metrics: {
      dataIntegrity: 100,
      performance: 100,
      security: 100,
      automation: 100
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const checkSystemHealth = () => {
    const issues: SystemHealth['issues'] = [];
    let score = 100;
    const metrics = {
      dataIntegrity: 100,
      performance: 100,
      security: 100,
      automation: 100
    };

    try {
      // Check data integrity
      const products = listProducts();
      const orders = listOrders();
      const customers = listCustomers();
      const automationRules = listAutomationRules();

      // Data integrity checks
      const productsWithoutPrices = products.filter(p => !p.sellingPrice || p.sellingPrice <= 0);
      if (productsWithoutPrices.length > 0) {
        issues.push({
          type: 'warning',
          message: `${productsWithoutPrices.length} products have invalid prices`,
          action: 'Review product pricing'
        });
        metrics.dataIntegrity -= 10;
      }

      const productsWithoutStock = products.filter(p => p.stock < 0);
      if (productsWithoutStock.length > 0) {
        issues.push({
          type: 'error',
          message: `${productsWithoutStock.length} products have negative stock`,
          action: 'Fix stock levels'
        });
        metrics.dataIntegrity -= 20;
      }

      const ordersWithoutCustomers = orders.filter(o => !customers.find(c => c.id === o.customerId));
      if (ordersWithoutCustomers.length > 0) {
        issues.push({
          type: 'error',
          message: `${ordersWithoutCustomers.length} orders have invalid customer references`,
          action: 'Fix customer data'
        });
        metrics.dataIntegrity -= 15;
      }

      // Performance checks
      const totalRecords = products.length + orders.length + customers.length;
      if (totalRecords > 10000) {
        issues.push({
          type: 'info',
          message: 'Large dataset detected - consider archiving old records',
          action: 'Archive old data'
        });
        metrics.performance -= 10;
      }

      // Security checks
      const adminUsers = JSON.parse(localStorage.getItem('chabs_users') || '[]').filter((u: any) => u.role === 'admin');
      if (adminUsers.length === 0) {
        issues.push({
          type: 'error',
          message: 'No admin users found',
          action: 'Create admin user'
        });
        metrics.security -= 30;
      }

      // Automation checks
      if (automationRules.length === 0) {
        issues.push({
          type: 'info',
          message: 'No automation rules configured',
          action: 'Set up automation'
        });
        metrics.automation -= 20;
      }

      const inactiveRules = automationRules.filter(r => !r.isActive);
      if (inactiveRules.length > 0) {
        issues.push({
          type: 'warning',
          message: `${inactiveRules.length} automation rules are inactive`,
          action: 'Review automation rules'
        });
        metrics.automation -= 10;
      }

      // Calculate overall score
      score = Math.round((metrics.dataIntegrity + metrics.performance + metrics.security + metrics.automation) / 4);

      // Determine status
      let status: SystemHealth['status'] = 'healthy';
      if (score < 70 || issues.some(i => i.type === 'error')) {
        status = 'critical';
      } else if (score < 85 || issues.some(i => i.type === 'error')) {
        status = 'warning';
      }

      setHealth({
        status,
        score,
        issues,
        metrics
      });

    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({
        status: 'critical',
        score: 0,
        issues: [{
          type: 'error',
          message: 'System health check failed',
          action: 'Check system logs'
        }],
        metrics: {
          dataIntegrity: 0,
          performance: 0,
          security: 0,
          automation: 0
        }
      });
    }
  };

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  return (
    <div className="card">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getStatusIcon(health.status)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">System Health</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(health.status)}`}>
                {health.status.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">Score: {health.score}/100</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              checkSystemHealth();
            }}
            className="btn-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            🔄 Refresh
          </button>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Health Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(health.metrics).map(([key, value]) => (
              <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-lg font-bold ${
                  value >= 90 ? 'text-green-600' :
                  value >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {value}%
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>

          {/* Issues */}
          {health.issues.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Issues & Recommendations</h4>
              <div className="space-y-2">
                {health.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-l-4 ${
                      issue.type === 'error' ? 'bg-red-50 border-red-400' :
                      issue.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{issue.message}</div>
                        {issue.action && (
                          <div className="text-sm text-gray-600 mt-1">
                            Recommended action: {issue.action}
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.type === 'error' ? 'bg-red-100 text-red-800' :
                        issue.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {issue.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Info */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">System Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Version: CHABS v2.0</div>
                <div>Last Check: {new Date().toLocaleString()}</div>
                <div>Uptime: {Math.floor(performance.now() / 1000 / 60)} minutes</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button className="btn-sm bg-green-100 text-green-800 hover:bg-green-200">
                  🔧 Run Diagnostics
                </button>
                <button className="btn-sm bg-blue-100 text-blue-800 hover:bg-blue-200">
                  📊 View Logs
                </button>
                <button className="btn-sm bg-purple-100 text-purple-800 hover:bg-purple-200">
                  🚀 Optimize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}