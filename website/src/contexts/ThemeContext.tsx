import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeName = 'darkNeutral' | 'neonPurple' | 'neonCyan' | 'vaporwave';

interface Theme {
  name: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
}

const themes: Record<ThemeName, Theme> = {
  darkNeutral: {
    name: 'Dark Neutral',
    background: '#0a0a0a',
    surface: '#141414',
    surfaceAlt: '#1a1a1a',
    border: '#262626',
    text: '#ffffff',
    textMuted: '#a3a3a3',
    accent: '#ffffff',
    accentGlow: 'rgba(255, 255, 255, 0.3)',
  },
  neonPurple: {
    name: 'Neon Purple',
    background: '#0a0612',
    surface: '#130d1c',
    surfaceAlt: '#1a1226',
    border: '#2d1f42',
    text: '#ffffff',
    textMuted: '#a78bfa',
    accent: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
  },
  neonCyan: {
    name: 'Neon Cyan',
    background: '#021114',
    surface: '#041a1f',
    surfaceAlt: '#062229',
    border: '#0d3d47',
    text: '#ffffff',
    textMuted: '#67e8f9',
    accent: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
  },
  vaporwave: {
    name: 'Vaporwave',
    background: '#0f0a1a',
    surface: '#1a1028',
    surfaceAlt: '#251538',
    border: '#3d2066',
    text: '#ffffff',
    textMuted: '#f0abfc',
    accent: '#ec4899',
    accentGlow: 'rgba(236, 72, 153, 0.4)',
  },
};

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (themeName: ThemeName) => void;
  themes: Record<ThemeName, Theme>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    if (typeof window === 'undefined') return 'darkNeutral';
    const stored = localStorage.getItem('innerCity_theme') as ThemeName;
    return stored && stored in themes ? stored : 'darkNeutral';
  });

  const theme = themes[themeName] || themes.darkNeutral;

  useEffect(() => {
    localStorage.setItem('innerCity_theme', themeName);
    document.documentElement.style.setProperty('--bg', theme.background);
    document.documentElement.style.setProperty('--surface', theme.surface);
    document.documentElement.style.setProperty('--surface-alt', theme.surfaceAlt);
    document.documentElement.style.setProperty('--border', theme.border);
    document.documentElement.style.setProperty('--text', theme.text);
    document.documentElement.style.setProperty('--text-muted', theme.textMuted);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-glow', theme.accentGlow);
  }, [themeName, theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
