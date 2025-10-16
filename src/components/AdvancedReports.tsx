import { useState, useEffect } from 'react';
import { listProducts, listOrders, listCustomers, listSuppliers } from '../lib/storage-simple';
import type { Product, Order, Customer, Supplier } from '../lib/types';

interface AdvancedReportsProps {
  onClose: () => void;
}

export default function AdvancedReports({ onClose }: AdvancedReportsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [reportType, setReportType] = useState<'abc' | 'xyz' | 'forecast' | 'cohort'>('abc');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    setProducts(listProducts());
    setOrders(listOrders());
    setCustomers(listCustomers());
    setSuppliers(listSuppliers());
    
    // Set default date range (last 6 months)
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  }, []);

  // ABC Analysis - categorize products by revenue contribution
  const getABCAnalysis = () => {
    const productRevenue = products.map(product => {
      const productOrders = orders.flatMap(o => o.items.filter(i => i.productId === product.id));
      const revenue = productOrders.reduce((sum, item) => sum + item.total, 0);
      return { ...product, revenue };
    }).sort((a, b) => b.revenue - a.revenue);

    const totalRevenue = productRevenue.reduce((sum, p) => sum + p.revenue, 0);
    let cumulativeRevenue = 0;
    
    return productRevenue.map(product => {
      cumulativeRevenue += product.revenue;
      const cumulativePercentage = (cumulativeRevenue / totalRevenue) * 100;
      
      let category = 'C';
      if (cumulativePercentage <= 80) category = 'A';
      else if (cumulativePercentage <= 95) category = 'B';
      
      return {
        ...product,
        category,
        revenuePercentage: (product.revenue / totalRevenue) * 100,
        cumulativePercentage
      };
    });
  };

  // XYZ Analysis - categorize products by demand variability
  const getXYZAnalysis = () => {
    return products.map(product => {
      const monthlyDemand = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        const monthOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          const orderKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          return orderKey === monthKey;
        });
        
        const demand = monthOrders.flatMap(o => o.items.filter(i => i.productId === product.id))
          .reduce((sum, item) => sum + item.quantity, 0);
        monthlyDemand.push(demand);
      }
      
      const avgDemand = monthlyDemand.reduce((sum, d) => sum + d, 0) / monthlyDemand.length;
      const variance = monthlyDemand.reduce((sum, d) => sum + Math.pow(d - avgDemand, 2), 0) / monthlyDemand.length;
      const coefficientOfVariation = avgDemand > 0 ? Math.sqrt(variance) / avgDemand : 0;
      
      let category = 'Z';
      if (coefficientOfVariation <= 0.5) category = 'X';
      else if (coefficientOfVariation <= 1.0) category = 'Y';
      
      return {
        ...product,
        category,
        avgDemand,
        coefficientOfVariation,
        monthlyDemand
      };
    });
  };

  // Demand Forecast using simple linear regression
  const getDemandForecast = () => {
    return products.map(product => {
      const monthlyData = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        const monthOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          const orderKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          return orderKey === monthKey;
        });
        
        const demand = monthOrders.flatMap(o => o.items.filter(i => i.productId === product.id))
          .reduce((sum, item) => sum + item.quantity, 0);
        monthlyData.push({ month: i, demand });
      }
      
      // Simple linear regression
      const n = monthlyData.length;
      const sumX = monthlyData.reduce((sum, d) => sum + d.month, 0);
      const sumY = monthlyData.reduce((sum, d) => sum + d.demand, 0);
      const sumXY = monthlyData.reduce((sum, d) => sum + d.month * d.demand, 0);
      const sumXX = monthlyData.reduce((sum, d) => sum + d.month * d.month, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      // Forecast next 3 months
      const forecasts = [];
      for (let i = 1; i <= 3; i++) {
        const forecast = Math.max(0, Math.round(slope * (12 + i) + intercept));
        forecasts.push(forecast);
      }
      
      return {
        ...product,
        historicalDemand: monthlyData,
        trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
        forecasts
      };
    });
  };

  // Customer Cohort Analysis
  const getCohortAnalysis = () => {
    const cohorts = customers.map(customer => {
      const customerOrders = orders.filter(o => o.customerId === customer.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      if (customerOrders.length === 0) return null;
      
      const firstOrder = customerOrders[0];
      const lastOrder = customerOrders[customerOrders.length - 1];
      const totalValue = customerOrders.reduce((sum, o) => sum + o.total, 0);
      const avgOrderValue = totalValue / customerOrders.length;
      
      const daysSinceFirst = Math.floor((new Date().getTime() - new Date(firstOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const daysSinceLast = Math.floor((new Date().getTime() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      
      let segment = 'At Risk';
      if (daysSinceLast <= 30 && customerOrders.length >= 3) segment = 'Champions';
      else if (daysSinceLast <= 60 && totalValue > 1000) segment = 'Loyal Customers';
      else if (daysSinceLast <= 90) segment = 'Potential Loyalists';
      else if (daysSinceLast <= 180) segment = 'Need Attention';
      
      return {
        ...customer,
        firstOrderDate: firstOrder.createdAt,
        lastOrderDate: lastOrder.createdAt,
        orderCount: customerOrders.length,
        totalValue,
        avgOrderValue,
        daysSinceFirst,
        daysSinceLast,
        segment
      };
    }).filter(Boolean);
    
    return cohorts;
  };

  const renderReport = () => {
    switch (reportType) {
      case 'abc':
        const abcData = getABCAnalysis();
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">
                  {abcData.filter(p => p.category === 'A').length}
                </div>
                <div className="text-sm text-gray-600">Category A Products</div>
                <div className="text-xs text-gray-500">80% of revenue</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {abcData.filter(p => p.category === 'B').length}
                </div>
                <div className="text-sm text-gray-600">Category B Products</div>
                <div className="text-xs text-gray-500">15% of revenue</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-red-600">
                  {abcData.filter(p => p.category === 'C').length}
                </div>
                <div className="text-sm text-gray-600">Category C Products</div>
                <div className="text-xs text-gray-500">5% of revenue</div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Revenue</th>
                    <th>Revenue %</th>
                    <th>Cumulative %</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {abcData.slice(0, 20).map(product => (
                    <tr key={product.id}>
                      <td className="font-medium">{product.name}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.category === 'A' ? 'bg-green-100 text-green-800' :
                          product.category === 'B' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.category}
                        </span>
                      </td>
                      <td>R{product.revenue.toFixed(2)}</td>
                      <td>{product.revenuePercentage.toFixed(1)}%</td>
                      <td>{product.cumulativePercentage.toFixed(1)}%</td>
                      <td className="text-sm">
                        {product.category === 'A' ? 'Focus on availability' :
                         product.category === 'B' ? 'Monitor closely' :
                         'Consider discontinuing'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'xyz':
        const xyzData = getXYZAnalysis();
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">
                  {xyzData.filter(p => p.category === 'X').length}
                </div>
                <div className="text-sm text-gray-600">Category X Products</div>
                <div className="text-xs text-gray-500">Stable demand</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {xyzData.filter(p => p.category === 'Y').length}
                </div>
                <div className="text-sm text-gray-600">Category Y Products</div>
                <div className="text-xs text-gray-500">Variable demand</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-red-600">
                  {xyzData.filter(p => p.category === 'Z').length}
                </div>
                <div className="text-sm text-gray-600">Category Z Products</div>
                <div className="text-xs text-gray-500">Highly variable</div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Avg Demand</th>
                    <th>Variability</th>
                    <th>6-Month Trend</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {xyzData.slice(0, 20).map(product => (
                    <tr key={product.id}>
                      <td className="font-medium">{product.name}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.category === 'X' ? 'bg-green-100 text-green-800' :
                          product.category === 'Y' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.category}
                        </span>
                      </td>
                      <td>{product.avgDemand.toFixed(1)}</td>
                      <td>{(product.coefficientOfVariation * 100).toFixed(1)}%</td>
                      <td>
                        <div className="flex space-x-1">
                          {product.monthlyDemand.map((demand, idx) => (
                            <div
                              key={idx}
                              className="w-2 h-4 bg-blue-200 rounded"
                              style={{ height: `${Math.max(4, (demand / Math.max(...product.monthlyDemand)) * 16)}px` }}
                              title={`Month ${idx + 1}: ${demand}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="text-sm">
                        {product.category === 'X' ? 'Optimize inventory' :
                         product.category === 'Y' ? 'Safety stock needed' :
                         'Flexible ordering'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'forecast':
        const forecastData = getDemandForecast();
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">
                  {forecastData.filter(p => p.trend === 'increasing').length}
                </div>
                <div className="text-sm text-gray-600">Growing Products</div>
                <div className="text-xs text-gray-500">Increasing demand</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {forecastData.filter(p => p.trend === 'stable').length}
                </div>
                <div className="text-sm text-gray-600">Stable Products</div>
                <div className="text-xs text-gray-500">Consistent demand</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-red-600">
                  {forecastData.filter(p => p.trend === 'decreasing').length}
                </div>
                <div className="text-sm text-gray-600">Declining Products</div>
                <div className="text-xs text-gray-500">Decreasing demand</div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Trend</th>
                    <th>Next Month</th>
                    <th>Month 2</th>
                    <th>Month 3</th>
                    <th>Current Stock</th>
                    <th>Action Needed</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.slice(0, 20).map(product => (
                    <tr key={product.id}>
                      <td className="font-medium">{product.name}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                          product.trend === 'stable' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.trend}
                        </span>
                      </td>
                      <td className="font-medium">{product.forecasts[0]}</td>
                      <td>{product.forecasts[1]}</td>
                      <td>{product.forecasts[2]}</td>
                      <td>{product.stock}</td>
                      <td className="text-sm">
                        {product.stock < product.forecasts[0] ? (
                          <span className="text-red-600">Reorder needed</span>
                        ) : product.stock < (product.forecasts[0] + product.forecasts[1]) ? (
                          <span className="text-yellow-600">Monitor closely</span>
                        ) : (
                          <span className="text-green-600">Stock adequate</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'cohort':
        const cohortData = getCohortAnalysis();
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-5 gap-4">
              {['Champions', 'Loyal Customers', 'Potential Loyalists', 'Need Attention', 'At Risk'].map(segment => (
                <div key={segment} className="card text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {cohortData.filter(c => c && c.segment === segment).length}
                  </div>
                  <div className="text-sm text-gray-600">{segment}</div>
                </div>
              ))}
            </div>
            
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Segment</th>
                    <th>Orders</th>
                    <th>Total Value</th>
                    <th>Avg Order</th>
                    <th>Last Order</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.filter(c => c !== null).slice(0, 20).map(customer => (
                    <tr key={customer.id}>
                      <td className="font-medium">{customer.name}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.segment === 'Champions' ? 'bg-green-100 text-green-800' :
                          customer.segment === 'Loyal Customers' ? 'bg-blue-100 text-blue-800' :
                          customer.segment === 'Potential Loyalists' ? 'bg-yellow-100 text-yellow-800' :
                          customer.segment === 'Need Attention' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {customer.segment}
                        </span>
                      </td>
                      <td>{customer.orderCount}</td>
                      <td>R{customer.totalValue.toFixed(2)}</td>
                      <td>R{customer.avgOrderValue.toFixed(2)}</td>
                      <td>{customer.daysSinceLast} days ago</td>
                      <td className="text-sm">
                        {customer.segment === 'Champions' ? 'Reward loyalty' :
                         customer.segment === 'Loyal Customers' ? 'Upsell opportunities' :
                         customer.segment === 'Potential Loyalists' ? 'Nurture relationship' :
                         customer.segment === 'Need Attention' ? 'Re-engagement campaign' :
                         'Win-back campaign'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📊 Advanced Analytics Reports
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          {/* Report Type Selection */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'abc', label: '📊 ABC Analysis', desc: 'Revenue-based product categorization' },
              { key: 'xyz', label: '📈 XYZ Analysis', desc: 'Demand variability analysis' },
              { key: 'forecast', label: '🔮 Demand Forecast', desc: 'Predictive demand analysis' },
              { key: 'cohort', label: '👥 Customer Cohorts', desc: 'Customer segmentation analysis' }
            ].map(report => (
              <button
                key={report.key}
                onClick={() => setReportType(report.key as any)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  reportType === report.key 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">{report.label}</div>
                <div className="text-xs opacity-80">{report.desc}</div>
              </button>
            ))}
          </div>
          
          {/* Date Range Filter */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quick Select</label>
              <select
                onChange={(e) => {
                  const months = parseInt(e.target.value);
                  if (months) {
                    const end = new Date();
                    const start = new Date();
                    start.setMonth(start.getMonth() - months);
                    setDateRange({
                      start: start.toISOString().split('T')[0],
                      end: end.toISOString().split('T')[0]
                    });
                  }
                }}
                className="input"
              >
                <option value="">Custom Range</option>
                <option value="1">Last Month</option>
                <option value="3">Last 3 Months</option>
                <option value="6">Last 6 Months</option>
                <option value="12">Last Year</option>
              </select>
            </div>
          </div>
          
          {/* Report Content */}
          <div className="card">
            {renderReport()}
          </div>
        </div>
      </div>
    </div>
  );
}