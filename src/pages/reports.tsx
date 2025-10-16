import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import AdvancedReports from '../components/AdvancedReports';
import { listProducts, listOrders, listQuotations, listCustomers, listSuppliers, listSupplierPrices, calculateProfitAnalysis } from '../lib/storage-simple';
import type { Product, Order, Quotation, Customer, Supplier } from '../lib/types';

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'profit' | 'inventory' | 'sales' | 'suppliers'>('overview');
  const [showAdvancedReports, setShowAdvancedReports] = useState(false);

  useEffect(() => {
    setProducts(listProducts());
    setOrders(listOrders());
    setQuotations(listQuotations());
    setCustomers(listCustomers());
    setSuppliers(listSuppliers());
  }, []);

  // Calculate key metrics
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const pendingRevenue = orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready', 'shipped'].includes(o.status)).reduce((sum, o) => sum + o.total, 0);
  const totalQuoteValue = quotations.reduce((sum, q) => sum + q.total, 0);
  const conversionRate = quotations.length > 0 ? (quotations.filter(q => q.convertedToOrder).length / quotations.length) * 100 : 0;
  
  const lowStockProducts = products.filter(p => p.stock <= p.minimumStock);
  const overstockProducts = products.filter(p => p.stock >= p.maximumStock);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);

  // Top customers by order value
  const customerStats = customers.map(customer => {
    const customerOrders = orders.filter(o => o.customerId === customer.id);
    const totalValue = customerOrders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = customerOrders.length;
    return { ...customer, totalValue, orderCount };
  }).sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);

  // Product profitability analysis
  const productProfitability = products.map(product => {
    const analysis = calculateProfitAnalysis(product.id, product.sellingPrice);
    const productOrders = orders.flatMap(o => o.items.filter(i => i.productId === product.id));
    const totalSold = productOrders.reduce((sum, item) => sum + item.quantity, 0);
    const revenue = productOrders.reduce((sum, item) => sum + item.total, 0);
    
    return {
      ...product,
      ...(analysis || {}),
      totalSold,
      revenue,
      turnoverRate: product.stock > 0 ? totalSold / product.stock : 0
    };
  }).sort((a, b) => (b.profit || 0) - (a.profit || 0));

  // Monthly sales trend (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      const orderKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      return orderKey === monthKey;
    });
    
    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      orders: monthOrders.length,
      revenue: monthOrders.reduce((sum, o) => sum + o.total, 0)
    });
  }

  return (
    <Layout>
      <div className="min-h-screen gradient-bg">
        <div className="container py-6 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
            <p className="text-white/80 text-lg">Business insights and performance metrics</p>
          </div>

        {/* Tab Navigation */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'overview', label: '📊 Overview', icon: '📊' },
                { key: 'profit', label: '💰 Profit Analysis', icon: '💰' },
                { key: 'inventory', label: '📦 Inventory Report', icon: '📦' },
                { key: 'sales', label: '📈 Sales Analytics', icon: '📈' },
                { key: 'suppliers', label: '🏭 Supplier Analysis', icon: '🏭' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAdvancedReports(true)}
              className="btn btn-primary"
            >
              🚀 Advanced Analytics
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-600">R{totalRevenue.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-xs text-gray-500">Delivered orders</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600">R{pendingRevenue.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Pending Revenue</div>
                <div className="text-xs text-gray-500">Active orders</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600">{conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Quote Conversion</div>
                <div className="text-xs text-gray-500">Quotes to orders</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-orange-600">R{totalInventoryValue.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Inventory Value</div>
                <div className="text-xs text-gray-500">At cost price</div>
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Monthly Sales Trend</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-left">Month</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                      <th>Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((month, idx) => (
                      <tr key={idx}>
                        <td className="font-medium">{month.month}</td>
                        <td>{month.orders}</td>
                        <td>R{month.revenue.toFixed(2)}</td>
                        <td>R{month.orders > 0 ? (month.revenue / month.orders).toFixed(2) : '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Customers */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">👥 Top Customers</h3>
              <div className="space-y-3">
                {customerStats.map((customer, idx) => (
                  <div key={customer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.orderCount} orders</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">R{customer.totalValue.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">Total value</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profit Analysis Tab */}
        {activeTab === 'profit' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Product Profitability Analysis</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-left">Product</th>
                      <th>Cost Price</th>
                      <th>Selling Price</th>
                      <th>Markup %</th>
                      <th>Profit per Unit</th>
                      <th>Units Sold</th>
                      <th>Total Profit</th>
                      <th>Margin %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productProfitability.slice(0, 20).map(product => (
                      <tr key={product.id}>
                        <td className="font-medium">{product.name}</td>
                        <td>R{product.costPrice.toFixed(2)}</td>
                        <td>R{product.sellingPrice.toFixed(2)}</td>
                        <td className="font-medium text-blue-600">{product.markup?.toFixed(1)}%</td>
                        <td className="font-medium text-green-600">R{(product.profit || 0).toFixed(2)}</td>
                        <td>{product.totalSold}</td>
                        <td className="font-bold text-green-600">R{((product.profit || 0) * product.totalSold).toFixed(2)}</td>
                        <td className="font-medium">{product.profitMargin?.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Profit Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">
                  R{productProfitability.reduce((sum, p) => sum + ((p.profit || 0) * p.totalSold), 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Profit Generated</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {productProfitability.length > 0 ? (productProfitability.reduce((sum, p) => sum + (p.profitMargin || 0), 0) / productProfitability.length).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-gray-600">Average Profit Margin</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {productProfitability.filter(p => (p.profitMargin || 0) > 30).length}
                </div>
                <div className="text-sm text-gray-600">High Margin Products (&gt;30%)</div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Report Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Inventory Alerts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ Low Stock Alert ({lowStockProducts.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {lowStockProducts.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-red-600 text-sm">
                        {product.stock} / {product.minimumStock} min
                      </span>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <div className="text-gray-500 text-center py-4">All products have adequate stock</div>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">📦 Overstock Alert ({overstockProducts.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {overstockProducts.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-yellow-600 text-sm">
                        {product.stock} / {product.maximumStock} max
                      </span>
                    </div>
                  ))}
                  {overstockProducts.length === 0 && (
                    <div className="text-gray-500 text-center py-4">No overstock issues</div>
                  )}
                </div>
              </div>
            </div>

            {/* Inventory Turnover */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🔄 Inventory Turnover Analysis</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-left">Product</th>
                      <th>Current Stock</th>
                      <th>Units Sold</th>
                      <th>Turnover Rate</th>
                      <th>Stock Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productProfitability.map(product => (
                      <tr key={product.id}>
                        <td className="font-medium">{product.name}</td>
                        <td>{product.stock}</td>
                        <td>{product.totalSold}</td>
                        <td className="font-medium">
                          {product.turnoverRate > 2 ? (
                            <span className="text-green-600">{product.turnoverRate.toFixed(2)}x</span>
                          ) : product.turnoverRate > 1 ? (
                            <span className="text-yellow-600">{product.turnoverRate.toFixed(2)}x</span>
                          ) : (
                            <span className="text-red-600">{product.turnoverRate.toFixed(2)}x</span>
                          )}
                        </td>
                        <td>R{(product.costPrice * product.stock).toFixed(2)}</td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.turnoverRate > 2 ? 'bg-green-100 text-green-800' :
                            product.turnoverRate > 1 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.turnoverRate > 2 ? 'Fast Moving' :
                             product.turnoverRate > 1 ? 'Normal' : 'Slow Moving'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sales Analytics Tab */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* Order Status Distribution */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Order Status Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['pending', 'confirmed', 'preparing', 'ready', 'shipped', 'delivered', 'cancelled'].map(status => {
                  const count = orders.filter(o => o.status === status).length;
                  const value = orders.filter(o => o.status === status).reduce((sum, o) => sum + o.total, 0);
                  return (
                    <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{count}</div>
                      <div className="text-sm text-gray-600 capitalize">{status}</div>
                      <div className="text-xs text-gray-500">R{value.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quote Performance */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Quotation Performance</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{quotations.length}</div>
                  <div className="text-sm text-gray-600">Total Quotes</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{quotations.filter(q => q.status === 'accepted').length}</div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{quotations.filter(q => q.status === 'rejected').length}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">R{totalQuoteValue.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🕒 Recent Activity</h3>
              <div className="space-y-3">
                {[...orders, ...quotations]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 10)
                  .map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">
                          {'orderNumber' in item ? `Order ${item.orderNumber}` : `Quote ${item.quoteNumber}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(item.createdAt).toLocaleDateString()} - R{item.total.toFixed(2)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'delivered' || item.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        item.status === 'cancelled' || item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Suppliers Analysis Tab */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            {/* Supplier Performance Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-600">{suppliers.length}</div>
                <div className="text-sm text-gray-600">Total Suppliers</div>
                <div className="text-xs text-gray-500">Active partnerships</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">
                  {listSupplierPrices().length}
                </div>
                <div className="text-sm text-gray-600">Price Quotes</div>
                <div className="text-xs text-gray-500">Available options</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {suppliers.filter(s => s.paymentTerms && s.paymentTerms.includes('30')).length}
                </div>
                <div className="text-sm text-gray-600">30+ Day Terms</div>
                <div className="text-xs text-gray-500">Extended payment</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-orange-600">
                  R{listSupplierPrices().length > 0 ? (listSupplierPrices().reduce((sum, sp) => sum + sp.price, 0) / listSupplierPrices().length).toFixed(2) : '0.00'}
                </div>
                <div className="text-sm text-gray-600">Avg Quote Price</div>
                <div className="text-xs text-gray-500">Across all suppliers</div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🏭 Supplier Performance Dashboard</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-left">Supplier</th>
                      <th>Products</th>
                      <th>Avg Price</th>
                      <th>Price Range</th>
                      <th>Payment Terms</th>
                      <th>Performance</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map(supplier => {
                      const supplierPrices = listSupplierPrices().filter(sp => sp.supplierId === supplier.id);
                      const avgPrice = supplierPrices.length > 0 
                        ? supplierPrices.reduce((sum, sp) => sum + sp.price, 0) / supplierPrices.length 
                        : 0;
                      const minPrice = supplierPrices.length > 0 ? Math.min(...supplierPrices.map(sp => sp.price)) : 0;
                      const maxPrice = supplierPrices.length > 0 ? Math.max(...supplierPrices.map(sp => sp.price)) : 0;
                      const performanceScore = Math.floor(Math.random() * 30) + 70; // Simulated performance score
                      
                      return (
                        <tr key={supplier.id}>
                          <td className="font-medium">
                            <div>
                              <div>{supplier.name}</div>
                              <div className="text-xs text-gray-500">{supplier.address?.split(',')[0] || 'No address'}</div>
                            </div>
                          </td>
                          <td>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {supplierPrices.length}
                            </span>
                          </td>
                          <td>
                            <div className="font-medium">R{avgPrice.toFixed(2)}</div>
                          </td>
                          <td>
                            <div className="text-sm">
                              R{minPrice.toFixed(2)} - R{maxPrice.toFixed(2)}
                            </div>
                          </td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              supplier.paymentTerms?.includes('30') ? 'bg-green-100 text-green-800' :
                              supplier.paymentTerms?.includes('15') ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {supplier.paymentTerms || 'COD'}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                performanceScore >= 90 ? 'bg-green-500' :
                                performanceScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className="text-sm font-medium">{performanceScore}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              <div>{supplier.email || '-'}</div>
                              <div className="text-gray-500">{supplier.phone || '-'}</div>
                            </div>
                          </td>
                          <td>
                            <div className="flex space-x-1">
                              <button className="btn-sm bg-blue-100 text-blue-800 hover:bg-blue-200">
                                📧 Contact
                              </button>
                              <button className="btn-sm bg-green-100 text-green-800 hover:bg-green-200">
                                📋 Quote
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supplier Comparison Chart */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Price Comparison Analysis</h3>
              <div className="space-y-4">
                {listSupplierPrices().reduce((acc, sp) => {
                  const product = products.find(p => p.id === sp.productId);
                  if (!product) return acc;
                  
                  if (!acc[product.name]) {
                    acc[product.name] = [];
                  }
                  acc[product.name].push({
                    supplier: suppliers.find(s => s.id === sp.supplierId)?.name || 'Unknown',
                    price: sp.price
                  });
                  return acc;
                }, {} as Record<string, Array<{supplier: string, price: number}>>).slice && Object.entries(
                  listSupplierPrices().reduce((acc, sp) => {
                    const product = products.find(p => p.id === sp.productId);
                    if (!product) return acc;
                    
                    if (!acc[product.name]) {
                      acc[product.name] = [];
                    }
                    acc[product.name].push({
                      supplier: suppliers.find(s => s.id === sp.supplierId)?.name || 'Unknown',
                      price: sp.price
                    });
                    return acc;
                  }, {} as Record<string, Array<{supplier: string, price: number}>>)
                ).slice(0, 5).map(([productName, supplierPrices]) => (
                  <div key={productName} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3">{productName}</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {supplierPrices.sort((a, b) => a.price - b.price).map((sp, idx) => (
                        <div key={idx} className={`p-3 rounded-lg ${
                          idx === 0 ? 'bg-green-50 border border-green-200' :
                          idx === supplierPrices.length - 1 ? 'bg-red-50 border border-red-200' :
                          'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="font-medium">{sp.supplier}</div>
                          <div className={`text-lg font-bold ${
                            idx === 0 ? 'text-green-600' :
                            idx === supplierPrices.length - 1 ? 'text-red-600' :
                            'text-gray-800'
                          }`}>
                            R{sp.price.toFixed(2)}
                          </div>
                          {idx === 0 && <div className="text-xs text-green-600">Best Price</div>}
                          {idx === supplierPrices.length - 1 && supplierPrices.length > 1 && (
                            <div className="text-xs text-red-600">Highest Price</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Advanced Reports Modal */}
        {showAdvancedReports && (
          <AdvancedReports onClose={() => setShowAdvancedReports(false)} />
        )}
        </div>
      </div>
    </Layout>
  );
}