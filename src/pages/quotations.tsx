import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import QuoteBuilder from '../components/QuoteBuilder';
import PDFExporter from '../components/PDFExporter';
import ProfessionalQuotePDF from '../components/ProfessionalQuotePDF';
import { createQuotation, listCustomers, listProducts, listQuotations, updateQuotation, createOrder, getCompany } from '../lib/storage-simple';
import { sendEmail, generateQuotationEmail } from '../lib/email';
import { me } from '../lib/auth-simple';
import type { Customer, Product, Quotation, QuoteItem } from '../lib/types';

export default function QuotationsPage() {
  const router = useRouter();
  const user = me();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOrderModal, setShowOrderModal] = useState<string | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([]);
  const [editingQuote, setEditingQuote] = useState<Quotation | null>(null);
  const [warehouseInstructions, setWarehouseInstructions] = useState('');
  const [orderPriority, setOrderPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const refresh = () => {
    setCustomers(listCustomers());
    setProducts(listProducts());
    setQuotes(listQuotations());
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role === 'warehouse') {
      router.push('/warehouse-dashboard');
      return;
    }
    refresh();
  }, [user, router]);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const company = useMemo(() => getCompany(), []);

  const filteredQuotes = useMemo(() => {
    return quotes.filter(quote => {
      const customer = customers.find(c => c.id === quote.customerId);
      
      let matchesSearch = false;
      if (searchTerm === '') {
        matchesSearch = false; // Don't show any by default
      } else if (searchTerm === ' ') {
        matchesSearch = true; // Show all when space (view all button)
      } else {
        matchesSearch = quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.id.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [quotes, customers, searchTerm, statusFilter]);

  if (!user || user.role === 'warehouse') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">This page is only available to administrators.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveAndEmail = async (quotation: Omit<Quotation, 'id' | 'createdAt'>, customerEmail: string) => {
    try {
      // Create the quotation first
      const newQuote = createQuotation(quotation);
      
      // Get customer and company details
      const customer = customers.find(c => c.id === quotation.customerId);
      const company = getCompany();
      
      if (!customer) {
        alert('Customer not found');
        return;
      }
      
      // Generate email template
      const emailTemplate = generateQuotationEmail(newQuote, customer, company, products);
      
      // Send email
      const result = await sendEmail(customerEmail, emailTemplate);
      
      if (result.success) {
        // Update quotation with email sent status
        updateQuotation(newQuote.id, {
          emailSent: true,
          emailSentAt: new Date().toISOString()
        });
        
        alert(`✅ Quotation ${quotation.quoteNumber} has been saved and sent to ${customerEmail}!`);
      } else {
        alert(`❌ Quotation saved but email failed: ${result.message}`);
      }
      
      refresh();
    } catch (error) {
      console.error('Error sending quotation email:', error);
      alert('❌ Error sending quotation email. Please try again.');
    }
  };

  const convertToOrder = (quote: Quotation, items: QuoteItem[]) => {
    const customer = customers.find(c => c.id === quote.customerId);
    if (!customer) return;

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 15;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const order = createOrder({
      quotationId: quote.id,
      quoteNumber: quote.quoteNumber,
      customerId: quote.customerId,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: 'pending',
      priority: orderPriority,
      notes: `Converted from quotation ${quote.quoteNumber}`,
      warehouseInstructions,
      orderNumber: `ORD-${Date.now()}`
    });

    // Update quotation to mark as converted
    updateQuotation(quote.id, {
      convertedToOrder: true,
      orderId: order.id,
      partialOrderItems: items.length < quote.items.length ? items : undefined
    });

    alert(`Order ${order.orderNumber} created successfully from quotation ${quote.quoteNumber}!`);
    setShowOrderModal(null);
    setSelectedItems([]);
    setWarehouseInstructions('');
    setOrderPriority('medium');
    refresh();
  };

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quotations</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredQuotes.length} of {quotes.length} quotations
          </div>
        </div>

        <QuoteBuilder 
          customers={customers}
          products={products}
          onSave={(q) => { 
            createQuotation(q);
            refresh(); 
          }}
          onSaveAndEmail={handleSaveAndEmail}
        />

        {/* Search and Filter */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔍 Search Quotations by Customer 
                <span className="text-xs text-gray-500 ml-2">Press Ctrl+K to focus</span>
              </label>
              <input
                className="input"
                placeholder="Search by customer name, quote number, or project..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📊 Filter by Status
              </label>
              <select
                className="input"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="md:w-32">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                👁️ Quick View
              </label>
              <button
                className={`btn w-full text-sm ${(searchTerm !== '' || statusFilter !== 'all') ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  if (searchTerm !== '' || statusFilter !== 'all') {
                    setSearchTerm('');
                    setStatusFilter('all');
                  } else {
                    setSearchTerm(' '); // Set to space to trigger showing all
                  }
                }}
              >
                {(searchTerm !== '' || statusFilter !== 'all') ? 'Clear' : 'View All'}
              </button>
            </div>
          </div>
        </div>

        {/* Quotations Display - Customer Grouped */}
        <div className="space-y-4">
          {searchTerm === '' && statusFilter === 'all' ? (
            <div className="card">
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-medium mb-2">Search for quotations</h3>
                <p>Enter a customer name or quote number to find quotations</p>
                <div className="mt-4 text-sm space-y-1">
                  <div>Total quotations in system: <span className="font-semibold">{quotes.length}</span></div>
                  <div className="text-xs text-gray-400">
                    💡 Try searching for customer names, companies, or project names
                  </div>
                </div>
              </div>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="card">
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium mb-2">No quotations found</h3>
                <p>No quotations match your search criteria</p>
                <p className="text-xs mt-2">Try searching for customer names, quote numbers, or project names</p>
              </div>
            </div>
          ) : (
            // Group quotations by customer
            Object.entries(
              filteredQuotes.reduce((groups, quote) => {
                const customer = customers.find(c => c.id === quote.customerId);
                const customerName = customer?.name || 'Unknown Customer';
                if (!groups[customerName]) groups[customerName] = [];
                groups[customerName].push(quote);
                return groups;
              }, {} as Record<string, typeof filteredQuotes>)
            ).map(([customerName, customerQuotes]) => (
              <div key={customerName} className="card">
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      👤 {customerName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {customerQuotes.length} quotation{customerQuotes.length !== 1 ? 's' : ''} 
                      {searchTerm === ' ' ? '' : ' found'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Total Value: R{customerQuotes.reduce((sum, q) => sum + q.total, 0).toFixed(2)}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="table text-sm">
                    <thead>
                      <tr className="text-xs">
                        <th className="text-left py-2">Quote #</th>
                        <th className="py-2">Date</th>
                        <th className="py-2">Valid Until</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Total</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerQuotes.map(q => {
                        const c = customers.find(cc => cc.id === q.customerId);
                        const isExpired = new Date(q.validUntil) < new Date();
                        
                        return (
                          <tr key={q.id} className={`${isExpired ? 'opacity-60' : ''} hover:bg-gray-50 dark:hover:bg-gray-800`}>
                            <td className="font-medium py-2">
                              <div className="flex items-center gap-1">
                                <span className="text-xs">{q.quoteNumber}</span>
                                {q.convertedToOrder && (
                                  <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2 text-xs">{new Date(q.createdAt).toLocaleDateString()}</td>
                            <td className={`py-2 text-xs ${isExpired ? 'text-red-600' : ''}`}>
                              {new Date(q.validUntil).toLocaleDateString()}
                              {isExpired && <div className="text-red-500">Expired</div>}
                            </td>
                            <td className="py-2">
                              <select
                                className="input text-xs py-1 px-2 h-7"
                                value={q.status}
                                onChange={e => { 
                                  updateQuotation(q.id, { status: e.target.value as any }); 
                                  refresh(); 
                                }}
                              >
                                <option value="draft">Draft</option>
                                <option value="sent">Sent</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                                <option value="expired">Expired</option>
                              </select>
                            </td>
                            <td className="font-medium py-2 text-xs">R{q.total.toFixed(2)}</td>
                            <td className="py-2">
                              {q.emailSent ? (
                                <span className="text-green-600 text-xs">
                                  ✓ {q.emailSentAt && new Date(q.emailSentAt).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">✗</span>
                              )}
                            </td>
                            <td className="py-2">
                              <div className="flex gap-1">
                                <button
                                  className="btn btn-secondary text-xs px-2 py-1 h-7"
                                  onClick={() => setEditingQuote(q)}
                                  title="Edit Quotation"
                                >
                                  ✏️
                                </button>
                                
                                {c && (
                                  <>
                                    <button
                                      className="btn btn-secondary text-xs px-2 py-1 h-7"
                                      onClick={() => setShowPDFPreview(q.id)}
                                      title="Professional PDF Preview"
                                    >
                                      👁️
                                    </button>
                                    <PDFExporter company={company} customer={c} quotation={q} products={products} />
                                  </>
                                )}
                                
                                {!q.convertedToOrder && q.status === 'accepted' && (
                                  <button
                                    className="btn btn-success text-xs px-2 py-1 h-7"
                                    onClick={() => {
                                      setShowOrderModal(q.id);
                                      setSelectedItems([...q.items]);
                                      setOrderPriority(q.priority || 'medium');
                                    }}
                                    title="Create Order"
                                  >
                                    📦
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Professional PDF Preview Modal */}
        {showPDFPreview && (() => {
          const quote = quotes.find(q => q.id === showPDFPreview);
          if (!quote) return null;
          
          const customer = customers.find(c => c.id === quote.customerId);
          if (!customer) return null;
          
          return (
            <ProfessionalQuotePDF
              quotation={quote}
              customer={customer}
              company={company}
              products={products}
              onClose={() => setShowPDFPreview(null)}
            />
          );
        })()}

        {/* Edit Quotation Modal */}
        {editingQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Edit Quotation {editingQuote.quoteNumber}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setEditingQuote(null)}
                >
                  ✕
                </button>
              </div>
              
              <QuoteBuilder 
                customers={customers}
                products={products}
                editingQuote={editingQuote}
                onSave={(q) => { 
                  if (editingQuote) {
                    updateQuotation(editingQuote.id, q);
                  } else {
                    createQuotation(q);
                  }
                  setEditingQuote(null);
                  refresh(); 
                }}
                onSaveAndEmail={handleSaveAndEmail}
              />
            </div>
          </div>
        )}

        {/* Order Creation Modal */}
        {showOrderModal && (() => {
          const quote = quotes.find(q => q.id === showOrderModal);
          if (!quote) return null;
          
          const customer = customers.find(c => c.id === quote.customerId);
          
          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Create Order from Quotation {quote.quoteNumber}
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => {
                      setShowOrderModal(null);
                      setSelectedItems([]);
                      setWarehouseInstructions('');
                      setOrderPriority('medium');
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Customer: <span className="font-medium">{customer?.name}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Select which items to include in the order:
                  </p>
                </div>
                
                <div className="space-y-3 mb-6">
                  {quote.items.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    const isSelected = selectedItems.some(si => si.productId === item.productId);
                    
                    return (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item]);
                            } else {
                              setSelectedItems(selectedItems.filter(si => si.productId !== item.productId));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{product?.name || 'Unknown Product'}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity} × R{item.unitPrice.toFixed(2)} = R{item.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Order Priority
                    </label>
                    <select 
                      className="input" 
                      value={orderPriority} 
                      onChange={e => setOrderPriority(e.target.value as any)}
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🟠 High Priority</option>
                      <option value="urgent">🔴 Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expected Delivery
                    </label>
                    <input
                      type="date"
                      className="input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Warehouse Instructions
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Special instructions for warehouse staff..."
                    value={warehouseInstructions}
                    onChange={e => setWarehouseInstructions(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-semibold">
                    Selected Total: R{selectedItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowOrderModal(null);
                        setSelectedItems([]);
                        setWarehouseInstructions('');
                        setOrderPriority('medium');
                      }}
                    >
                      Cancel
                    </button>
                    
                    <button
                      className="btn btn-primary"
                      disabled={selectedItems.length === 0}
                      onClick={() => convertToOrder(quote, selectedItems)}
                    >
                      Create Order ({selectedItems.length} items)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </Layout>
  );
}