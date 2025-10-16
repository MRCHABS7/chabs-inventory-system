import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import CustomerForm from '../components/CustomerForm';
import { createCustomer, deleteCustomer, listCustomers } from '../lib/storage-simple';
import { me } from '../lib/auth-simple';
import type { Customer } from '../lib/types';

export default function CustomersPage() {
  const router = useRouter();
  const user = me();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const refresh = () => setCustomers(listCustomers());

  const filteredCustomers = customers.filter(customer => {
    if (searchTerm === '') return false; // Don't show any by default
    if (searchTerm === ' ') return true; // Show all when space (view all button)
    return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (customer.phone && customer.phone.includes(searchTerm));
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role === 'warehouse') {
      router.push('/warehouse-dashboard');
      return;
    }
    refresh();
  }, [user, router]);

  if (!user || user.role === 'warehouse') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">This page is only available to administrators.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customers</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '➕ Add Customer'}
          </button>
        </div>

        {/* Add Customer Form - Collapsible */}
        {showForm && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>
            <CustomerForm onSave={(draft) => { 
              createCustomer({ id: '', ...draft } as any); 
              refresh(); 
              setShowForm(false);
            }} />
          </div>
        )}

        {/* Search Section */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔍 Search Customers
              </label>
              <input
                className="input"
                placeholder="Search by name, email, company, or phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-32">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                👁️ Quick View
              </label>
              <button
                className={`btn w-full text-sm ${searchTerm !== '' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  if (searchTerm !== '') {
                    setSearchTerm('');
                  } else {
                    setSearchTerm(' '); // Set to space to trigger showing all
                  }
                }}
              >
                {searchTerm !== '' ? 'Clear' : 'View All'}
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-6">
              {searchTerm && searchTerm !== ' ' ? `${filteredCustomers.length} of ${customers.length} customers` : `${customers.length} total customers`}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {searchTerm === '' ? (
          <div className="card">
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium mb-2">Search for customers</h3>
              <p>Enter a name, email, company, or phone number to find customers</p>
              <div className="mt-4 text-sm">
                Total customers in system: <span className="font-semibold">{customers.length}</span>
              </div>
            </div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="card">
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2">No customers found</h3>
              <p>No customers match your search for "{searchTerm.trim()}"</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => setShowForm(true)}
              >
                Add New Customer
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {searchTerm === ' ' ? 'All Customers' : 'Search Results'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {searchTerm === ' ' 
                  ? `Showing all ${filteredCustomers.length} customer${filteredCustomers.length !== 1 ? 's' : ''}`
                  : `Found ${filteredCustomers.length} customer${filteredCustomers.length !== 1 ? 's' : ''} matching "${searchTerm.trim()}"`
                }
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="table text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2">Name</th>
                    <th className="py-2">Company</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Address</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="text-left py-2 font-medium">
                        <div className="truncate max-w-32" title={c.name}>
                          {c.name}
                        </div>
                      </td>
                      <td className="py-2 text-xs">
                        <div className="truncate max-w-32" title={c.company ?? '-'}>
                          {c.company ?? '-'}
                        </div>
                      </td>
                      <td className="py-2 text-xs">
                        <div className="truncate max-w-40" title={c.email ?? '-'}>
                          {c.email ?? '-'}
                        </div>
                      </td>
                      <td className="py-2 text-xs">{c.phone ?? '-'}</td>
                      <td className="py-2 text-xs">
                        <div className="truncate max-w-48" title={c.address ?? '-'}>
                          {c.address ?? '-'}
                        </div>
                      </td>
                      <td className="py-2">
                        <button 
                          className="btn btn-danger text-xs px-2 py-1 h-7" 
                          onClick={() => { 
                            if (confirm(`Delete customer "${c.name}"?`)) {
                              deleteCustomer(c.id); 
                              refresh(); 
                            }
                          }}
                          title="Delete Customer"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
