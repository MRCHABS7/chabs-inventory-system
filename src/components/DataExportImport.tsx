import { useState } from 'react';
import { listProducts, listOrders, listCustomers, listSuppliers } from '../lib/storage-simple';

interface ExportData {
  products: any[];
  orders: any[];
  customers: any[];
  suppliers: any[];
  exportDate: string;
  version: string;
}

export default function DataExportImport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const exportData = async () => {
    setIsExporting(true);
    try {
      const data: ExportData = {
        products: listProducts(),
        orders: listOrders(),
        customers: listCustomers(),
        suppliers: listSuppliers(),
        exportDate: new Date().toISOString(),
        version: '2.0.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chabs-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = (dataType: 'products' | 'orders' | 'customers' | 'suppliers') => {
    let data: any[] = [];
    let filename = '';

    switch (dataType) {
      case 'products':
        data = listProducts();
        filename = 'products';
        break;
      case 'orders':
        data = listOrders();
        filename = 'orders';
        break;
      case 'customers':
        data = listCustomers();
        filename = 'customers';
        break;
      case 'suppliers':
        data = listSuppliers();
        filename = 'suppliers';
        break;
    }

    if (data.length === 0) {
      alert(`No ${dataType} data to export.`);
      return;
    }

    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle nested objects and arrays
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = async () => {
    if (!importFile) {
      alert('Please select a file to import.');
      return;
    }

    setIsImporting(true);
    try {
      const text = await importFile.text();
      const data: ExportData = JSON.parse(text);

      // Validate data structure
      if (!data.products || !data.orders || !data.customers || !data.suppliers) {
        throw new Error('Invalid backup file format');
      }

      // Confirm import
      const confirmed = confirm(
        `This will replace all current data with the backup from ${new Date(data.exportDate).toLocaleDateString()}. Are you sure?`
      );

      if (!confirmed) {
        setIsImporting(false);
        return;
      }

      // Import data
      localStorage.setItem('chabs_products', JSON.stringify(data.products));
      localStorage.setItem('chabs_orders', JSON.stringify(data.orders));
      localStorage.setItem('chabs_customers', JSON.stringify(data.customers));
      localStorage.setItem('chabs_suppliers', JSON.stringify(data.suppliers));

      alert('Data imported successfully! Please refresh the page.');
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📤 Export Data</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Complete Backup</h3>
            <p className="text-sm text-gray-600 mb-3">
              Export all your data as a JSON backup file that can be imported later.
            </p>
            <button
              onClick={exportData}
              disabled={isExporting}
              className="btn btn-primary"
              aria-label="Export complete backup"
            >
              {isExporting ? '⏳ Exporting...' : '📦 Export Complete Backup'}
            </button>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">CSV Exports</h3>
            <p className="text-sm text-gray-600 mb-3">
              Export individual data types as CSV files for use in spreadsheet applications.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => exportToCSV('products')}
                className="btn btn-secondary"
                aria-label="Export products to CSV"
              >
                📦 Products CSV
              </button>
              <button
                onClick={() => exportToCSV('orders')}
                className="btn btn-secondary"
                aria-label="Export orders to CSV"
              >
                🚚 Orders CSV
              </button>
              <button
                onClick={() => exportToCSV('customers')}
                className="btn btn-secondary"
                aria-label="Export customers to CSV"
              >
                👥 Customers CSV
              </button>
              <button
                onClick={() => exportToCSV('suppliers')}
                className="btn btn-secondary"
                aria-label="Export suppliers to CSV"
              >
                🏭 Suppliers CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📥 Import Data</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Import a previously exported JSON backup file. This will replace all current data.
            </p>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="input flex-1"
                aria-label="Select backup file to import"
              />
              <button
                onClick={importData}
                disabled={!importFile || isImporting}
                className="btn btn-primary"
                aria-label="Import selected backup file"
              >
                {isImporting ? '⏳ Importing...' : '📥 Import Backup'}
              </button>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <div>
                <h4 className="font-medium text-yellow-800">Important Notice</h4>
                <p className="text-sm text-yellow-700">
                  Importing data will completely replace all existing data. Make sure to export your current data first if you want to keep it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}