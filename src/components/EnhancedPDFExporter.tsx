import { PDFGenerator } from '../lib/pdf-generator';
import type { CompanyDetails, Customer, Product, Quotation } from '../lib/types';

interface EnhancedPDFExporterProps {
  company: CompanyDetails;
  customer: Customer;
  quotation: Quotation;
  products: Product[];
  type?: 'quotation' | 'invoice' | 'report';
  className?: string;
}

export default function EnhancedPDFExporter({ 
  company, 
  customer, 
  quotation, 
  products, 
  type = 'quotation',
  className = 'btn btn-primary'
}: EnhancedPDFExporterProps) {
  
  const handleExport = () => {
    const pdfGenerator = new PDFGenerator();
    
    try {
      switch (type) {
        case 'quotation':
          pdfGenerator.generateQuotationPDF(quotation, customer, company, products);
          break;
        case 'invoice':
          pdfGenerator.generateInvoicePDF(quotation, customer, company);
          break;
        case 'report':
          pdfGenerator.generateReportPDF(quotation, 'Quotation Report');
          break;
        default:
          pdfGenerator.generateQuotationPDF(quotation, customer, company, products);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'quotation': return '📄 Export PDF';
      case 'invoice': return '🧾 Generate Invoice';
      case 'report': return '📊 Export Report';
      default: return '📄 Export PDF';
    }
  };

  return (
    <button 
      className={className}
      onClick={handleExport}
      type="button"
    >
      {getButtonText()}
    </button>
  );
}