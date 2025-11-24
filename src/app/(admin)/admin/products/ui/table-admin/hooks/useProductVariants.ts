import { useMemo } from 'react';
import type { Product } from '@/interfaces';

interface VariantInfo {
  totalInventory: number;
  availableSizes: string;
  availableColors: string;
  priceRange: string;
  inventoryStatus: 'out-of-stock' | 'low-stock' | 'in-stock';
  uniqueSizes: string[]; // ✅ Ya no es Size[] sino string[]
  uniqueColors: string[];
}

export const useProductVariants = (product: Product): VariantInfo => {
  // Calcular inventario total
  const totalInventory = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((acc, variant) => acc + variant.inStock, 0); // ✅ stock → inStock
  }, [product.variants]);

  // Obtener tallas únicas con stock
  const uniqueSizes = useMemo(() => {
    if (!product.variants) return [];

    const sizesWithStock = product.variants
      .filter((variant) => variant.inStock > 0 && variant.size) // ✅ stock → inStock, validar que size existe
      .map((variant) => variant.size!); // ✅ size ya es string | undefined

    // Eliminar duplicados
    return [...new Set(sizesWithStock)];
  }, [product.variants]);

  // Obtener colores únicos con stock
  const uniqueColors = useMemo(() => {
    if (!product.variants) return [];

    const colorsWithStock = product.variants
      .filter((variant) => variant.inStock > 0 && variant.color) // ✅ stock → inStock, validar que color existe
      .map((variant) => variant.color!); // ✅ color ya es string | undefined

    // Eliminar duplicados
    return [...new Set(colorsWithStock)];
  }, [product.variants]);

  // Formatear tallas disponibles
  const availableSizes = useMemo(() => {
    if (uniqueSizes.length === 0) return 'Sin stock';
    return uniqueSizes.join(', ');
  }, [uniqueSizes]);

  // Formatear colores disponibles
  const availableColors = useMemo(() => {
    if (uniqueColors.length === 0) return 'Sin stock';

    // Limitar a 3 colores visibles
    if (uniqueColors.length > 3) {
      return `${uniqueColors.slice(0, 3).join(', ')} +${uniqueColors.length - 3}`;
    }

    return uniqueColors.join(', ');
  }, [uniqueColors]);

  // Calcular rango de precios de variantes
  const priceRange = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return '';
    }

    const variantPrices = product.variants
      .map((v) => v.price)
      .filter((price): price is number => price !== null && price !== undefined && price > 0);

    if (variantPrices.length === 0) return '';

    const minPrice =
      Math.min(...variantPrices) > product.price ? product.price : Math.min(...variantPrices);

    const maxPrice = Math.max(...variantPrices);

    if (minPrice === maxPrice) return '';

    return `(${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)})`; // ✅ Agregar formateo
  }, [product.price, product.variants]);

  // Estado del inventario
  const inventoryStatus = useMemo((): VariantInfo['inventoryStatus'] => {
    if (totalInventory === 0) return 'out-of-stock';
    if (totalInventory < 10) return 'low-stock';
    return 'in-stock';
  }, [totalInventory]);

  return {
    totalInventory,
    availableSizes,
    availableColors,
    priceRange,
    inventoryStatus,
    uniqueSizes,
    uniqueColors,
  };
};
