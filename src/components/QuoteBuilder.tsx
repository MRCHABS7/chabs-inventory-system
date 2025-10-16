import { useMemo, useState, useEffect } from 'react';
import { getCustomerPriceHistory, createCustomerPrice } from '../lib/storage-simple';
import type { Customer, Product, Quotation, CustomerPrice } from '../lib/types';

// Product Search Input Component
function ProductSearchInput({ 
  products, 
  selectedProductId, 
  onProductSelect, 
  placeholder = "Search products..." 
}: {
  products: Product[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  placeholder?: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  useEffect(() => {
    if (selectedProduct) {
      setDisplayValue(`${selectedProduct.name} - R${selectedProduct.sellingPrice.toFixed(2)}`);
      setSearchTerm('');
    } else {
      setDisplayValue('');
    }
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term)) ||
      (product.category && product.category.toLowerCase().includes(term))
    ).sort((a, b) => {
      // Prioritize name matches over other matches
      const aNameMatch = a.name.toLowerCase().includes(term);
      const bNameMatch = b.name.toLowerCase().includes(term);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return a.name.localeCompare(b.name);
    }).slice(0, 15); // Show more results
  }, [products, searchTerm]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setDisplayValue(value);
    setIsOpen(value.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleProductSelect = (product: Product) => {
    onProductSelect(product.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputFocus = () => {
    if (!selectedProductId) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    onProductSelect('');
    setDisplayValue('');
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex">
        <input
          type="text"
          className="input flex-1"
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          autoComplete="off"
        />
        {selectedProductId && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 px-2 py-1 text-red-600 hover:text-red-800 text-sm"
          >
            ✕
          </button>
        )}
      </div>
      
      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="p-2 border-b bg-gray-50 dark:bg-gray-700">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </div>
          </div>
          {filteredProducts.map((product) => {
            const isLowStock = product.stock <= (product.minimumStock || 0);
            const isOutOfStock = product.stock === 0;
            
            return (
              <button
                key={product.id}
                type="button"
                className="w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-gray-700 border-b last:border-b-0 transition-colors"
                onClick={() => handleProductSelect(product)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {product.name}
                      {isOutOfStock && (
                        <span className="px-1 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                          Out of Stock
                        </span>
                      )}
                      {isLowStock && !isOutOfStock && (
                        <span className="px-1 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                          Low Stock
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      SKU: {product.sku} | Stock: {product.stock} {product.unit}
                      {product.category && ` | ${product.category}`}
                    </div>
                    {product.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                        {product.description}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 text-right">
                    <div className="font-semibold text-green-600">R{product.sellingPrice.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">per {product.unit}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      
      {isOpen && searchTerm && filteredProducts.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-3">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            No products found for "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
}

type ItemDraft = { 
  productId: string; 
  quantity: number; 
  customPrice?: number; 
  discount?: number;
  description?: string;
  unit?: string;
  finish?: string;
};

export default function QuoteBuilder({
  customers,
  products,
  onSave,
  onSaveAndEmail,
  editingQuote,
}: {
  customers: Customer[];
  products: Product[];
  onSave: (q: Omit<Quotation, 'id' | 'createdAt'>) => void;
  onSaveAndEmail?: (q: Omit<Quotation, 'id' | 'createdAt'>, customerEmail: string) => void;
  editingQuote?: Quotation;
}) {
  const [customerId, setCustomerId] = useState<string>('');
  const [customQuoteNumber, setCustomQuoteNumber] = useState<string>('');
  const [items, setItems] = useState<ItemDraft[]>([]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(`1. NETT Prices excluding VAT, Customs Duties, or any other statutory levies.
2. Prices are valid for 45 days, subject to SEIFSA escalation.
3. Settlement discount of 2.5% on payment within 30days from statement.
4. Delivery time as per your requirements days from receipt of order.
5. Prices include free delivery to the site.`);
  const [showPriceHistory, setShowPriceHistory] = useState<{[key: string]: boolean}>({});

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    company: '',
    contactPerson: '',
    email: '',
    alternativeEmails: [''],
    phone: '',
    address: ''
  });
  const [projectName, setProjectName] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingQuote) {
      setCustomerId(editingQuote.customerId);
      setCustomQuoteNumber(editingQuote.quoteNumber);
      setNotes(editingQuote.notes || '');
      setTerms(editingQuote.terms || terms);

      setProjectName(editingQuote.projectName || '');
      
      if (editingQuote.customerDetails) {
        setCustomerDetails({
          name: editingQuote.customerDetails.name || '',
          company: editingQuote.customerDetails.company || '',
          contactPerson: editingQuote.customerDetails.contactPerson || '',
          email: editingQuote.customerDetails.email || '',
          alternativeEmails: editingQuote.customerDetails.alternativeEmails || [''],
          phone: editingQuote.customerDetails.phone || '',
          address: editingQuote.customerDetails.address || ''
        });
      } else {
        const customer = customers.find(c => c.id === editingQuote.customerId);
        if (customer) {
          setCustomerDetails({
            name: customer.name,
            company: customer.company || '',
            contactPerson: customer.contactPerson || '',
            email: customer.email || '',
            alternativeEmails: [''],
            phone: customer.phone || '',
            address: customer.address || ''
          });
        }
      }
      
      const editItems = editingQuote.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        customPrice: item.unitPrice,
        discount: item.discount || 0,
        description: (item as any).description || '',
        unit: (item as any).unit || 'EA',
        finish: (item as any).finish || 'PG'
      }));
      setItems(editItems);
    }
  }, [editingQuote, customers]);

  const addItem = () => setItems(prev => [...prev, { 
    productId: products[0]?.id ?? '', 
    quantity: 1, 
    discount: 0,
    unit: 'EA',
    finish: 'PG'
  }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, patch: Partial<ItemDraft>) => setItems(prev => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const total = useMemo(() => items.reduce((sum, it) => {
    const p = products.find(pp => pp.id === it.productId);
    const price = it.customPrice ?? p?.sellingPrice ?? 0;
    return sum + price * (it.quantity || 0);
  }, 0), [items, products]);

  const buildQuotation = () => {
    const quoteItems = items.map(i => {
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
        unit: i.unit || p?.unit || 'EA',
        finish: i.finish || 'PG'
      };
    });

    const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 15; // Default South African VAT rate
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    return {
      quoteNumber: customQuoteNumber || `QUO-${Date.now()}`,
      customerId,
      customerName: customerDetails.name || customerDetails.company || '',
      projectName,

      customerDetails,
      items: quoteItems,
      subtotal,
      discount: 0,
      discountAmount: 0,
      taxRate,
      taxAmount,
      total: totalAmount,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      status: 'draft' as const,
      notes,
      terms
    };
  };

  const save = () => {
    if (!customerDetails.name && !customerDetails.company) return alert('Enter customer name or company');
    if (!items.length) return alert('Add at least one item');
    
    const quotation = buildQuotation();
    
    // Save customer price history for custom prices
    if (customerId) {
      items.forEach(item => {
        if (item.customPrice && item.productId) {
          createCustomerPrice({
            customerId,
            productId: item.productId,
            unitPrice: item.customPrice,
            unit: item.unit || 'EA',
            validFrom: new Date().toISOString()
          });
        }
      });
    }
    
    onSave(quotation);
    if (!editingQuote) resetForm();
  };

  const saveAndEmail = () => {
    if (!customerDetails.name && !customerDetails.company) return alert('Enter customer name or company');
    if (!items.length) return alert('Add at least one item');
    if (!customerDetails.email) return alert('Customer must have an email address');
    
    const quotation = buildQuotation();
    
    // Save customer price history for custom prices
    if (customerId) {
      items.forEach(item => {
        if (item.customPrice && item.productId) {
          createCustomerPrice({
            customerId,
            productId: item.productId,
            unitPrice: item.customPrice,
            unit: item.unit || 'EA',
            validFrom: new Date().toISOString()
          });
        }
      });
    }
    
    if (onSaveAndEmail) {
      onSaveAndEmail(quotation, customerDetails.email);
    }
    if (!editingQuote) resetForm();
  };

  const resetForm = () => {
    setCustomerId('');
    setCustomQuoteNumber('');
    setItems([]);
    setNotes('');
    setTerms(`1. NETT Prices excluding VAT, Customs Duties, or any other statutory levies.
2. Prices are valid for 45 days, subject to SEIFSA escalation.
3. Settlement discount of 2.5% on payment within 30days from statement.
4. Delivery time as per your requirements days from receipt of order.
5. Prices include free delivery to the site.`);
    setShowPriceHistory({});

    setProjectName('');
    setCustomerDetails({
      name: '',
      company: '',
      contactPerson: '',
      email: '',
      alternativeEmails: [''],
      phone: '',
      address: ''
    });
  };
  

  const selectedCustomer = customers.find(c => c.id === customerId);

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
        📋 New Quotation
      </h2>

      {/* Customer Selection and Basic Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Customer (Optional)</label>
          <select className="input" value={customerId} onChange={e => {
            setCustomerId(e.target.value);
            const customer = customers.find(c => c.id === e.target.value);
            if (customer) {
              setCustomerDetails({
                name: customer.name,
                company: customer.company || '',
                contactPerson: customer.contactPerson || '',
                email: customer.email || '',
                alternativeEmails: [''],
                phone: customer.phone || '',
                address: customer.address || ''
              });
            }
          }}>
            <option value="">New Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.email ? `(${c.email})` : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quote Number (Optional)</label>
          <input 
            className="input" 
            placeholder="Leave empty for auto-generation" 
            value={customQuoteNumber} 
            onChange={e => setCustomQuoteNumber(e.target.value)} 
          />
        </div>
      </div>

      {/* Customer Details - Compressed */}
      <div className="card bg-gray-50 dark:bg-gray-800/50 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Customer Details</h3>
          <button 
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={() => {
              const section = document.getElementById('customer-details-expanded');
              if (section) {
                section.style.display = section.style.display === 'none' ? 'block' : 'none';
              }
            }}
          >
            Toggle Details
          </button>
        </div>
        
        {/* Essential Fields - Always Visible */}
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Customer/Company *</label>
            <input 
              className="input text-sm" 
              placeholder="Customer or company name" 
              value={customerDetails.name || customerDetails.company} 
              onChange={e => {
                if (customerDetails.name) {
                  setCustomerDetails({...customerDetails, name: e.target.value});
                } else {
                  setCustomerDetails({...customerDetails, company: e.target.value});
                }
              }} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email *</label>
            <input 
              className="input text-sm" 
              type="email"
              placeholder="Primary email" 
              value={customerDetails.email} 
              onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Project Name</label>
            <input 
              className="input text-sm" 
              placeholder="Project name" 
              value={projectName} 
              onChange={e => setProjectName(e.target.value)} 
            />
          </div>
        </div>

        {/* Expanded Details - Collapsible */}
        <div id="customer-details-expanded" style={{ display: 'none' }} className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Customer Name</label>
              <input 
                className="input text-sm" 
                placeholder="Individual customer name" 
                value={customerDetails.name} 
                onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Company Name</label>
              <input 
                className="input text-sm" 
                placeholder="Company name" 
                value={customerDetails.company} 
                onChange={e => setCustomerDetails({...customerDetails, company: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Contact Person</label>
              <input 
                className="input text-sm" 
                placeholder="Contact person" 
                value={customerDetails.contactPerson} 
                onChange={e => setCustomerDetails({...customerDetails, contactPerson: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
              <input 
                className="input text-sm" 
                placeholder="Phone number" 
                value={customerDetails.phone} 
                onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Alternative Emails</label>
            {customerDetails.alternativeEmails.map((email, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input 
                  className="input text-sm flex-1" 
                  type="email"
                  placeholder={`Alternative email ${index + 1}`}
                  value={email} 
                  onChange={e => {
                    const newEmails = [...customerDetails.alternativeEmails];
                    newEmails[index] = e.target.value;
                    setCustomerDetails({...customerDetails, alternativeEmails: newEmails});
                  }} 
                />
                {index > 0 && (
                  <button 
                    type="button"
                    className="btn btn-danger px-2 py-1 text-xs"
                    onClick={() => {
                      const newEmails = customerDetails.alternativeEmails.filter((_, i) => i !== index);
                      setCustomerDetails({...customerDetails, alternativeEmails: newEmails});
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button"
              className="btn btn-secondary text-xs px-3 py-1"
              onClick={() => setCustomerDetails({...customerDetails, alternativeEmails: [...customerDetails.alternativeEmails, '']})}
            >
              + Add Alternative Email
            </button>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Address</label>
            <textarea 
              className="input text-sm" 
              rows={2}
              placeholder="Customer address" 
              value={customerDetails.address} 
              onChange={e => setCustomerDetails({...customerDetails, address: e.target.value})} 
            />
          </div>
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
          
          // Get customer price history for this product
          const priceHistory = customerId && product ? getCustomerPriceHistory(customerId, product.id) : [];
          const historyKey = `${i}-${it.productId}`;
          
          return (
            <div key={i} className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
              {/* First Row - Product Selection and Basic Info */}
              <div className="grid md:grid-cols-4 gap-3">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Product - Type to search (e.g., "h" or "powerskirt")
                  </label>
                  <ProductSearchInput
                    products={products}
                    selectedProductId={it.productId}
                    onProductSelect={(productId) => updateItem(i, { productId })}
                    placeholder="Start typing product name..."
                  />
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
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Unit</label>
                  <select 
                    className="input" 
                    value={it.unit || 'EA'} 
                    onChange={e => updateItem(i, { unit: e.target.value })}
                  >
                    <option value="EA">EA (Each)</option>
                    <option value="L">L (Litre)</option>
                    <option value="M">M (Metre)</option>
                    <option value="KG">KG (Kilogram)</option>
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="SET">SET (Set)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Finish</label>
                  <select 
                    className="input" 
                    value={it.finish || 'PG'} 
                    onChange={e => updateItem(i, { finish: e.target.value })}
                  >
                    <option value="PG">PG (Primer Grey)</option>
                    <option value="RAW">RAW (Raw Material)</option>
                    <option value="GAL">GAL (Galvanized)</option>
                    <option value="POW">POW (Powder Coated)</option>
                    <option value="SS">SS (Stainless Steel)</option>
                  </select>
                </div>
              </div>

              {/* Second Row - Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                <input 
                  className="input" 
                  type="text"
                  placeholder={product?.description || product?.name || "Enter item description"}
                  value={it.description || ''} 
                  onChange={e => updateItem(i, { description: e.target.value })} 
                />
              </div>

              {/* Third Row - Pricing with History */}
              <div className="grid md:grid-cols-5 gap-3">
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Unit Price (R)</label>
                    {priceHistory.length > 0 && (
                      <button
                        type="button"
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => setShowPriceHistory({...showPriceHistory, [historyKey]: !showPriceHistory[historyKey]})}
                      >
                        📊 History ({priceHistory.length})
                      </button>
                    )}
                  </div>
                  <input 
                    className="input font-semibold text-green-600" 
                    type="number" 
                    step="0.01"
                    placeholder={product ? `${product.sellingPrice.toFixed(2)}` : '0.00'} 
                    value={it.customPrice ?? ''} 
                    onChange={e => updateItem(i, { customPrice: e.target.value ? Number(e.target.value) : undefined })} 
                  />
                  {product && !it.customPrice && (
                    <div className="text-xs text-gray-500 mt-1">
                      Default: R{product.sellingPrice.toFixed(2)}
                    </div>
                  )}
                  
                  {/* Price History Dropdown */}
                  {showPriceHistory[historyKey] && priceHistory.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      <div className="p-2 border-b bg-gray-50 dark:bg-gray-700">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Previous Quotes for this Customer</div>
                      </div>
                      {priceHistory.slice(0, 5).map((ph, idx) => (
                        <button
                          key={ph.id}
                          type="button"
                          className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0"
                          onClick={() => {
                            updateItem(i, { customPrice: ph.unitPrice });
                            setShowPriceHistory({...showPriceHistory, [historyKey]: false});
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-green-600">R{ph.unitPrice.toFixed(2)}</span>
                            <span className="text-xs text-gray-500">{new Date(ph.createdAt).toLocaleDateString()}</span>
                          </div>
                          {idx === 0 && <div className="text-xs text-blue-600">Most Recent</div>}
                        </button>
                      ))}
                      {priceHistory.length > 5 && (
                        <div className="p-2 text-xs text-gray-500 text-center">
                          +{priceHistory.length - 5} more quotes
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Discount (%)</label>
                  <input 
                    className="input" 
                    type="number" 
                    min="0"
                    max="100"
                    step="0.1"
                    value={it.discount ?? 0} 
                    onChange={e => updateItem(i, { discount: Number(e.target.value) || 0 })} 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subtotal (R)</label>
                  <div className="input bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {subtotalBeforeDiscount.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Discount (R)</label>
                  <div className="input bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    -{discountAmount.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Line Total (R)</label>
                  <div className="input bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-semibold">
                    {lineTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <div className="flex justify-end">
                <button 
                  className="btn btn-danger" 
                  type="button" 
                  onClick={() => removeItem(i)}
                >
                  🗑️ Remove Item
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes and Terms */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
          <textarea 
            className="input h-24" 
            placeholder="Internal notes (optional)" 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Terms & Conditions</label>
          <textarea 
            className="input h-24" 
            placeholder="Payment terms and conditions" 
            value={terms} 
            onChange={e => setTerms(e.target.value)} 
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
            <button className="btn btn-secondary" type="button" onClick={save}>
              💾 Save Draft
            </button>
            
            {customerDetails.email && onSaveAndEmail && (
              <button className="btn btn-primary" type="button" onClick={saveAndEmail}>
                📧 Save & Email
              </button>
            )}
          </div>
        </div>
        
        {!customerDetails.email && (
          <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            ⚠️ Customer email required for direct sending
          </div>
        )}
      </div>
    </div>
  );
}