'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`
        relative h-8 w-16 rounded-full p-1 transition-colors duration-500 border-2 border-gray-200
        ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-700'}
      `}
    >
      <div
        className={`
          flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform duration-500 -translate-y-0.5
          ${theme === 'light' ? 'translate-x-0' : 'translate-x-7'}
        `}
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700" />
        )}
      </div>
    </button>
  );
}
