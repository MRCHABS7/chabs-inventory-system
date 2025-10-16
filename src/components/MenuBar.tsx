import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { me, logout } from '../lib/auth-simple';
import { useTheme } from '../contexts/ThemeContext';

interface MenuBarProps {
  onSearch?: (term: string) => void;
}

interface MenuItem {
  label?: string;
  action?: () => void;
  shortcut?: string;
  divider?: boolean;
  checked?: boolean;
  adminOnly?: boolean;
  disabled?: boolean;
}

export default function MenuBar({ onSearch }: MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const user = me();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const menuItems: { label: string; items: MenuItem[] }[] = [
    {
      label: 'File',
      items: [
        { label: 'New Quotation', action: () => router.push('/quotations'), shortcut: 'Ctrl+N' },
        { label: 'New Customer', action: () => router.push('/customers'), shortcut: 'Ctrl+Shift+C' },
        { label: 'New Product', action: () => router.push('/products'), shortcut: 'Ctrl+Shift+P' },
        { label: 'New Order', action: () => router.push('/orders'), shortcut: 'Ctrl+Shift+O' },
        { divider: true },
        { label: 'Import Data', action: () => router.push('/settings'), shortcut: 'Ctrl+I' },
        { label: 'Export Data', action: () => router.push('/settings'), shortcut: 'Ctrl+E' },
        { divider: true },
        { label: 'Print Preview', action: () => window.print(), shortcut: 'Ctrl+P' },
        { label: 'Print', action: () => window.print(), shortcut: 'Ctrl+Shift+P' },
        { divider: true },
        { label: 'Exit', action: () => logout(), shortcut: 'Alt+F4' }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', action: () => document.execCommand('undo'), shortcut: 'Ctrl+Z' },
        { label: 'Redo', action: () => document.execCommand('redo'), shortcut: 'Ctrl+Y' },
        { divider: true },
        { label: 'Cut', action: () => document.execCommand('cut'), shortcut: 'Ctrl+X' },
        { label: 'Copy', action: () => document.execCommand('copy'), shortcut: 'Ctrl+C' },
        { label: 'Paste', action: () => document.execCommand('paste'), shortcut: 'Ctrl+V' },
        { divider: true },
        { label: 'Select All', action: () => document.execCommand('selectAll'), shortcut: 'Ctrl+A' },
        { label: 'Find', action: () => setShowSearch(true), shortcut: 'Ctrl+F' },
        { label: 'Find and Replace', action: () => setShowSearch(true), shortcut: 'Ctrl+H' },
        { divider: true },
        { label: 'Preferences', action: () => router.push('/settings'), shortcut: 'Ctrl+,' }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Dashboard', action: () => router.push('/dashboard'), shortcut: 'Ctrl+1' },
        { label: 'Customers', action: () => router.push('/customers'), shortcut: 'Ctrl+2' },
        { label: 'Products', action: () => router.push('/products'), shortcut: 'Ctrl+3' },
        { label: 'Quotations', action: () => router.push('/quotations'), shortcut: 'Ctrl+4' },
        { label: 'Orders', action: () => router.push('/orders'), shortcut: 'Ctrl+5' },
        { divider: true },
        { label: 'Refresh', action: () => window.location.reload(), shortcut: 'F5' },
        { label: 'Full Screen', action: () => document.documentElement.requestFullscreen(), shortcut: 'F11' },
        { divider: true },
        { label: 'Light Theme', action: () => toggleTheme(), checked: theme === 'light' },
        { label: 'Dark Theme', action: () => toggleTheme(), checked: theme === 'dark' },
        { label: 'Auto Theme', action: () => toggleTheme(), checked: theme === 'auto' },
        { divider: true },
        { label: 'Zoom In', action: () => document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') + 0.1).toString(), shortcut: 'Ctrl++' },
        { label: 'Zoom Out', action: () => document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') - 0.1).toString(), shortcut: 'Ctrl+-' },
        { label: 'Reset Zoom', action: () => document.body.style.zoom = '1', shortcut: 'Ctrl+0' }
      ]
    },
    {
      label: 'Tools',
      items: [
        { label: 'Calculator', action: () => window.open('calc://'), shortcut: 'Ctrl+Alt+C' },
        { label: 'Calendar', action: () => window.open('https://calendar.google.com'), shortcut: 'Ctrl+Alt+D' },
        { divider: true },
        { label: 'Backup Data', action: () => router.push('/settings'), shortcut: 'Ctrl+B' },
        { label: 'Restore Data', action: () => router.push('/settings'), shortcut: 'Ctrl+R' },
        { divider: true },
        { label: 'System Settings', action: () => router.push('/settings'), shortcut: 'Ctrl+Alt+S' },
        { label: 'User Management', action: () => router.push('/settings'), shortcut: 'Ctrl+Alt+U', adminOnly: true },
        { label: 'Email Settings', action: () => router.push('/settings'), shortcut: 'Ctrl+Alt+E', adminOnly: true },
        { divider: true },
        { label: 'Generate Reports', action: () => router.push('/reports'), shortcut: 'Ctrl+Alt+R' },
        { label: 'Analytics Dashboard', action: () => router.push('/reports'), shortcut: 'Ctrl+Alt+A' }
      ]
    },
    {
      label: 'Window',
      items: [
        { label: 'Minimize', action: () => {}, shortcut: 'Alt+F9' },
        { label: 'Maximize', action: () => {}, shortcut: 'Alt+F10' },
        { label: 'Close', action: () => window.close(), shortcut: 'Alt+F4' },
        { divider: true },
        { label: 'New Window', action: () => window.open(window.location.href), shortcut: 'Ctrl+N' },
        { label: 'New Tab', action: () => window.open(window.location.href, '_blank'), shortcut: 'Ctrl+T' },
        { divider: true },
        { label: 'Split View', action: () => {}, disabled: true },
        { label: 'Tile Windows', action: () => {}, disabled: true }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'User Manual', action: () => router.push('/manual'), shortcut: 'F1', adminOnly: true },
        { label: 'Quick Start Guide', action: () => alert('Quick Start Guide coming soon!'), shortcut: 'Ctrl+F1' },
        { label: 'Keyboard Shortcuts', action: () => setActiveMenu('shortcuts'), shortcut: 'Ctrl+/' },
        { label: 'Video Tutorials', action: () => window.open('https://youtube.com'), shortcut: 'Ctrl+Alt+V' },
        { divider: true },
        { label: 'Check for Updates', action: () => alert('You are using the latest version!'), shortcut: 'Ctrl+U' },
        { label: 'Report a Bug', action: () => window.open('mailto:support@chabs.com?subject=Bug Report'), shortcut: 'Ctrl+Alt+B' },
        { label: 'Contact Support', action: () => window.open('mailto:support@chabs.com'), shortcut: 'Ctrl+Alt+H' },
        { divider: true },
        { label: 'About CHABS', action: () => setActiveMenu('about'), shortcut: 'Ctrl+Alt+A' }
      ]
    }
  ];

  const shortcuts = [
    { category: 'General', items: [
      { key: 'Ctrl+N', description: 'New Quotation' },
      { key: 'Ctrl+S', description: 'Save' },
      { key: 'Ctrl+P', description: 'Print' },
      { key: 'Ctrl+F', description: 'Find/Search' },
      { key: 'F5', description: 'Refresh' },
      { key: 'F11', description: 'Full Screen' }
    ]},
    { category: 'Navigation', items: [
      { key: 'Ctrl+1', description: 'Dashboard' },
      { key: 'Ctrl+2', description: 'Customers' },
      { key: 'Ctrl+3', description: 'Products' },
      { key: 'Ctrl+4', description: 'Quotations' },
      { key: 'Ctrl+5', description: 'Orders' }
    ]},
    { category: 'Editing', items: [
      { key: 'Ctrl+Z', description: 'Undo' },
      { key: 'Ctrl+Y', description: 'Redo' },
      { key: 'Ctrl+C', description: 'Copy' },
      { key: 'Ctrl+V', description: 'Paste' },
      { key: 'Ctrl+A', description: 'Select All' }
    ]}
  ];

  return (
    <div ref={menuRef} className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
      {/* Menu Bar */}
      <div className="flex items-center justify-between px-4 py-1">
        <div className="flex items-center space-x-1">
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                className={`px-3 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
                  activeMenu === menu.label ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
                onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
              >
                {menu.label}
              </button>
              
              {activeMenu === menu.label && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-48">
                  {menu.items.map((item, index) => {
                    if (item.divider) {
                      return <div key={index} className="border-t border-gray-200 dark:border-gray-600 my-1" />;
                    }
                    
                    if (item.adminOnly && user?.role !== 'admin') {
                      return null;
                    }
                    
                    return (
                      <button
                        key={index}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                          item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => {
                          if (!item.disabled && item.action) {
                            item.action();
                            setActiveMenu(null);
                          }
                        }}
                        disabled={item.disabled}
                      >
                        <span className="flex items-center">
                          {item.checked && <span className="mr-2">✓</span>}
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-l bg-white dark:bg-gray-700"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-r hover:bg-blue-700"
              >
                🔍
              </button>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="ml-1 px-2 py-1 text-gray-500 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="px-3 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="Search (Ctrl+F)"
            >
              🔍
            </button>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {activeMenu === 'shortcuts' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
              <button
                onClick={() => setActiveMenu(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {shortcuts.map((category) => (
                <div key={category.category}>
                  <h3 className="font-medium mb-3 text-purple-600 dark:text-purple-400">
                    {category.category}
                  </h3>
                  <div className="space-y-2">
                    {category.items.map((shortcut) => (
                      <div key={shortcut.key} className="flex justify-between text-sm">
                        <span>{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {activeMenu === 'about' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-xl font-semibold mb-2">CHABS Inventory Management</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Version 2.0.0</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                A comprehensive business management system for South African businesses.
                Built with Next.js, TypeScript, and modern web technologies.
              </p>
              <div className="text-xs text-gray-400 dark:text-gray-600 mb-4">
                © 2024 CHABS Systems. All rights reserved.
              </div>
              <button
                onClick={() => setActiveMenu(null)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}