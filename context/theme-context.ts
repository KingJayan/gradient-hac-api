import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { logWarning } from '../utils/error-logger';

export interface Theme {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

// modern dark themes with vibrant primaries inspired by grade viewer ui
export const THEMES: Record<string, Theme> = {
  emerald: {
    primary: '#00F5A0',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#2A2A2A',
  },
  ocean: {
    primary: '#4A9FFF',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#2A2A2A',
  },
  violet: {
    primary: '#A855F7',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#2A2A2A',
  },
  rose: {
    primary: '#F43F5E',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#2A2A2A',
  },
  amber: {
    primary: '#FCD34D',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#2A2A2A',
  },
  slate: {
    primary: '#94A3B8',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#2A2A2A',
  },
};

// extract constant to prevent reallocation on every render
const THEME_NAMES = Object.keys(THEMES) as readonly string[];

export interface ThemeContextType {
  currentTheme: Theme;
  themeName: string;
  availableThemes: string[];
  setTheme: (name: string) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = 'appTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState('emerald');
  const [loading, setLoading] = useState(true);

  // restore persisted theme on mount, prevent race condition
  useEffect(() => {
    SecureStore.getItemAsync(THEME_KEY)
      .then((saved) => {
        if (saved && THEMES[saved]) setThemeName(saved);
      })
      .catch((e) => {
        // graceful degradation but log for debugging
        logWarning('theme restore failed', { error: (e as Error).message });
      })
      .finally(() => setLoading(false));
  }, []);

  // persist theme change to securestore
  const setTheme = useCallback(async (name: string) => {
    if (!THEMES[name]) return;
    setThemeName(name);
    try {
      await SecureStore.setItemAsync(THEME_KEY, name);
    } catch (e) {
      // graceful degradation but log for debugging
      logWarning('theme persist failed', { themeName: name, error: (e as Error).message });
    }
  }, []);

  // memoize value to prevent unnecessary consumer re-renders
  const value: ThemeContextType = useMemo(
    () => ({
      currentTheme: THEMES[themeName] ?? THEMES.emerald, // defensive fallback
      themeName,
      availableThemes: THEME_NAMES,
      setTheme,
    }),
    [themeName, setTheme]
  );

  // prevent flash of wrong theme during restoration
  if (loading) return null;

  return React.createElement(ThemeContext.Provider, { value }, children);
}
