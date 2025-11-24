import { LeftBar } from '@/components';
import { getCategoriesBar, getColors, getSizes, getFilterBrands, getPriceRange } from '@/actions';
import React from 'react';

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  const [categoriesData, colorsData, sizesData, brandsData, priceData] = await Promise.all([
    getCategoriesBar(),
    getColors(),
    getSizes(),
    getFilterBrands(),
    getPriceRange(),
  ]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8">
      {/* LeftBar fijo */}
      <LeftBar
        categories={categoriesData.categories || []}
        colors={colorsData.colors || []}
        sizes={sizesData.sizes || []}
        brands={brandsData.brands || []}
        priceRange={{
          min: priceData.min || 0,
          max: priceData.max || 1000,
        }}
      />

      {/* Contenido dinámico de las páginas */}
      <div className="flex-1 w-full lg:w-3/4">{children}</div>
    </div>
  );
}
