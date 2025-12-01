import React, { memo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { MdEdit, MdContentCopy, MdDelete } from 'react-icons/md';
import { ProductImage, ToggleSwitch } from '@/components';
import { currencyFormat } from '@/utils';
import { getTableStyles } from './tableStyles';
import { useProductVariants } from './hooks/useProductVariants';
import type { ProductRowProps } from './table.interface';

const ProductRow = memo(({ product, isDark }: ProductRowProps) => {
  const firstImage = product.images?.[0] || '/placeholder.jpg';
  const styles = getTableStyles(isDark);
  const [isActive, setIsActive] = useState(product.isActive ?? true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { totalInventory, availableSizes, availableColors, priceRange, inventoryStatus } =
    useProductVariants(product);

  // 🆕 Obtener categoría primaria o la primera disponible
  const primaryCategory = product.categories?.find((pc) => pc.isPrimary)?.category;
  const displayCategory = primaryCategory || product.categories?.[0]?.category;

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

  const handleToggle = async (checked: boolean) => {
    setIsActive(checked);
    // TODO: Implement update product active status
    console.log('Toggle product active:', product.id, checked);
  };

  const handleDuplicate = () => {
    // TODO: Implement duplicate product
    console.log('Duplicate product:', product.id);
  };

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar "${product.title}"?`)) return;

    setIsDeleting(true);
    // TODO: Implement delete product
    console.log('Delete product:', product.id);
    setIsDeleting(false);
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

      {/* 🆕 Categoría (reemplazo de Género) */}
      <td className="text-sm px-6 py-4 whitespace-nowrap">
        {displayCategory ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {displayCategory.name}
          </span>
        ) : (
          <span className="text-xs text-gray-400">Sin categoría</span>
        )}

        {/* Mostrar cantidad de categorías adicionales */}
        {product.categories && product.categories.length > 1 && (
          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
            +{product.categories.length - 1}
          </span>
        )}
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

      {/* Acciones */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end items-center gap-2">
          {/* Edit Button */}
          <Link
            href={`/admin/product/${product.slug}`}
            className={clsx(
              'p-1.5 rounded-md transition-colors',
              isDark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            )}
            title="Editar"
          >
            <MdEdit size={18} />
          </Link>

          {/* Duplicate Button */}
          <button
            onClick={handleDuplicate}
            className={clsx(
              'p-1.5 rounded-md transition-colors',
              isDark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            )}
            title="Duplicar"
          >
            <MdContentCopy size={18} />
          </button>

          {/* Toggle Active/Inactive */}
          <ToggleSwitch
            checked={isActive}
            onChange={handleToggle}
            ariaLabel={`${isActive ? 'Desactivar' : 'Activar'} ${product.title}`}
          />

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={clsx(
              'p-1.5 rounded-md transition-colors',
              'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500',
              isDeleting && 'opacity-50 cursor-not-allowed'
            )}
            title="Eliminar"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
});

ProductRow.displayName = 'ProductRow';

export default ProductRow;
