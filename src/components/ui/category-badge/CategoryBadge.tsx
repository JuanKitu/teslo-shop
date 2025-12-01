import React from 'react';
import clsx from 'clsx';

interface CategoryBadgeProps {
  name: string;
  className?: string;
}

export function CategoryBadge({ name, className }: CategoryBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        'bg-blue-100 text-blue-800',
        'dark:bg-blue-900 dark:text-blue-200',
        className
      )}
    >
      {name}
    </span>
  );
}
