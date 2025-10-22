import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { me } from '../lib/auth-simple';
import { listProducts, listOrders, listStockMovements, getPickingSlipStats, getExternalProcessingStats } from '../lib/storage-simple';
import { addNotification } from '../lib/notifications';
import type { Product, Order, StockMovement } from '../lib/types';

export default function WarehouseDashboard() {
  const router = useRouter();
  const user = me();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [counts, setCounts] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    pendingOrders: 0,
    todayMovements: 0
  });
  const [pickingSlipStats, setPickingSlipStats] = useState({
    totalPrints: 0,
    uniqueOrders: 0,
    recentPrints: 0,
    averagePrintsPerOrder: 0
  });
  const [externalProcessingStats, setExternalProcessingStats] = useState({
    totalOrders: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    totalCost: 0,
    avgLeadTime: 0
  });

  useEffect(() => {
    // Check if user has warehouse access
    if (!user || (user.role !== 'warehouse' && user.role !== 'admin')) {
      router.push('/login');
      return;
    }

    const products = listProducts();
    const orders = listOrders();
    const movements = listStockMovements();
    
    setProducts(products);
    setOrders(orders);
    setStockMovements(movements);

    const lowStockProducts = products.filter(p => p.stock <= p.minimumStock && p.stock > 0);
    const outOfStockProducts = products.filter(p => p.stock === 0);
    const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status));
    
    const today = new Date().toDateString();
    const todayMovements = movements.filter(m => new Date(m.createdAt).toDateString() === today);

    setCounts({
      totalProducts: products.length,
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      pendingOrders: pendingOrders.length,
      todayMovements: todayMovements.length
    });

    // Get picking slip statistics
    const pickingStats = getPickingSlipStats();
    setPickingSlipStats(pickingStats);

    // Get external processing statistics
    const extProcessingStats = getExternalProcessingStats();
    setExternalProcessingStats(extProcessingStats);

    // Add warehouse-specific notifications
    if (outOfStockProducts.length > 0) {
      outOfStockProducts.slice(0, 3).forEach(product => {
        addNotification({
          type: 'error',
          title: 'Stock Out Alert',
          message: `${product.name} is out of stock!`,
          category: 'warehouse',
          actionUrl: '/warehouse'
        });
      });
    }

    if (lowStockProducts.length > 0) {
      lowStockProducts.slice(0, 2).forEach(product => {
        addNotification({
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${product.name} is running low (${product.stock} remaining)`,
          category: 'warehouse',
          actionUrl: '/warehouse'
        });
      });
    }
  }, [user, router]);

  if (!user) return null;

  const recentMovements = stockMovements
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const urgentOrders = orders
    .filter(o => o.priority === 'urgent' && ['pending', 'confirmed', 'preparing'].includes(o.status))
    .slice(0, 5);

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Warehouse Dashboard</h1>
            <p className="text-muted-foreground">Inventory control and stock management</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Welcome back, {user.email}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-foreground">{counts.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">PROD</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{counts.lowStock}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">LOW</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{counts.outOfStock}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">OUT</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-blue-600">{counts.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">ORD</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Movements</p>
                <p className="text-2xl font-bold text-green-600">{counts.todayMovements}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">MOV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Picking Slip Statistics */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Picking Slip Statistics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{pickingSlipStats.totalPrints}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Prints</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{pickingSlipStats.uniqueOrders}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Orders Printed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{pickingSlipStats.recentPrints}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Last 24 Hours</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{pickingSlipStats.averagePrintsPerOrder.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Prints/Order</div>
            </div>
          </div>
        </div>

        {/* External Painting Statistics */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">External Painting Status</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{externalProcessingStats.totalOrders}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{externalProcessingStats.inProgress}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{externalProcessingStats.completed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{externalProcessingStats.overdue}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">R{externalProcessingStats.totalCost.toFixed(0)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{externalProcessingStats.avgLeadTime}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Days</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/external-processing')}
              className="btn btn-primary"
            >
              Manage External Painting
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/warehouse')}
              className="btn btn-primary p-4 text-left"
            >
              <div className="text-lg mb-2">Stock Management</div>
              <div className="font-medium">Manage Stock</div>
              <div className="text-sm opacity-80">Add, remove, or adjust inventory</div>
            </button>

            <button
              onClick={() => router.push('/orders')}
              className="btn btn-secondary p-4 text-left"
            >
              <div className="text-lg mb-2">Order Processing</div>
              <div className="font-medium">Process Orders</div>
              <div className="text-sm opacity-80">View and fulfill orders</div>
            </button>

            <button
              onClick={() => router.push('/products')}
              className="btn btn-secondary p-4 text-left"
            >
              <div className="text-lg mb-2">Product Catalog</div>
              <div className="font-medium">Product Catalog</div>
              <div className="text-sm opacity-80">View product information</div>
            </button>

            <button
              onClick={() => router.push('/reports')}
              className="btn btn-secondary p-4 text-left"
            >
              <div className="text-lg mb-2">Stock Reports</div>
              <div className="font-medium">Stock Reports</div>
              <div className="text-sm opacity-80">View inventory reports</div>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Stock Movements */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Stock Movements</h2>
            <div className="space-y-3">
              {recentMovements.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent movements</p>
              ) : (
                recentMovements.map((movement) => {
                  const product = products.find(p => p.id === movement.productId);
                  return (
                    <div key={movement.id} className="flex items-center justify-between p-3 bg-surface-hover rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{product?.name || 'Unknown Product'}</div>
                        <div className="text-sm text-muted-foreground">
                          {movement.type === 'in' ? 'IN' : movement.type === 'out' ? 'OUT' : 'ADJ'} 
                          {movement.type.toUpperCase()} - {movement.quantity} units
                        </div>
                        <div className="text-xs text-muted-foreground">{movement.reason}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(movement.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Urgent Orders */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Urgent Orders</h2>
            <div className="space-y-3">
              {urgentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No urgent orders</p>
              ) : (
                urgentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div>
                      <div className="font-medium text-foreground">Order #{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} items - Status: {order.status}
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium">URGENT PRIORITY</div>
                    </div>
                    <button
                      onClick={() => router.push('/orders')}
                      className="btn btn-danger text-sm px-3 py-1"
                    >
                      Process
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        {(counts.lowStock > 0 || counts.outOfStock > 0) && (
          <div className="card p-6 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              Stock Alerts
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {counts.outOfStock > 0 && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <div className="font-medium text-red-800 dark:text-red-200">
                    {counts.outOfStock} Products Out of Stock
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-300 mt-1">
                    Immediate attention required
                  </div>
                  <button
                    onClick={() => router.push('/warehouse')}
                    className="btn btn-danger text-sm mt-2"
                  >
                    Restock Now
                  </button>
                </div>
              )}
              
              {counts.lowStock > 0 && (
                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <div className="font-medium text-orange-800 dark:text-orange-200">
                    {counts.lowStock} Products Low Stock
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                    Consider reordering soon
                  </div>
                  <button
                    onClick={() => router.push('/warehouse')}
                    className="btn btn-warning text-sm mt-2"
                  >
                    Review Stock
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}