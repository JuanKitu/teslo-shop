'use server';

import { getPaginatedProductsWithImages } from '@/actions';

export async function loadMoreProducts(page: number, categorySlug?: string, brandSlug?: string) {
  const { products } = await getPaginatedProductsWithImages({
    page,
    take: 12,
    categorySlug,
    brandSlug,
  });

  return products;
}
