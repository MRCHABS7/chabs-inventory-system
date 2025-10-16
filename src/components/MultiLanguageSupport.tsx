import React, { createContext, useContext, useState, useEffect } from 'react';

interface Translation {
  [key: string]: string | Translation;
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const translations: Record<string, Translation> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information'
    },
    navigation: {
      dashboard: 'Dashboard',
      products: 'Products',
      orders: 'Orders',
      customers: 'Customers',
      suppliers: 'Suppliers',
      warehouse: 'Warehouse',
      reports: 'Reports',
      settings: 'Settings'
    },
    products: {
      title: 'Products',
      name: 'Product Name',
      sku: 'SKU',
      price: 'Price',
      stock: 'Stock',
      category: 'Category',
      addProduct: 'Add Product',
      editProduct: 'Edit Product'
    },
    orders: {
      title: 'Orders',
      orderNumber: 'Order Number',
      customer: 'Customer',
      status: 'Status',
      total: 'Total',
      date: 'Date',
      createOrder: 'Create Order'
    }
  },
  es: {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Agregar',
      search: 'Buscar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      info: 'Información'
    },
    navigation: {
      dashboard: 'Panel',
      products: 'Productos',
      orders: 'Pedidos',
      customers: 'Clientes',
      suppliers: 'Proveedores',
      warehouse: 'Almacén',
      reports: 'Informes',
      settings: 'Configuración'
    },
    products: {
      title: 'Productos',
      name: 'Nombre del Producto',
      sku: 'SKU',
      price: 'Precio',
      stock: 'Stock',
      category: 'Categoría',
      addProduct: 'Agregar Producto',
      editProduct: 'Editar Producto'
    },
    orders: {
      title: 'Pedidos',
      orderNumber: 'Número de Pedido',
      customer: 'Cliente',
      status: 'Estado',
      total: 'Total',
      date: 'Fecha',
      createOrder: 'Crear Pedido'
    }
  },
  fr: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      search: 'Rechercher',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      warning: 'Avertissement',
      info: 'Information'
    },
    navigation: {
      dashboard: 'Tableau de bord',
      products: 'Produits',
      orders: 'Commandes',
      customers: 'Clients',
      suppliers: 'Fournisseurs',
      warehouse: 'Entrepôt',
      reports: 'Rapports',
      settings: 'Paramètres'
    },
    products: {
      title: 'Produits',
      name: 'Nom du Produit',
      sku: 'SKU',
      price: 'Prix',
      stock: 'Stock',
      category: 'Catégorie',
      addProduct: 'Ajouter un Produit',
      editProduct: 'Modifier le Produit'
    },
    orders: {
      title: 'Commandes',
      orderNumber: 'Numéro de Commande',
      customer: 'Client',
      status: 'Statut',
      total: 'Total',
      date: 'Date',
      createOrder: 'Créer une Commande'
    }
  },
  de: {
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      add: 'Hinzufügen',
      search: 'Suchen',
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      warning: 'Warnung',
      info: 'Information'
    },
    navigation: {
      dashboard: 'Dashboard',
      products: 'Produkte',
      orders: 'Bestellungen',
      customers: 'Kunden',
      suppliers: 'Lieferanten',
      warehouse: 'Lager',
      reports: 'Berichte',
      settings: 'Einstellungen'
    },
    products: {
      title: 'Produkte',
      name: 'Produktname',
      sku: 'SKU',
      price: 'Preis',
      stock: 'Lager',
      category: 'Kategorie',
      addProduct: 'Produkt hinzufügen',
      editProduct: 'Produkt bearbeiten'
    },
    orders: {
      title: 'Bestellungen',
      orderNumber: 'Bestellnummer',
      customer: 'Kunde',
      status: 'Status',
      total: 'Gesamt',
      date: 'Datum',
      createOrder: 'Bestellung erstellen'
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('chabs_language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chabs_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, replacement]) => {
        value = value.replace(new RegExp(`{{${param}}}`, 'g'), replacement);
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Language Selector Component
export function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="input pr-8 appearance-none"
        aria-label="Select language"
      >
        {availableLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}