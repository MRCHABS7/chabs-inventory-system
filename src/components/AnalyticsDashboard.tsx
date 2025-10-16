import React, { useState, useEffect } from 'react';
import { 
  listProducts, 
  listOrders, 
  listQuotations, 
  listExternalProcessingOrders
} from '../lib/storage-simple';

interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    conversionRate: number;
  };
  inventory: {
    totalValue: number;
    lowStockItems: number;
    turnoverRate: number;
    topProducts: Array<{ name: string; sales: number; revenue: number }>;
  };
  external: {
    totalOrders: number;
    inProgress: number;
    averageLeadTime: number;
    totalCost: number;
  };
  performance: {
    quotationToOrderRate: number;
    averageOrderValue: number;
    customerSatisfaction: number;
    systemUptime: number;
  };
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAnalytics();
  }, [timeRange]);

  const generateAnalytics = () => {
    setLoading(true);
    
    try {
      const products = listProducts();
      const orders = listOrders();
      const quotations = listQuotations();
      const externalOrders = listExternalProcessingOrders();
      
      const now = new Date();
      const timeRangeMs = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000
      }[timeRange];
      
      const cutoffDate = new Date(now.getTime() - timeRangeMs);
      
      // Revenue calculations
      const recentOrders = orders.filter(order => new Date(order.createdAt) >= cutoffDate);
      const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);
      
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const thisMonthRevenue = orders
        .filter(order => new Date(order.createdAt) >= thisMonthStart)
        .reduce((sum, order) => sum + order.total, 0);
      
      const lastMonthRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
        })
        .reduce((sum, order) => sum + order.total, 0);
      
      const revenueGrowth = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      // Order statistics
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'delivered').length;
      const recentQuotations = quotations.filter(quote => new Date(quote.createdAt) >= cutoffDate);
      const conversionRate = recentQuotations.length > 0 
        ? (recentOrders.length / recentQuotations.length) * 100 
        : 0;

      // Inventory analytics
      const totalInventoryValue = products.reduce((sum, product) => 
        sum + (product.stock * product.sellingPrice), 0);
      const lowStockItems = products.filter(product => 
        product.stock <= product.minimumStock).length;
      
      // Top products by sales (mock data for now)
      const topProducts = products
        .map(product => ({
          name: product.name,
          sales: Math.floor(Math.random() * 100), // Mock sales data
          revenue: Math.floor(Math.random() * 10000) // Mock revenue data
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // External processing analytics
      const inProgressExternal = externalOrders.filter(order => 
        ['sent', 'in_progress', 'quality_check'].includes(order.status)).length;
      const completedExternal = externalOrders.filter(order => 
        order.status === 'completed');
      
      const averageLeadTime = completedExternal.length > 0
        ? completedExternal.reduce((sum, order) => {
            if (order.actualReturn && order.sentDate) {
              const leadTime = new Date(order.actualReturn).getTime() - 
                              new Date(order.sentDate).getTime();
              return sum + (leadTime / (1000 * 60 * 60 * 24)); // Convert to days
            }
            return sum;
          }, 0) / completedExternal.length
        : 0;
      
      const totalExternalCost = externalOrders.reduce((sum, order) => sum + order.cost, 0);

      // Performance metrics
      const averageOrderValue = recentOrders.length > 0 
        ? totalRevenue / recentOrders.length 
        : 0;

      setAnalytics({
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growth: revenueGrowth
        },
        orders: {
          total: recentOrders.length,
          pending: pendingOrders,
          completed: completedOrders,
          conversionRate
        },
        inventory: {
          totalValue: totalInventoryValue,
          lowStockItems,
          turnoverRate: 85, // Mock data
          topProducts
        },
        external: {
          totalOrders: externalOrders.length,
          inProgress: inProgressExternal,
          averageLeadTime,
          totalCost: totalExternalCost
        },
        performance: {
          quotationToOrderRate: conversionRate,
          averageOrderValue,
          customerSatisfaction: 4.2, // Mock data
          systemUptime: 99.8 // Mock data
        }
      });
    } catch (error) {
      console.error('Error generating analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue.total)}</p>
              <p className={`text-sm ${analytics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.revenue.growth >= 0 ? '↗' : '↘'} {formatPercentage(Math.abs(analytics.revenue.growth))} vs last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.orders.total}</p>
              <p className="text-sm text-gray-500">
                {analytics.orders.pending} pending, {analytics.orders.completed} completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.orders.conversionRate)}</p>
              <p className="text-sm text-gray-500">Quotations to orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">🏭</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.inventory.totalValue)}</p>
              <p className="text-sm text-red-500">{analytics.inventory.lowStockItems} low stock items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {analytics.inventory.topProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Processing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">External Processing</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Orders:</span>
              <span className="font-medium">{analytics.external.totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress:</span>
              <span className="font-medium text-blue-600">{analytics.external.inProgress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Lead Time:</span>
              <span className="font-medium">{analytics.external.averageLeadTime.toFixed(1)} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cost:</span>
              <span className="font-medium">{formatCurrency(analytics.external.totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {formatPercentage(analytics.performance.quotationToOrderRate)}
            </div>
            <div className="text-sm text-gray-600">Quote Conversion</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(analytics.performance.averageOrderValue)}
            </div>
            <div className="text-sm text-gray-600">Avg Order Value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {analytics.performance.customerSatisfaction}/5
            </div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {formatPercentage(analytics.performance.systemUptime)}
            </div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}