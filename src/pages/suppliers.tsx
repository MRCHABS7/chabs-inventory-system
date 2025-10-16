import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import UnifiedSupplierManager from '../components/UnifiedSupplierManager';
import { me } from '../lib/auth-simple';

export default function SuppliersPage() {
  const router = useRouter();
  const user = me();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Required</h2>
            <p className="text-muted-foreground">Please log in to access supplier management.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <UnifiedSupplierManager />
      </div>
    </Layout>
  );
}