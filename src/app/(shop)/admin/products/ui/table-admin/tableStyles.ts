import clsx from 'clsx';

export const getTableStyles = (isDark: boolean) => ({
  table: clsx(
    'min-w-full rounded-lg overflow-hidden shadow',
    isDark ? 'bg-[var(--color-card)] text-[var(--color-text)]' : 'bg-white text-gray-900'
  ),

  thead: clsx(
    'border-b',
    isDark ? 'bg-[var(--color-border)] border-[var(--color-border)]' : 'bg-gray-200 border-gray-300'
  ),

  row: clsx(
    'border-b transition duration-300 ease-in-out',
    isDark
      ? 'border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.1)]'
      : 'bg-white border-gray-300 hover:bg-gray-100'
  ),

  link: clsx('hover:underline', isDark ? 'text-blue-400' : 'text-blue-600'),

  emptyState: clsx(
    'p-8 text-center rounded-lg',
    isDark ? 'bg-[var(--color-card)] text-[var(--color-text)]' : 'bg-white text-gray-900'
  ),

  skeleton: 'min-w-full h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg',
});

export const TABLE_HEADERS = [
  'Imagen',
  'Título',
  'Precio',
  'Género',
  'Inventario',
  'Tallas',
] as const;
