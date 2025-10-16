import { useState, useEffect, useMemo } from 'react';
import { Order, OrderItem, Product, Customer, BackorderItem, StockMovement } from '../lib/types';
import { listOrders, listProducts, listCustomers, updateOrder, createBackorderItem, listBackorderItems, createStockMovement, updateProduct } from '../lib/storage-simple';
import { me } from '../lib/auth-simple';

export default function AdvancedWarehouseManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [backorders, setBackorders] = useState<BackorderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'preparation' | 'backorders' | 'reports'>('preparation');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const user = me();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setOrders(listOrders());
    setProducts(listProducts());
    setCustomers(listCustomers());
    setBackorders(listBackorderItems());
  };

  const preparationOrders = useMemo(() => {
    return orders.filter(order => 
      ['confirmed', 'preparing'].includes(order.status) &&
      (filterStatus === 'all' || order.status === filterStatus)
    );
  }, [orders, filterStatus]);

  const updateItemPreparation = (orderId: string, itemIndex: number, preparedQuantity: number, notes?: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updatedItems = [...order.items];
    const item = updatedItems[itemIndex];
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    // Calculate available stock
    const availableStock = product.stock - (product.reservedStock || 0);
    const maxPreparable = Math.min(item.quantity, availableStock);
    const actualPrepared = Math.min(preparedQuantity, maxPreparable);
    const backorderQty = item.quantity - actualPrepared;

    // Update item
    updatedItems[itemIndex] = {
      ...item,
      preparedQuantity: actualPrepared,
      backorderQuantity: backorderQty > 0 ? backorderQty : undefined,
      availableStock: availableStock,
      preparationStatus: actualPrepared === item.quantity ? 'complete' : 
                       actualPrepared > 0 ? 'partial' : 
                       backorderQty > 0 ? 'backorder' : 'pending',
      preparedBy: user?.email || 'Unknown',
      preparedAt: new Date().toISOString(),
      notes
    };

    // Create backorder if needed
    if (backorderQty > 0) {
      const backorderItem: Omit<BackorderItem, 'id'> = {
        customerId: order.customerId,
        orderId: order.id,
        productId: item.productId,
        quantity: backorderQty,
        unitPrice: item.unitPrice,
        unit: item.unit,
        priority: order.priority,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: `Backorder from order ${order.orderNumber}`
      };
      createBackorderItem(backorderItem);
    }

    // Update stock movement
    if (actualPrepared > 0) {
      const stockMovement: Omit<StockMovement, 'id'> = {
        productId: item.productId,
        type: 'reserved',
        quantity: actualPrepared,
        reason: 'Order preparation',
        reference: order.orderNumber,
        orderId: order.id,
        customerId: order.customerId,
        createdAt: new Date().toISOString(),
        createdBy: user?.email || 'Unknown'
      };
      createStockMovement(stockMovement);

      // Update product reserved stock
      updateProduct(product.id, {
        reservedStock: (product.reservedStock || 0) + actualPrepared,
        availableStock: product.stock - ((product.reservedStock || 0) + actualPrepared)
      });
    }

    // Calculate preparation progress
    const totalItems = updatedItems.length;
    const completedItems = updatedItems.filter(i => i.preparationStatus === 'complete').length;
    const preparationProgress = Math.round((completedItems / totalItems) * 100);

    // Update order
    const updatedOrder: Partial<Order> = {
      items: updatedItems,
      hasBackorders: updatedItems.some(i => i.backorderQuantity && i.backorderQuantity > 0),
      preparationProgress,
      status: preparationProgress === 100 ? 'ready' : 'preparing',
      updatedAt: new Date().toISOString()
    };

    updateOrder(order.id, updatedOrder);
    refresh();
  };

  const completeOrderPreparation = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Move reserved stock to out
    order.items.forEach(item => {
      if (item.preparedQuantity && item.preparedQuantity > 0) {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          // Create stock out movement
          const stockMovement: Omit<StockMovement, 'id'> = {
            productId: item.productId,
            type: 'out',
            quantity: item.preparedQuantity,
            reason: 'Order fulfillment',
            reference: order.orderNumber,
            orderId: order.id,
            customerId: order.customerId,
            createdAt: new Date().toISOString(),
            createdBy: user?.email || 'Unknown'
          };
          createStockMovement(stockMovement);

          // Update product stock
          updateProduct(product.id, {
            stock: product.stock - item.preparedQuantity,
            reservedStock: (product.reservedStock || 0) - item.preparedQuantity,
            availableStock: (product.stock - item.preparedQuantity) - ((product.reservedStock || 0) - item.preparedQuantity)
          });
        }
      }
    });

    updateOrder(orderId, { 
      status: 'ready',
      preparationProgress: 100,
      updatedAt: new Date().toISOString()
    });
    
    refresh();
  };

  const printPickingSlip = (order: Order) => {
    const customer = customers.find(c => c.id === order.customerId);
    if (!customer) return;

    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>PICKING SLIP</h1>
        <div style="border-bottom: 2px solid #000; margin: 20px 0;"></div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h3>Order Details</h3>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Priority:</strong> ${order.priority.toUpperCase()}</p>
          </div>
          <div>
            <h3>Customer</h3>
            <p><strong>${customer.name}</strong></p>
            <p>${customer.company || ''}</p>
            <p>${customer.address || ''}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">SKU</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Product</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Qty Ordered</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Qty Picked</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Location</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => {
              const product = products.find(p => p.id === item.productId);
              return `
                <tr>
                  <td style="border: 1px solid #000; padding: 8px;">${product?.sku || ''}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${product?.name || ''}</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quantity} ${item.unit || product?.unit || ''}</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">_______</td>
                  <td style="border: 1px solid #000; padding: 8px;">${product?.location || ''}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${item.notes || ''}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="margin-top: 40px;">
          <p><strong>Picked by:</strong> ________________________ <strong>Date:</strong> ____________</p>
          <p><strong>Checked by:</strong> _______________________ <strong>Date:</strong> ____________</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const printBackorderReport = (customerId?: string) => {
    const filteredBackorders = customerId 
      ? backorders.filter(b => b.customerId === customerId)
      : backorders;

    const groupedByCustomer = filteredBackorders.reduce((acc, backorder) => {
      if (!acc[backorder.customerId]) {
        acc[backorder.customerId] = [];
      }
      acc[backorder.customerId].push(backorder);
      return acc;
    }, {} as Record<string, BackorderItem[]>);

    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>BACKORDER REPORT</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <div style="border-bottom: 2px solid #000; margin: 20px 0;"></div>
        
        ${Object.entries(groupedByCustomer).map(([custId, items]) => {
          const customer = customers.find(c => c.id === custId);
          return `
            <div style="margin-bottom: 30px; page-break-inside: avoid;">
              <h2>${customer?.name || 'Unknown Customer'}</h2>
              <p>${customer?.company || ''} - ${customer?.email || ''}</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f0f0f0;">
                    <th style="border: 1px solid #000; padding: 8px; text-align: left;">Product</th>
                    <th style="border: 1px solid #000; padding: 8px; text-align: center;">Quantity</th>
                    <th style="border: 1px solid #000; padding: 8px; text-align: center;">Priority</th>
                    <th style="border: 1px solid #000; padding: 8px; text-align: left;">Expected Date</th>
                    <th style="border: 1px solid #000; padding: 8px; text-align: left;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return `
                      <tr>
                        <td style="border: 1px solid #000; padding: 8px;">${product?.name || ''} (${product?.sku || ''})</td>
                        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quantity} ${item.unit || product?.unit || ''}</td>
                        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.priority.toUpperCase()}</td>
                        <td style="border: 1px solid #000; padding: 8px;">${item.expectedDate ? new Date(item.expectedDate).toLocaleDateString() : 'TBD'}</td>
                        <td style="border: 1px solid #000; padding: 8px;">${item.status.toUpperCase()}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `;
        }).join('')}
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">🏭 Advanced Warehouse Management</h1>
          <p className="text-muted-foreground">Professional order preparation and backorder management</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => printBackorderReport()}
          >
            📊 Print All Backorders
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: 'preparation', label: '📦 Order Preparation', count: preparationOrders.length },
          { id: 'backorders', label: '⏳ Backorders', count: backorders.length },
          { id: 'reports', label: '📊 Reports', count: 0 }
        ].map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label} {tab.count > 0 && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Order Preparation Tab */}
      {activeTab === 'preparation' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <select
              className="input w-48"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="grid gap-4">
            {preparationOrders.map(order => {
              const customer = customers.find(c => c.id === order.customerId);
              
              return (
                <div key={order.id} className="card">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Order {order.orderNumber}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Customer: {customer?.name} • Priority: {order.priority.toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Progress</div>
                          <div className="font-medium">{order.preparationProgress || 0}%</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                        <button
                          className="btn btn-secondary text-sm"
                          onClick={() => printPickingSlip(order)}
                        >
                          🖨️ Print Slip
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="text-left">Product</th>
                            <th>Ordered</th>
                            <th>Available</th>
                            <th>Prepare</th>
                            <th>Backorder</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, itemIndex) => {
                            const product = products.find(p => p.id === item.productId);
                            const availableStock = product ? product.stock - (product.reservedStock || 0) : 0;
                            
                            return (
                              <tr key={itemIndex}>
                                <td>
                                  <div>
                                    <div className="font-medium">{product?.name}</div>
                                    <div className="text-sm text-muted-foreground">{product?.sku}</div>
                                    <div className="text-sm text-muted-foreground">Location: {product?.location || 'N/A'}</div>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="font-medium">{item.quantity}</div>
                                  <div className="text-sm text-muted-foreground">{item.unit || product?.unit}</div>
                                </td>
                                <td className="text-center">
                                  <div className={`font-medium ${availableStock < item.quantity ? 'text-red-600' : 'text-green-600'}`}>
                                    {availableStock}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{product?.unit}</div>
                                </td>
                                <td className="text-center">
                                  <input
                                    type="number"
                                    min="0"
                                    max={Math.min(item.quantity, availableStock)}
                                    className="input w-20 text-center"
                                    value={item.preparedQuantity || 0}
                                    onChange={(e) => {
                                      const preparedQty = parseFloat(e.target.value) || 0;
                                      updateItemPreparation(order.id, itemIndex, preparedQty);
                                    }}
                                  />
                                </td>
                                <td className="text-center">
                                  <div className={`font-medium ${item.backorderQuantity ? 'text-orange-600' : 'text-gray-400'}`}>
                                    {item.backorderQuantity || 0}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    item.preparationStatus === 'complete' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                    item.preparationStatus === 'partial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                    item.preparationStatus === 'backorder' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                  }`}>
                                    {item.preparationStatus || 'pending'}
                                  </div>
                                </td>
                                <td>
                                  {item.preparedBy && (
                                    <div className="text-xs text-muted-foreground">
                                      By: {item.preparedBy.split('@')[0]}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {order.preparationProgress === 100 && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-green-800 dark:text-green-200 font-medium">
                            ✅ Order preparation complete - Ready to ship
                          </span>
                          <button
                            className="btn btn-success"
                            onClick={() => completeOrderPreparation(order.id)}
                          >
                            Mark as Ready
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Backorders Tab */}
      {activeTab === 'backorders' && (
        <div className="space-y-4">
          <div className="card">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Customer Backorders</h3>
            </div>
            <div className="p-4">
              {/* Group backorders by customer */}
              {Object.entries(
                backorders.reduce((acc, backorder) => {
                  if (!acc[backorder.customerId]) {
                    acc[backorder.customerId] = [];
                  }
                  acc[backorder.customerId].push(backorder);
                  return acc;
                }, {} as Record<string, BackorderItem[]>)
              ).map(([customerId, customerBackorders]) => {
                const customer = customers.find(c => c.id === customerId);
                
                return (
                  <div key={customerId} className="mb-6 border border-border rounded-lg">
                    <div className="p-4 bg-muted border-b border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">
                          {customer?.name} ({customerBackorders.length} items)
                        </h4>
                        <button
                          className="btn btn-secondary text-sm"
                          onClick={() => printBackorderReport(customerId)}
                        >
                          🖨️ Print Customer Backorders
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="text-left">Product</th>
                              <th>Quantity</th>
                              <th>Priority</th>
                              <th>Expected Date</th>
                              <th>Status</th>
                              <th>Created</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerBackorders.map(backorder => {
                              const product = products.find(p => p.id === backorder.productId);
                              
                              return (
                                <tr key={backorder.id}>
                                  <td>
                                    <div>
                                      <div className="font-medium">{product?.name}</div>
                                      <div className="text-sm text-muted-foreground">{product?.sku}</div>
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    {backorder.quantity} {backorder.unit || product?.unit}
                                  </td>
                                  <td className="text-center">
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                      backorder.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                      backorder.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                                      backorder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                    }`}>
                                      {backorder.priority.toUpperCase()}
                                    </div>
                                  </td>
                                  <td>
                                    {backorder.expectedDate 
                                      ? new Date(backorder.expectedDate).toLocaleDateString()
                                      : 'TBD'
                                    }
                                  </td>
                                  <td>
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                      backorder.status === 'fulfilled' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                      backorder.status === 'ordered' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                    }`}>
                                      {backorder.status.toUpperCase()}
                                    </div>
                                  </td>
                                  <td className="text-sm text-muted-foreground">
                                    {new Date(backorder.createdAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Preparation Statistics</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{preparationOrders.length}</div>
                  <div className="text-sm text-muted-foreground">Orders in Preparation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{backorders.length}</div>
                  <div className="text-sm text-muted-foreground">Total Backorders</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              <button
                className="btn btn-primary w-full"
                onClick={() => printBackorderReport()}
              >
                📊 Generate Complete Backorder Report
              </button>
              <button
                className="btn btn-secondary w-full"
                onClick={() => {
                  const urgentBackorders = backorders.filter(b => b.priority === 'urgent');
                  if (urgentBackorders.length > 0) {
                    alert(`${urgentBackorders.length} urgent backorders require immediate attention!`);
                  } else {
                    alert('No urgent backorders at this time.');
                  }
                }}
              >
                🚨 Check Urgent Backorders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}