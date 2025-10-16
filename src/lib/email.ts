// Email service for CHABS Inventory System
import type { Quotation, Customer, CompanyDetails, Order, PurchaseOrder, Supplier, Product } from './types';
import { sanitizeHtml, sanitizeText } from './sanitizer';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  messageId?: string;
}

// Email templates
export const generateQuotationEmail = (
  quotation: Quotation, 
  customer: Customer, 
  company: CompanyDetails,
  products: Product[]
): EmailTemplate => {
  const subject = `Quotation ${quotation.quoteNumber} from ${company.name}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.4; 
          color: #333; 
          margin: 0; 
          padding: 20px;
          background: #f5f5f5;
        }
        .quotation-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 2px solid #333;
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
          color: #ff6600;
          margin-bottom: 10px;
        }
        .company-details {
          font-size: 11px;
          line-height: 1.3;
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
          color: #ff6600;
          margin: 0 0 10px 0;
        }
        .logo-placeholder {
          width: 60px;
          height: 60px;
          background: #ff6600;
          border-radius: 50%;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
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
          font-size: 11px;
          margin-bottom: 3px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        .items-header {
          background: #ff6600;
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
      </style>
    </head>
    <body>
      <div class="quotation-container">
        <!-- Header Section -->
        <div class="header-section">
          <div class="company-info">
            <div class="company-name">${sanitizeHtml(company.name).toUpperCase()}</div>
            <div class="company-details">
              ${company.taxNumber ? `Registration No: ${company.taxNumber}<br>` : ''}
              ${company.address ? `${sanitizeHtml(company.address)}<br>` : ''}
              ${company.phone ? `Tel No: ${company.phone}<br>` : ''}
              ${company.email ? `Email: ${company.email}` : ''}
            </div>
          </div>
          <div class="quotation-title">
            <div class="logo-placeholder">
              ${company.name.charAt(0)}
            </div>
            <h1>QUOTATION</h1>
            ${company.phone ? `<div style="font-size: 11px;">Tel No: ${company.phone}</div>` : ''}
            ${company.email ? `<div style="font-size: 11px;">email: ${company.email}</div>` : ''}
          </div>
        </div>

        <!-- Customer and Quote Info Section -->
        <div class="customer-quote-section">
          <div class="customer-info">
            <div class="section-label">CUSTOMER: ${sanitizeHtml(customer.company || customer.name)}</div>
            ${customer.contactPerson ? `<div class="info-line">ATT: ${customer.contactPerson}</div>` : ''}
            ${customer.phone ? `<div class="info-line">CELL: ${customer.phone}</div>` : ''}
            ${customer.email ? `<div class="info-line">EMAIL: ${customer.email}</div>` : ''}
            <div class="info-line">PROJECT: ${sanitizeHtml(quotation.notes || 'General Quote')}</div>
          </div>
          <div class="quote-info">
            <div class="info-line"><strong>QUOTE #: ${quotation.quoteNumber}</strong></div>
            <div class="info-line"><strong>DATE: ${new Date(quotation.createdAt).toLocaleDateString('en-ZA')}</strong></div>
            <div class="info-line"><strong>FROM: CHABS SYSTEM</strong></div>
            ${company.phone ? `<div class="info-line"><strong>CELL: ${company.phone}</strong></div>` : ''}
            ${company.email ? `<div class="info-line"><strong>EMAIL: ${company.email}</strong></div>` : ''}
          </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead class="items-header">
            <tr>
              <th style="width: 8%;">ITEM NO</th>
              <th style="width: 8%;">QTY</th>
              <th style="width: 40%;">DESCRIPTION</th>
              <th style="width: 8%;">FINISH</th>
              <th style="width: 8%;">UNIT</th>
              <th style="width: 12%;">UNIT PRICE</th>
              <th style="width: 16%;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${quotation.items.map((item, index) => {
              const discountAmount = item.unitPrice * item.quantity * (item.discount / 100);
              const lineTotal = (item.unitPrice * item.quantity) - discountAmount;
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: left;">${(() => {
                    const product = products.find(p => p.id === item.productId);
                    return product ? product.name : `Product ${item.productId}`;
                  })()}</td>
                  <td>PG</td>
                  <td>${(() => {
                    const product = products.find(p => p.id === item.productId);
                    return product ? product.unit : 'EA';
                  })()}</td>
                  <td>R${item.unitPrice.toFixed(2)}</td>
                  <td>R ${lineTotal.toFixed(2)}</td>
                </tr>
                ${item.discount > 0 ? `
                <tr style="color: #666; font-style: italic;">
                  <td></td>
                  <td></td>
                  <td style="text-align: left;">Discount (${item.discount}%)</td>
                  <td></td>
                  <td></td>
                  <td>-R${discountAmount.toFixed(2)}</td>
                  <td></td>
                </tr>
                ` : ''}
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Totals and Notes Section -->
        <div class="totals-section">
          <div class="notes-section">
            <div style="font-size: 11px; font-weight: bold; margin-bottom: 10px;">Notes:</div>
            <ol class="terms-list">
              <li>NETT Prices excluding VAT, Customs Duties, or any other statutory levies.</li>
              <li>Prices are valid for 45 days, subject to SEIFSA escalation.</li>
              <li>Settlement discount of 2.5% on payment within 30days from statement.</li>
              <li>Delivery time as per your requirements days from receipt of order.</li>
              <li>Prices include free delivery to the site.</li>
            </ol>
            ${quotation.terms ? `<div style="font-size: 10px; margin-top: 10px;"><strong>Additional Terms:</strong><br>${sanitizeHtml(quotation.terms)}</div>` : ''}
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

        <!-- Footer -->
        <div class="footer-section">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <div style="width: 40px; height: 40px; background: #0066cc; margin-right: 10px;"></div>
            <div style="font-weight: bold;">MEMBER OF HOT DIP GALVANIZERS ASSOCIATION SA</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Quotation ${quotation.quoteNumber} from ${company.name}
    
    Dear ${customer.name},
    
    Thank you for your interest in our products. Please find your quotation details below:
    
    Quote Number: ${quotation.quoteNumber}
    Date: ${new Date(quotation.createdAt).toLocaleDateString()}
    Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}
    Customer: ${customer.name}
    ${customer.company ? `Company: ${customer.company}` : ''}
    
    Items:
    ${quotation.items.map(item => 
      `- Product ${item.productId}: ${item.quantity} x R ${item.unitPrice.toFixed(2)} (${item.discount}% discount) = R ${item.total.toFixed(2)}`
    ).join('\n')}
    
    Subtotal: R ${quotation.subtotal.toFixed(2)}
    Tax (${quotation.taxRate}%): R ${quotation.taxAmount.toFixed(2)}
    Total: R ${quotation.total.toFixed(2)}
    
    ${quotation.notes ? `Notes: ${quotation.notes}` : ''}
    ${quotation.terms ? `Terms & Conditions: ${quotation.terms}` : ''}
    
    If you have any questions or would like to proceed with this quotation, please don't hesitate to contact us.
    
    Thank you for choosing ${company.name}!
    
    ${company.name}
    ${company.address || ''}
    ${company.phone ? `Phone: ${company.phone}` : ''}
    ${company.email ? `Email: ${company.email}` : ''}
    ${company.website ? `Website: ${company.website}` : ''}
  `;
  
  return { subject, html, text };
};

export const generateOrderConfirmationEmail = (
  order: Order,
  customer: Customer,
  company: CompanyDetails
): EmailTemplate => {
  const subject = `Order Confirmation ${order.orderNumber} from ${company.name}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-details { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background: #f8f9fa; font-weight: bold; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .status-confirmed { background: #dcfce7; color: #166534; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Order Confirmed! 🎉</h1>
        <p>${company.name}</p>
      </div>
      
      <div class="content">
        <h2>Dear ${customer.name},</h2>
        <p>Great news! Your order has been confirmed and is being processed.</p>
        
        <div class="order-details">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Status:</strong> <span class="status-badge status-confirmed">${order.status}</span></p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Priority:</strong> ${order.priority.toUpperCase()}</p>
          ${order.expectedDelivery ? `<p><strong>Expected Delivery:</strong> ${new Date(order.expectedDelivery).toLocaleDateString()}</p>` : ''}
          ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>Product ${item.productId}</td>
                <td>${item.quantity}</td>
                <td>R ${item.unitPrice.toFixed(2)}</td>
                <td>R ${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3">Subtotal</td>
              <td>R ${order.subtotal.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3">Tax (${order.taxRate}%)</td>
              <td>R ${order.taxAmount.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>R ${order.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        ${order.notes ? `<div class="order-details"><h3>Order Notes</h3><p>${order.notes}</p></div>` : ''}
        
        <p>We'll keep you updated on your order progress. Thank you for your business!</p>
      </div>
      
      <div class="footer">
        <p>${company.name}</p>
        ${company.address ? `<p>${company.address}</p>` : ''}
        ${company.phone ? `<p>Phone: ${company.phone}</p>` : ''}
        ${company.email ? `<p>Email: ${company.email}</p>` : ''}
      </div>
    </body>
    </html>
  `;
  
  const text = `Order Confirmation ${order.orderNumber} from ${company.name}
  
Dear ${customer.name},

Great news! Your order has been confirmed and is being processed.

Order Number: ${order.orderNumber}
Status: ${order.status.toUpperCase()}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Priority: ${order.priority.toUpperCase()}
${order.expectedDelivery ? `Expected Delivery: ${new Date(order.expectedDelivery).toLocaleDateString()}` : ''}
${order.trackingNumber ? `Tracking Number: ${order.trackingNumber}` : ''}

Items:
${order.items.map(item => 
  `- Product ${item.productId}: ${item.quantity} x R ${item.unitPrice.toFixed(2)} = R ${item.total.toFixed(2)}`
).join('\n')}

Subtotal: R ${order.subtotal.toFixed(2)}
Tax (${order.taxRate}%): R ${order.taxAmount.toFixed(2)}
Total: R ${order.total.toFixed(2)}

${order.notes ? `Order Notes: ${order.notes}` : ''}

We'll keep you updated on your order progress. Thank you for your business!

${company.name}
${company.address || ''}
${company.phone ? `Phone: ${company.phone}` : ''}
${company.email ? `Email: ${company.email}` : ''}`;
  
  return { subject, html, text };
};

export const generatePurchaseOrderEmail = (
  po: PurchaseOrder,
  supplier: Supplier,
  company: CompanyDetails
): EmailTemplate => {
  const subject = `Purchase Order ${po.poNumber} from ${company.name}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .po-details { background: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background: #f8f9fa; font-weight: bold; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Purchase Order</h1>
        <p>${company.name}</p>
      </div>
      
      <div class="content">
        <h2>Dear ${supplier.name},</h2>
        <p>Please find our purchase order details below:</p>
        
        <div class="po-details">
          <h3>Purchase Order Details</h3>
          <p><strong>PO Number:</strong> ${po.poNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(po.orderDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${po.status.toUpperCase()}</p>
          ${po.expectedDelivery ? `<p><strong>Expected Delivery:</strong> ${new Date(po.expectedDelivery).toLocaleDateString()}</p>` : ''}
          <p><strong>Supplier:</strong> ${supplier.name}</p>
          ${supplier.contactPerson ? `<p><strong>Contact Person:</strong> ${supplier.contactPerson}</p>` : ''}
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${po.items.map(item => `
              <tr>
                <td>Product ${item.productId}</td>
                <td>${item.quantity}</td>
                <td>R ${item.unitPrice.toFixed(2)}</td>
                <td>R ${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3">Subtotal</td>
              <td>R ${po.subtotal.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3">Tax (${po.taxRate}%)</td>
              <td>R ${po.taxAmount.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>R ${po.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        ${po.notes ? `<div class="po-details"><h3>Notes</h3><p>${po.notes}</p></div>` : ''}
        
        <p>Please confirm receipt of this purchase order and provide delivery timeline.</p>
        <p>Thank you for your continued partnership.</p>
      </div>
      
      <div class="footer">
        <p>${company.name}</p>
        ${company.address ? `<p>${company.address}</p>` : ''}
        ${company.phone ? `<p>Phone: ${company.phone}</p>` : ''}
        ${company.email ? `<p>Email: ${company.email}</p>` : ''}
      </div>
    </body>
    </html>
  `;
  
  const text = `Purchase Order ${po.poNumber} from ${company.name}

Dear ${supplier.name},

Please find our purchase order details below:

PO Number: ${po.poNumber}
Order Date: ${new Date(po.orderDate).toLocaleDateString()}
Status: ${po.status.toUpperCase()}
${po.expectedDelivery ? `Expected Delivery: ${new Date(po.expectedDelivery).toLocaleDateString()}` : ''}
Supplier: ${supplier.name}
${supplier.contactPerson ? `Contact Person: ${supplier.contactPerson}` : ''}

Items:
${po.items.map(item => 
  `- Product ${item.productId}: ${item.quantity} x R ${item.unitPrice.toFixed(2)} = R ${item.total.toFixed(2)}`
).join('\n')}

Subtotal: R ${po.subtotal.toFixed(2)}
Tax (${po.taxRate}%): R ${po.taxAmount.toFixed(2)}
Total: R ${po.total.toFixed(2)}

${po.notes ? `Notes: ${po.notes}` : ''}

Please confirm receipt of this purchase order and provide delivery timeline.
Thank you for your continued partnership.

${company.name}
${company.address || ''}
${company.phone ? `Phone: ${company.phone}` : ''}
${company.email ? `Email: ${company.email}` : ''}`;
  
  return { subject, html, text };
};

// Mock email sending function (replace with real email service)
export const sendEmail = async (
  to: string,
  template: EmailTemplate,
  attachments?: { filename: string; content: string }[]
): Promise<EmailResult> => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    return {
      success: false,
      message: 'Failed to send email. Please try again.'
    };
  }
  
  console.log(`📧 Email sent to: ${to}`);
  console.log(`📧 Subject: ${template.subject}`);
  if (attachments) {
    console.log(`📎 Attachments: ${attachments.map(a => a.filename).join(', ')}`);
  }
  
  return {
    success: true,
    message: 'Email sent successfully',
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

// Email configuration (for real email services)
export interface EmailConfig {
  provider: 'sendgrid' | 'mailgun' | 'smtp';
  apiKey?: string;
  domain?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  fromEmail: string;
  fromName: string;
}

// Save email configuration
export const saveEmailConfig = (config: EmailConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chabs_email_config', JSON.stringify(config));
  }
};

// Get email configuration
export const getEmailConfig = (): EmailConfig | null => {
  if (typeof window === 'undefined') return null;
  try {
    const config = localStorage.getItem('chabs_email_config');
    return config ? JSON.parse(config) : null;
  } catch {
    return null;
  }
};