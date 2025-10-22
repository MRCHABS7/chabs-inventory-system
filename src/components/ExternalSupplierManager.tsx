import { useState, useEffect } from 'react';
import { listSuppliers, createSupplier, deleteSupplier } from '../lib/storage-simple';
import type { Supplier, ExternalProcess } from '../lib/types';

export default function ExternalSupplierManager() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    paymentTerms: ''
  });

  const [processData, setProcessData] = useState({
    processType: '',
    description: '',
    leadTime: 0,
    costPerUnit: 0,
    minimumQuantity: 1
  });

  useEffect(() => {
    setSuppliers(listSuppliers());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSupplier) {
      // Update existing supplier
      const updatedSuppliers = suppliers.map(s => 
        s.id === editingSupplier.id 
          ? { ...s, ...formData }
          : s
      );
      setSuppliers(updatedSuppliers);
      localStorage.setItem('chabs_suppliers', JSON.stringify(updatedSuppliers));
    } else {
      // Create new supplier
      const newSupplier = createSupplier(formData);
      setSuppliers([newSupplier, ...suppliers]);
    }

    resetForm();
  };

  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProcess: ExternalProcess = {
      id: `proc_${Date.now()}`,
      supplierId: selectedSupplierId,
      ...processData,
      currency: 'ZAR',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add process to supplier's external processes
    const updatedSuppliers = suppliers.map(supplier => {
      if (supplier.id === selectedSupplierId) {
        return {
          ...supplier,
          externalProcesses: [...(supplier.externalProcesses || []), newProcess]
        };
      }
      return supplier;
    });

    setSuppliers(updatedSuppliers);
    localStorage.setItem('chabs_suppliers', JSON.stringify(updatedSuppliers));
    
    setProcessData({
      processType: '',
      description: '',
      leadTime: 0,
      costPerUnit: 0,
      minimumQuantity: 1
    });
    setShowProcessForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      paymentTerms: ''
    });
    setEditingSupplier(null);
    setShowForm(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setFormData({
      name: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      contactPerson: supplier.contactPerson || '',
      paymentTerms: supplier.paymentTerms || ''
    });
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      deleteSupplier(id);
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">External Suppliers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage external suppliers and processing services</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowProcessForm(true)}
            className="btn btn-secondary"
          >
            ⚙️ Add Process
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Add Supplier
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{suppliers.length}</p>
            </div>
            <div className="text-3xl">🏭</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Processes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {suppliers.reduce((acc, s) => acc + (s.externalProcesses?.length || 0), 0)}
              </p>
            </div>
            <div className="text-3xl">⚙️</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {suppliers.length}
              </p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Processes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {suppliers.reduce((acc, s) => acc + (s.externalProcesses?.length || 0), 0)}
              </p>
            </div>
            <div className="text-3xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Supplier Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  className="input min-h-[80px]"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Terms
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Net 30"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingSupplier ? 'Update' : 'Create'} Supplier
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Process Form Modal */}
      {showProcessForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Add External Process
            </h2>
            
            <form onSubmit={handleAddProcess} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supplier *
                </label>
                <select
                  required
                  className="input"
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Process Type *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g., Painting, Coating, Assembly"
                  value={processData.processType}
                  onChange={(e) => setProcessData({ ...processData, processType: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  className="input min-h-[80px]"
                  value={processData.description}
                  onChange={(e) => setProcessData({ ...processData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lead Time (days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={processData.leadTime}
                    onChange={(e) => setProcessData({ ...processData, leadTime: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost per Unit (R)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input"
                    value={processData.costPerUnit}
                    onChange={(e) => setProcessData({ ...processData, costPerUnit: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="input"
                  value={processData.minimumQuantity}
                  onChange={(e) => setProcessData({ ...processData, minimumQuantity: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Add Process
                </button>
                <button
                  type="button"
                  onClick={() => setShowProcessForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suppliers List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Suppliers</h2>
        </div>

        {suppliers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏭</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No suppliers yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first external supplier to get started</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Add Supplier
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Processes</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{supplier.name}</div>
                        {supplier.address && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">{supplier.address}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {supplier.contactPerson && (
                          <div className="text-gray-900 dark:text-white">{supplier.contactPerson}</div>
                        )}
                        {supplier.email && (
                          <div className="text-gray-600 dark:text-gray-400">{supplier.email}</div>
                        )}
                        {supplier.phone && (
                          <div className="text-gray-600 dark:text-gray-400">{supplier.phone}</div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {supplier.externalProcesses?.length || 0} processes
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}