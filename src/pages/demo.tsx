import { useState } from 'react';
import Layout from '../components/Layout';
import { useBranding } from '../contexts/BrandingContext';

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState('dashboard');
  const { branding } = useBranding();

  const demoSections = [
    {
      id: 'dashboard',
      title: 'Smart Dashboard',
      icon: '📊',
      description: 'Real-time analytics and business insights'
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      icon: '📦',
      description: 'Advanced stock tracking and automation'
    },
    {
      id: 'quotes',
      title: 'Professional Quotes',
      icon: '💼',
      description: 'Branded quotations with custom templates'
    },
    {
      id: 'warehouse',
      title: 'Warehouse Control',
      icon: '🏪',
      description: 'Complete warehouse management system'
    },
    {
      id: 'automation',
      title: 'AI Automation',
      icon: '🤖',
      description: 'Smart workflows and predictive analytics'
    },
    {
      id: 'branding',
      title: 'Custom Branding',
      icon: '🎨',
      description: 'Personalize your system appearance'
    }
  ];

  const mockData = {
    dashboard: {
      stats: [
        { label: 'Total Products', value: '2,847', change: '+12%', color: 'from-blue-500 to-cyan-500' },
        { label: 'Active Orders', value: '156', change: '+8%', color: 'from-emerald-500 to-teal-500' },
        { label: 'Revenue', value: 'R47,892', change: '+23%', color: 'from-violet-500 to-purple-500' },
        { label: 'Suppliers', value: '89', change: '+5%', color: 'from-orange-500 to-red-500' }
      ],
      recentActivity: [
        { action: 'New order received', time: '2 minutes ago', type: 'success' },
        { action: 'Low stock alert: Screws M6', time: '15 minutes ago', type: 'warning' },
        { action: 'Quote sent to ABC Corp', time: '1 hour ago', type: 'info' },
        { action: 'Supplier payment processed', time: '2 hours ago', type: 'success' }
      ]
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-in">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient">CHABS Demo</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the powerful features of our advanced inventory management system
            </p>
          </div>

          {/* Demo Navigation */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {demoSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveDemo(section.id)}
                className={`card interactive text-center p-6 animate-fade-in ${
                  activeDemo === section.id ? 'border-primary shadow-glow' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-3">{section.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </button>
            ))}
          </div>

          {/* Demo Content */}
          <div className="card p-8 animate-slide-in">
            {activeDemo === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Smart Dashboard</h2>
                
                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {mockData.dashboard.stats.map((stat, index) => (
                    <div key={stat.label} className="card p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                        <span className="text-white font-bold">📊</span>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                      <span className="text-emerald-500 text-sm font-medium">{stat.change}</span>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockData.dashboard.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-hover transition-colors">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-emerald-500' :
                          activity.type === 'warning' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-foreground">{activity.action}</p>
                          <p className="text-muted-foreground text-sm">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'inventory' && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Inventory Management</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                        <span>Real-time stock tracking</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                        <span>Automated low stock alerts</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                        <span>Barcode scanning support</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                        <span>Multi-location tracking</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                    <h4 className="font-semibold mb-3">Sample Product</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Product:</span>
                        <span className="font-medium">M6 Hex Bolts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span className="font-medium text-orange-500">45 units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min Stock:</span>
                        <span className="font-medium">50 units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-medium">Warehouse A-12</span>
                      </div>
                    </div>
                    <div className="mt-4 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <span className="text-orange-700 dark:text-orange-300 text-sm">⚠️ Low stock alert triggered</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'branding' && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Custom Branding</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customization Options</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">🎨</span>
                        <span>Custom color schemes</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">📷</span>
                        <span>Logo upload and positioning</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">✏️</span>
                        <span>Typography selection</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">🎭</span>
                        <span>Style themes</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <h4 className="font-semibold mb-3">Current Branding</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Company Name:</span>
                        <p className="font-medium">{branding.companyName || 'CHABS Inventory'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Primary Color:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: branding.primaryColor }}
                          ></div>
                          <span className="text-sm font-mono">{branding.primaryColor}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Font Family:</span>
                        <p className="font-medium" style={{ fontFamily: branding.fontFamily }}>
                          {branding.fontFamily}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Default content for other demos */}
            {!['dashboard', 'inventory', 'branding'].includes(activeDemo) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {demoSections.find(s => s.id === activeDemo)?.icon}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {demoSections.find(s => s.id === activeDemo)?.title}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {demoSections.find(s => s.id === activeDemo)?.description}
                </p>
                <div className="card p-6 max-w-md mx-auto">
                  <p className="text-muted-foreground">
                    This demo section is coming soon. Contact us to learn more about this feature.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="card glass p-8 border-gradient">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-muted-foreground mb-6">
                Experience the full power of CHABS with your own data
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="btn btn-primary px-8 py-3 text-lg font-semibold shadow-glow"
              >
                Start Your Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}