import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ExternalProcessingManager from '../components/ExternalProcessingManager';
import { me } from '../lib/auth-simple';

export default function ExternalProcessingPage() {
  const router = useRouter();
  const user = me();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <Layout>
      <div className="container py-6">
        <ExternalProcessingManager />
      </div>
    </Layout>
  );
}