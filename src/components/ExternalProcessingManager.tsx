import { useState, useEffect } from 'react';
import { 
  listExternalProcessingOrders, 
  createExternalProcessingOrder, 
  updateExternalProcessingOrder, 
  deleteExternalProcessingOrder,
  listProducts,
  listSuppliers,
  getExternalProcessingStats
} from '../lib/storage-simple';
import { me } from '../lib/auth-simple';
import type { ExternalProcessingOrder, Product, Supplier } from '../lib/types';

export default function ExternalProcessingManager() {
  const [orders, setOrders] = useState<ExternalProcessingOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    totalCost: 0,
    avgLeadTime: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ExternalProcessingOrder | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const [newOrder, setNewOrder] = useState({
    productId: '',
    externalProcessId: '',
    quantity: 1,
    cost: 0,
    notes: '',
    paintingDetails: {
      color: '',
      finish: 'gloss',
      coats: 2,
      dryingTime: 24
    },
    expectedReturn: '',
    currentLocation: ''
  });

  const refresh = () => {
    const ordersList = listExternalProcessingOrders();
    setOrders(ordersList);
    setProducts(listProducts());
    setSuppliers(listSuppliers());
    setStats(getExternalProcessingStats());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreateOrder = () => {
    const user = me();
    if (!user) return;

    const supplier = suppliers.find(s => s.id === newOrder.externalProcessId);
    const product = products.find(p => p.id === newOrder.productId);
    
    if (!supplier || !product) {
      alert('Please select valid product and supplier');
      return;
    }

    createExternalProcessingOrder({
      productId: newOrder.productId,
      externalProcessId: newOrder.externalProcessId,
      quantity: newOrder.quantity,
      status: 'pending',
      cost: newOrder.cost,
      notes: newOrder.notes,
      paintingDetails: newOrder.paintingDetails,
      expectedReturn: newOrder.expectedReturn,
      currentLocation: newOrder.currentLocation || `${supplier.name} - Painting Facility`,
      createdBy: user.email
    });

    setShowCreateModal(false);
    setNewOrder({
      productId: '',
      externalProcessId: '',
      quantity: 1,
      cost: 0,
      notes: '',
      paintingDetails: {
        color: '',
        finish: 'gloss',
        coats: 2,
        dryingTime: 24
      },
      expectedReturn: '',
      currentLocation: ''
    });
    refresh();
  };

  const handleUpdateStatus = (orderId: string, status: ExternalProcessingOrder['status']) => {
    const updates: Partial<ExternalProcessingOrder> = { status };
    
    if (status === 'sent') {
      updates.sentDate = new Date().toISOString();
    } else if (status === 'returned' || status === 'completed') {
      updates.actualReturn = new Date().toISOString();
    }
    
    updateExternalProcessingOrder(orderId, updates);
    refresh();
  };

  const handleUpdateLocation = (orderId: string, location: string) => {
    updateExternalProcessingOrder(orderId, { currentLocation: location });
    refresh();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      quality_check: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      returned: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  const getSupplierName = (supplierId: string) => {
    return suppliers.find(s => s.id === supplierId)?.name || 'Unknown Supplier';
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🎨 External Painting Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Track products sent for external painting and processing</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          + Send for Painting
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">R{stats.totalCost.toFixed(0)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgLeadTime}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Days</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'sent', 'in_progress', 'quality_check', 'completed', 'overdue'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                {status === 'all' ? orders.length : orders.filter(o => o.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Current Location</th>
                <th>Painting Details</th>
                <th>Expected Return</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="font-medium">{getProductName(order.productId)}</td>
                  <td>{getSupplierName(order.externalProcessId)}</td>
                  <td className="text-center">{order.quantity}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={order.currentLocation || ''}
                      onChange={(e) => handleUpdateLocation(order.id, e.target.value)}
                      className="input text-sm w-full"
                      placeholder="Update location..."
                    />
                  </td>
                  <td>
                    {order.paintingDetails && (
                      <div className="text-xs">
                        <div><strong>Color:</strong> {order.paintingDetails.color}</div>
                        <div><strong>Finish:</strong> {order.paintingDetails.finish}</div>
                        <div><strong>Coats:</strong> {order.paintingDetails.coats}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    {order.expectedReturn ? new Date(order.expectedReturn).toLocaleDateString() : '-'}
                  </td>
                  <td>R{order.cost.toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as ExternalProcessingOrder['status'])}
                      className="input text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="sent">Sent</option>
                      <option value="in_progress">In Progress</option>
                      <option value="quality_check">Quality Check</option>
                      <option value="completed">Completed</option>
                      <option value="returned">Returned</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No external processing orders found for the selected filter.
            </div>
          )}
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Send Product for External Painting</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product
                  </label>
                  <select
                    value={newOrder.productId}
                    onChange={(e) => setNewOrder({...newOrder, productId: e.target.value})}
                    className="input"
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stock: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Painting Supplier
                  </label>
                  <select
                    value={newOrder.externalProcessId}
                    onChange={(e) => setNewOrder({...newOrder, externalProcessId: e.target.value})}
                    className="input"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({...newOrder, quantity: parseInt(e.target.value) || 1})}
                    className="input"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cost (R)
                  </label>
                  <input
                    type="number"
                    value={newOrder.cost}
                    onChange={(e) => setNewOrder({...newOrder, cost: parseFloat(e.target.value) || 0})}
                    className="input"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expected Return
                  </label>
                  <input
                    type="date"
                    value={newOrder.expectedReturn}
                    onChange={(e) => setNewOrder({...newOrder, expectedReturn: e.target.value})}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Location
                </label>
                <input
                  type="text"
                  value={newOrder.currentLocation}
                  onChange={(e) => setNewOrder({...newOrder, currentLocation: e.target.value})}
                  className="input"
                  placeholder="e.g., ABC Painting - Booth 3"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Painting Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      value={newOrder.paintingDetails.color}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        paintingDetails: {...newOrder.paintingDetails, color: e.target.value}
                      })}
                      className="input"
                      placeholder="e.g., RAL 9010 White"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Finish
                    </label>
                    <select
                      value={newOrder.paintingDetails.finish}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        paintingDetails: {...newOrder.paintingDetails, finish: e.target.value}
                      })}
                      className="input"
                    >
                      <option value="matte">Matte</option>
                      <option value="satin">Satin</option>
                      <option value="gloss">Gloss</option>
                      <option value="semi-gloss">Semi-Gloss</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Coats
                    </label>
                    <input
                      type="number"
                      value={newOrder.paintingDetails.coats}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        paintingDetails: {...newOrder.paintingDetails, coats: parseInt(e.target.value) || 2}
                      })}
                      className="input"
                      min="1"
                      max="5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Drying Time (hours)
                    </label>
                    <input
                      type="number"
                      value={newOrder.paintingDetails.dryingTime}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        paintingDetails: {...newOrder.paintingDetails, dryingTime: parseInt(e.target.value) || 24}
                      })}
                      className="input"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  className="input"
                  rows={3}
                  placeholder="Special instructions or notes..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="btn btn-primary"
                disabled={!newOrder.productId || !newOrder.externalProcessId}
              >
                Send for Painting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}