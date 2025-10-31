'use server';

import { getPaginatedProductsWithImages } from '@/actions';
import { Gender } from '@prisma/client';

export async function loadMoreProducts(page: number, gender?: Gender) {
  const { products } = await getPaginatedProductsWithImages({
    page,
    take: 12,
    gender,
  });
  return products;
}
