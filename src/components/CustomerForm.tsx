import { useState, type ChangeEvent, type FormEvent } from 'react';

type CustomerDraft = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

export default function CustomerForm({ onSave }: { onSave: (c: CustomerDraft) => void }) {
  const [draft, setDraft] = useState<CustomerDraft>({ name: '' });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft(prev => ({ ...prev, [name]: value }));
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    onSave(draft);
    setDraft({ name: '' });
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-3">
      <h2 className="text-lg font-semibold">New Customer</h2>
      <input className="input" name="name" placeholder="Name" value={draft.name} onChange={onChange} required />
      <input className="input" name="email" placeholder="Email" value={draft.email ?? ''} onChange={onChange} />
      <input className="input" name="phone" placeholder="Phone" value={draft.phone ?? ''} onChange={onChange} />
      <input className="input" name="address" placeholder="Address" value={draft.address ?? ''} onChange={onChange} />
      <button className="btn" type="submit">Save Customer</button>
    </form>
  );
}