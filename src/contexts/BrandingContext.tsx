import React, { createContext, useContext, useState, useEffect } from 'react';

interface BrandingSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  logoUrl?: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  membershipText: string;
  fontFamily?: string;
  quotationNotes: string;
}

interface BrandingContextType {
  branding: BrandingSettings;
  updateBranding: (settings: Partial<BrandingSettings>) => void;
}

const defaultBranding: BrandingSettings = {
  companyName: 'Your Company',
  companyEmail: 'info@yourcompany.com',
  companyPhone: '+1 (555) 123-4567',
  companyAddress: '123 Business St, City, State 12345',
  primaryColor: '#8B5CF6',
  secondaryColor: '#EC4899',
  accentColor: '#10B981',
  textColor: '#1F2937',
  backgroundColor: '#FFFFFF',
  membershipText: '',
  fontFamily: 'Inter',
  quotationNotes: '1. NETT Prices excluding VAT, Customs Duties, or any other statutory levies.\n2. Prices are valid for 45 days, subject to SEIFSA escalation.\n3. Settlement discount of 2.5% on payment within 30days from statement.\n4. Delivery time as per your requirements days from receipt of order.\n5. Prices include free delivery to the site.'
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);

  useEffect(() => {
    const saved = localStorage.getItem('brandingSettings');
    if (saved) {
      setBranding({ ...defaultBranding, ...JSON.parse(saved) });
    }
  }, []);

  const updateBranding = (settings: Partial<BrandingSettings>) => {
    const updated = { ...branding, ...settings };
    setBranding(updated);
    localStorage.setItem('brandingSettings', JSON.stringify(updated));
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within BrandingProvider');
  }
  return context;
};