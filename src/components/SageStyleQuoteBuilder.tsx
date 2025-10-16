import React, { useState, useEffect } from 'react';
import { Product, Customer, QuoteItem, Quotation } from '../lib/types';
import { getProducts, getCustomers, saveQuotation, getCustomerPricing } from '../lib/storage-simple';
import { useBranding } from '../contexts/BrandingContext';
import { me } from '../lib/auth-simple';

interface QuoteBuilderProps {
  onQuoteSaved?: (quote: Quotation) => void;
}

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({ onQuoteSaved }) => {
  const { branding } = useBranding();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [projectName, setProjectName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [showPriceHistory, setShowPriceHistory] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [requestedBy, setRequestedBy] = useState('');
  const [itemSearch, setItemSearch] = useState<{[key: number]: string}>({});
  const [descriptionSearch, setDescriptionSearch] = useState<{[key: number]: string}>({});
  const [notes, setNotes] = useState('');
  const [membershipText, setMembershipText] = useState('MEMBER OF THE GALVANISING ASSOCIATION OF SOUTH AFRICA');
  const [vatRate, setVatRate] = useState(15);

  useEffect(() => {
    setCustomers(getCustomers());
    setProducts(getProducts());
    const currentUser = me();
    setUser(currentUser);
    setRequestedBy(currentUser?.firstName && currentUser?.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser?.email || '');
  }, []);

  const addNewLine = () => {
    setItems([...items, {
      productId: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'piece',
      discount: 0,
      total: 0
    }]);
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'productId' && value) {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].unitPrice = product.sellingPrice;
        newItems[index].unit = product.unit;

      }
    }
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  const deleteLine = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getPriceHistory = (productId: string) => {
    return getCustomerPricing(productId);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (discount / 100);
  const netTotal = subtotal - discountAmount;
  const vatAmount = netTotal * (vatRate / 100);
  const total = netTotal + vatAmount;

  const saveQuote = () => {
    if (!selectedCustomer || !quoteNumber || !projectName) {
      alert('Please fill in all required fields');
      return;
    }

    const quote: Quotation = {
      id: Date.now().toString(),
      quoteNumber,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      projectName,
      items: items.filter(item => item.productId),
      subtotal,
      discount,
      discountAmount,
      taxRate: vatRate,
      taxAmount: vatAmount,
      total,
      status: 'draft',
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes,
  
      companyDetails: {
        name: branding.companyName,
        email: branding.companyEmail,
        phone: branding.companyPhone,
        address: branding.companyAddress,
        contactPerson: user?.name || requestedBy,
        contactEmail: user?.email || ''
      },
      colors: {
        primary: branding.primaryColor,
        secondary: branding.secondaryColor,
        accent: branding.accentColor
      }
    };

    saveQuotation(quote);
    onQuoteSaved?.(quote);
    
    setItems([]);
    setQuoteNumber('');
    setProjectName('');
    setDiscount(0);
    setSelectedCustomer(null);
    setItemSearch({});
    setDescriptionSearch({});
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
      {/* Header Toolbar */}
      <div className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2">
        <div className="flex items-center space-x-2">
          <button onClick={saveQuote} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
            Save
          </button>
          <button onClick={addNewLine} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            New Line
          </button>
        </div>
      </div>

      {/* Quote Header */}
      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-300 dark:border-gray-600">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Number</label>
            <input
              type="text"
              value={quoteNumber}
              onChange={(e) => setQuoteNumber(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Quote Number"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Requested By</label>
            <input
              type="text"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Requested By"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Project Name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const customer = customers.find(c => c.id === e.target.value);
                setSelectedCustomer(customer || null);
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
            >
              <option value="">Select a Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={new Date().toISOString().split('T')[0]}
              readOnly
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Discount (%)</label>
            <input
              type="number"
              value={discount || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                setDiscount(Math.min(100, Math.max(0, value)));
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-2 py-2 text-left border-r border-gray-300 dark:border-gray-600 w-12">Line</th>
              <th className="px-2 py-2 text-left border-r border-gray-300 dark:border-gray-600 w-20">Item</th>
              <th className="px-2 py-2 text-left border-r border-gray-300 dark:border-gray-600">Item Description</th>

              <th className="px-2 py-2 text-left border-r border-gray-300 dark:border-gray-600 w-20">Qty</th>
              <th className="px-2 py-2 text-left border-r border-gray-300 dark:border-gray-600 w-24">Unit Price</th>
              <th className="px-2 py-2 text-left border-r border-gray-300 dark:border-gray-600 w-24">Line Total</th>
              <th className="px-2 py-2 text-left w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const product = products.find(p => p.id === item.productId);
              return (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-2 py-2 border-r border-gray-300 dark:border-gray-600 text-center">
                    {index + 1}
                  </td>
                  <td className="px-2 py-2 border-r border-gray-300 dark:border-gray-600">
                    <input
                      type="text"
                      value={itemSearch[index] || (product?.sku || '')}
                      onChange={(e) => {
                        setItemSearch({...itemSearch, [index]: e.target.value});
                        const foundProduct = products.find(p => 
                          p.sku.toLowerCase().includes(e.target.value.toLowerCase()) ||
                          p.name.toLowerCase().includes(e.target.value.toLowerCase())
                        );
                        if (foundProduct && e.target.value === foundProduct.sku) {
                          updateItem(index, 'productId', foundProduct.id);
                        }
                      }}
                      onFocus={() => {
                        if (!itemSearch[index]) {
                          setItemSearch({...itemSearch, [index]: product?.sku || ''});
                        }
                      }}
                      className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 focus:border focus:border-blue-500 rounded"
                      placeholder="Search item..."
                      list={`items-${index}`}
                    />
                    <datalist id={`items-${index}`}>
                      {products
                        .filter(p => 
                          !itemSearch[index] || 
                          p.sku.toLowerCase().includes(itemSearch[index].toLowerCase()) ||
                          p.name.toLowerCase().includes(itemSearch[index].toLowerCase())
                        )
                        .map(product => (
                          <option key={product.id} value={product.sku}>{product.sku} - {product.name}</option>
                        ))
                      }
                    </datalist>
                  </td>
                  <td className="px-2 py-2 border-r border-gray-300 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={descriptionSearch[index] || (product?.name || '')}
                        onChange={(e) => {
                          setDescriptionSearch({...descriptionSearch, [index]: e.target.value});
                          const foundProduct = products.find(p => 
                            p.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                            p.sku.toLowerCase().includes(e.target.value.toLowerCase())
                          );
                          if (foundProduct && e.target.value === foundProduct.name) {
                            updateItem(index, 'productId', foundProduct.id);
                            setItemSearch({...itemSearch, [index]: foundProduct.sku});
                          }
                        }}
                        onFocus={() => {
                          if (!descriptionSearch[index]) {
                            setDescriptionSearch({...descriptionSearch, [index]: product?.name || ''});
                          }
                        }}
                        className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 focus:border focus:border-blue-500 rounded"
                        placeholder="Search description..."
                        list={`descriptions-${index}`}
                      />
                      <datalist id={`descriptions-${index}`}>
                        {products
                          .filter(p => 
                            !descriptionSearch[index] || 
                            p.name.toLowerCase().includes(descriptionSearch[index].toLowerCase()) ||
                            p.sku.toLowerCase().includes(descriptionSearch[index].toLowerCase())
                          )
                          .map(product => (
                            <option key={product.id} value={product.name}>{product.name} - {product.sku}</option>
                          ))
                        }
                      </datalist>
                      {item.productId && (
                        <button
                          onClick={() => setShowPriceHistory(showPriceHistory === item.productId ? null : item.productId)}
                          className="text-blue-600 hover:text-blue-800 text-xs ml-2 flex-shrink-0"
                          title="View Price History"
                        >
                          📊
                        </button>
                      )}
                    </div>
                    {showPriceHistory === item.productId && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded text-xs">
                        <div className="font-medium mb-1">Last Price Per Customer:</div>
                        {(() => {
                          const priceHistory = getPriceHistory(item.productId);
                          const lastPricePerCustomer = priceHistory.reduce((acc, pricing) => {
                            if (!acc[pricing.customerName] || new Date(pricing.date) > new Date(acc[pricing.customerName].date)) {
                              acc[pricing.customerName] = pricing;
                            }
                            return acc;
                          }, {} as Record<string, any>);
                          
                          return Object.values(lastPricePerCustomer).map((pricing: any, i) => (
                            <div key={i} className="flex justify-between">
                              <span>{pricing.customerName}</span>
                              <span>R{pricing.price} ({pricing.date})</span>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </td>

                  <td className="px-2 py-2 border-r border-gray-300 dark:border-gray-600">
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        updateItem(index, 'quantity', value);
                      }}
                      className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 focus:border focus:border-blue-500 rounded text-right"
                      min="0"
                      step="1"
                    />
                  </td>
                  <td className="px-2 py-2 border-r border-gray-300 dark:border-gray-600">
                    {editingPrice === `${index}-price` ? (
                      <input
                        type="number"
                        value={item.unitPrice || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                          updateItem(index, 'unitPrice', value);
                        }}
                        onBlur={() => setEditingPrice(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingPrice(null)}
                        className="w-full px-1 py-1 text-xs border border-blue-500 rounded text-right"
                        min="0"
                        step="0.01"
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => setEditingPrice(`${index}-price`)}
                        className="w-full px-1 py-1 text-xs cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded text-right"
                      >
                        R{item.unitPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2 border-r border-gray-300 dark:border-gray-600 text-right">
                    R{item.total.toFixed(2)}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => deleteLine(index)}
                      className="text-red-600 hover:text-red-800 text-xs"
                      title="Delete Line"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-300 dark:border-gray-600">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount ({discount}%):</span>
              <span>-R{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Net Total:</span>
              <span>R{netTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT ({vatRate}%):</span>
              <span>R{vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total Incl VAT:</span>
              <span>R{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes and Footer */}
      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-300 dark:border-gray-600 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
            rows={3}
            placeholder="Additional notes or terms..."
          />
        </div>

      </div>
    </div>
  );
};