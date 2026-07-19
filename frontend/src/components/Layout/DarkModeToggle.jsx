import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Default to light mode (cream background) instead of system dark preference
    const theme = localStorage.getItem('theme');
    
    if (theme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-350 cursor-pointer ${className}`}
      aria-label="Toggle theme mode"
      id="theme-toggle-btn"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 rotate-0 transition-transform duration-500" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 rotate-0 transition-transform duration-500" />
      )}
    </button>
  );
}
