import { useState, useEffect } from 'react';
import { listProducts, listOrders, listCustomers, listAutomationRules } from '../lib/storage-simple';
import { me } from '../lib/auth-simple';
import SystemHealthMonitor from './SystemHealthMonitor';
import DashboardCustomizer from './DashboardCustomizer';
import type { Product, Order, Customer, AutomationRule, User } from '../lib/types';

export default function BusinessDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setUser(me());
    setProducts(listProducts());
    setOrders(listOrders());
    setCustomers(listCustomers());
    setAutomationRules(listAutomationRules());
  }, []);

  // Smart alerts and recommendations
  const getSmartAlerts = () => {
    const alerts = [];
    
    // Low stock alerts
    const lowStockProducts = products.filter(p => p.stock <= p.minimumStock);
    if (lowStockProducts.length > 0) {
      alerts.push({
        type: 'warning',
        title: `${lowStockProducts.length} products need restocking`,
        message: 'Consider creating purchase orders for low stock items',
        action: 'View Products',
        priority: 'high'
      });
    }

    // Pending orders
    const pendingOrders = orders.filter(o => o.status === 'pending');
    if (pendingOrders.length > 0) {
      alerts.push({
        type: 'info',
        title: `${pendingOrders.length} orders awaiting confirmation`,
        message: 'Review and confirm pending customer orders',
        action: 'View Orders',
        priority: 'medium'
      });
    }

    // Automation opportunities
    if (automationRules.length === 0) {
      alerts.push({
        type: 'info',
        title: 'Set up automation rules',
        message: 'Automate routine tasks like reordering and alerts',
        action: 'Setup Automation',
        priority: 'low'
      });
    }

    return alerts;
  };

  // Performance metrics
  const getPerformanceMetrics = () => {
    const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
    const thisMonth = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const thisMonthOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === thisMonth.getMonth() && orderDate.getFullYear() === thisMonth.getFullYear();
    });
    
    const lastMonthOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === lastMonth.getMonth() && orderDate.getFullYear() === lastMonth.getFullYear();
    });

    const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return {
      totalRevenue,
      thisMonthRevenue,
      revenueGrowth,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      activeAutomations: automationRules.filter(r => r.isActive).length
    };
  };

  const alerts = getSmartAlerts();
  const metrics = getPerformanceMetrics();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {isClient && user ? `${user.firstName} ${user.lastName}`.trim() || user.email || 'User' : 'User'}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your business today
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-xs text-gray-400">
              Last updated: {isClient ? new Date().toLocaleTimeString() : '--:--:--'}
            </div>
          </div>
        </div>
      </div>

      {/* System Health Monitor */}
      <div className="floating">
        <SystemHealthMonitor />
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card text-center floating pulse-glow">
          <div className="text-2xl font-bold text-green-600">R{metrics.totalRevenue.toFixed(0)}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="card text-center floating">
          <div className="text-2xl font-bold text-blue-600">R{metrics.thisMonthRevenue.toFixed(0)}</div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
        <div className="card text-center floating pulse-glow">
          <div className={`text-2xl font-bold ${metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.revenueGrowth >= 0 ? '+' : ''}{metrics.revenueGrowth.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Growth</div>
        </div>
        <div className="card text-center floating">
          <div className="text-2xl font-bold text-purple-600">{metrics.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="card text-center floating">
          <div className="text-2xl font-bold text-pink-600">{metrics.totalCustomers}</div>
          <div className="text-sm text-gray-600">Customers</div>
        </div>
        <div className="card text-center floating pulse-glow">
          <div className="text-2xl font-bold text-purple-600">{metrics.activeAutomations}</div>
          <div className="text-sm text-gray-600">Automations</div>
        </div>
      </div>

      {/* Smart Alerts */}
      {alerts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Alerts & Recommendations
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  alert.type === 'error' ? 'bg-red-50 border-red-400' :
                  'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.priority}
                    </span>
                    <button className="btn-sm bg-white border border-gray-300 hover:bg-gray-50">
                      {alert.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Quick Actions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <button className="btn btn-secondary text-sm">
            Customize
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all floating">
            <div className="text-sm font-bold mb-2">PROD</div>
            <div className="font-medium">Add Product</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all floating">
            <div className="text-sm font-bold mb-2">ORD</div>
            <div className="font-medium">New Order</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all floating">
            <div className="text-sm font-bold mb-2">CUST</div>
            <div className="font-medium">Add Customer</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-pink-600 to-purple-500 text-white rounded-lg hover:from-pink-700 hover:to-purple-600 transition-all floating">
            <div className="text-sm font-bold mb-2">RPT</div>
            <div className="font-medium">View Reports</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Order #{order.orderNumber}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">R{order.total.toFixed(2)}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Inventory Status
          </h3>
          <div className="space-y-3">
            {products.slice(0, 5).map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.sku}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{product.stock} units</div>
                  <div className={`text-xs ${
                    product.stock <= product.minimumStock ? 'text-red-600' :
                    product.stock <= product.minimumStock * 2 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {product.stock <= product.minimumStock ? 'Low Stock' :
                     product.stock <= product.minimumStock * 2 ? 'Running Low' :
                     'In Stock'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Customizer */}
      <DashboardCustomizer />
    </div>
  );
}