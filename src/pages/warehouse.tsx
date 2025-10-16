import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import WarehouseManager from '../components/WarehouseManager';
import { me } from '../lib/auth-simple';

export default function WarehousePage() {
  const router = useRouter();

  // Authentication check
  useEffect(() => { 
    if (!me()) router.replace('/'); 
  }, [router]);

  return (
    <Layout>
      <WarehouseManager />
    </Layout>
  );
}