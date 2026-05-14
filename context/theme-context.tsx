import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export const themes: Record<string, Theme> = {
  emerald: {
    name: 'Emerald',
    primary: '#00D67E',
    secondary: '#00B86D',
    accent: '#00F5A0',
    background: '#f8f8f8',
    surface: '#fff',
    text: '#1a1a1a',
    textSecondary: '#999',
    border: '#e0e0e0',
  },
  ocean: {
    name: 'Ocean',
    primary: '#0EA5E9',
    secondary: '#0284C7',
    accent: '#38BDF8',
    background: '#f8fbff',
    surface: '#fff',
    text: '#1a1a1a',
    textSecondary: '#999',
    border: '#e0e0e0',
  },
  sunset: {
    name: 'Sunset',
    primary: '#F97316',
    secondary: '#EA580C',
    accent: '#FDBA74',
    background: '#fef7f0',
    surface: '#fff',
    text: '#1a1a1a',
    textSecondary: '#999',
    border: '#e0e0e0',
  },
  lavender: {
    name: 'Lavender',
    primary: '#A855F7',
    secondary: '#9333EA',
    accent: '#D8B4FE',
    background: '#faf8ff',
    surface: '#fff',
    text: '#1a1a1a',
    textSecondary: '#999',
    border: '#e0e0e0',
  },
  rose: {
    name: 'Rose',
    primary: '#EC4899',
    secondary: '#DB2777',
    accent: '#F472B6',
    background: '#fff8fa',
    surface: '#fff',
    text: '#1a1a1a',
    textSecondary: '#999',
    border: '#e0e0e0',
  },
  teal: {
    name: 'Teal',
    primary: '#14B8A6',
    secondary: '#0D9488',
    accent: '#2DD4BF',
    background: '#f8fffe',
    surface: '#fff',
    text: '#1a1a1a',
    textSecondary: '#999',
    border: '#e0e0e0',
  },
  amber: {
    name: 'Amber',
    primary: '#FBBF24',
    secondary: '#F59E0B',
    accent: '#FCD34D',
    background: '#fffbf0',
    surface: '#fff',
    text: '#1a1a1a',
    textSecondary: '#999',
    border: '#e0e0e0',
  },
  slate: {
    name: 'Slate',
    primary: '#64748B',
    secondary: '#475569',
    accent: '#94A3B8',
    background: '#f8fafc',
    surface: '#fff',
    text: '#1a1a1a',
    textSecondary: '#999',
    border: '#e0e0e0',
  },
  indigo: {
    name: 'Indigo',
    primary: '#6366F1',
    secondary: '#4F46E5',
    accent: '#818CF8',
    background: '#f8f8ff',
    surface: '#fff',
    text: '#1a1a1a',
    textSecondary: '#999',
    border: '#e0e0e0',
  },
};

export interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => Promise<void>;
  availableThemes: string[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.emerald);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync('app_theme');
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(themes[savedTheme]);
      }
    } catch (error) {
      console.error('[v0] Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themes[themeName]);
      try {
        await SecureStore.setItemAsync('app_theme', themeName);
      } catch (error) {
        console.error('[v0] Error saving theme:', error);
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        availableThemes: Object.keys(themes),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
