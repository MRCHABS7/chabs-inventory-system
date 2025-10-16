import Layout from '../components/Layout';
import BackorderReport from '../components/BackorderReport';

export default function BackordersPage() {
  return (
    <Layout>
      <div className="container py-6">
        <BackorderReport />
      </div>
    </Layout>
  );
}