'use client';

import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  hydrate: () => void;
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    set({ theme });
  },

  toggle: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('theme') as Theme | null;
    const theme = stored || 'light';
    applyTheme(theme);
    set({ theme });
  },
}));

export function useChartColors() {
  const isDark = useThemeStore((s) => s.theme === 'dark');
  return {
    grid: isDark ? '#2A2A2A' : '#E8E4DE',
    tick: isDark ? '#A8A29E' : '#78716C',
    axis: isDark ? '#3A3A3A' : '#D6D3D1',
    tooltipBg: isDark ? '#1A1A1A' : '#FFFFFF',
    tooltipBorder: isDark ? '#2A2A2A' : '#E2DDD5',
    tooltipText: isDark ? '#FAFAF9' : '#1C1917',
    tooltipMuted: isDark ? '#A8A29E' : '#78716C',
  };
}
