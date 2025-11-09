'use client';

import { useTheme } from 'next-themes';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Cambiar tema"
      className={clsx(
        'flex items-center w-full p-2 rounded-md transition-all select-none',
        isDark ? 'hover:bg-[#222222] text-gray-100' : 'hover:bg-gray-100 text-gray-900'
      )}
    >
      {isDark ? (
        <>
          <IoSunnyOutline size={22} className="text-yellow-400" />
          <span className="ml-3 text-base">Modo claro</span>
        </>
      ) : (
        <>
          <IoMoonOutline size={22} className="text-gray-700" />
          <span className="ml-3 text-base">Modo oscuro</span>
        </>
      )}
    </button>
  );
}
