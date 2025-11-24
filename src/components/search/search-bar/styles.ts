import clsx from 'clsx';

export const getSearchBarStyles = (isDark: boolean) => ({
  container: 'relative w-full max-w-2xl',

  inputWrapper: clsx(
    'relative flex items-center rounded-lg transition-all duration-200',
    'border-2',
    isDark
      ? 'bg-[var(--color-card)] border-[var(--color-border)] focus-within:border-blue-500'
      : 'bg-white border-gray-300 focus-within:border-blue-500'
  ),

  input: clsx(
    'w-full px-4 py-2.5 pl-10 pr-10 rounded-lg',
    'focus:outline-none transition-colors',
    isDark
      ? 'bg-transparent text-[var(--color-text)] placeholder:text-gray-500'
      : 'bg-transparent text-gray-900 placeholder:text-gray-400'
  ),

  iconSearch: clsx('absolute left-3 w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500'),

  iconClear: clsx(
    'absolute right-3 w-5 h-5 cursor-pointer transition-colors',
    isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
  ),

  spinner:
    'absolute right-3 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin',

  dropdown: clsx(
    'absolute top-full left-0 right-0 mt-2 rounded-lg shadow-2xl',
    'border overflow-hidden z-50 max-h-[600px] overflow-y-auto',
    isDark ? 'bg-[var(--color-card)] border-[var(--color-border)]' : 'bg-white border-gray-200'
  ),

  section: 'py-2',

  sectionTitle: clsx(
    'px-4 py-2 text-xs font-semibold uppercase tracking-wider',
    isDark ? 'text-gray-400' : 'text-gray-500'
  ),

  resultItem: (isSelected: boolean) =>
    clsx(
      'px-4 py-3 cursor-pointer transition-colors flex items-center gap-3',
      isSelected
        ? isDark
          ? 'bg-blue-950/30 text-blue-400'
          : 'bg-blue-50 text-blue-600'
        : isDark
          ? 'hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-text)]'
          : 'hover:bg-gray-50 text-gray-900'
    ),

  trendingItem: clsx(
    'px-4 py-2 cursor-pointer transition-colors flex items-center justify-between',
    isDark
      ? 'hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-text)]'
      : 'hover:bg-gray-50 text-gray-900'
  ),

  recentItem: clsx(
    'px-4 py-2 cursor-pointer transition-colors flex items-center justify-between group',
    isDark
      ? 'hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-text)]'
      : 'hover:bg-gray-50 text-gray-900'
  ),

  emptyState: clsx('px-4 py-8 text-center', isDark ? 'text-gray-400' : 'text-gray-500'),

  badge: (type: 'new' | 'bestseller' | 'trending') =>
    clsx(
      'px-2 py-0.5 rounded-full text-xs font-medium',
      type === 'new' &&
        (isDark
          ? 'bg-green-950/30 text-green-400 border border-green-900'
          : 'bg-green-100 text-green-700'),
      type === 'bestseller' &&
        (isDark
          ? 'bg-yellow-950/30 text-yellow-400 border border-yellow-900'
          : 'bg-yellow-100 text-yellow-700'),
      type === 'trending' &&
        (isDark
          ? 'bg-purple-950/30 text-purple-400 border border-purple-900'
          : 'bg-purple-100 text-purple-700')
    ),

  trendIcon: (trend: 'up' | 'down' | 'stable') =>
    clsx(
      'w-4 h-4',
      trend === 'up' && 'text-green-500',
      trend === 'down' && 'text-red-500',
      trend === 'stable' && 'text-gray-400'
    ),
});
