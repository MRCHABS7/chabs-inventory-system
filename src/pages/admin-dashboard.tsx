import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProfessionalDashboard from '../components/ProfessionalDashboard';
import { me } from '../lib/auth-simple';

export default function AdminDashboard() {
  const router = useRouter();
  const user = me();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <Layout>
      <div className="container py-6">
        <ProfessionalDashboard />
      </div>
    </Layout>
  );
}