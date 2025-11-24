'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import { SearchAnalytics } from '@/interfaces';

interface Props {
  analytics: SearchAnalytics[];
}

export function SearchAnalyticsTable({ analytics }: Props) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />;
  }

  const isDark = theme === 'dark';

  return (
    <div className="overflow-x-auto">
      <table
        className={clsx(
          'min-w-full rounded-lg overflow-hidden shadow-lg',
          isDark ? 'bg-[var(--color-card)] text-[var(--color-text)]' : 'bg-white text-gray-900'
        )}
      >
        <thead className={clsx('border-b', isDark ? 'bg-[var(--color-border)]' : 'bg-gray-200')}>
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium">Término</th>
            <th className="px-6 py-4 text-left text-sm font-medium">Búsquedas</th>
            <th className="px-6 py-4 text-left text-sm font-medium">Resultados</th>
            <th className="px-6 py-4 text-left text-sm font-medium">Tasa de éxito</th>
            <th className="px-6 py-4 text-left text-sm font-medium">Última búsqueda</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map((item, index) => {
            const successRate =
              item.searchCount > 0
                ? ((item.resultsFound / item.searchCount) * 100).toFixed(1)
                : '0';

            const needsAttention = parseFloat(successRate) < 50;

            return (
              <tr
                key={`${item.term}-${index}`}
                className={clsx(
                  'border-b transition-colors',
                  isDark
                    ? 'border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.05)]'
                    : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <td className="px-6 py-4 font-medium capitalize">{item.term}</td>
                <td className="px-6 py-4">{item.searchCount}</td>
                <td className="px-6 py-4">{item.resultsFound}</td>
                <td className="px-6 py-4">
                  <span
                    className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      needsAttention
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                    )}
                  >
                    {successRate}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(item.lastSearched).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={clsx('p-4 rounded-lg', isDark ? 'bg-[var(--color-card)]' : 'bg-white')}>
          <h3 className="text-sm font-medium mb-2">Búsquedas sin resultados</h3>
          <p className="text-2xl font-bold">
            {analytics.filter((a) => a.resultsFound === 0).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Considera agregar estos productos</p>
        </div>

        <div className={clsx('p-4 rounded-lg', isDark ? 'bg-[var(--color-card)]' : 'bg-white')}>
          <h3 className="text-sm font-medium mb-2">Total de búsquedas</h3>
          <p className="text-2xl font-bold">
            {analytics.reduce((sum, a) => sum + a.searchCount, 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">En los últimos 30 días</p>
        </div>

        <div className={clsx('p-4 rounded-lg', isDark ? 'bg-[var(--color-card)]' : 'bg-white')}>
          <h3 className="text-sm font-medium mb-2">Términos únicos</h3>
          <p className="text-2xl font-bold">{analytics.length}</p>
          <p className="text-xs text-gray-500 mt-1">Diferentes búsquedas realizadas</p>
        </div>
      </div>
    </div>
  );
}
