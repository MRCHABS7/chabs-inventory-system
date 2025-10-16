import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductForm from '../components/ProductForm';
import BulkProductImport from '../components/BulkProductImport';
import InventoryView from '../components/InventoryView';
import { createProduct, deleteProduct, listProducts } from '../lib/storage-simple';
import type { Product } from '../lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  
  const refresh = () => setProducts(listProducts());
  useEffect(() => { refresh(); }, []);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📦 Products</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="btn btn-secondary"
            >
              {showBulkImport ? '📝 Single Product' : '📦 Bulk Import'}
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>
        
        {showBulkImport ? (
          <BulkProductImport onSave={(products) => {
            products.forEach(product => {
              createProduct({ id: '', ...product } as any);
            });
            refresh();
          }} />
        ) : (
          <ProductForm onSave={(draft) => { createProduct({ id: '', ...draft } as any); refresh(); }} />
        )}
        
        {/* Search and Filter */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔍 Search Products (e.g., "h" or "powerskirt") 
                <span className="text-xs text-gray-500 ml-2">Press Ctrl+K to focus</span>
              </label>
              <input
                className="input"
                placeholder="Type to search products by name, SKU, or description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📂 Filter by Category
              </label>
              <select
                className="input"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="md:w-32">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                👁️ Quick View
              </label>
              <button
                className={`btn w-full text-sm ${viewAll ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  if (viewAll) {
                    setViewAll(false);
                    setSearchTerm('');
                    setCategoryFilter('all');
                  } else {
                    setViewAll(true);
                    setSearchTerm('');
                    setCategoryFilter('all');
                  }
                }}
              >
                {viewAll ? 'Hide All' : 'View All'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Results Section - Only show when searching, filtering, or viewing all */}
        {searchTerm === '' && categoryFilter === 'all' && !viewAll ? (
          <div className="card">
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium mb-2">Search for products</h3>
              <p>Start typing to search through your {products.length} products</p>
              <div className="mt-4 text-sm">
                Try searching for: "h", "powerskirt", or any product name
              </div>
            </div>
          </div>
        ) : (
          <>
            <InventoryView products={filteredProducts} />
            
            <div className="card">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  {viewAll ? 'All Products' : 'Search Results'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredProducts.length === 0 
                    ? `No products found matching your criteria`
                    : viewAll 
                      ? `Showing all ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
                      : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p>Try adjusting your search terms or category filter</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2">Product Name</th>
                        <th className="py-2">SKU</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Stock</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => {
                        const isLowStock = p.stock <= p.minimumStock;
                        const isOutOfStock = p.stock === 0;
                        
                        return (
                          <tr key={p.id} className={`${isOutOfStock ? 'opacity-60' : ''} hover:bg-gray-50 dark:hover:bg-gray-800`}>
                            <td className="text-left font-medium py-2">
                              <div className="truncate max-w-48" title={p.name}>
                                {p.name}
                              </div>
                            </td>
                            <td className="font-mono text-xs py-2">{p.sku}</td>
                            <td className="py-2 text-xs">
                              <div className="truncate max-w-24" title={p.category}>
                                {p.category}
                              </div>
                            </td>
                            <td className="py-2 text-xs font-medium">R{typeof p.sellingPrice === 'number' ? p.sellingPrice.toFixed(2) : '0.00'}</td>
                            <td className={`py-2 text-xs ${isLowStock ? 'text-orange-600 font-medium' : ''}`}>{p.stock || 0}</td>
                            <td className="py-2">
                              {isOutOfStock ? (
                                <span className="px-1 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                                  ✗ Out
                                </span>
                              ) : isLowStock ? (
                                <span className="px-1 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                                  ⚠ Low
                                </span>
                              ) : (
                                <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                  ✓ OK
                                </span>
                              )}
                            </td>
                            <td className="py-2">
                              <div className="flex gap-1">
                                <button className="btn-secondary text-xs px-2 py-1 h-7">✏️</button>
                                <button 
                                  className="btn-danger text-sm px-3 py-1" 
                                  onClick={() => { deleteProduct(p.id); refresh(); }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
