import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import BusinessDashboard from '../components/SmartDashboard';
import { me } from '../lib/auth-simple';

export default function DashboardPage() {
  const router = useRouter();
  const user = me();

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="min-h-screen gradient-bg">
        <div className="container py-6">
          <BusinessDashboard />
        </div>
      </div>
    </Layout>
  );
}
