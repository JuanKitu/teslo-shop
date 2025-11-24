'use server';

import { getPaginatedProductsWithImages } from '@/actions';

interface LoadMoreOptions {
  page: number;
  categorySlug?: string;
  subcategorySlug?: string; // ← NUEVO
  brandSlug?: string;
  color?: string;
  size?: string;
  brand?: string;
  maxPrice?: number;
}

export async function loadMoreProducts({
  page,
  categorySlug,
  subcategorySlug, // ← NUEVO
  brandSlug,
  color,
  size,
  brand,
  maxPrice,
}: LoadMoreOptions) {
  try {
    const { products } = await getPaginatedProductsWithImages({
      page,
      take: 12,
      categorySlug,
      subcategorySlug, // ← NUEVO
      brandSlug,
      color,
      size,
      brand: brand || brandSlug,
      maxPrice,
    });

    return products;
  } catch (error) {
    console.error('[loadMoreProducts]', error);
    return [];
  }
}
