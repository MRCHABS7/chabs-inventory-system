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
    
    // Redirect to role-specific dashboard
    if (user.role === 'admin') {
      router.replace('/admin-dashboard');
    } else if (user.role === 'warehouse') {
      router.replace('/warehouse-dashboard');
    }
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="min-h-screen gradient-bg">
        <div className="container py-6">
          <div className="text-center">
            <div>Redirecting to your dashboard...</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
