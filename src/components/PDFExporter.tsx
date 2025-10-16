import { useRef } from 'react';
import type { CompanyDetails, Customer, Product, Quotation } from '../lib/types';

export default function PDFExporter({ company, customer, quotation, products }: { company: CompanyDetails; customer: Customer; quotation: Quotation; products: Product[] }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (printRef.current) {
      const printContent = `
        <html>
          <head>
            <title>Quotation ${quotation.quoteNumber}</title>
            <style>
              body { margin: 0; font-family: Arial, sans-serif; }
              .quotation-container { max-width: 800px; margin: 0 auto; border: 2px solid #333; font-size: 12px; line-height: 1.4; }
              .header-section { display: flex; border-bottom: 2px solid #333; }
              .company-info { flex: 1; padding: 20px; background: #fff; }
              .company-name { font-size: 18px; font-weight: bold; color: #ff6600; margin-bottom: 10px; }
              .quotation-title { flex: 1; padding: 20px; text-align: center; background: #fff; border-left: 2px solid #333; }
              .quotation-title h1 { font-size: 24px; color: #ff6600; margin: 0 0 10px 0; }
              .customer-quote-section { display: flex; border-bottom: 2px solid #333; }
              .customer-info { flex: 1; padding: 15px 20px; }
              .quote-info { flex: 1; padding: 15px 20px; border-left: 2px solid #333; text-align: right; }
              .items-table { width: 100%; border-collapse: collapse; font-size: 11px; }
              .items-header { background: #ff6600; color: white; }
              .items-header th { padding: 8px 6px; text-align: center; font-weight: bold; border-right: 1px solid #fff; }
              .items-table td { padding: 6px; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; text-align: center; }
              .totals-section { display: flex; }
              .notes-section { flex: 1; padding: 15px 20px; }
              .totals-column { width: 200px; border-left: 2px solid #333; }
              .total-row { display: flex; padding: 5px 15px; border-bottom: 1px solid #ddd; font-size: 11px; }
              .total-row.final { background: #333; color: white; font-weight: bold; }
              .total-label { flex: 1; text-align: right; margin-right: 10px; }
              .total-amount { width: 80px; text-align: right; }
            </style>
          </head>
          <body>
            ${generateQuotationHTML(company, customer, quotation, products)}
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const generateQuotationHTML = (company: CompanyDetails, customer: Customer, quotation: Quotation, products: Product[]) => {
    return `
      <div class="quotation-container">
        <div class="header-section">
          <div class="company-info">
            <div class="company-name">${company.name.toUpperCase()}</div>
            <div>
              ${company.taxNumber ? `Registration No: ${company.taxNumber}<br>` : ''}
              ${company.address ? `${company.address}<br>` : ''}
              ${company.phone ? `Tel No: ${company.phone}<br>` : ''}
              ${company.email ? `Email: ${company.email}` : ''}
            </div>
          </div>
          <div class="quotation-title">
            <h1>QUOTATION</h1>
            ${company.phone ? `<div>Tel No: ${company.phone}</div>` : ''}
            ${company.email ? `<div>email: ${company.email}</div>` : ''}
          </div>
        </div>
        
        <div class="customer-quote-section">
          <div class="customer-info">
            <div><strong>CUSTOMER: ${customer.company || customer.name}</strong></div>
            ${customer.contactPerson ? `<div>ATT: ${customer.contactPerson}</div>` : ''}
            ${customer.phone ? `<div>CELL: ${customer.phone}</div>` : ''}
            ${customer.email ? `<div>EMAIL: ${customer.email}</div>` : ''}
            <div>PROJECT: ${quotation.notes || 'General Quote'}</div>
          </div>
          <div class="quote-info">
            <div><strong>QUOTE #: ${quotation.quoteNumber}</strong></div>
            <div><strong>DATE: ${new Date(quotation.createdAt).toLocaleDateString('en-ZA')}</strong></div>
            <div><strong>FROM: CHABS SYSTEM</strong></div>
          </div>
        </div>
        
        <table class="items-table">
          <thead class="items-header">
            <tr>
              <th>ITEM NO</th>
              <th>QTY</th>
              <th>DESCRIPTION</th>
              <th>FINISH</th>
              <th>UNIT</th>
              <th>UNIT PRICE</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${quotation.items.map((item, index) => {
              const product = products.find(p => p.id === item.productId);
              const lineTotal = item.quantity * item.unitPrice;
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: left;">${product ? product.name : `Product ${item.productId}`}</td>
                  <td>PG</td>
                  <td>${product ? product.unit : 'EA'}</td>
                  <td>R${item.unitPrice.toFixed(2)}</td>
                  <td>R ${lineTotal.toFixed(2)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="totals-section">
          <div class="notes-section">
            <div><strong>Notes:</strong></div>
            <ol>
              <li>NETT Prices excluding VAT, Customs Duties, or any other statutory levies.</li>
              <li>Prices are valid for 45 days, subject to SEIFSA escalation.</li>
              <li>Settlement discount of 2.5% on payment within 30days from statement.</li>
              <li>Delivery time as per your requirements days from receipt of order.</li>
              <li>Prices include free delivery to the site.</li>
            </ol>
          </div>
          <div class="totals-column">
            <div class="total-row">
              <div class="total-label">SUB TOT:</div>
              <div class="total-amount">R ${quotation.subtotal.toFixed(2)}</div>
            </div>
            <div class="total-row">
              <div class="total-label">VAT:</div>
              <div class="total-amount">R ${quotation.taxAmount.toFixed(2)}</div>
            </div>
            <div class="total-row final">
              <div class="total-label">TOTAL:</div>
              <div class="total-amount">R ${quotation.total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <button className="btn" type="button" onClick={handleExportPDF}>
      Export PDF
    </button>
  );
}