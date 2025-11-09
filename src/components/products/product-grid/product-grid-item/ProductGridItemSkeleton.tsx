'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { getSkeletonStyles } from './styles';

export function ProductGridItemSkeleton() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar flash, mostrar versión neutra mientras monta
  const isDark = mounted ? theme === 'dark' : false;
  const styles = getSkeletonStyles(isDark);

  return (
    <div className={styles.container}>
      {/* Imagen skeleton */}
      <div className={styles.imageWrapper}>
        <div className="w-full h-full" />
      </div>

      {/* Contenido skeleton */}
      <div className={styles.content}>
        {/* Título (2 líneas) */}
        <div className={styles.title} />
        <div className={styles.titleShort} />

        {/* Precio */}
        <div className={styles.price} />
      </div>
    </div>
  );
}
