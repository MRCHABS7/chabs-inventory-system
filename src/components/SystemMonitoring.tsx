import { useState, useEffect } from 'react';
import type { Tenant } from '../lib/types-multi-tenant';

export default function SystemMonitoring() {
  const [metrics, setMetrics] = useState({
    totalTenants: 0,
    activeTenants: 0,
    totalUsers: 0,
    totalRevenue: 0,
    systemHealth: 'good',
    uptime: '99.9%',
    responseTime: '120ms',
    errorRate: '0.1%'
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'High CPU usage on server 2', time: '5 min ago' },
    { id: 2, type: 'info', message: 'New company registration: ABC Corp', time: '15 min ago' },
    { id: 3, type: 'success', message: 'Backup completed successfully', time: '1 hour ago' }
  ]);

  useEffect(() => {
    // Load system metrics
    const tenants: Tenant[] = JSON.parse(localStorage.getItem('tenants') || '[]');
    const planPrices = { starter: 299, professional: 599, enterprise: 1299 };
    
    setMetrics({
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.isActive).length,
      totalUsers: tenants.reduce((sum, t) => sum + t.currentUsers, 0),
      totalRevenue: tenants.reduce((sum, t) => sum + (t.isActive ? planPrices[t.plan] : 0), 0),
      systemHealth: 'good',
      uptime: '99.9%',
      responseTime: '120ms',
      errorRate: '0.1%'
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{metrics.uptime}</div>
          <div className="text-sm text-gray-600">Uptime</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{metrics.responseTime}</div>
          <div className="text-sm text-gray-600">Avg Response</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{metrics.totalUsers}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{metrics.errorRate}</div>
          <div className="text-sm text-gray-600">Error Rate</div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">R{metrics.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Monthly Recurring Revenue</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">R{(metrics.totalRevenue * 12).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Annual Run Rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">R{Math.round(metrics.totalRevenue / Math.max(metrics.activeTenants, 1))}</div>
            <div className="text-sm text-gray-600">Average Revenue Per User</div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">System Alerts</h3>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              alert.type === 'success' ? 'bg-green-50 border-green-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`mr-2 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {alert.type === 'warning' ? '⚠️' : alert.type === 'success' ? '✅' : 'ℹ️'}
                  </span>
                  <span className="font-medium">{alert.message}</span>
                </div>
                <span className="text-sm text-gray-500">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn btn-primary p-4 text-left">
            <div className="text-lg mb-2">🔄</div>
            <div className="font-medium">Restart Services</div>
            <div className="text-sm opacity-80">Restart all system services</div>
          </button>
          
          <button className="btn btn-secondary p-4 text-left">
            <div className="text-lg mb-2">💾</div>
            <div className="font-medium">Create Backup</div>
            <div className="text-sm opacity-80">Full system backup</div>
          </button>
          
          <button className="btn btn-secondary p-4 text-left">
            <div className="text-lg mb-2">📊</div>
            <div className="font-medium">Generate Report</div>
            <div className="text-sm opacity-80">Monthly system report</div>
          </button>
          
          <button className="btn btn-secondary p-4 text-left">
            <div className="text-lg mb-2">🔧</div>
            <div className="font-medium">Maintenance Mode</div>
            <div className="text-sm opacity-80">Enable maintenance</div>
          </button>
        </div>
      </div>
    </div>
  );
}