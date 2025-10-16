import { useState, useEffect, useMemo } from 'react';
import { listOrders, listQuotations, listProducts, listCustomers, listBackorderItems, getCompany } from '../lib/storage-simple';
import { Order, Quotation, Product, Customer, BackorderItem } from '../lib/types';

export default function ProfessionalDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [backorders, setBackorders] = useState<BackorderItem[]>([]);
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'quarter'>('month');

  const company = useMemo(() => getCompany(), []);

  useEffect(() => {
    setOrders(listOrders());
    setQuotations(listQuotations());
    setProducts(listProducts());
    setCustomers(listCustomers());
    setBackorders(listBackorderItems());
  }, []);

  const getDateRange = () => {
    const now = new Date();
    const start = new Date();
    
    switch (timeframe) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
    }
    
    return { start, end: now };
  };

  const { start, end } = getDateRange();

  const metrics = useMemo(() => {
    const filteredOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= start && orderDate <= end;
    });

    const filteredQuotations = quotations.filter(q => {
      const quoteDate = new Date(q.createdAt);
      return quoteDate >= start && quoteDate <= end;
    });

    // Sales metrics
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalQuoteValue = filteredQuotations.reduce((sum, quote) => sum + quote.total, 0);
    const avgOrderValue = filteredOrders.length > 0 ? totalSales / filteredOrders.length : 0;
    
    // Conversion metrics
    const acceptedQuotes = filteredQuotations.filter(q => q.status === 'accepted').length;
    const conversionRate = filteredQuotations.length > 0 ? (acceptedQuotes / filteredQuotations.length) * 100 : 0;

    // Inventory metrics
    const lowStockProducts = products.filter(p => p.stock <= p.minimumStock);
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    // Order status breakdown
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length
    };

    // Top customers by value
    const customerSales = customers.map(customer => {
      const customerOrders = filteredOrders.filter(o => o.customerId === customer.id);
      const totalValue = customerOrders.reduce((sum, order) => sum + order.total, 0);
      return { customer, totalValue, orderCount: customerOrders.length };
    }).sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);

    // Recent activity
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const recentQuotes = quotations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalSales,
      totalQuoteValue,
      avgOrderValue,
      conversionRate,
      lowStockProducts,
      totalInventoryValue,
      outOfStockProducts,
      ordersByStatus,
      customerSales,
      recentOrders,
      recentQuotes,
      totalOrders: filteredOrders.length,
      totalQuotes: filteredQuotations.length,
      totalBackorders: backorders.length
    };
  }, [orders, quotations, products, customers, backorders, start, end]);

  const formatCurrency = (amount: number) => `${company.currency}${amount.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">📊 Business Dashboard</h1>
          <p className="text-muted-foreground">Professional business intelligence and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input w-32"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.totalSales)}</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {metrics.totalOrders} orders
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quote Value</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.totalQuoteValue)}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {metrics.totalQuotes} quotes
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">{metrics.conversionRate.toFixed(1)}%</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Quote to Order
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.totalInventoryValue)}</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {products.length} products
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Warnings */}
      {(metrics.lowStockProducts.length > 0 || metrics.outOfStockProducts.length > 0 || metrics.totalBackorders > 0) && (
        <div className="card border-l-4 border-l-red-500">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              🚨 Attention Required
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {metrics.outOfStockProducts.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="text-red-800 dark:text-red-200 font-medium">
                    {metrics.outOfStockProducts.length} Out of Stock
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    Products need immediate restocking
                  </div>
                </div>
              )}
              {metrics.lowStockProducts.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="text-yellow-800 dark:text-yellow-200 font-medium">
                    {metrics.lowStockProducts.length} Low Stock
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">
                    Products below minimum levels
                  </div>
                </div>
              )}
              {metrics.totalBackorders > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-orange-800 dark:text-orange-200 font-medium">
                    {metrics.totalBackorders} Backorders
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    Customer orders waiting for stock
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Status Overview */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Order Pipeline</h3>
            <div className="space-y-3">
              {Object.entries(metrics.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'pending' ? 'bg-gray-400' :
                      status === 'confirmed' ? 'bg-blue-500' :
                      status === 'preparing' ? 'bg-yellow-500' :
                      status === 'ready' ? 'bg-purple-500' :
                      status === 'shipped' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium text-foreground capitalize">{status}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Customers</h3>
            <div className="space-y-3">
              {metrics.customerSales.map((item, index) => (
                <div key={item.customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{item.orderCount} orders</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {formatCurrency(item.totalValue)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {metrics.recentOrders.map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground">{order.orderNumber}</div>
                      <div className="text-xs text-muted-foreground">
                        {customer?.name} • {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">{formatCurrency(order.total)}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Quotations</h3>
            <div className="space-y-3">
              {metrics.recentQuotes.map(quote => {
                const customer = customers.find(c => c.id === quote.customerId);
                return (
                  <div key={quote.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground">{quote.quoteNumber}</div>
                      <div className="text-xs text-muted-foreground">
                        {customer?.name} • {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">{formatCurrency(quote.total)}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        quote.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        quote.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        quote.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {quote.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}