'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import {
  IoAppsOutline,
  IoHomeOutline,
  IoPeopleOutline,
  IoStatsChartOutline,
} from 'react-icons/io5';
import { PiPackageLight } from 'react-icons/pi';
import { AdminMenuItem, ThemeToggle } from '@/components';

const menuItems = [
  { icon: <IoHomeOutline size={20} />, urlPath: '/admin', name: 'Inicio' },
  { icon: <PiPackageLight size={20} />, urlPath: '/admin/orders', name: 'Ordenes' },
  { icon: <IoAppsOutline size={20} />, urlPath: '/admin/products', name: 'Productos' },
  { icon: <IoPeopleOutline size={20} />, urlPath: '/admin/users', name: 'Cuentas' },
  { icon: <IoStatsChartOutline size={20} />, urlPath: '/admin/analytics', name: 'Analytics' },
];

export function AdminMenu() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full min-h-[700px] flex-col justify-between bg-gray-50 dark:bg-gray-900 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={clsx(
        'flex h-full min-h-[700px] flex-col justify-between p-4 transition-colors',
        isDark
          ? 'bg-[var(--color-card)] border-r border-[var(--color-border)]'
          : 'bg-slate-50 border-r border-gray-200'
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1
            className={clsx(
              'text-base font-bold leading-normal',
              isDark ? 'text-[var(--color-text)]' : 'text-gray-900'
            )}
          >
            Tienda de artesanías
          </h1>
          <p
            className={clsx(
              'text-sm font-normal leading-normal',
              isDark ? 'text-blue-400' : 'text-blue-600'
            )}
          >
            Administrador
          </p>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-2">
          {menuItems.map(({ icon, urlPath, name }) => (
            <AdminMenuItem key={urlPath} icon={icon} urlPath={urlPath} name={name} />
          ))}
        </div>
      </div>

      {/* Footer (opcional) */}
      <div className={clsx('pt-4 border-t', isDark ? 'border-gray-700' : 'border-gray-200')}>
        <ThemeToggle />
        <p className={clsx('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>Version 1.0.0</p>
      </div>
    </div>
  );
}
