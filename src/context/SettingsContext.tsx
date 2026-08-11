import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types/index.js';
import { fetchSiteSettings } from '../lib/api.js';

const defaultSettings: SiteSettings = {
  businessName: 'Trusted Cars',
  ownerName: 'Hitesh Modi',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'trustedcars.delhi@gmail.com',
  address: 'Shop No. 12-14, Block 5, Saraswati Marg, Karol Bagh, New Delhi, Delhi 110005',
  description: 'Delhi’s premier pre-owned car dealership.',
  socialLinks: {
    facebook: 'https://facebook.com/trustedcarsdelhi',
    instagram: 'https://instagram.com/trustedcarsdelhi',
    youtube: 'https://youtube.com/trustedcarsdelhi',
  },
  workingHours: 'Monday - Sunday: 10:00 AM - 8:00 PM',
  businessHours: 'Monday - Sunday: 10:00 AM - 8:00 PM',
};

interface SettingsContextType {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  refreshSettings: async () => {},
  updateSettings: () => {},
  loading: true,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await fetchSiteSettings();
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('Using default site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
