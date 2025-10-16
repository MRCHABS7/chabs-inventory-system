import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Supplier } from '../lib/types';

interface Props {
  onSave: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
}

export default function SupplierForm({ onSave }: Props) {
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    paymentTerms: ''
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDraft(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(draft);
    setDraft({
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      paymentTerms: ''
    });
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Add New Supplier</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name *</label>
          <input 
            className="input" 
            name="name" 
            placeholder="Enter supplier name" 
            value={draft.name} 
            onChange={onChange} 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
          <input 
            className="input" 
            name="contactPerson" 
            placeholder="Contact person name" 
            value={draft.contactPerson} 
            onChange={onChange} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            className="input" 
            type="email" 
            name="email" 
            placeholder="supplier@company.com" 
            value={draft.email} 
            onChange={onChange} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input 
            className="input" 
            name="phone" 
            placeholder="Phone number" 
            value={draft.phone} 
            onChange={onChange} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
          <select className="input" name="paymentTerms" value={draft.paymentTerms} onChange={onChange}>
            <option value="">Select payment terms</option>
            <option value="Net 30">Net 30 days</option>
            <option value="Net 60">Net 60 days</option>
            <option value="COD">Cash on Delivery</option>
            <option value="Prepaid">Prepaid</option>
            <option value="2/10 Net 30">2/10 Net 30</option>
          </select>
        </div>
        

      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea 
          className="input h-20" 
          name="address" 
          placeholder="Full address" 
          value={draft.address} 
          onChange={onChange} 
        />
      </div>
      
      <button className="btn" type="submit">Add Supplier</button>
    </form>
  );
}