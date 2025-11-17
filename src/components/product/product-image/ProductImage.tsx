'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import { getAdaptiveStyles, getWrapperClasses } from './styles';
import type { ProductImageProps } from './product-image.interface';

export function ProductImage({
  src,
  alt,
  className,
  width,
  height,
  fill,
  style,
  onMouseEnter,
  onMouseLeave,
  adaptiveBackground = 'medium',
  priority = false,
}: ProductImageProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ FIX: Verificar si ya tiene /products/ o si es URL externa
  const localSrc = (() => {
    if (!src) return '/imgs/placeholder.jpg';

    // Si ya es URL completa (http/https), usar directo
    if (src.startsWith('http')) return src;

    // Si ya empieza con /products/, usar directo
    if (src.startsWith('/products/')) return src;

    // Si empieza con /, usar directo (ruta absoluta)
    if (src.startsWith('/')) return src;

    // Si no, agregar prefijo /products/
    return `/products/${src}`;
  })();

  const isDark = mounted && theme === 'dark';

  // Sin adaptiveBackground o no montado, renderizar directo
  if (!adaptiveBackground || !mounted) {
    return (
      <Image
        src={localSrc}
        alt={alt}
        style={style}
        width={width}
        fill={fill}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        height={height}
        className={className}
        priority={priority}
      />
    );
  }

  const styles = getAdaptiveStyles(isDark, adaptiveBackground);
  const WrapperComponent = fill ? 'div' : 'span';

  return (
    <WrapperComponent
      className={clsx(styles.wrapper, getWrapperClasses(fill))}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={fill ? style : { width, height, ...style }}
    >
      <Image
        src={localSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={clsx(className, styles.image)}
        priority={priority}
      />

      {/* Overlay oscuro sutil */}
      {isDark && <div className={styles.overlay} />}
    </WrapperComponent>
  );
}
