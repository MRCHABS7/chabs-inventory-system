import { useState } from 'react';
import { PDFGenerator } from '../lib/pdf-generator';
import type { Quotation, Customer, Product, CompanyDetails } from '../lib/types';

interface BulkPDFGeneratorProps {
  quotations: Quotation[];
  customers: Customer[];
  products: Product[];
  company: CompanyDetails;
}

export default function BulkPDFGenerator({ quotations, customers, products, company }: BulkPDFGeneratorProps) {
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleQuote = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const selectAll = () => {
    setSelectedQuotes(quotations.map(q => q.id));
  };

  const clearAll = () => {
    setSelectedQuotes([]);
  };

  const generateBulkPDFs = async () => {
    if (selectedQuotes.length === 0) {
      alert('Please select at least one quotation');
      return;
    }

    setIsGenerating(true);
    const pdfGenerator = new PDFGenerator();

    try {
      for (const quoteId of selectedQuotes) {
        const quotation = quotations.find(q => q.id === quoteId);
        const customer = customers.find(c => c.id === quotation?.customerId);
        
        if (quotation && customer) {
          // Add delay to prevent browser freezing
          await new Promise(resolve => setTimeout(resolve, 100));
          pdfGenerator.generateQuotationPDF(quotation, customer, company, products);
        }
      }
      
      alert(`Successfully generated ${selectedQuotes.length} PDF files!`);
      setSelectedQuotes([]);
    } catch (error) {
      console.error('Bulk PDF generation failed:', error);
      alert('Some PDFs failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bulk PDF Export</h3>
        <div className="space-x-2">
          <button onClick={selectAll} className="btn btn-secondary text-sm">
            Select All
          </button>
          <button onClick={clearAll} className="btn btn-secondary text-sm">
            Clear All
          </button>
          <button 
            onClick={generateBulkPDFs}
            disabled={selectedQuotes.length === 0 || isGenerating}
            className="btn btn-primary text-sm"
          >
            {isGenerating ? 'Generating...' : `Generate ${selectedQuotes.length} PDFs`}
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto border rounded-lg">
        <table className="table">
          <thead>
            <tr>
              <th className="w-12">
                <input
                  type="checkbox"
                  checked={selectedQuotes.length === quotations.length}
                  onChange={() => selectedQuotes.length === quotations.length ? clearAll() : selectAll()}
                />
              </th>
              <th>Quote Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map(quote => {
              const customer = customers.find(c => c.id === quote.customerId);
              return (
                <tr key={quote.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedQuotes.includes(quote.id)}
                      onChange={() => toggleQuote(quote.id)}
                    />
                  </td>
                  <td className="font-medium">{quote.quoteNumber}</td>
                  <td>{customer?.name || 'Unknown'}</td>
                  <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                  <td>R{quote.total.toFixed(2)}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isGenerating && (
        <div className="text-center p-4">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            Generating PDFs... ({selectedQuotes.length} remaining)
          </div>
        </div>
      )}
    </div>
  );
}