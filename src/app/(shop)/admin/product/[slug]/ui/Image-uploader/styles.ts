import clsx from 'clsx';

export const getImageUploaderStyles = (isDark: boolean) => ({
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

  counter: clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-500'),

  skeleton: 'min-h-[300px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl',
});

export const getDropZoneStyles = (isDark: boolean, isDragActive: boolean) =>
  clsx(
    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
    isDragActive
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-105'
      : isDark
        ? 'border-[var(--color-border)] hover:border-blue-500 hover:bg-[rgba(255,255,255,0.02)]'
        : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

export const getDropZoneTextStyles = (isDark: boolean) => ({
  primary: isDark ? 'text-gray-300' : 'text-gray-700',
  secondary: clsx('text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-500'),
  dragActive: 'text-blue-500 font-medium',
});

export const getImageGridStyles = (isDark: boolean) => ({
  container: 'grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4',

  imageWrapper: clsx(
    'relative aspect-square overflow-hidden rounded-md shadow-sm group transition-all hover:shadow-lg',
    isDark
      ? 'bg-[var(--color-border)] ring-1 ring-[var(--color-border)]'
      : 'bg-gray-100 ring-1 ring-gray-200'
  ),

  deleteButton: clsx(
    'absolute top-2 right-2 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100',
    isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700',
    'text-white shadow-lg hover:scale-110'
  ),

  image: 'object-cover transition-transform group-hover:scale-110',
});

export const getLoadingSpinnerStyles = (isDark: boolean) => ({
  container: 'flex items-center gap-2 mt-4',
  spinner: 'w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin',
  text: clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-500'),
});
