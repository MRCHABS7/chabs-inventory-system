import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Quotation, Customer, CompanyDetails, Product } from './types';

export class PDFGenerator {
  private doc: jsPDF;
  
  constructor() {
    this.doc = new jsPDF();
  }

  generateQuotationPDF(quotation: Quotation, customer: Customer, company: CompanyDetails, products: Product[]): void {
    // Reset document
    this.doc = new jsPDF();
    
    // Set font
    this.doc.setFont('helvetica');
    
    // Header
    this.addHeader(company);
    
    // Title
    this.addTitle('QUOTATION');
    
    // Company and customer info
    this.addCompanyCustomerInfo(company, customer, quotation);
    
    // Items table
    this.addItemsTable(quotation, products);
    
    // Totals
    this.addTotals(quotation);
    
    // Terms and conditions
    this.addTerms();
    
    // Footer
    this.addFooter(company);
    
    // Download
    this.doc.save(`Quotation_${quotation.quoteNumber}.pdf`);
  }

  private addHeader(company: CompanyDetails): void {
    // Company name
    this.doc.setFontSize(20);
    this.doc.setTextColor(255, 102, 0); // Orange color
    this.doc.text(company.name.toUpperCase(), 20, 25);
    
    // Company details
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    let yPos = 35;
    
    if (company.taxNumber) {
      this.doc.text(`Registration No: ${company.taxNumber}`, 20, yPos);
      yPos += 5;
    }
    if (company.address) {
      this.doc.text(company.address, 20, yPos);
      yPos += 5;
    }
    if (company.phone) {
      this.doc.text(`Tel: ${company.phone}`, 20, yPos);
      yPos += 5;
    }
    if (company.email) {
      this.doc.text(`Email: ${company.email}`, 20, yPos);
    }
  }

  private addTitle(title: string): void {
    this.doc.setFontSize(24);
    this.doc.setTextColor(255, 102, 0);
    const pageWidth = this.doc.internal.pageSize.width;
    const textWidth = this.doc.getTextWidth(title);
    this.doc.text(title, (pageWidth - textWidth) / 2, 70);
  }

  private addCompanyCustomerInfo(company: CompanyDetails, customer: Customer, quotation: Quotation): void {
    // Customer info (left side)
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`CUSTOMER: ${customer.company || customer.name}`, 20, 90);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    let yPos = 100;
    
    if (customer.contactPerson) {
      this.doc.text(`ATT: ${customer.contactPerson}`, 20, yPos);
      yPos += 5;
    }
    if (customer.phone) {
      this.doc.text(`CELL: ${customer.phone}`, 20, yPos);
      yPos += 5;
    }
    if (customer.email) {
      this.doc.text(`EMAIL: ${customer.email}`, 20, yPos);
      yPos += 5;
    }
    
    // Quote info (right side)
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`QUOTE #: ${quotation.quoteNumber}`, 120, 90);
    this.doc.text(`DATE: ${new Date(quotation.createdAt).toLocaleDateString('en-ZA')}`, 120, 100);
    this.doc.text('FROM: CHABS SYSTEM', 120, 110);
    
    if (company.phone) {
      this.doc.text(`CELL: ${company.phone}`, 120, 120);
    }
  }

  private addItemsTable(quotation: Quotation, products: Product[]): void {
    const tableData = quotation.items.map((item, index) => {
      const product = products.find(p => p.id === item.productId);
      return [
        (index + 1).toString(),
        item.quantity.toString(),
        product?.name || 'Unknown Product',
        'PG', // Finish
        product?.unit || 'EA',
        `R${item.unitPrice.toFixed(2)}`,
        `R${(item.quantity * item.unitPrice).toFixed(2)}`
      ];
    });

    (this.doc as any).autoTable({
      head: [['ITEM NO', 'QTY', 'DESCRIPTION', 'FINISH', 'UNIT', 'UNIT PRICE', 'TOTAL']],
      body: tableData,
      startY: 140,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 102, 0],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { halign: 'center', cellWidth: 15 },
        2: { halign: 'left', cellWidth: 60 },
        3: { halign: 'center', cellWidth: 20 },
        4: { halign: 'center', cellWidth: 15 },
        5: { halign: 'right', cellWidth: 25 },
        6: { halign: 'right', cellWidth: 25 }
      }
    });
  }

  private addTotals(quotation: Quotation): void {
    const finalY = (this.doc as any).lastAutoTable.finalY + 20;
    
    // Totals box
    const boxX = 130;
    const boxY = finalY;
    const boxWidth = 60;
    
    // Subtotal
    this.doc.setFontSize(10);
    this.doc.text('SUB TOT:', boxX + 5, boxY + 10);
    this.doc.text(`R ${quotation.subtotal.toFixed(2)}`, boxX + boxWidth - 5, boxY + 10, { align: 'right' });
    
    // VAT
    this.doc.text('VAT:', boxX + 5, boxY + 20);
    this.doc.text(`R ${quotation.taxAmount.toFixed(2)}`, boxX + boxWidth - 5, boxY + 20, { align: 'right' });
    
    // Total (highlighted)
    this.doc.setFillColor(51, 51, 51);
    this.doc.rect(boxX, boxY + 25, boxWidth, 10, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TOTAL:', boxX + 5, boxY + 32);
    this.doc.text(`R ${quotation.total.toFixed(2)}`, boxX + boxWidth - 5, boxY + 32, { align: 'right' });
    
    // Reset text color
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');
  }

  private addTerms(): void {
    const finalY = (this.doc as any).lastAutoTable.finalY + 60;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Notes:', 20, finalY);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    
    const terms = [
      '1. NETT Prices excluding VAT, Customs Duties, or any other statutory levies.',
      '2. Prices are valid for 45 days, subject to SEIFSA escalation.',
      '3. Settlement discount of 2.5% on payment within 30days from statement.',
      '4. Delivery time as per your requirements days from receipt of order.',
      '5. Prices include free delivery to the site.'
    ];
    
    let yPos = finalY + 10;
    terms.forEach(term => {
      this.doc.text(term, 20, yPos);
      yPos += 6;
    });
  }

  private addFooter(company: CompanyDetails): void {
    const pageHeight = this.doc.internal.pageSize.height;
    
    // Footer line
    this.doc.setDrawColor(51, 51, 51);
    this.doc.line(20, pageHeight - 30, 190, pageHeight - 30);
    
    // Footer text
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Generated by CHABS Inventory System - ${new Date().toLocaleString()}`, 20, pageHeight - 20);
    
    // Page number
    this.doc.text('Page 1 of 1', 190, pageHeight - 20, { align: 'right' });
  }

  // Generate other PDF types
  generateInvoicePDF(order: any, customer: Customer, company: CompanyDetails): void {
    this.doc = new jsPDF();
    this.addHeader(company);
    this.addTitle('INVOICE');
    // Add invoice-specific content...
    this.doc.save(`Invoice_${order.orderNumber}.pdf`);
  }

  generateReportPDF(reportData: any, title: string): void {
    this.doc = new jsPDF();
    this.doc.setFontSize(16);
    this.doc.text(title, 20, 20);
    // Add report content...
    this.doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  }

  generatePickingSlipPDF(order: any, products: Product[]): void {
    this.doc = new jsPDF();
    this.doc.setFontSize(18);
    this.doc.text('PICKING SLIP', 20, 20);
    // Add picking slip content...
    this.doc.save(`PickingSlip_${order.orderNumber}.pdf`);
  }
}