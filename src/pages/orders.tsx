import { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import OrderForm from '../components/OrderForm';
import { listOrders, updateOrder, listCustomers, listProducts, recordPickingSlipPrint, getPickingSlipRecord, createOrder } from '../lib/storage-simple';
import { me } from '../lib/auth-simple';
import PickingSlipPDF from '../components/PickingSlipPDF';
import type { Order, Customer, Product, PickingSlipRecord } from '../lib/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPickingSlip, setShowPickingSlip] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [pickingSlipRecords, setPickingSlipRecords] = useState<Record<string, PickingSlipRecord>>({});
  const pickingSlipRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    const ordersList = listOrders();
    setOrders(ordersList);
    setCustomers(listCustomers());
    setProducts(listProducts());
    
    // Load picking slip records for all orders
    const records: Record<string, PickingSlipRecord> = {};
    ordersList.forEach(order => {
      const record = getPickingSlipRecord(order.id);
      if (record) {
        records[order.id] = record;
      }
    });
    setPickingSlipRecords(records);
  };
  
  useEffect(() => { refresh(); }, []);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-200 text-green-900',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    updateOrder(orderId, { status: status as any, updatedAt: new Date().toISOString() });
    refresh();
  };

  const handlePrintPickingSlip = (order: Order) => {
    setSelectedOrder(order);
    setShowPickingSlip(true);
  };

  const handlePickingSlipPrint = () => {
    if (!selectedOrder) return;
    
    const user = me();
    const userEmail = user?.email || 'Unknown User';
    
    // Record the print
    recordPickingSlipPrint(selectedOrder.id, userEmail);
    
    // Print the document
    if (pickingSlipRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Picking Slip - ${selectedOrder.orderNumber}</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                @media print { body { padding: 0; } }
              </style>
            </head>
            <body>
              ${pickingSlipRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
    
    // Refresh to update the picking slip count
    refresh();
    setShowPickingSlip(false);
  };

  const handlePickingSlipDownload = () => {
    if (!selectedOrder) return;
    
    const user = me();
    const userEmail = user?.email || 'Unknown User';
    
    // Record the print/download
    recordPickingSlipPrint(selectedOrder.id, userEmail);
    
    // Create and download PDF (simplified version)
    const element = pickingSlipRef.current;
    if (element) {
      // For now, we'll use the print functionality
      // In a real implementation, you'd use jsPDF or similar
      handlePickingSlipPrint();
    }
    
    refresh();
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <Layout>
      <div className="min-h-screen gradient-bg">
        <div className="container py-6 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Order Management</h1>
            <p className="text-white/80 text-lg">Track and manage customer orders</p>
          </div>

        {/* Filter Tabs */}
        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'preparing', 'ready', 'shipped', 'delivered'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                      {orders.filter(o => o.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowOrderForm(true)}
              className="btn btn-primary"
            >
              ➕ New Order
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Orders ({filteredOrders.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-left">Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                  <th>Expected Delivery</th>
                  <th>Picking Slips</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.orderNumber}</td>
                    <td>{getCustomerName(order.customerId)}</td>
                    <td className="font-medium">R{typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString() : '-'}</td>
                    <td>
                      {pickingSlipRecords[order.id] ? (
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {pickingSlipRecords[order.id].printCount} prints
                          </div>
                          <div className="text-xs text-gray-500">
                            by {pickingSlipRecords[order.id].printedBy}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(pickingSlipRecords[order.id].printedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 text-sm">
                          Not printed
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePrintPickingSlip(order)}
                          className="btn btn-secondary text-xs px-2 py-1"
                          title="Print Picking Slip"
                        >
                          🖨️ Print
                        </button>
                        <select
                          className="input text-sm"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No orders found for the selected filter.
              </div>
            )}
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Pending Orders</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-orange-600">{orders.filter(o => o.status === 'preparing').length}</div>
            <div className="text-sm text-gray-600">In Preparation</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'shipped').length}</div>
            <div className="text-sm text-gray-600">Shipped</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              R{orders.reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : 0), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
        </div>
      </div>

      {/* Picking Slip Modal */}
      {showPickingSlip && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Picking Slip - Order #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowPickingSlip(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-4">
              <PickingSlipPDF
                ref={pickingSlipRef}
                order={selectedOrder}
                customer={customers.find(c => c.id === selectedOrder.customerId) || { 
                  id: '', 
                  name: 'Unknown Customer', 
                  createdAt: '' 
                }}
                products={products}
                onPrint={handlePickingSlipPrint}
                onDownload={handlePickingSlipDownload}
              />
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Create New Order
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowOrderForm(false)}
              >
                ✕
              </button>
            </div>
            
            <OrderForm
              customers={customers}
              products={products}
              onSave={(orderData) => {
                createOrder(orderData);
                setShowOrderForm(false);
                refresh();
              }}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}