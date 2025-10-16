import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { listPurchaseOrders, listSuppliers, listProducts, updatePurchaseOrder, createPurchaseOrder, autoGeneratePurchaseOrders } from '../lib/storage-simple';
import PurchaseOrderForm from '../components/PurchaseOrderForm';
import type { PurchaseOrder, Supplier, Product } from '../lib/types';

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  const refresh = () => {
    setPurchaseOrders(listPurchaseOrders());
    setSuppliers(listSuppliers());
    setProducts(listProducts());
  };
  
  useEffect(() => { refresh(); }, []);

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Unknown Supplier';
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      received: 'bg-green-200 text-green-900',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const updatePOStatus = (poId: string, status: string) => {
    updatePurchaseOrder(poId, { status: status as any });
    refresh();
  };

  const handleAutoGenerate = () => {
    const generatedPOs = autoGeneratePurchaseOrders();
    if (generatedPOs.length > 0) {
      alert(`Generated ${generatedPOs.length} purchase orders for low-stock items!`);
      refresh();
    } else {
      alert('No purchase orders needed at this time.');
    }
  };

  const filteredPOs = filter === 'all' ? purchaseOrders : purchaseOrders.filter(po => po.status === filter);

  return (
    <Layout>
      <div className="min-h-screen gradient-bg-2">
        <div className="container py-6 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Purchase Order Management</h1>
            <p className="text-white/80 text-lg">Automate and manage supplier orders</p>
          </div>

        {/* Action Buttons */}
        <div className="card">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn"
              >
                {showForm ? 'Cancel' : '+ Create Purchase Order'}
              </button>
              <button
                onClick={handleAutoGenerate}
                className="btn-success"
              >
                🤖 Auto-Generate POs
              </button>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['all', 'draft', 'sent', 'confirmed', 'partial', 'received'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === status 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-1 bg-white/20 px-1 rounded text-xs">
                      {purchaseOrders.filter(po => po.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase Order Form */}
        {showForm && (
          <PurchaseOrderForm 
            onSave={(po) => { 
              createPurchaseOrder(po); 
              refresh(); 
              setShowForm(false);
            }} 
          />
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{purchaseOrders.length}</div>
            <div className="text-sm text-gray-600">Total POs</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-orange-600">
              {purchaseOrders.filter(po => ['draft', 'sent'].includes(po.status)).length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              R{purchaseOrders.reduce((sum, po) => sum + (typeof po.total === 'number' ? po.total : 0), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">
              {purchaseOrders.filter(po => po.autoGenerated).length}
            </div>
            <div className="text-sm text-gray-600">Auto-Generated</div>
          </div>
        </div>

        {/* Purchase Orders Table */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Purchase Orders ({filteredPOs.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-left">PO Number</th>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Order Date</th>
                  <th>Expected Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.map(po => (
                  <tr key={po.id}>
                    <td className="font-medium">
                      {po.poNumber}
                      {po.autoGenerated && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          🤖 Auto
                        </span>
                      )}
                    </td>
                    <td>{getSupplierName(po.supplierId)}</td>
                    <td>
                      <div className="text-sm">
                        {po.items.slice(0, 2).map((item, idx) => (
                          <div key={idx}>{getProductName(item.productId)} ({item.quantity})</div>
                        ))}
                        {po.items.length > 2 && (
                          <div className="text-gray-500">+{po.items.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td className="font-medium">R{typeof po.total === 'number' ? po.total.toFixed(2) : '0.00'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                        {po.status}
                      </span>
                    </td>
                    <td>{new Date(po.orderDate).toLocaleDateString()}</td>
                    <td>{po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="flex space-x-2">
                        <select
                          className="input text-sm"
                          value={po.status}
                          onChange={(e) => updatePOStatus(po.id, e.target.value)}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="partial">Partial</option>
                          <option value="received">Received</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPOs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No purchase orders found for the selected filter.
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🤖 AI-Powered Insights</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Smart Reordering</h4>
              <p className="text-sm text-blue-700 mb-3">
                AI analyzes your sales patterns and automatically suggests optimal reorder quantities and timing.
              </p>
              <div className="text-xs text-blue-600">
                • Prevents stockouts<br/>
                • Optimizes cash flow<br/>
                • Reduces carrying costs
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Supplier Intelligence</h4>
              <p className="text-sm text-green-700 mb-3">
                Compare supplier performance, pricing trends, and delivery reliability automatically.
              </p>
              <div className="text-xs text-green-600">
                • Best price detection<br/>
                • Performance tracking<br/>
                • Risk assessment
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">Demand Forecasting</h4>
              <p className="text-sm text-purple-700 mb-3">
                Predict future demand based on historical data, seasonality, and market trends.
              </p>
              <div className="text-xs text-purple-600">
                • Seasonal adjustments<br/>
                • Trend analysis<br/>
                • Market intelligence
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">Cost Optimization</h4>
              <p className="text-sm text-orange-700 mb-3">
                Identify opportunities to reduce procurement costs while maintaining quality and service levels.
              </p>
              <div className="text-xs text-orange-600">
                • Bulk discount analysis<br/>
                • Alternative suppliers<br/>
                • Contract optimization
              </div>
            </div>
          </div>
        </div>

        {/* Automation Status */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">⚡ Automation Status</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <div className="text-sm text-gray-600">Auto-Reordering</div>
              <div className="text-xs text-gray-500 mt-1">Monitoring {products.length} products</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Price Monitoring</div>
              <div className="text-xs text-gray-500 mt-1">Tracking {suppliers.length} suppliers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Smart</div>
              <div className="text-sm text-gray-600">Demand Prediction</div>
              <div className="text-xs text-gray-500 mt-1">ML-powered forecasting</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}