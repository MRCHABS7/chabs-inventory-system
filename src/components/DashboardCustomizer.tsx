import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardSettings {
  layout: 'modern' | 'classic' | 'compact' | 'cards' | 'minimal';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  cardStyle: 'glass' | 'solid' | 'gradient' | 'neon';
  animations: boolean;
  compactMode: boolean;
}

export default function DashboardCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<DashboardSettings>({
    layout: 'modern',
    fontSize: 'medium',
    cardStyle: 'glass',
    animations: true,
    compactMode: false
  });

  const { theme } = useTheme();

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('chabs_dashboard_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load dashboard settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    
    // Font size
    const fontSizes = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    root.style.fontSize = fontSizes[settings.fontSize];
    
    // Layout classes
    root.className = root.className.replace(/layout-\w+/g, '');
    root.classList.add(`layout-${settings.layout}`);
    
    // Card style
    root.className = root.className.replace(/cards-\w+/g, '');
    root.classList.add(`cards-${settings.cardStyle}`);
    
    // Animations
    if (settings.animations) {
      root.classList.add('animations-enabled');
    } else {
      root.classList.remove('animations-enabled');
    }
    
    // Compact mode
    if (settings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Save settings
    localStorage.setItem('chabs_dashboard_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof DashboardSettings>(
    key: K,
    value: DashboardSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Floating Customizer Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        style={{
          boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)',
        }}
      >
        <span className="text-xl group-hover:rotate-180 transition-transform duration-300">
          🎨
        </span>
      </button>

      {/* Customizer Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  🎨 Dashboard Customizer
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-8">
                {/* Layout Style */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📐 Layout Style
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'modern', label: 'Modern', icon: '🚀', desc: '3D cards with animations' },
                      { key: 'classic', label: 'Classic', icon: '📊', desc: 'Traditional business look' },
                      { key: 'compact', label: 'Compact', icon: '📱', desc: 'Space-efficient design' },
                      { key: 'cards', label: 'Cards', icon: '🃏', desc: 'Card-based layout' },
                      { key: 'minimal', label: 'Minimal', icon: '⚪', desc: 'Clean and simple' }
                    ].map(layout => (
                      <button
                        key={layout.key}
                        onClick={() => updateSetting('layout', layout.key as any)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          settings.layout === layout.key
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{layout.icon}</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {layout.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {layout.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🔤 Font Size
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { key: 'small', label: 'Small', size: '14px' },
                      { key: 'medium', label: 'Medium', size: '16px' },
                      { key: 'large', label: 'Large', size: '18px' },
                      { key: 'extra-large', label: 'Extra Large', size: '20px' }
                    ].map(size => (
                      <button
                        key={size.key}
                        onClick={() => updateSetting('fontSize', size.key as any)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          settings.fontSize === size.key
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                        style={{ fontSize: size.size }}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          Aa
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {size.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Style */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🎴 Card Style
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'glass', label: 'Glass', icon: '🔮', desc: 'Glassmorphism effect' },
                      { key: 'solid', label: 'Solid', icon: '⬜', desc: 'Solid backgrounds' },
                      { key: 'gradient', label: 'Gradient', icon: '🌈', desc: 'Gradient backgrounds' },
                      { key: 'neon', label: 'Neon', icon: '💫', desc: 'Neon glow effects' }
                    ].map(style => (
                      <button
                        key={style.key}
                        onClick={() => updateSetting('cardStyle', style.key as any)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          settings.cardStyle === style.key
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-xl mb-1">{style.icon}</div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {style.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {style.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle Options */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    ⚙️ Options
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          ✨ Animations
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Enable smooth animations and transitions
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.animations}
                          onChange={(e) => updateSetting('animations', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          📱 Compact Mode
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Reduce spacing for more content on screen
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.compactMode}
                          onChange={(e) => updateSetting('compactMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </label>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    👀 Preview
                  </h3>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="card p-4 mb-4">
                      <h4 className="font-semibold mb-2">Sample Card</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This is how your cards will look with the current settings.
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button className="btn btn-primary text-sm px-3 py-1">
                          Primary
                        </button>
                        <button className="btn btn-secondary text-sm px-3 py-1">
                          Secondary
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setSettings({
                      layout: 'modern',
                      fontSize: 'medium',
                      cardStyle: 'glass',
                      animations: true,
                      compactMode: false
                    });
                  }}
                  className="btn btn-secondary"
                >
                  🔄 Reset to Default
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary"
                >
                  ✅ Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}