import { useState, useEffect } from 'react';
import { Supplier, Product, SupplierPrice, ExternalProcessingOrder } from '../lib/types';
import { listSuppliers, createSupplier, deleteSupplier, listProducts, listSupplierPrices, createExternalProcessingOrder, listExternalProcessingOrders } from '../lib/storage-simple';

export default function UnifiedSupplierManager() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierPrices, setSupplierPrices] = useState<SupplierPrice[]>([]);
  const [externalOrders, setExternalOrders] = useState<ExternalProcessingOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'suppliers' | 'external' | 'pricing'>('suppliers');
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showExternalOrder, setShowExternalOrder] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    paymentTerms: '',
    isExternal: false,
    services: [] as string[]
  });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setSuppliers(listSuppliers());
    setProducts(listProducts());
    setSupplierPrices(listSupplierPrices());
    setExternalOrders(listExternalProcessingOrders());
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name.trim()) return;

    createSupplier({
      name: newSupplier.name,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      contactPerson: newSupplier.contactPerson,
      paymentTerms: newSupplier.paymentTerms
    });

    setNewSupplier({
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      paymentTerms: '',
      isExternal: false,
      services: []
    });
    setShowAddSupplier(false);
    refresh();
  };

  const getSupplierPrices = (productId: string) => {
    return supplierPrices.filter(sp => sp.productId === productId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supplier Management</h1>
          <p className="text-muted-foreground">Manage suppliers and external processing services</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddSupplier(true)}
        >
          Add Supplier
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: 'suppliers', label: 'Suppliers', count: suppliers.length },
          { id: 'external', label: 'External Processing', count: externalOrders.length },
          { id: 'pricing', label: 'Product Pricing', count: 0 }
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

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">All Suppliers</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-left">Supplier Name</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Payment Terms</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(supplier => (
                    <tr key={supplier.id}>
                      <td className="font-medium">{supplier.name}</td>
                      <td>{supplier.contactPerson || '-'}</td>
                      <td>{supplier.email || '-'}</td>
                      <td>{supplier.phone || '-'}</td>
                      <td>{supplier.paymentTerms || '-'}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button className="btn-secondary text-sm px-3 py-1">Edit</button>
                          <button 
                            className="btn-danger text-sm px-3 py-1"
                            onClick={() => { deleteSupplier(supplier.id); refresh(); }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* External Processing Tab */}
      {activeTab === 'external' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">External Processing Orders</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowExternalOrder(true)}
            >
              Send for Processing
            </button>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-left">Product</th>
                      <th>Supplier</th>
                      <th>Process Type</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Sent Date</th>
                      <th>Expected Return</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {externalOrders.map(order => {
                      const product = products.find(p => p.id === order.productId);
                      const supplier = suppliers.find(s => s.id === order.externalProcessId);
                      
                      return (
                        <tr key={order.id}>
                          <td>
                            <div>
                              <div className="font-medium">{product?.name}</div>
                              <div className="text-sm text-muted-foreground">{product?.sku}</div>
                            </div>
                          </td>
                          <td>{supplier?.name || 'Unknown'}</td>
                          <td className="capitalize">{order.paintingDetails?.color || 'Processing'}</td>
                          <td>{order.quantity}</td>
                          <td>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              order.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              order.status === 'quality_check' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </div>
                          </td>
                          <td>{order.sentDate ? new Date(order.sentDate).toLocaleDateString() : '-'}</td>
                          <td>{order.expectedReturn ? new Date(order.expectedReturn).toLocaleDateString() : '-'}</td>
                          <td>
                            <button className="btn-secondary text-sm px-3 py-1">
                              Update Status
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Product Pricing by Supplier</h3>
          
          <div className="grid gap-4">
            {products.map(product => {
              const productPrices = getSupplierPrices(product.id);
              
              return (
                <div key={product.id} className="card">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Current Price</div>
                        <div className="font-medium">R{product.sellingPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {productPrices.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground mb-2">Supplier Prices:</div>
                        {productPrices.map(price => {
                          const supplier = suppliers.find(s => s.id === price.supplierId);
                          return (
                            <div key={price.id} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <div className="font-medium">{supplier?.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Min Qty: {price.minimumQuantity} • Lead Time: {price.leadTime} days
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">R{price.price.toFixed(2)}</div>
                                <div className="text-sm text-muted-foreground">per {price.currency}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No supplier prices available for this product
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">Add New Supplier</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Supplier Name *</label>
                <input
                  type="text"
                  className="input"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  placeholder="Enter supplier name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Contact Person</label>
                <input
                  type="text"
                  className="input"
                  value={newSupplier.contactPerson}
                  onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                  placeholder="Contact person name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  className="input"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  placeholder="supplier@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input
                  type="tel"
                  className="input"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  placeholder="Phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Payment Terms</label>
                <select
                  className="input"
                  value={newSupplier.paymentTerms}
                  onChange={(e) => setNewSupplier({...newSupplier, paymentTerms: e.target.value})}
                >
                  <option value="">Select payment terms</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="COD">Cash on Delivery</option>
                  <option value="Prepaid">Prepaid</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="btn btn-secondary flex-1"
                onClick={() => setShowAddSupplier(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary flex-1"
                onClick={handleAddSupplier}
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}