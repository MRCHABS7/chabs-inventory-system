import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/auth-supabase';
import { useBranding } from '../contexts/BrandingContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { branding } = useBranding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    auth.getCurrentUser().then(user => {
      if (user) {
        router.push('/admin-dashboard');
      }
    });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await auth.signIn(email, password);
      // Check if user is admin after login
      const user = await auth.getCurrentUser();
      if (user?.user_metadata?.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        setError('Access denied. Admin credentials required.');
        await auth.signOut();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-in">
          {branding.logo && (
            <div className="mb-6 flex justify-center">
              <img 
                src={branding.logo} 
                alt="Company Logo" 
                className="h-12 w-auto"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">CHABS</span>
          </h1>
          <p className="text-muted-foreground text-lg">Admin Portal</p>
        </div>
        
        <form onSubmit={submit} className="card space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h2>
            <p className="text-gray-600">Access administrative functions</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                className="input" 
                type="email"
                placeholder="Enter admin email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                className="input" 
                type="password" 
                placeholder="Enter admin password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <button className="btn w-full text-lg py-4" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Admin Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-8 space-y-2">
          <button
            onClick={() => router.push('/warehouse-login')}
            className="text-blue-600 hover:text-blue-500 block"
          >
            Warehouse Login
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}