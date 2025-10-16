import { useRef } from 'react';
import type { Quotation, Customer, CompanyDetails, Product } from '../lib/types';
import { me } from '../lib/auth-simple';
import { useBranding } from '../contexts/BrandingContext';

interface ProfessionalQuotePDFProps {
  quotation: Quotation;
  customer: Customer;
  company: CompanyDetails;
  products: Product[];
  onClose: () => void;
}

export default function ProfessionalQuotePDF({ quotation, customer, company, products, onClose }: ProfessionalQuotePDFProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const user = me();
  const { branding } = useBranding();

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore React functionality
    }
  };

  const handleDownloadPDF = () => {
    // This would integrate with a PDF library like jsPDF or Puppeteer
    // For now, we'll use the browser's print to PDF functionality
    handlePrint();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Action Buttons */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Quotation Preview</h2>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="btn btn-secondary">
              🖨️ Print
            </button>
            <button onClick={handleDownloadPDF} className="btn btn-primary">
              📄 Download PDF
            </button>
            <button onClick={onClose} className="btn btn-danger">
              ✕ Close
            </button>
          </div>
        </div>

        {/* Quotation Content */}
        <div ref={printRef} className="p-8">
          <style jsx>{`
            @media print {
              body { margin: 0; }
              .no-print { display: none !important; }
            }
            .quotation-container {
              max-width: 800px;
              margin: 0 auto;
              border: 2px solid #333;
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
            }
            .header-section {
              display: flex;
              border-bottom: 2px solid #333;
            }
            .company-info {
              flex: 1;
              padding: 20px;
              background: #fff;
            }
            .company-name {
              font-size: 18px;
              font-weight: bold;
              color: ${branding.primaryColor};
              margin-bottom: 10px;
            }
            .company-details {
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              font-weight: 500;
            }
            .quotation-title {
              flex: 1;
              padding: 20px;
              text-align: center;
              background: #fff;
              border-left: 2px solid #333;
            }
            .quotation-title h1 {
              font-size: 24px;
              color: ${branding.primaryColor};
              margin: 0 0 10px 0;
            }
            .customer-quote-section {
              display: flex;
              border-bottom: 2px solid #333;
            }
            .customer-info {
              flex: 1;
              padding: 15px 20px;
            }
            .quote-info {
              flex: 1;
              padding: 15px 20px;
              border-left: 2px solid #333;
              text-align: right;
            }
            .section-label {
              font-weight: bold;
              font-size: 12px;
              margin-bottom: 5px;
            }
            .info-line {
              font-size: 12px;
              margin-bottom: 3px;
              color: #000;
              font-weight: 500;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }
            .items-header {
              background: ${branding.primaryColor};
              color: white;
            }
            .items-header th {
              padding: 8px 6px;
              text-align: center;
              font-weight: bold;
              border-right: 1px solid #fff;
            }
            .items-table td {
              padding: 6px;
              border-bottom: 1px solid #ddd;
              border-right: 1px solid #ddd;
              text-align: center;
            }
            .items-table td:first-child {
              text-align: left;
            }
            .items-table td:last-child {
              text-align: right;
              font-weight: bold;
            }
            .totals-section {
              display: flex;
            }
            .notes-section {
              flex: 1;
              padding: 15px 20px;
            }
            .totals-column {
              width: 200px;
              border-left: 2px solid #333;
            }
            .total-row {
              display: flex;
              padding: 5px 15px;
              border-bottom: 1px solid #ddd;
              font-size: 11px;
            }
            .total-row.final {
              background: #333;
              color: white;
              font-weight: bold;
            }
            .total-label {
              flex: 1;
              text-align: right;
              margin-right: 10px;
            }
            .total-amount {
              width: 80px;
              text-align: right;
            }
            .terms-list {
              font-size: 10px;
              line-height: 1.4;
              margin: 10px 0;
              padding-left: 15px;
            }
            .terms-list li {
              margin-bottom: 3px;
            }
            .footer-section {
              text-align: center;
              padding: 15px;
              border-top: 2px solid #333;
              font-size: 10px;
              background: #f8f9fa;
            }
          `}</style>

          <div className="quotation-container">
            {/* Header Section */}
            <div className="header-section">
              <div className="company-info">
                <div className="company-name">{company.name.toUpperCase()}</div>
                <div className="company-details">
                  {company.taxNumber && (
                    <>Registration No: {company.taxNumber}<br /></>
                  )}
                  {company.address && (
                    <>{company.address}<br /></>
                  )}
                  {company.phone && (
                    <>Tel No: {company.phone}<br /></>
                  )}
                  {company.email && (
                    <>Email: {company.email}<br /></>
                  )}
                  {company.website && (
                    <>Website: {company.website}</>
                  )}
                </div>
              </div>
              <div className="quotation-title">
                <h1>QUOTATION</h1>
              </div>
            </div>

            {/* Customer and Quote Info Section */}
            <div className="customer-quote-section">
              <div className="customer-info">
                <div className="section-label">CUSTOMER: {quotation.customerDetails?.company || quotation.customerDetails?.name || customer.company || customer.name}</div>
                <div className="info-line" style={{display: 'flex'}}>
                  <span style={{width: '60px', fontWeight: 'bold'}}>ATT:</span>
                  <span>{quotation.customerDetails?.contactPerson || customer.contactPerson || 'N/A'}</span>
                </div>
                {(quotation.customerDetails?.phone || customer.phone) && (
                  <div className="info-line" style={{display: 'flex'}}>
                    <span style={{width: '60px', fontWeight: 'bold'}}>CELL:</span>
                    <span>{quotation.customerDetails?.phone || customer.phone}</span>
                  </div>
                )}
                {(quotation.customerDetails?.email || customer.email) && (
                  <div className="info-line" style={{display: 'flex'}}>
                    <span style={{width: '60px', fontWeight: 'bold'}}>EMAIL:</span>
                    <span>{quotation.customerDetails?.email || customer.email}</span>
                  </div>
                )}
                <div className="info-line" style={{display: 'flex'}}>
                  <span style={{width: '60px', fontWeight: 'bold'}}>PROJECT:</span>
                  <span>{quotation.projectName || 'General Quote'}</span>
                </div>
              </div>
              <div className="quote-info">
                <div className="info-line" style={{display: 'flex', justifyContent: 'space-between'}}>
                  <strong>QUOTE #:</strong> 
                  <span>{quotation.quoteNumber}</span>
                </div>
                <div className="info-line" style={{display: 'flex', justifyContent: 'space-between'}}>
                  <strong>DATE:</strong> 
                  <span>{new Date(quotation.createdAt).toLocaleDateString('en-ZA')}</span>
                </div>
                <div className="info-line" style={{display: 'flex', justifyContent: 'space-between'}}>
                  <strong>FROM:</strong> 
                  <span>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'System User'}</span>
                </div>
                {quotation.priority && (
                  <div className="info-line" style={{display: 'flex', justifyContent: 'space-between'}}>
                    <strong>PRIORITY:</strong> 
                    <span style={{textTransform: 'uppercase'}}>{quotation.priority}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="info-line" style={{display: 'flex', justifyContent: 'space-between'}}>
                    <strong>CELL:</strong> 
                    <span>{company.phone}</span>
                  </div>
                )}
                {user?.email && (
                  <div className="info-line" style={{display: 'flex', justifyContent: 'space-between'}}>
                    <strong>EMAIL:</strong> 
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <table className="items-table">
              <thead className="items-header">
                <tr>
                  <th style={{ width: '8%' }}>ITEM NO</th>
                  <th style={{ width: '8%' }}>QTY</th>
                  <th style={{ width: '40%' }}>DESCRIPTION</th>
                  <th style={{ width: '8%' }}>FINISH</th>
                  <th style={{ width: '8%' }}>UNIT</th>
                  <th style={{ width: '12%' }}>UNIT PRICE</th>
                  <th style={{ width: '16%' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => {
                  const discountAmount = item.unitPrice * item.quantity * (item.discount / 100);
                  const lineTotal = (item.unitPrice * item.quantity) - discountAmount;
                  return (
                    <>
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.quantity}</td>
                        <td style={{ textAlign: 'left' }}>
                          {(() => {
                            const product = products.find(p => p.id === item.productId);
                            return product ? product.name : `Product ${item.productId}`;
                          })()}
                        </td>
                        <td>
                          {(item as any).finish || 'PG'}
                        </td>
                        <td>
                          {(() => {
                            const product = products.find(p => p.id === item.productId);
                            return product ? product.unit : 'EA';
                          })()}
                        </td>
                        <td>R{item.unitPrice.toFixed(2)}</td>
                        <td>R {lineTotal.toFixed(2)}</td>
                      </tr>
                      {item.discount > 0 && (
                        <tr key={`${index}-discount`} style={{ color: '#666', fontStyle: 'italic' }}>
                          <td></td>
                          <td></td>
                          <td style={{ textAlign: 'left' }}>Discount ({item.discount}%)</td>
                          <td></td>
                          <td></td>
                          <td>-R{discountAmount.toFixed(2)}</td>
                          <td></td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>

            {/* Totals and Notes Section */}
            <div className="totals-section">
              <div className="notes-section">
                <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' }}>Notes:</div>
                <div style={{ fontSize: '10px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                  {branding.quotationNotes}
                </div>
                {quotation.terms && (
                  <div style={{ fontSize: '10px', marginTop: '10px' }}>
                    <strong>Additional Terms:</strong><br />
                    {quotation.terms}
                  </div>
                )}
              </div>
              <div className="totals-column">
                <div className="total-row">
                  <div className="total-label">SUB TOT:</div>
                  <div className="total-amount">R {quotation.subtotal.toFixed(2)}</div>
                </div>
                <div className="total-row">
                  <div className="total-label">VAT:</div>
                  <div className="total-amount">R {quotation.taxAmount.toFixed(2)}</div>
                </div>
                <div className="total-row final">
                  <div className="total-label">TOTAL:</div>
                  <div className="total-amount">R {quotation.total.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer-section">
              {branding.membershipText && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', background: branding.primaryColor, marginRight: '10px' }}></div>
                  <div style={{ fontWeight: 'bold', color: '#000' }}>{branding.membershipText}</div>
                </div>
              )}
              <div style={{ textAlign: 'center', fontSize: '8px', color: '#ccc', marginTop: '10px' }}>
                Powered by CHABS System
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}