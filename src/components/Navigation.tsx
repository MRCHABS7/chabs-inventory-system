import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logout, me } from '../lib/auth-simple';
import NotificationCenter from './NotificationCenter';
import { useBranding } from '../contexts/BrandingContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { branding } = useBranding();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    setUser(me());
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Role-based navigation items
  const getNavItems = () => {
    if (user?.role === 'warehouse') {
      return [
        { href: '/warehouse-dashboard', label: 'Dashboard' },
        { href: '/products', label: 'Products' },
        { href: '/orders', label: 'Orders' },
        { href: '/warehouse', label: 'Warehouse' },
        { href: '/suppliers', label: 'Suppliers' },
      ];
    }

    // Admin gets full access
    return [
      { href: '/admin-dashboard', label: 'Dashboard' },
      { href: '/customers', label: 'Customers' },
      { href: '/suppliers', label: 'Suppliers' },
      { href: '/products', label: 'Products' },
      { href: '/quotations', label: 'Quotes' },
      { href: '/orders', label: 'Orders' },
      { href: '/purchase-orders', label: 'Purchase Orders' },
      { href: '/warehouse', label: 'Warehouse' },
    ];
  };

  const navItems = getNavItems();

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <nav className="bg-gray-900 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50 shadow-xl">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-white text-2xl">CHABS</span>
                  <span className="text-sm text-white/80 ml-2">Inventory</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-gray-900 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50 shadow-xl">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Empty space where logo was */}
          <div className="flex items-center">
            {/* Logo removed as requested */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 interactive ${
                  router.pathname === item.href
                    ? 'bg-gray-700 text-white shadow-md border border-gray-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle moved to settings */}

            {/* Notifications */}
            <NotificationCenter />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors interactive"
              >
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center shadow-lg border border-gray-600">
                  <span className="text-white font-semibold text-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
                <span className="text-gray-400">▼</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-600">
                    <p className="text-xs text-gray-400 font-medium">Role</p>
                    <p className="text-sm font-medium text-white capitalize">{user.role}</p>
                  </div>
                  
                  <Link href="/profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                    Profile
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link href="/settings" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                      Settings
                    </Link>
                  )}
                  
                  <hr className="my-2 border-gray-600" />
                  {user.role === 'admin' && (
                    <>
                      <Link href="/manual" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                        User Manual
                      </Link>
                      <Link href="/technical-manual" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                        Technical Manual
                      </Link>
                    </>
                  )}
                  
                  <hr className="my-2 border-gray-600" />
                  <div className="px-4 py-1">
                    <p className="text-xs text-gray-400 font-medium">Features</p>
                  </div>
                  
                  {user.role === 'admin' && (
                    <>
                      <Link href="/automation" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                        Automation
                      </Link>
                      <Link href="/reports" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                        Reports
                      </Link>
                    </>
                  )}
                  
                  {user.role === 'warehouse' && (
                    <Link href="/reports" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                      Stock Reports
                    </Link>
                  )}
                  
                  <hr className="my-2 border-gray-600" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
            >
              <span className="text-xl">{isMenuOpen ? 'X' : 'Menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700 animate-slide-in">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push(item.href);
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all interactive ${
                    router.pathname === item.href
                      ? 'bg-gray-700 text-white border border-gray-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}