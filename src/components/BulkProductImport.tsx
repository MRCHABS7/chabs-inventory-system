import { useState, useEffect } from 'react';
import type { Product } from '../lib/types';
import { getSystemSettings } from '../lib/storage-simple';

interface Props {
  onSave: (products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

type ProductRow = {
  name: string;
  sku: string;
  description: string;
  category: string;
  unit: string;
  finish: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  maximumStock: number;
  location: string;
  barcode: string;
};

export default function BulkProductImport({ onSave }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [finishes, setFinishes] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([{
    name: '',
    sku: '',
    description: '',
    category: '',
    unit: 'pcs',
    finish: '',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minimumStock: 0,
    maximumStock: 0,
    location: '',
    barcode: ''
  }]);

  useEffect(() => {
    const settings = getSystemSettings();
    setCategories(settings.categories || ['Raw Materials', 'Finished Goods', 'Components', 'Consumables', 'Tools']);
    setUnits(settings.units || ['pcs', 'kg', 'm', 'l', 'box', 'set']);
    setFinishes(settings.finishes || ['PG', 'RAW', 'GAL', 'POW', 'SS']);
  }, []);

  const addRow = () => {
    setProducts([...products, {
      name: '',
      sku: '',
      description: '',
      category: '',
      unit: 'pcs',
      finish: '',
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
      minimumStock: 0,
      maximumStock: 0,
      location: '',
      barcode: ''
    }]);
  };

  const removeRow = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const updateProduct = (index: number, field: keyof ProductRow, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleSave = () => {
    const validProducts = products.filter(p => p.name.trim() && p.sku.trim());
    if (validProducts.length === 0) {
      alert('Please fill in at least Name and SKU for each product');
      return;
    }

    const finalProducts = validProducts.map(product => ({
      ...product,
      markup: product.costPrice > 0 && product.sellingPrice > 0 
        ? ((product.sellingPrice - product.costPrice) / product.costPrice) * 100 
        : 0
    }));

    onSave(finalProducts);
    setProducts([{
      name: '',
      sku: '',
      description: '',
      category: '',
      unit: 'pcs',
      finish: '',
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
      minimumStock: 0,
      maximumStock: 0,
      location: '',
      barcode: ''
    }]);
    alert(`Successfully imported ${finalProducts.length} products!`);
  };



  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          📦 Bulk Product Import - Table Format
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addRow}
            className="btn btn-primary text-sm"
          >
            ➕ Add Row
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-success text-sm"
          >
            ✅ Import {products.filter(p => p.name.trim() && p.sku.trim()).length} Products
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 How to use Table Import</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Fill in each row with product information</li>
          <li>• Name and SKU are required fields</li>
          <li>• Click "Add Row" to add more products</li>
          <li>• Click "Remove" to delete unwanted rows</li>
          <li>• Click "Import Products" when ready</li>
        </ul>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left w-4">#</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-32">Name *</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-24">SKU *</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-40">Description</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-28">Category</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-20">Unit</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-20">Finish</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-24">Cost Price</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-24">Sell Price</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-20">Stock</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-20">Min Stock</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-20">Max Stock</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-24">Location</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-left min-w-24">Barcode</th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs font-medium text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center text-xs">
                  {index + 1}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(index, 'name', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded"
                    placeholder="Product name"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="text"
                    value={product.sku}
                    onChange={(e) => updateProduct(index, 'sku', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded"
                    placeholder="SKU"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="text"
                    value={product.description}
                    onChange={(e) => updateProduct(index, 'description', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded"
                    placeholder="Description"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <select
                    value={product.category}
                    onChange={(e) => updateProduct(index, 'category', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded"
                  >
                    <option value="">Select</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <select
                    value={product.unit}
                    onChange={(e) => updateProduct(index, 'unit', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <select
                    value={product.finish}
                    onChange={(e) => updateProduct(index, 'finish', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded"
                  >
                    <option value="">Select</option>
                    {finishes.map(finish => (
                      <option key={finish} value={finish}>{finish}</option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="number"
                    step="0.01"
                    value={product.costPrice || ''}
                    onChange={(e) => updateProduct(index, 'costPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded text-right"
                    placeholder="0.00"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="number"
                    step="0.01"
                    value={product.sellingPrice || ''}
                    onChange={(e) => updateProduct(index, 'sellingPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded text-right"
                    placeholder="0.00"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="number"
                    step="1"
                    value={product.stock || ''}
                    onChange={(e) => updateProduct(index, 'stock', parseInt(e.target.value) || 0)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded text-right"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="number"
                    step="1"
                    value={product.minimumStock || ''}
                    onChange={(e) => updateProduct(index, 'minimumStock', parseInt(e.target.value) || 0)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded text-right"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="number"
                    step="1"
                    value={product.maximumStock || ''}
                    onChange={(e) => updateProduct(index, 'maximumStock', parseInt(e.target.value) || 0)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded text-right"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="text"
                    value={product.location}
                    onChange={(e) => updateProduct(index, 'location', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded"
                    placeholder="A-1-B"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1">
                  <input
                    type="text"
                    value={product.barcode}
                    onChange={(e) => updateProduct(index, 'barcode', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:bg-white dark:focus:bg-gray-700 rounded"
                    placeholder="123456"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    disabled={products.length === 1}
                    className="text-red-600 hover:text-red-800 text-xs px-1 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove row"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total rows: {products.length} | Valid products: {products.filter(p => p.name.trim() && p.sku.trim()).length}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={addRow}
            className="btn btn-secondary"
          >
            ➕ Add Row
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={products.filter(p => p.name.trim() && p.sku.trim()).length === 0}
            className="btn btn-primary"
          >
            ✅ Import Products
          </button>
        </div>
      </div>
    </div>
  );
}