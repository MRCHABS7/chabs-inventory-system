import { useState } from 'react';
import Layout from '../components/Layout';
import { me } from '../lib/auth-simple';

export default function TechnicalManual() {
  const user = me();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p>Please log in to access the technical manual.</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'overview', title: '🎯 Overview', icon: '📋' },
    { id: 'architecture', title: '🏗️ System Architecture', icon: '🏗️' },
    { id: 'files', title: '📁 File Structure', icon: '📁' },
    { id: 'programming', title: '💻 Programming Basics', icon: '💻' },
    { id: 'issues', title: '🔧 Common Issues', icon: '🔧' },
    { id: 'changes', title: '✏️ Making Changes', icon: '✏️' },
    { id: 'troubleshooting', title: '🚨 Troubleshooting', icon: '🚨' },
    { id: 'deployment', title: '🚀 Deployment', icon: '🚀' },
    { id: 'database', title: '💾 Database Management', icon: '💾' },
    { id: 'security', title: '🔒 Security & Backup', icon: '🔒' },
    { id: 'performance', title: '⚡ Performance', icon: '⚡' },
    { id: 'tools', title: '🛠️ Development Tools', icon: '🛠️' },
    { id: 'help', title: '📞 Getting Help', icon: '📞' },
    { id: 'reference', title: '🎯 Quick Reference', icon: '🎯' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🎯 System Overview</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Welcome to Your Technical Manual</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This comprehensive guide contains everything you need to know about your CHABS Inventory Management System. 
                Since this system was built using AI assistance, this manual will help you understand, maintain, and modify 
                your application even if you're new to programming.
              </p>
            </div>
          </div>
        );
      // Additional cases will be added in the next part
      default:
        return <div>Content loading...</div>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Technical Manual</h2>
              
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search manual..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}