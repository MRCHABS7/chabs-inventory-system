import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CompanyDetails, Customer, Product, Quotation } from './types';

export function quotationToPDF(opts: {
  company: CompanyDetails;
  customer: Customer;
  quotation: Quotation;
  products: Product[];
}) {
  const { company, customer, quotation, products } = opts;
  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text(company.name || 'Company', 14, 16);
  doc.setFontSize(10);
  if (company.address) doc.text(company.address, 14, 22);
  const cLine = [company.phone, company.email].filter(Boolean).join(' · ');
  if (cLine) doc.text(cLine, 14, 27);

  // Title
  doc.setFontSize(14);
  doc.text('Quotation', 14, 40);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, 14, 46);
  doc.text(`Quote ID: ${quotation.id}`, 14, 51);

  // Customer
  doc.text(`Customer: ${customer.name}`, 120, 40);
  if (customer.email) doc.text(`Email: ${customer.email}`, 120, 46);
  if (customer.phone) doc.text(`Phone: ${customer.phone}`, 120, 51);
  if (customer.address) doc.text(`Address: ${customer.address}`, 120, 56);

  const body = quotation.items.map(it => {
    const p = products.find(pp => pp.id === it.productId);
    const name = p?.name ?? 'Unknown';
    const price = it.unitPrice;
    const qty = it.quantity;
    const total = price * qty;
    return [name, qty.toString(), `R${price.toFixed(2)}`, `R${total.toFixed(2)}`];
  });

  autoTable(doc, {
    head: [['Product', 'Qty', 'Unit Price', 'Line Total']],
    body,
    startY: 64,
  });

  const subtotal = body.reduce((acc, row) => acc + parseFloat(row[3]), 0);
  doc.text(`Subtotal: R${subtotal.toFixed(2)}`, 160, (doc as any).lastAutoTable.finalY + 10, { align: 'right' });

  doc.save(`quotation_${quotation.id}.pdf`);
}
