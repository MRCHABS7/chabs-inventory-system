import { useState, useEffect, useMemo } from 'react';
import { Customer, Product, Quotation, QuoteItem, CustomerPrice } from '../lib/types';
import { getCustomerPrices, saveCustomerPrice, getCompany } from '../lib/storage-simple';

interface EnhancedQuoteBuilderProps {
  customers: Customer[];
  products: Product[];
  onSave: (quotation: Omit<Quotation, 'id' | 'createdAt'>) => void;
  onSaveAndEmail?: (quotation: Omit<Quotation, 'id' | 'createdAt'>, customerEmail: string) => void;
  editingQuote?: Quotation | null;
}

export default function EnhancedQuoteBuilder({ 
  customers, 
  products, 
  onSave, 
  onSaveAndEmail,
  editingQuote 
}: EnhancedQuoteBuilderProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [customerPrices, setCustomerPrices] = useState<CustomerPrice[]>([]);
  const [showPriceHistory, setShowPriceHistory] = useState<string | null>(null);

  const company = useMemo(() => getCompany(), []);

  useEffect(() => {
    if (editingQuote) {
      const customer = customers.find(c => c.id === editingQuote.customerId);
      setSelectedCustomer(customer || null);
      setItems(editingQuote.items);
      setNotes(editingQuote.notes || '');
      setValidUntil(editingQuote.validUntil);
    }
  }, [editingQuote, customers]);

  useEffect(() => {
    if (selectedCustomer) {
      setCustomerPrices(getCustomerPrices(selectedCustomer.id));
    }
  }, [selectedCustomer]);

  const getCustomerPrice = (productId: string): CustomerPrice | null => {
    return customerPrices.find(cp => 
      cp.productId === productId && 
      new Date(cp.validFrom) <= new Date() &&
      (!cp.validUntil || new Date(cp.validUntil) >= new Date())
    ) || null;
  };

  const addItem = (product: Product) => {
    const existingItem = items.find(item => item.productId === product.id);
    if (existingItem) return;

    const customerPrice = getCustomerPrice(product.id);
    const unitPrice = customerPrice?.unitPrice || product.sellingPrice;
    const unit = customerPrice?.unit || product.unit;

    const newItem: QuoteItem = {
      productId: product.id,
      quantity: 1,
      unitPrice,
      unit,
      discount: selectedCustomer?.discount || 0,
      total: unitPrice,
      customPrice: !!customerPrice
    };

    setItems([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<QuoteItem>) => {
    const newItems = [...items];
    const item = { ...newItems[index], ...updates };
    
    // Recalculate total
    const discountAmount = (item.unitPrice * item.quantity * item.discount) / 100;
    item.total = (item.unitPrice * item.quantity) - discountAmount;
    
    newItems[index] = item;
    setItems(newItems);
  };

  const saveCustomPrice = (productId: string, unitPrice: number, unit?: string) => {
    if (!selectedCustomer) return;

    const customerPrice: Omit<CustomerPrice, 'id'> = {
      customerId: selectedCustomer.id,
      productId,
      unitPrice,
      unit,
      validFrom: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveCustomerPrice(customerPrice);
    setCustomerPrices(getCustomerPrices(selectedCustomer.id));
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (company.taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSave = () => {
    if (!selectedCustomer || items.length === 0) return;

    const quotation: Omit<Quotation, 'id' | 'createdAt'> = {
      quoteNumber: editingQuote?.quoteNumber || `QUO-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      projectName: 'Project',
      items,
      subtotal,
      discount: 0,
      discountAmount: 0,
      taxRate: company.taxRate,
      taxAmount,
      total,
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      notes,
      terms: 'Payment due within 30 days'
    };

    onSave(quotation);
    
    if (!editingQuote) {
      setSelectedCustomer(null);
      setItems([]);
      setNotes('');
      setValidUntil('');
    }
  };

  const handleSaveAndEmail = () => {
    if (!selectedCustomer || !selectedCustomer.email || items.length === 0) return;

    const quotation: Omit<Quotation, 'id' | 'createdAt'> = {
      quoteNumber: editingQuote?.quoteNumber || `QUO-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      projectName: 'Project',
      items,
      subtotal,
      discount: 0,
      discountAmount: 0,
      taxRate: company.taxRate,
      taxAmount,
      total,
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'sent',
      notes,
      terms: 'Payment due within 30 days'
    };

    onSaveAndEmail?.(quotation, selectedCustomer.email);
    
    if (!editingQuote) {
      setSelectedCustomer(null);
      setItems([]);
      setNotes('');
      setValidUntil('');
    }
  };

  return (
    <div className="card">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          📋 {editingQuote ? 'Edit Quotation' : 'Professional Quotation Builder'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create professional quotations with customer-specific pricing
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Customer *
            </label>
            <select
              className="input"
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const customer = customers.find(c => c.id === e.target.value);
                setSelectedCustomer(customer || null);
                setItems([]); // Clear items when customer changes
              }}
            >
              <option value="">Choose a customer...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.company && `(${customer.company})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Valid Until
            </label>
            <input
              type="date"
              className="input"
              value={validUntil ? validUntil.split('T')[0] : ''}
              onChange={(e) => setValidUntil(e.target.value ? new Date(e.target.value).toISOString() : '')}
            />
          </div>
        </div>

        {selectedCustomer && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 dark:text-blue-400">ℹ️</span>
              <span className="font-medium text-blue-800 dark:text-blue-200">Customer Information</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Price Level:</span>
                <span className="ml-2 font-medium capitalize">{selectedCustomer.priceLevel || 'Standard'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Default Discount:</span>
                <span className="ml-2 font-medium">{selectedCustomer.discount || 0}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Terms:</span>
                <span className="ml-2 font-medium">{selectedCustomer.paymentTerms || 'Net 30'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Product Selection */}
        {selectedCustomer && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Add Products
            </label>
            <div className="grid gap-2 max-h-48 overflow-y-auto border border-border rounded-lg p-2">
              {products.map(product => {
                const customerPrice = getCustomerPrice(product.id);
                const isAdded = items.some(item => item.productId === product.id);
                
                return (
                  <div
                    key={product.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isAdded 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                        : 'bg-surface border-border hover:bg-muted'
                    }`}
                    onClick={() => !isAdded && addItem(product)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                        <div className="text-sm text-muted-foreground">Stock: {product.stock} {product.unit}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-foreground">
                          {company.currency}{customerPrice?.unitPrice.toFixed(2) || product.sellingPrice.toFixed(2)}
                        </div>
                        {customerPrice && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">Custom Price</div>
                        )}
                        <div className="text-xs text-muted-foreground">per {customerPrice?.unit || product.unit}</div>
                      </div>
                    </div>
                    {isAdded && (
                      <div className="mt-2 text-sm text-green-600 dark:text-green-400">✓ Added to quotation</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quote Items */}
        {items.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Quotation Items</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-left">Product</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Unit Price</th>
                    <th>Discount %</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;

                    return (
                      <tr key={index}>
                        <td>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.sku}</div>
                            {item.customPrice && (
                              <div className="text-xs text-blue-600 dark:text-blue-400">Custom Price</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            className="input w-20"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                          />
                        </td>
                        <td>
                          <select
                            className="input w-24"
                            value={item.unit || product.unit}
                            onChange={(e) => updateItem(index, { unit: e.target.value })}
                          >
                            <option value={product.unit}>{product.unit}</option>
                            {product.alternativeUnits?.map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="input w-24"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                            />
                            <button
                              className="btn-secondary text-xs px-2 py-1"
                              onClick={() => saveCustomPrice(product.id, item.unitPrice, item.unit)}
                              title="Save as customer price"
                            >
                              💾
                            </button>
                          </div>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="input w-20"
                            value={item.discount}
                            onChange={(e) => updateItem(index, { discount: parseFloat(e.target.value) || 0 })}
                          />
                        </td>
                        <td className="font-medium">
                          {company.currency}{item.total.toFixed(2)}
                        </td>
                        <td>
                          <button
                            className="btn-danger text-sm px-2 py-1"
                            onClick={() => removeItem(index)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Notes & Special Instructions
          </label>
          <textarea
            className="input"
            rows={3}
            placeholder="Add any special notes or instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{company.currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({company.taxRate}%):</span>
                <span className="font-medium">{company.currency}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                <span>Total:</span>
                <span>{company.currency}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!selectedCustomer || items.length === 0}
          >
            {editingQuote ? 'Update Quotation' : 'Save Quotation'}
          </button>
          
          {selectedCustomer?.email && onSaveAndEmail && (
            <button
              className="btn btn-secondary"
              onClick={handleSaveAndEmail}
              disabled={!selectedCustomer || items.length === 0}
            >
              📧 Save & Email to {selectedCustomer.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}