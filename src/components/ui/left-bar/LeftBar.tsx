// components/ui/left-bar/LeftBar.tsx
import React, { Suspense } from 'react';
import { LeftCategoryOption } from './left-category-option/LeftCategoryOption';
import { LeftColorOption } from './left-color-option/LeftColorOption';
import { LeftSizeOption } from './left-size-option/LeftSizeOption';
import { LeftPriceOption } from './left-price-option/LeftPriceOption';
import { LeftBrandOption } from './left-brand-option/LeftBrandOption';

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface Props {
  categories: Category[];
  colors?: string[];
  sizes?: string[];
  brands?: Array<{ id: string; name: string; slug: string }>;
  priceRange?: { min: number; max: number };
}

// Componente de loading
function FilterSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  );
}

export function LeftBar({
  categories,
  colors = [],
  sizes = [],
  brands = [],
  priceRange = { min: 0, max: 200 },
}: Props) {
  return (
    <aside className="w-full lg:w-1/4">
      <div className="space-y-8">
        {/* Categorías */}
        <Suspense fallback={<FilterSkeleton />}>
          <LeftCategoryOption categories={categories} />
        </Suspense>

        {/* Precio */}
        <Suspense fallback={<FilterSkeleton />}>
          <LeftPriceOption min={priceRange.min} max={priceRange.max} />
        </Suspense>

        {/* Marcas */}
        {brands.length > 0 && (
          <Suspense fallback={<FilterSkeleton />}>
            <LeftBrandOption brands={brands} />
          </Suspense>
        )}

        {/* Colores */}
        {colors.length > 0 && (
          <Suspense fallback={<FilterSkeleton />}>
            <LeftColorOption colors={colors} />
          </Suspense>
        )}

        {/* Tallas */}
        {sizes.length > 0 && (
          <Suspense fallback={<FilterSkeleton />}>
            <LeftSizeOption sizes={sizes} />
          </Suspense>
        )}
      </div>
    </aside>
  );
}
