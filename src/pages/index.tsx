import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { me } from '../lib/auth-simple';
import Layout from '../components/Layout';
import { useBranding } from '../contexts/BrandingContext';

export default function IndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { branding } = useBranding();

  useEffect(() => {
    const currentUser = me();
    if (currentUser) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="card p-8 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-purple-500"></div>
            <div className="text-lg font-medium">Loading CHABS...</div>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: '📦',
      title: 'Smart Inventory',
      description: 'Advanced stock management with real-time alerts and automated tracking.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💼',
      title: 'Professional Quotes',
      description: 'Generate branded quotations with custom templates and email integration.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: '📊',
      title: 'Business Analytics',
      description: 'Comprehensive insights with detailed reports and performance metrics.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: '🏪',
      title: 'Warehouse Control',
      description: 'Complete warehouse management with location tracking and stock control.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '🤝',
      title: 'Supplier Management',
      description: 'Manage supplier relationships and purchase orders efficiently.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: '⚙️',
      title: 'System Features',
      description: 'Advanced automation, custom branding, and workflow optimization.',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-3xl"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="text-center animate-slide-in">
              {branding.logo && (
                <div className="mb-8 flex justify-center">
                  <img 
                    src={branding.logo} 
                    alt="Company Logo" 
                    className="h-16 w-auto"
                  />
                </div>
              )}
              <h1 className="mb-6">
                <div className="text-7xl font-bold text-gradient mb-2">CHABS</div>
                <div className="text-2xl text-muted-foreground">Inventory</div>
                <div className="text-lg text-muted-foreground mt-1">Business Management System</div>
              </h1>
              <p className="text-xl text-muted mb-4 max-w-3xl mx-auto leading-relaxed">
                Complete Hardware and Business Solutions
              </p>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                Professional inventory management with advanced features, 
                customizable branding, and enterprise-grade functionality
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={() => router.push('/login')}
                  className="btn btn-primary px-8 py-4 text-lg font-semibold shadow-glow animate-fade-in"
                  style={{ animationDelay: '0.2s' }}
                >
                  Launch Dashboard
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for modern businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card interactive animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: '99.9%', label: 'Uptime' },
                { number: '500+', label: 'Companies' },
                { number: '50K+', label: 'Products Managed' },
                { number: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <div key={stat.label} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="card glass text-center p-12 border-gradient">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of companies already using CHABS to streamline their operations
            </p>
            <button
              onClick={() => router.push('/login')}
              className="btn btn-primary px-8 py-4 text-lg font-semibold shadow-glow"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}