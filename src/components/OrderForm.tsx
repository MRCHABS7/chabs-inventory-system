import { useState, useEffect } from 'react';
import type { Customer, Product, Order } from '../lib/types';

type OrderItemDraft = {
  productId: string;
  quantity: number;
  customPrice?: number;
  discount?: number;
  description?: string;
  unit?: string;
};

export default function OrderForm({
  customers,
  products,
  onSave,
  editingOrder,
}: {
  customers: Customer[];
  products: Product[];
  onSave: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingOrder?: Order;
}) {
  const [customerId, setCustomerId] = useState<string>('');
  const [items, setItems] = useState<OrderItemDraft[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [warehouseInstructions, setWarehouseInstructions] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingOrder) {
      setCustomerId(editingOrder.customerId);
      setPriority(editingOrder.priority);
      setExpectedDelivery(editingOrder.expectedDelivery || '');
      setNotes(editingOrder.notes || '');
      setWarehouseInstructions(editingOrder.warehouseInstructions || '');
      
      const editItems = editingOrder.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        customPrice: item.unitPrice,
        discount: item.discount || 0,
        description: (item as any).description || '',
        unit: (item as any).unit || 'EA'
      }));
      setItems(editItems);
    }
  }, [editingOrder]);

  const addItem = () => setItems(prev => [...prev, { 
    productId: products[0]?.id ?? '', 
    quantity: 1, 
    discount: 0,
    unit: 'EA'
  }]);

  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  
  const updateItem = (i: number, patch: Partial<OrderItemDraft>) => 
    setItems(prev => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const buildOrder = () => {
    const orderItems = items.map(i => {
      const p = products.find(pp => pp.id === i.productId);
      const unitPrice = i.customPrice ?? p?.sellingPrice ?? 0;
      const quantity = Number(i.quantity) || 0;
      const discount = Number(i.discount) || 0;
      const subtotalBeforeDiscount = unitPrice * quantity;
      const discountAmount = subtotalBeforeDiscount * (discount / 100);
      const total = subtotalBeforeDiscount - discountAmount;
      
      return {
        productId: i.productId,
        quantity,
        unitPrice,
        discount,
        total,
        description: i.description || p?.description || p?.name || '',
        unit: i.unit || p?.unit || 'EA'
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 15;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    return {
      orderNumber: `ORD-${Date.now()}`,
      customerId,
      items: orderItems,
      subtotal,
      taxRate,
      taxAmount,
      total: totalAmount,
      status: 'pending' as const,
      priority,
      expectedDelivery: expectedDelivery || undefined,
      notes,
      warehouseInstructions
    };
  };

  const save = () => {
    if (!customerId) return alert('Please select a customer');
    if (!items.length) return alert('Add at least one item');
    
    const order = buildOrder();
    onSave(order);
    resetForm();
  };

  const resetForm = () => {
    setCustomerId('');
    setItems([]);
    setPriority('medium');
    setExpectedDelivery('');
    setNotes('');
    setWarehouseInstructions('');
  };

  const total = items.reduce((sum, it) => {
    const p = products.find(pp => pp.id === it.productId);
    const price = it.customPrice ?? p?.sellingPrice ?? 0;
    return sum + price * (it.quantity || 0);
  }, 0);

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
        📦 {editingOrder ? 'Edit Order' : 'New Order'}
      </h2>

      {/* Basic Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer *</label>
          <select className="input" value={customerId} onChange={e => setCustomerId(e.target.value)}>
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.email ? `(${c.email})` : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
          <select className="input" value={priority} onChange={e => setPriority(e.target.value as any)}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🟠 High</option>
            <option value="urgent">🔴 Urgent</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Delivery</label>
          <input 
            type="date"
            className="input" 
            value={expectedDelivery} 
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setExpectedDelivery(e.target.value)} 
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Items</h3>
          <button className="btn btn-secondary" type="button" onClick={addItem}>
            ➕ Add Item
          </button>
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No items added yet. Click "Add Item" to get started.
          </div>
        )}

        {items.map((it, i) => {
          const product = products.find(p => p.id === it.productId);
          const unitPrice = it.customPrice ?? product?.sellingPrice ?? 0;
          const quantity = it.quantity || 0;
          const discount = it.discount || 0;
          const subtotalBeforeDiscount = unitPrice * quantity;
          const discountAmount = subtotalBeforeDiscount * (discount / 100);
          const lineTotal = subtotalBeforeDiscount - discountAmount;
          
          return (
            <div key={i} className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
              <div className="grid md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Product</label>
                  <select className="input" value={it.productId} onChange={e => updateItem(i, { productId: e.target.value })}>
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (R{p.sellingPrice.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Quantity</label>
                  <input 
                    className="input" 
                    type="number" 
                    min={1} 
                    value={it.quantity} 
                    onChange={e => updateItem(i, { quantity: Number(e.target.value) })} 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Unit Price (R)</label>
                  <input 
                    className="input" 
                    type="number" 
                    step="0.01"
                    placeholder={product ? `${product.sellingPrice.toFixed(2)}` : '0.00'} 
                    value={it.customPrice ?? ''} 
                    onChange={e => updateItem(i, { customPrice: e.target.value ? Number(e.target.value) : undefined })} 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Line Total (R)</label>
                  <div className="input bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-semibold">
                    {lineTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  className="btn btn-danger" 
                  type="button" 
                  onClick={() => removeItem(i)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Notes</label>
          <textarea 
            className="input h-24" 
            placeholder="Order notes (optional)" 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Warehouse Instructions</label>
          <textarea 
            className="input h-24" 
            placeholder="Special instructions for warehouse staff" 
            value={warehouseInstructions} 
            onChange={e => setWarehouseInstructions(e.target.value)} 
          />
        </div>
      </div>

      {/* Summary and Actions */}
      <div className="border-t pt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Subtotal: R{total.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              VAT (15%): R{(total * 0.15).toFixed(2)}
            </div>
            <div className="text-lg font-semibold text-gray-800 dark:text-white">
              Total: R{(total * 1.15).toFixed(2)}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="btn btn-primary" type="button" onClick={save}>
              💾 {editingOrder ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}