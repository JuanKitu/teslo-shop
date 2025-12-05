'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface Tab {
  name: string;
  href: string;
  count?: number;
}

interface TabsNavigationProps {
  tabs: Tab[];
}

export function TabsNavigation({ tabs }: TabsNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex gap-x-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={clsx(
                'shrink-0 border-b-2 px-1 pb-4 text-sm font-medium transition-colors',
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.name}
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'ml-2 rounded-full px-2 py-0.5 text-xs',
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
