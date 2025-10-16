import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { listSuppliers, createSupplierPrice } from '../lib/storage';
import { getSystemSettings } from '../lib/storage-simple';
import type { Product, Supplier, BOMItem } from '../lib/types';

interface Props {
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function ProductForm({ onSave }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'bom' | 'suppliers'>('basic');
  
  const [draft, setDraft] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    unit: 'pcs',
    costPrice: 0,
    sellingPrice: 0,
    markup: 0,
    stock: 0,
    minimumStock: 0,
    maximumStock: 0,
    location: '',
    barcode: ''
  });

  const [bomItems, setBomItems] = useState<Omit<BOMItem, 'id'>[]>([]);
  const [supplierPrices, setSupplierPrices] = useState<Array<{
    supplierId: string;
    price: number;
    minimumQuantity: number;
    leadTime: number;
  }>>([]);

  useEffect(() => {
    setSuppliers(listSuppliers());
    const settings = getSystemSettings();
    setCategories(settings.categories || ['Raw Materials', 'Finished Goods', 'Components', 'Consumables', 'Tools']);
    setUnits(settings.units || ['pcs', 'kg', 'm', 'l', 'box', 'set']);
  }, []);

  // Auto-calculate markup when prices change
  useEffect(() => {
    if (draft.costPrice > 0 && draft.sellingPrice > 0) {
      const calculatedMarkup = ((draft.sellingPrice - draft.costPrice) / draft.costPrice) * 100;
      setDraft(prev => ({ ...prev, markup: calculatedMarkup }));
    }
  }, [draft.costPrice, draft.sellingPrice]);

  // Auto-calculate selling price when markup changes
  const handleMarkupChange = (markup: number) => {
    if (draft.costPrice > 0) {
      const calculatedSellingPrice = draft.costPrice * (1 + markup / 100);
      setDraft(prev => ({ ...prev, markup, sellingPrice: calculatedSellingPrice }));
    } else {
      setDraft(prev => ({ ...prev, markup }));
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'markup') {
      handleMarkupChange(Number(value));
    } else {
      setDraft(prev => ({ 
        ...prev, 
        [name]: ['costPrice', 'sellingPrice', 'stock', 'minimumStock', 'maximumStock'].includes(name) 
          ? Number(value) 
          : value 
      }));
    }
  };

  const addBOMItem = () => {
    setBomItems(prev => [...prev, { productId: '', quantity: 1, unit: 'pcs', costPrice: 0 }]);
  };

  const updateBOMItem = (index: number, field: string, value: any) => {
    setBomItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeBOMItem = (index: number) => {
    setBomItems(prev => prev.filter((_, i) => i !== index));
  };

  const addSupplierPrice = () => {
    setSupplierPrices(prev => [...prev, { supplierId: '', price: 0, minimumQuantity: 1, leadTime: 7 }]);
  };

  const updateSupplierPrice = (index: number, field: string, value: any) => {
    setSupplierPrices(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeSupplierPrice = (index: number) => {
    setSupplierPrices(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const product = {
      ...draft,
      bomItems: bomItems.length > 0 ? bomItems.map(item => ({ ...item, id: `bom-${Date.now()}-${Math.random()}` })) : undefined
    };
    
    onSave(product);
    
    // Reset form
    setDraft({
      name: '',
      sku: '',
      description: '',
      category: '',
      unit: 'pcs',
      costPrice: 0,
      sellingPrice: 0,
      markup: 0,
      stock: 0,
      minimumStock: 0,
      maximumStock: 0,
      location: '',
      barcode: ''
    });
    setBomItems([]);
    setSupplierPrices([]);
    setActiveTab('basic');
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        {[
          { key: 'basic', label: '📦 Basic Info' },
          { key: 'pricing', label: '💰 Pricing' },
          { key: 'bom', label: '🔧 Bill of Materials' },
          { key: 'suppliers', label: '🏭 Suppliers' }
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input 
                className="input" 
                name="name" 
                placeholder="Enter product name" 
                value={draft.name} 
                onChange={onChange} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
              <input 
                className="input" 
                name="sku" 
                placeholder="Product SKU/Code" 
                value={draft.sku} 
                onChange={onChange} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="input" name="category" value={draft.category} onChange={onChange}>
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measure</label>
              <select className="input" name="unit" value={draft.unit} onChange={onChange}>
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Storage Location</label>
              <input 
                className="input" 
                name="location" 
                placeholder="e.g., Warehouse A-1-B" 
                value={draft.location} 
                onChange={onChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
              <input 
                className="input" 
                name="barcode" 
                placeholder="Product barcode" 
                value={draft.barcode} 
                onChange={onChange} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              className="input h-20" 
              name="description" 
              placeholder="Product description" 
              value={draft.description} 
              onChange={onChange} 
            />
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price *</label>
              <input 
                className="input" 
                type="number" 
                step="0.01"
                name="costPrice" 
                placeholder="0.00" 
                value={draft.costPrice} 
                onChange={onChange} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price *</label>
              <input 
                className="input" 
                type="number" 
                step="0.01"
                name="sellingPrice" 
                placeholder="0.00" 
                value={draft.sellingPrice} 
                onChange={onChange} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Markup %</label>
              <input 
                className="input" 
                type="number" 
                step="0.1"
                name="markup" 
                placeholder="0.0" 
                value={draft.markup.toFixed(1)} 
                onChange={onChange} 
              />
            </div>
          </div>
          
          {/* Profit Analysis */}
          {draft.costPrice > 0 && draft.sellingPrice > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">💰 Profit Analysis</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Profit per Unit:</span>
                  <div className="font-bold text-green-600">R{(draft.sellingPrice - draft.costPrice).toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Profit Margin:</span>
                  <div className="font-bold text-green-600">{((draft.sellingPrice - draft.costPrice) / draft.sellingPrice * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Markup:</span>
                  <div className="font-bold text-green-600">{draft.markup.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Stock Levels */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
              <input 
                className="input" 
                type="number" 
                step="1"
                name="stock" 
                placeholder="0" 
                value={draft.stock || ''} 
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                  setDraft(prev => ({ ...prev, stock: Math.max(0, value) }));
                }} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock</label>
              <input 
                className="input" 
                type="number" 
                step="1"
                name="minimumStock" 
                placeholder="0" 
                value={draft.minimumStock || ''} 
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                  setDraft(prev => ({ ...prev, minimumStock: Math.max(0, value) }));
                }} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stock</label>
              <input 
                className="input" 
                type="number" 
                step="1"
                name="maximumStock" 
                placeholder="0" 
                value={draft.maximumStock || ''} 
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                  setDraft(prev => ({ ...prev, maximumStock: Math.max(0, value) }));
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* BOM Tab */}
      {activeTab === 'bom' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Bill of Materials</h3>
            <button type="button" onClick={addBOMItem} className="btn-success text-sm px-4 py-2">
              + Add Component
            </button>
          </div>
          
          {bomItems.map((item, index) => (
            <div key={index} className="grid md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg">
              <input 
                className="input" 
                placeholder="Component name" 
                value={item.productId} 
                onChange={(e) => updateBOMItem(index, 'productId', e.target.value)} 
              />
              <input 
                className="input" 
                type="number" 
                step="1"
                placeholder="Quantity" 
                value={item.quantity || ''} 
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                  updateBOMItem(index, 'quantity', Math.max(0, value));
                }} 
              />
              <select 
                className="input" 
                value={item.unit} 
                onChange={(e) => updateBOMItem(index, 'unit', e.target.value)}
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              <input 
                className="input" 
                type="number" 
                step="0.01"
                placeholder="Cost" 
                value={item.costPrice} 
                onChange={(e) => updateBOMItem(index, 'costPrice', Number(e.target.value))} 
              />
              <button 
                type="button" 
                onClick={() => removeBOMItem(index)} 
                className="btn-danger text-sm px-3 py-2"
              >
                Remove
              </button>
            </div>
          ))}
          
          {bomItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No components added. Click "Add Component" to start building your BOM.
            </div>
          )}
          
          {bomItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">📊 BOM Summary</h4>
              <div className="text-sm">
                <div>Total Components: {bomItems.length}</div>
                <div>Total BOM Cost: R{bomItems.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0).toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Supplier Prices</h3>
            <button type="button" onClick={addSupplierPrice} className="btn-success text-sm px-4 py-2">
              + Add Supplier Price
            </button>
          </div>
          
          {supplierPrices.map((item, index) => (
            <div key={index} className="grid md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg">
              <select 
                className="input" 
                value={item.supplierId} 
                onChange={(e) => updateSupplierPrice(index, 'supplierId', e.target.value)}
              >
                <option value="">Select Supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input 
                className="input" 
                type="number" 
                step="0.01"
                placeholder="Price" 
                value={item.price} 
                onChange={(e) => updateSupplierPrice(index, 'price', Number(e.target.value))} 
              />
              <input 
                className="input" 
                type="number" 
                step="1"
                placeholder="Min Qty" 
                value={item.minimumQuantity || ''} 
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                  updateSupplierPrice(index, 'minimumQuantity', Math.max(1, value));
                }} 
              />
              <input 
                className="input" 
                type="number" 
                step="1"
                placeholder="Lead Time (days)" 
                value={item.leadTime || ''} 
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                  updateSupplierPrice(index, 'leadTime', Math.max(1, value));
                }} 
              />
              <button 
                type="button" 
                onClick={() => removeSupplierPrice(index)} 
                className="btn-danger text-sm px-3 py-2"
              >
                Remove
              </button>
            </div>
          ))}
          
          {supplierPrices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No supplier prices added. Click "Add Supplier Price" to compare supplier pricing.
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button type="button" className="btn-secondary" onClick={() => {
          setDraft({
            name: '',
            sku: '',
            description: '',
            category: '',
            unit: 'pcs',
            costPrice: 0,
            sellingPrice: 0,
            markup: 0,
            stock: 0,
            minimumStock: 0,
            maximumStock: 0,
            location: '',
            barcode: ''
          });
          setBomItems([]);
          setSupplierPrices([]);
          setActiveTab('basic');
        }}>
          Reset Form
        </button>
        <button type="submit" className="btn">
          Save Product
        </button>
      </div>
    </form>
  );
}