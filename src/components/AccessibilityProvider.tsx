import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'xl';
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: 'normal' | 'large' | 'xl') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');

  useEffect(() => {
    // Load accessibility preferences
    const savedHighContrast = localStorage.getItem('chabs_high_contrast') === 'true';
    const savedReducedMotion = localStorage.getItem('chabs_reduced_motion') === 'true';
    const savedFontSize = localStorage.getItem('chabs_font_size') as 'normal' | 'large' | 'xl' || 'normal';

    setHighContrast(savedHighContrast);
    setReducedMotion(savedReducedMotion);
    setFontSize(savedFontSize);

    // Apply system preferences if not set
    if (!localStorage.getItem('chabs_reduced_motion')) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setReducedMotion(prefersReducedMotion);
    }
  }, []);

  useEffect(() => {
    // Apply accessibility settings to document
    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    document.documentElement.classList.remove('font-normal', 'font-large', 'font-xl');
    document.documentElement.classList.add(`font-${fontSize}`);

    // Save preferences
    localStorage.setItem('chabs_high_contrast', highContrast.toString());
    localStorage.setItem('chabs_reduced_motion', reducedMotion.toString());
    localStorage.setItem('chabs_font_size', fontSize);
  }, [highContrast, reducedMotion, fontSize]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      reducedMotion,
      fontSize,
      toggleHighContrast,
      toggleReducedMotion,
      setFontSize
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}