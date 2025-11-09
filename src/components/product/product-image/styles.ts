import clsx from 'clsx';
import type { AdaptiveIntensity } from './product-image.interface';

/**
 * Obtiene las clases de estilo según la intensidad adaptativa
 */
export const getAdaptiveStyles = (isDark: boolean, intensity: AdaptiveIntensity = 'medium') => {
  // Si está en modo claro o intensidad es false, no aplicar estilos
  if (!isDark || intensity === false) {
    return {
      wrapper: '',
      image: '',
      overlay: '',
    };
  }

  // Variantes de intensidad
  const variants = {
    light: {
      wrapper: 'bg-gray-800',
      image: 'brightness-[0.90] contrast-[0.95]',
      overlay: 'from-black/5',
    },
    medium: {
      wrapper: 'bg-gray-900',
      image: 'brightness-[0.85] contrast-[0.92] saturate-[0.95]',
      overlay: 'from-black/10',
    },
    dark: {
      wrapper: 'bg-gray-950',
      image: 'brightness-[0.75] contrast-[0.85] saturate-[0.90]',
      overlay: 'from-black/15',
    },
  };

  // Si intensity es true, usar medium por defecto
  const selectedVariant = intensity === true ? variants.medium : variants[intensity];

  return {
    wrapper: clsx(
      'relative overflow-hidden inline-block transition-colors duration-300',
      selectedVariant.wrapper
    ),
    image: clsx('transition-all duration-300', selectedVariant.image),
    overlay: clsx(
      'absolute inset-0 pointer-events-none transition-opacity duration-300',
      'bg-gradient-to-t to-transparent',
      selectedVariant.overlay
    ),
  };
};

/**
 * Obtiene las clases para el wrapper según el modo fill
 */
export const getWrapperClasses = (fill?: boolean) => {
  return clsx(fill && 'w-full h-full');
};
