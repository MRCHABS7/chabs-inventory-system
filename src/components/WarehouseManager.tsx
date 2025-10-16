import { useState, useEffect, useRef } from 'react';
import { listProducts, createStockMovement, listOrders, listCustomers } from '../lib/storage-simple';
import { notifyLowStock, notifyStockOut, notifyStockMovement } from '../lib/notifications';
import { me } from '../lib/auth-simple';
import PickingSlipPDF from './PickingSlipPDF';
import type { Product, StockMovement, Order, Customer } from '../lib/types';

interface StockLocation {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  currentStock: number;
}

export default function WarehouseManager() {
  const user = me();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [selectedOrderForPicking, setSelectedOrderForPicking] = useState<Order | null>(null);
  const pickingSlipRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<StockLocation[]>([
    { id: 'A1', name: 'Aisle A - Shelf 1', capacity: 1000, currentStock: 0 },
    { id: 'A2', name: 'Aisle A - Shelf 2', capacity: 1000, currentStock: 0 },
    { id: 'B1', name: 'Aisle B - Shelf 1', capacity: 1500, currentStock: 0 },
    { id: 'B2', name: 'Aisle B - Shelf 2', capacity: 1500, currentStock: 0 },
    { id: 'C1', name: 'Cold Storage', capacity: 500, currentStock: 0 },
    { id: 'RECV', name: 'Receiving Area', capacity: 2000, currentStock: 0 },
    { id: 'SHIP', name: 'Shipping Area', capacity: 1000, currentStock: 0 }
  ]);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'locations' | 'picking'>('overview');
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [movementData, setMovementData] = useState({
    type: 'in' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reason: '',
    reference: '',
    location: ''
  });

  useEffect(() => {
    const loadedProducts = listProducts();
    const loadedOrders = listOrders();
    const loadedMovements = JSON.parse(localStorage.getItem('chabs_stock_movements') || '[]');
    
    setProducts(loadedProducts);
    setOrders(loadedOrders);
    setStockMovements(loadedMovements);
  }, []);

  const handleStockMovement = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    const movement = createStockMovement({
      productId: selectedProduct,
      type: movementData.type,
      quantity: movementData.quantity,
      reason: movementData.reason,
      reference: movementData.reference,
      createdBy: 'current_user'
    });

    // Update product stock
    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct) {
        let newStock = product.stock;
        if (movementData.type === 'in') {
          newStock += movementData.quantity;
        } else if (movementData.type === 'out') {
          newStock -= movementData.quantity;
        } else {
          newStock = movementData.quantity; // adjustment sets absolute value
        }
        
        const finalStock = Math.max(0, newStock);
        
        // Trigger notifications based on stock levels
        if (finalStock === 0) {
          notifyStockOut(product.name);
        } else if (finalStock <= product.minimumStock) {
          notifyLowStock(product.name, finalStock, product.minimumStock);
        }
        
        // Notify about the stock movement
        notifyStockMovement(product.name, movementData.type, movementData.quantity);
        
        return { ...product, stock: finalStock };
      }
      return product;
    });

    setProducts(updatedProducts);
    setStockMovements([movement, ...stockMovements]);
    
    // Update localStorage
    localStorage.setItem('chabs_products', JSON.stringify(updatedProducts));
    
    // Reset form
    setMovementData({
      type: 'in',
      quantity: 0,
      reason: '',
      reference: '',
      location: ''
    });
    setSelectedProduct('');
    setShowMovementForm(false);
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.minimumStock);
  };

  const getOverstockProducts = () => {
    return products.filter(p => p.stock > p.maximumStock);
  };

  const getPendingOrders = () => {
    return orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status));
  };

  const getStockValue = () => {
    return products.reduce((total, product) => total + (product.stock * product.costPrice), 0);
  };

  const formatCurrency = (amount: number) => `R ${amount.toFixed(2)}`;

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.minimumStock) return 'low';
    if (product.stock > product.maximumStock) return 'high';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      default: return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'low': return 'Low Stock';
      case 'high': return 'Overstock';
      default: return 'Normal';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Warehouse Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor inventory, track movements, and manage locations</p>
        </div>
        {user?.role === 'warehouse' ? (
          <button
            onClick={() => setShowMovementForm(true)}
            className="btn btn-primary"
          >
            📦 Record Movement
          </button>
        ) : (
          <div className="bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-orange-600 dark:text-orange-400 text-xl mr-3">🔒</span>
              <div>
                <h3 className="font-medium text-orange-800 dark:text-orange-200">View Only Access</h3>
                <p className="text-sm text-orange-600 dark:text-orange-400">Stock movements can only be recorded by warehouse users</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(getStockValue())}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">{getLowStockProducts().length}</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-2xl font-bold text-blue-600">{getPendingOrders().length}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'movements', label: 'Stock Movements', icon: '📈' },
            { id: 'locations', label: 'Locations', icon: '🏢' },
            { id: 'picking', label: 'Order Picking', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Stock Movement Form Modal */}
      {showMovementForm && user?.role === 'warehouse' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Record Stock Movement</h2>
            
            <form onSubmit={handleStockMovement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product *
                </label>
                <select
                  required
                  className="input"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Current: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Movement Type *
                </label>
                <select
                  required
                  className="input"
                  value={movementData.type}
                  onChange={(e) => setMovementData({ ...movementData, type: e.target.value as any })}
                >
                  <option value="in">Stock In (Receiving)</option>
                  <option value="out">Stock Out (Shipping)</option>
                  <option value="adjustment">Stock Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="input"
                  value={movementData.quantity}
                  onChange={(e) => setMovementData({ ...movementData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <select
                  className="input"
                  value={movementData.location}
                  onChange={(e) => setMovementData({ ...movementData, location: e.target.value })}
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g., Purchase order received, Customer order shipped"
                  value={movementData.reason}
                  onChange={(e) => setMovementData({ ...movementData, reason: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Order number, PO number, etc."
                  value={movementData.reference}
                  onChange={(e) => setMovementData({ ...movementData, reference: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Record Movement
                </button>
                <button
                  type="button"
                  onClick={() => setShowMovementForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Alerts */}
          {getLowStockProducts().length > 0 && (
            <div className="card border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⚠️</div>
                <div>
                  <h3 className="font-medium text-red-800 dark:text-red-200">Low Stock Alert</h3>
                  <p className="text-red-700 dark:text-red-300">
                    {getLowStockProducts().length} products are running low on stock
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stock Overview */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Overview</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">SKU</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Current Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Min/Max</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const status = getStockStatus(product);
                    return (
                      <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{product.category}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{product.sku}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900 dark:text-white">{product.stock}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{product.unit}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {product.minimumStock} / {product.maximumStock}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {getStatusText(status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(product.stock * product.costPrice)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {product.location || 'Unassigned'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Stock Movements</h2>
          
          {stockMovements.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No movements recorded</h3>
              <p className="text-gray-600 dark:text-gray-400">Stock movements will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Reason</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {stockMovements.map((movement) => {
                    const product = products.find(p => p.id === movement.productId);
                    return (
                      <tr key={movement.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(movement.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {product?.name || 'Unknown Product'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            movement.type === 'in' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            movement.type === 'out' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {movement.type === 'in' ? '📥 In' : movement.type === 'out' ? '📤 Out' : '🔄 Adjustment'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {movement.type === 'out' ? '-' : '+'}{movement.quantity}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {movement.reason}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {movement.reference || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'locations' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Warehouse Locations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div key={location.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{location.name}</h3>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{location.id}</span>
                </div>
                
                {location.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{location.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Current Stock:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{location.currentStock}</span>
                  </div>
                  
                  {location.capacity && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{location.capacity}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((location.currentStock / location.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {((location.currentStock / location.capacity) * 100).toFixed(1)}% utilized
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'picking' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Picking List</h2>
          
          {getPendingOrders().length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pending orders</h3>
              <p className="text-gray-600 dark:text-gray-400">Orders ready for picking will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getPendingOrders().map((order) => (
                <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Priority: <span className={`font-medium ${
                          order.priority === 'urgent' ? 'text-red-600' :
                          order.priority === 'high' ? 'text-orange-600' :
                          order.priority === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>{order.priority.toUpperCase()}</span>
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Items to Pick:</h4>
                    {order.items.map((item, index) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {product?.name || 'Unknown Product'}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              ({product?.sku})
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900 dark:text-white">
                              Qty: {item.quantity}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Location: {product?.location || 'Unassigned'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}