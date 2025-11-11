import React, { memo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ProductImage } from '@/components';
import { currencyFormat } from '@/utils';
import { getTableStyles } from './tableStyles';
import { useProductVariants } from './hooks/useProductVariants';
import { labelCategory } from './table.interface';
import type { ProductRowProps } from './table.interface';

const ProductRow = memo(({ product, isDark }: ProductRowProps) => {
  const firstImage = product.images?.[0] || '/placeholder.jpg';
  const styles = getTableStyles(isDark);

  const { totalInventory, availableSizes, availableColors, priceRange, inventoryStatus } =
    useProductVariants(product);

  // Determinar color del inventario
  const getInventoryColor = () => {
    switch (inventoryStatus) {
      case 'out-of-stock':
        return 'text-red-500';
      case 'low-stock':
        return 'text-yellow-500';
      case 'in-stock':
        return 'text-green-600';
      default:
        return '';
    }
  };

  return (
    <tr className={styles.row}>
      {/* Imagen */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Link
          href={`/product/${product.slug}`}
          aria-label={`Ver imagen de ${product.title}`}
          className="block"
        >
          <ProductImage
            src={firstImage}
            alt={product.title}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded hover:scale-105 transition-transform"
          />
        </Link>
      </td>

      {/* Título */}
      <td className="text-sm font-light px-6 py-4">
        <Link className={styles.link} href={`/admin/product/${product.slug}`}>
          <div className="max-w-xs">
            <p className="font-medium truncate">{product.title}</p>
          </div>
        </Link>
      </td>

      {/* Precio base */}
      <td className="text-sm font-bold px-6 py-4 whitespace-nowrap">
        {currencyFormat(product.price)}
        {priceRange && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Variante: {priceRange}</p>
        )}
      </td>

      {/* Género */}
      <td className="text-sm px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {labelCategory[product.gender]}
        </span>
      </td>

      {/* Inventario */}
      <td className={clsx('text-sm font-bold px-6 py-4 whitespace-nowrap', getInventoryColor())}>
        <div className="flex items-center gap-2">
          <span>{totalInventory}</span>
          {inventoryStatus === 'low-stock' && (
            <span className="text-xs" title="Stock bajo">
              ⚠️
            </span>
          )}
          {inventoryStatus === 'out-of-stock' && (
            <span className="text-xs" title="Sin stock">
              ❌
            </span>
          )}
        </div>
      </td>

      {/* Tallas y Colores */}
      <td className="text-sm px-6 py-4">
        <div className="max-w-xs">
          <div className="mb-1">
            <span className="font-semibold text-xs text-gray-600 dark:text-gray-400">Tallas:</span>
            <p className="text-xs truncate">{availableSizes}</p>
          </div>
          <div>
            <span className="font-semibold text-xs text-gray-600 dark:text-gray-400">Colores:</span>
            <p className="text-xs truncate capitalize">{availableColors}</p>
          </div>
        </div>
      </td>
    </tr>
  );
});

ProductRow.displayName = 'ProductRow';

export default ProductRow;
