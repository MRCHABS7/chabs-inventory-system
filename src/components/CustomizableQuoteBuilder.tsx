import React, { useState, useEffect } from 'react';
import { Product, Customer, QuoteItem, Quotation } from '../lib/types';
import { getProducts, getCustomers, saveQuotation, getCustomerPricing } from '../lib/storage-simple';
import { useBranding } from '../contexts/BrandingContext';
import { me } from '../lib/auth-simple';

interface CustomizableQuoteBuilderProps {
  onQuoteSaved?: (quote: Quotation) => void;
}

export const CustomizableQuoteBuilder: React.FC<CustomizableQuoteBuilderProps> = ({ onQuoteSaved }) => {
  const { branding } = useBranding();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [projectName, setProjectName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; productId: string } | null>(null);
  const [customerPricing, setCustomerPricing] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setCustomers(getCustomers());
    setProducts(getProducts());
    setUser(me());
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product: Product) => {
    const existingItem = items.find(item => item.productId === product.id);
    if (existingItem) {
      setItems(items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setItems([...items, {
        productId: product.id,
        quantity: 1,
        unitPrice: product.sellingPrice,
        unit: product.unit,
        discount: 0,
        total: product.sellingPrice
      }]);
    }
    setSearchTerm('');
    setShowProductSearch(false);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(items.map(item =>
      item.productId === productId
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const handleRightClick = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    const pricing = getCustomerPricing(productId);
    setCustomerPricing(pricing);
    setContextMenu({ x: e.clientX, y: e.clientY, productId });
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

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
      items,
      subtotal,
      discount,
      discountAmount,
      taxRate: 15,
      taxAmount: total * 0.15,
      total,
      status: 'draft',
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      companyDetails: {
        name: branding.companyName,
        email: branding.companyEmail,
        phone: branding.companyPhone,
        address: branding.companyAddress,
        contactPerson: user ? `${user.name}` : '',
        contactEmail: user ? user.email : ''
      },
      colors: {
        primary: branding.primaryColor,
        secondary: branding.secondaryColor,
        accent: branding.accentColor
      }
    };

    saveQuotation(quote);
    onQuoteSaved?.(quote);
    
    // Reset form
    setItems([]);
    setQuoteNumber('');
    setProjectName('');
    setDiscount(0);
    setSelectedCustomer(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Quotation</h2>
      
      {/* Company Info Display */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>{branding.companyName}</strong><br/>
            {branding.companyEmail}<br/>
            {branding.companyPhone}
          </div>
          <div>
            {branding.companyAddress}
          </div>
        </div>
      </div>
      
      {/* Header Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Quote Number *</label>
          <input
            type="text"
            value={quoteNumber}
            onChange={(e) => setQuoteNumber(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter quote number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Project Name *</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter project name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Customer *</label>
          <select
            value={selectedCustomer?.id || ''}
            onChange={(e) => {
              const customer = customers.find(c => c.id === e.target.value);
              setSelectedCustomer(customer || null);
            }}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Search */}
      <div className="mb-6">
        <button
          onClick={() => setShowProductSearch(!showProductSearch)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showProductSearch ? 'Hide' : 'Add'} Products
        </button>
        
        {showProductSearch && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full p-2 border rounded-md mb-4 dark:bg-gray-600 dark:border-gray-500"
            />
            
            <div className="max-h-60 overflow-y-auto">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => addItem(product)}
                  className="p-3 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    SKU: {product.sku} | Price: R{product.sellingPrice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quote Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Quote Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Product</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Qty</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Unit Price</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Total</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <tr key={item.productId}>
                    <td 
                      className="border border-gray-300 dark:border-gray-600 p-2"
                      onContextMenu={(e) => handleRightClick(e, item.productId)}
                    >
                      {product?.name || 'Unknown Product'}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      <input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                          updateQuantity(item.productId, Math.max(0, value));
                        }}
                        className="w-16 p-1 border rounded dark:bg-gray-700 text-center"
                        min="0"
                        step="1"
                      />
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      R{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      R{item.total.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:text-red-800"
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

      {/* Discount and Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Discount (%)</label>
          <input
            type="number"
            value={discount || ''}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
              setDiscount(Math.min(100, Math.max(0, value)));
            }}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>R{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount ({discount}%):</span>
            <span>-R{discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>R{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={saveQuote}
        className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
      >
        Save Quotation
      </button>

      {/* Context Menu for Customer Pricing */}
      {contextMenu && (
        <div
          className="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-4 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={() => setContextMenu(null)}
        >
          <h4 className="font-semibold mb-2">Previous Customer Pricing</h4>
          {customerPricing.length > 0 ? (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {customerPricing.map((pricing, index) => (
                <div key={index} className="text-sm p-2 bg-gray-100 dark:bg-gray-600 rounded">
                  <div className="font-medium">{pricing.customerName}</div>
                  <div>R{pricing.price} - {pricing.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No previous pricing found</div>
          )}
        </div>
      )}
    </div>
  );
};