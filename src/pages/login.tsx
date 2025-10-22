import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { me } from '../lib/auth-simple';
import LoginForm from '../components/LoginForm';
import { useBranding } from '../contexts/BrandingContext';

export default function LoginPage() {
  const router = useRouter();
  const { branding } = useBranding();

  useEffect(() => {
    const user = me();
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

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
          <p className="text-muted-foreground text-lg">Advanced Business Management System</p>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <LoginForm />
        </div>
        
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}