import clsx from 'clsx';

export const getVariantImagePickerStyles = (isDark: boolean) => ({
  container: 'flex flex-wrap gap-2',

  emptyState: clsx(
    'text-sm p-4 rounded-md text-center',
    isDark
      ? 'text-gray-400 bg-[rgba(255,255,255,0.05)] border border-[var(--color-border)]'
      : 'text-gray-500 bg-gray-50 border border-gray-200'
  ),

  label: clsx(
    'text-sm font-medium mb-2 block',
    isDark ? 'text-[var(--color-text)]' : 'text-gray-700'
  ),

  imageButton: (isSelected: boolean) =>
    clsx(
      'relative rounded-md overflow-hidden border-2 transition-all cursor-pointer',
      // ✅ Estilos base sin confusión
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      // Estados condicionales claros
      isSelected
        ? isDark
          ? 'border-blue-500 shadow-lg shadow-blue-500/20 focus-visible:ring-blue-500'
          : 'border-blue-500 shadow-lg shadow-blue-500/30 focus-visible:ring-blue-500'
        : isDark
          ? 'border-[var(--color-border)] hover:border-blue-400 focus-visible:ring-blue-400'
          : 'border-gray-300 hover:border-blue-400 focus-visible:ring-blue-400',
      // ✅ Offset según tema
      isDark ? 'focus-visible:ring-offset-[var(--color-card)]' : 'focus-visible:ring-offset-white',
      // Animaciones
      'hover:scale-105 active:scale-95'
    ),

  overlay: (isSelected: boolean) =>
    clsx(
      'absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center',
      'text-white text-xs font-bold transition-all shadow-md',
      isSelected ? 'bg-blue-600 scale-110' : 'bg-black/60 scale-100'
    ),

  badge: clsx(
    'text-xs px-2 py-1 rounded-full inline-block mb-2',
    isDark
      ? 'bg-blue-950/30 text-blue-400 border border-blue-900'
      : 'bg-blue-50 text-blue-600 border border-blue-200'
  ),
});
