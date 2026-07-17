import { useState, useEffect } from 'react';

/**
 * Toggles the `.dark` class on <html> for Tailwind dark mode.
 * Persists preference to localStorage.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('nearpay_theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('nearpay_theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('nearpay_theme', 'light');
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(v => !v) };
}
