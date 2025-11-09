'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Product } from '@/interfaces';
import { ProductImage, FavoriteButton } from '@/components';
import { getProductGridItemStyles } from './styles';
import { ProductGridItemSkeleton } from '@/components';

interface Props {
  product: Product;
}

export function ProductGridItem({ product }: Props) {
  const [displayImage, setDisplayImage] = useState(product.images[0]);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Mostrar skeleton mientras carga el tema
  if (!mounted) {
    return <ProductGridItemSkeleton />;
  }

  const isDark = theme === 'dark';
  const styles = getProductGridItemStyles(isDark);

  const changeImage = (imageIndex: number) => {
    // Verificar que existe la imagen antes de cambiar
    if (product.images[imageIndex]) {
      setDisplayImage(product.images[imageIndex]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {/* 📸 Contenedor con proporción fija */}
        <Link href={`/product/${product.slug}`}>
          <div className={styles.imageWrapper}>
            <ProductImage
              src={displayImage}
              alt={product.title}
              fill
              adaptiveBackground={isDark ? 'dark' : 'light'}
              className={styles.image}
              onMouseEnter={() => changeImage(1)}
              onMouseLeave={() => changeImage(0)}
            />
          </div>
        </Link>

        {/* Botón de favoritos */}
        <div className={styles.favoriteButton}>
          <FavoriteButton product={product} />
        </div>
      </div>

      {/* Información del producto */}
      <div className={styles.content}>
        <Link className={styles.title} href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className={styles.price}>${product.price}</span>
      </div>
    </div>
  );
}
