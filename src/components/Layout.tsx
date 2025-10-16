import { ReactNode, useState, useEffect } from 'react';
import Navigation from './Navigation';
import MenuBar from './MenuBar';
import StatusBar from './StatusBar';
import { me } from '../lib/auth-simple';
import { useBranding } from '../contexts/BrandingContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { branding } = useBranding();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    setIsClient(true);
    setUser(me());
  }, []);

  const shouldShowNav = showNavigation && user && isClient;

  return (
    <div className="min-h-screen bg-background pb-6">
      {shouldShowNav && <MenuBar />}
      {shouldShowNav && <Navigation />}
      <div className={shouldShowNav ? 'pt-0' : ''}>
        {children}
      </div>
      {shouldShowNav && <StatusBar />}
      
      {/* Footer */}
      {shouldShowNav && (
        <footer className="bg-surface border-t border-border mt-20">
          <div className="container py-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  {branding.logoUrl ? (
                    <img 
                      src={branding.logoUrl} 
                      alt="Company Logo" 
                      className="h-8 w-auto"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">C</span>
                    </div>
                  )}
                  <span className="font-bold text-foreground">
                    <span className="text-lg">CHABS</span>
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Advanced Business Management System for modern enterprises.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Inventory Management</li>
                  <li>Purchase Orders</li>
                  <li>Warehouse Control</li>
                  <li>Professional Quotes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">Support</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Documentation</li>
                  <li>Help Center</li>
                  <li>Contact Support</li>
                  <li>Training</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">System Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-muted-foreground">All Systems Operational</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-muted-foreground">AI Services Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 flex justify-between items-center">
              <p className="text-muted-foreground text-sm">
                © 2024 CHABS Inventory System. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <span>v2.0.0</span>
                <span>•</span>
                <span>Last updated: {isClient ? new Date().toLocaleDateString() : '--/--/----'}</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}