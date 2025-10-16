import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ManualGeneratorComponent from '../components/ManualGenerator';
import { me } from '../lib/auth-simple';

export default function ManualPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = me();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Documentation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate comprehensive documentation for your CHABS system
          </p>
        </div>

        <ManualGeneratorComponent />

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">👥</span>
              For Business Owners
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Simple explanations without technical jargon</li>
              <li>• Step-by-step guides for daily tasks</li>
              <li>• Common problems and easy solutions</li>
              <li>• Tips for getting the most from your system</li>
              <li>• User training materials</li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🔧</span>
              For System Administrators
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Technical architecture overview</li>
              <li>• Deployment and hosting options</li>
              <li>• Maintenance procedures</li>
              <li>• Troubleshooting advanced issues</li>
              <li>• Scaling and performance optimization</li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">💼</span>
              For Sales & Presentations
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Key selling points and benefits</li>
              <li>• Pricing plans and features</li>
              <li>• ROI calculations and examples</li>
              <li>• Common objections and responses</li>
              <li>• Demo scenarios and talking points</li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🚨</span>
              Emergency Procedures
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• What to do when system is down</li>
              <li>• Data backup and recovery</li>
              <li>• Contact information for support</li>
              <li>• Temporary workaround procedures</li>
              <li>• Security incident response</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            💡 Pro Tip: Keep Your Manual Updated
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            Generate a new manual whenever you add features or make significant changes to your system. 
            This ensures your documentation stays current and useful for training new users.
          </p>
        </div>
      </div>
    </Layout>
  );
}