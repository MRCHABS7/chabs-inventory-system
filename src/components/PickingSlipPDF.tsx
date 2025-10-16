import { forwardRef } from 'react';
import { useBranding } from '../contexts/BrandingContext';
import type { Order, Product, Customer } from '../lib/types';

interface PickingSlipPDFProps {
  order: Order;
  customer: Customer;
  products: Product[];
  company?: { name: string };
  onPrint?: () => void;
  onDownload?: () => void;
}

const PickingSlipPDF = forwardRef<HTMLDivElement, PickingSlipPDFProps>(
  ({ order, customer, products, company, onPrint, onDownload }, ref) => {
    const { branding } = useBranding();
    
    const getProductDetails = (productId: string) => {
      return products.find(p => p.id === productId);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    };

    return (
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6 no-print">
          <button
            onClick={onPrint}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <span>🖨️</span>
            <span>Print</span>
          </button>
          <button
            onClick={onDownload}
            className="btn btn-primary flex items-center space-x-2"
          >
            <span>📄</span>
            <span>Download PDF</span>
          </button>
        </div>

        {/* Picking Slip Content */}
        <div ref={ref} className="bg-white p-8 shadow-lg print:shadow-none print:p-0">
          <style jsx>{`
            @media print {
              .no-print { display: none !important; }
              .print\\:shadow-none { box-shadow: none !important; }
              .print\\:p-0 { padding: 0 !important; }
              body { -webkit-print-color-adjust: exact; }
              .page-break { page-break-before: always; }
            }
            
            .picking-slip {
              font-family: 'Arial', sans-serif;
              color: #000;
              line-height: 1.4;
            }
            
            .header {
              border-bottom: 3px solid ${branding.primaryColor};
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .company-info {
              text-align: center;
              margin-bottom: 20px;
            }
            
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: ${branding.primaryColor};
              margin-bottom: 5px;
            }
            
            .document-title {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              color: #1f2937;
              margin: 20px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .info-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            
            .info-box {
              border: 1px solid #e5e7eb;
              padding: 15px;
              border-radius: 8px;
              background-color: #f9fafb;
            }
            
            .info-title {
              font-weight: bold;
              color: #374151;
              margin-bottom: 10px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .info-line {
              margin-bottom: 5px;
              font-size: 14px;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            
            .items-table th,
            .items-table td {
              border: 1px solid #d1d5db;
              padding: 12px 8px;
              text-align: left;
              font-size: 13px;
            }
            
            .items-table th {
              background-color: #8b5cf6;
              color: white;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .items-table tr:nth-child(even) {
              background-color: #f9fafb;
            }
            
            .priority-urgent {
              background-color: #fee2e2;
              color: #dc2626;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
              font-size: 12px;
            }
            
            .priority-high {
              background-color: #fef3c7;
              color: #d97706;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
              font-size: 12px;
            }
            
            .priority-normal {
              background-color: #e0f2fe;
              color: #0369a1;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
              font-size: 12px;
            }
            
            .footer {
              border-top: 2px solid #e5e7eb;
              padding-top: 20px;
              margin-top: 40px;
            }
            
            .signature-section {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 40px;
              margin-top: 40px;
            }
            
            .signature-box {
              text-align: center;
              border-top: 1px solid #9ca3af;
              padding-top: 10px;
            }
            
            .notes-section {
              margin-top: 30px;
              border: 1px solid #d1d5db;
              padding: 15px;
              border-radius: 8px;
              background-color: #f9fafb;
            }
          `}</style>

          <div className="picking-slip">
            {/* Header */}
            <div className="header">
              <div className="company-info">
                <div className="company-name">{company?.name || 'COMPANY NAME'}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Warehouse Operations
                </div>
              </div>
              
              <div className="document-title">PICKING SLIP</div>
              
              <div className="info-section">
                <div className="info-box">
                  <div className="info-title">Order Information</div>
                  <div className="info-line"><strong>Order #:</strong> {order.orderNumber}</div>
                  {order.quoteNumber && (
                    <div className="info-line"><strong>Quote #:</strong> {order.quoteNumber}</div>
                  )}
                  <div className="info-line"><strong>Date:</strong> {formatDate(order.createdAt)}</div>
                  <div className="info-line"><strong>Status:</strong> {order.status.toUpperCase()}</div>
                  <div className="info-line">
                    <strong>Priority:</strong> 
                    <span className={`priority-${order.priority || 'normal'}`}>
                      {(order.priority || 'normal').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="info-box">
                  <div className="info-title">Customer Details</div>
                  <div className="info-line"><strong>Name:</strong> {customer.name}</div>
                  {customer.email && (
                    <div className="info-line"><strong>Email:</strong> {customer.email}</div>
                  )}
                  {customer.phone && (
                    <div className="info-line"><strong>Phone:</strong> {customer.phone}</div>
                  )}
                  {customer.address && (
                    <div className="info-line"><strong>Address:</strong> {customer.address}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className="items-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Item #</th>
                  <th style={{ width: '15%' }}>SKU</th>
                  <th style={{ width: '35%' }}>Product Name</th>
                  <th style={{ width: '10%' }}>Qty Ordered</th>
                  <th style={{ width: '10%' }}>Qty Picked</th>
                  <th style={{ width: '20%' }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => {
                  const product = getProductDetails(item.productId);
                  return (
                    <tr key={item.productId}>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {index + 1}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {product?.sku || 'N/A'}
                      </td>
                      <td>
                        <div style={{ fontWeight: 'bold' }}>{product?.name || 'Unknown Product'}</div>
                        {product?.description && (
                          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                            {product.description}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                        {item.quantity}
                      </td>
                      <td style={{ textAlign: 'center', border: '2px solid #8b5cf6', backgroundColor: '#f3f4f6' }}>
                        {/* Empty cell for manual entry */}
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {product?.location || 'TBD'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              <div className="info-box">
                <div className="info-title">Picking Summary</div>
                <div className="info-line"><strong>Total Items:</strong> {order.items.length}</div>
                <div className="info-line">
                  <strong>Total Quantity:</strong> {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
                <div className="info-line"><strong>Order Value:</strong> R{order.total.toFixed(2)}</div>
              </div>
              
              <div className="info-box">
                <div className="info-title">Warehouse Instructions</div>
                <div style={{ minHeight: '60px', fontSize: '12px', color: '#6b7280' }}>
                  {order.warehouseInstructions || order.notes || 'No special instructions'}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="notes-section">
              <div className="info-title">Picker Notes</div>
              <div style={{ minHeight: '80px', borderTop: '1px dotted #9ca3af', marginTop: '10px', paddingTop: '10px' }}>
                {/* Empty space for manual notes */}
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              <div className="signature-section">
                <div className="signature-box">
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Picked By</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Date: _______________
                  </div>
                </div>
                
                <div className="signature-box">
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Checked By</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Date: _______________
                  </div>
                </div>
                
                <div className="signature-box">
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Packed By</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Date: _______________
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '8px', color: '#ccc' }}>
                Powered by CHABS System - {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PickingSlipPDF.displayName = 'PickingSlipPDF';

export default PickingSlipPDF;