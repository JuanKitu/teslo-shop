import clsx from 'clsx';

export const getProductGridItemStyles = (isDark: boolean) => ({
  container: clsx(
    'rounded-md overflow-hidden fade-in transition-all duration-300',
    'hover:shadow-lg',
    isDark ? 'bg-[var(--color-card)]' : 'bg-white'
  ),

  imageContainer: 'relative',

  imageWrapper: 'aspect-square relative w-full overflow-hidden rounded-2xl',

  image: 'object-cover transition-transform duration-300 hover:scale-105',

  favoriteButton: 'absolute top-2 right-2 z-10',

  content: clsx('p-4 flex flex-col gap-1', isDark ? 'text-[var(--color-text)]' : 'text-gray-900'),

  title: clsx(
    'hover:text-blue-600 transition-colors line-clamp-2',
    isDark ? 'text-[var(--color-text)]' : 'text-gray-900'
  ),

  price: clsx('font-bold text-lg', isDark ? 'text-[var(--color-text)]' : 'text-gray-900'),
});

export const getSkeletonStyles = (isDark: boolean) => ({
  container: clsx(
    'rounded-md overflow-hidden animate-pulse',
    isDark ? 'bg-[var(--color-card)]' : 'bg-white'
  ),

  imageWrapper: clsx('aspect-square w-full rounded-2xl', isDark ? 'bg-gray-700' : 'bg-gray-200'),

  content: 'p-4 flex flex-col gap-3',

  title: clsx('h-4 rounded', isDark ? 'bg-gray-700' : 'bg-gray-200'),

  titleShort: clsx('h-4 rounded w-2/3', isDark ? 'bg-gray-700' : 'bg-gray-200'),

  price: clsx('h-6 rounded w-24', isDark ? 'bg-gray-700' : 'bg-gray-200'),
});
