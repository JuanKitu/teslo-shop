import clsx from 'clsx';

export const getFormStyles = (isDark: boolean) => ({
  container: 'grid grid-cols-1 lg:grid-cols-2 gap-6 px-5 sm:px-0 mb-20 items-start',

  card: clsx(
    'rounded-2xl shadow-lg p-6 border transition-colors',
    isDark
      ? 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)]'
      : 'bg-white border-gray-200 text-gray-900'
  ),

  heading: clsx(
    'text-lg font-semibold mb-4',
    isDark ? 'text-[var(--color-text)]' : 'text-gray-900'
  ),

  button: {
    primary: (isValid: boolean) =>
      clsx(
        'w-full py-2 rounded-md font-medium mt-4 transition-all',
        isValid
          ? isDark
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-gray-400 cursor-not-allowed text-gray-200'
      ),

    secondary: clsx(
      'flex items-center gap-2 font-medium transition-colors',
      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
    ),

    danger: clsx(
      'border-transparent',
      isDark
        ? 'text-red-400 hover:text-red-300 hover:bg-red-950/20 hover:border-red-900'
        : 'text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300'
    ),
  },

  alert: {
    error: clsx(
      'mt-4 flex items-center gap-2 text-sm p-3 rounded-md border',
      isDark ? 'text-red-400 bg-red-950/20 border-red-900' : 'text-red-600 bg-red-50 border-red-200'
    ),
  },

  variantCard: clsx(
    'grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 border rounded-md transition-colors',
    isDark
      ? 'bg-[rgba(255,255,255,0.05)] border-[var(--color-border)]'
      : 'bg-gray-50 border-gray-200'
  ),

  emptyState: clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-500'),

  skeleton: 'min-h-[600px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg',
});
