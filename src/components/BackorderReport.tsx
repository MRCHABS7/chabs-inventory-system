import { useState, useMemo } from 'react';
import { listBackorders, listCustomers, listQuotations } from '../lib/storage-simple';
import type { BackorderItem, Customer, Quotation } from '../lib/types';

export default function BackorderReport() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  const backorders = useMemo(() => listBackorders(), []);
  const customers = useMemo(() => listCustomers(), []);
  const quotations = useMemo(() => listQuotations(), []);

  const filteredBackorders = useMemo(() => {
    if (selectedCustomer === 'all') return backorders;
    return backorders.filter(b => b.customerId === selectedCustomer);
  }, [backorders, selectedCustomer]);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getQuoteNumber = (orderId: string) => {
    const quotation = quotations.find(q => q.orderId === orderId);
    return quotation?.quoteNumber || 'N/A';
  };

  const handlePrint = () => {
    const printContent = document.getElementById('backorder-report')?.innerHTML;
    if (printContent) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b5cf6; margin-bottom: 10px;">BACKORDER REPORT</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            ${selectedCustomer !== 'all' ? `<p>Customer: ${getCustomerName(selectedCustomer)}</p>` : '<p>All Customers</p>'}
          </div>
          ${printContent}
          <div style="text-align: center; margin-top: 30px; font-size: 8px; color: #ccc;">
            Powered by CHABS System
          </div>
        </div>
      `;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Backorder Report</h2>
        <div className="flex gap-3">
          <select
            className="input"
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
          >
            <option value="all">All Customers</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print Report
          </button>
        </div>
      </div>

      <div id="backorder-report" className="card">
        {filteredBackorders.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No backorders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Quote #</th>
                  <th>Order #</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Priority</th>
                  <th>Expected Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBackorders.map(backorder => (
                  <tr key={backorder.id}>
                    <td className="font-medium">{getCustomerName(backorder.customerId)}</td>
                    <td>{getQuoteNumber(backorder.orderId)}</td>
                    <td>{backorder.orderId}</td>
                    <td>{backorder.productId}</td>
                    <td>{backorder.quantity}</td>
                    <td>R{backorder.unitPrice.toFixed(2)}</td>
                    <td>R{(backorder.quantity * backorder.unitPrice).toFixed(2)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        backorder.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        backorder.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        backorder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {backorder.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>{backorder.expectedDate ? new Date(backorder.expectedDate).toLocaleDateString() : 'TBD'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        backorder.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                        backorder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {backorder.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card bg-gray-50 dark:bg-gray-800/50 p-4">
        <h3 className="font-semibold mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600 dark:text-gray-400">Total Backorders</div>
            <div className="font-semibold">{filteredBackorders.length}</div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Total Value</div>
            <div className="font-semibold">
              R{filteredBackorders.reduce((sum, b) => sum + (b.quantity * b.unitPrice), 0).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Urgent Items</div>
            <div className="font-semibold text-red-600">
              {filteredBackorders.filter(b => b.priority === 'urgent').length}
            </div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Customers Affected</div>
            <div className="font-semibold">
              {new Set(filteredBackorders.map(b => b.customerId)).size}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}