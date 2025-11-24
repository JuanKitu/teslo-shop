'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

interface Props {
  icon: React.ReactNode;
  urlPath: string;
  name: string;
}

export function AdminMenuItem({ icon, urlPath, name }: Props) {
  const currentPath = usePathname();
  const { theme } = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  const isDark = theme === 'dark';
  const isActive = currentPath === urlPath;

  return (
    <Link
      href={urlPath}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
        'hover:scale-[1.02]',
        isActive
          ? isDark
            ? 'bg-blue-950/30 text-blue-400 border border-blue-900'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
          : isDark
            ? 'text-gray-300 hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <div
        className={clsx(
          'transition-colors',
          isActive
            ? isDark
              ? 'text-blue-400'
              : 'text-blue-600'
            : isDark
              ? 'text-gray-400'
              : 'text-gray-500'
        )}
      >
        {icon}
      </div>
      <p className="text-sm font-medium leading-normal">{name}</p>
    </Link>
  );
}
