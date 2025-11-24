import clsx from 'clsx';

export const getUsersTableStyles = (isDark: boolean) => ({
  container: 'overflow-x-auto',

  table: clsx(
    'min-w-full rounded-lg overflow-hidden shadow-lg',
    isDark ? 'bg-[var(--color-card)] text-[var(--color-text)]' : 'bg-white text-gray-900'
  ),

  thead: clsx(
    'border-b',
    isDark ? 'bg-[var(--color-border)] border-[var(--color-border)]' : 'bg-gray-200 border-gray-300'
  ),

  th: clsx(
    'text-sm font-medium px-6 py-4 text-left',
    isDark ? 'text-[var(--color-text)]' : 'text-gray-900'
  ),

  row: clsx(
    'border-b transition duration-300 ease-in-out',
    isDark
      ? 'border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.05)]'
      : 'bg-white border-gray-300 hover:bg-gray-100'
  ),

  td: clsx(
    'px-6 py-4 whitespace-nowrap text-sm',
    isDark ? 'text-[var(--color-text)]' : 'text-gray-900'
  ),

  tdEmail: clsx(
    'px-6 py-4 whitespace-nowrap text-sm font-medium',
    isDark ? 'text-[var(--color-text)]' : 'text-gray-900'
  ),

  select: clsx(
    'text-sm p-2 rounded-md border transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    isDark
      ? 'bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)]'
      : 'bg-white text-gray-900 border-gray-300'
  ),

  badge: (role: string) =>
    clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      role === 'admin'
        ? isDark
          ? 'bg-purple-950/30 text-purple-400 border border-purple-900'
          : 'bg-purple-100 text-purple-800'
        : isDark
          ? 'bg-blue-950/30 text-blue-400 border border-blue-900'
          : 'bg-blue-100 text-blue-800'
    ),

  emptyState: clsx(
    'p-8 text-center rounded-lg',
    isDark ? 'bg-[var(--color-card)] text-[var(--color-text)]' : 'bg-white text-gray-900'
  ),

  skeleton: 'min-h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg',
});

// ✅ Nuevos estilos para cards mobile
export const getUserCardStyles = (isDark: boolean) => ({
  card: clsx(
    'p-4 rounded-lg border transition-colors',
    isDark ? 'bg-[var(--color-card)] border-[var(--color-border)]' : 'bg-white border-gray-200'
  ),

  select: clsx(
    'text-sm p-2 rounded-md border transition-colors w-full',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    isDark
      ? 'bg-[rgba(255,255,255,0.05)] text-[var(--color-text)] border-[var(--color-border)]'
      : 'bg-gray-50 text-gray-900 border-gray-300'
  ),

  badge: (role: string) =>
    clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
      role === 'admin'
        ? isDark
          ? 'bg-purple-950/30 text-purple-400 border border-purple-900'
          : 'bg-purple-100 text-purple-800'
        : isDark
          ? 'bg-blue-950/30 text-blue-400 border border-blue-900'
          : 'bg-blue-100 text-blue-800'
    ),
});

export const ROLE_OPTIONS = [
  { value: 'admin' as const, label: 'Administrador', color: 'purple' },
  { value: 'user' as const, label: 'Usuario', color: 'blue' },
];

export const TABLE_HEADERS = ['Email', 'Nombre completo', 'Rol'] as const;
