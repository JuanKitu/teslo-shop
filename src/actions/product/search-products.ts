'use server';

import prisma from '@/lib/prisma';

interface SearchProductsParams {
  query: string;
  excludeId?: string; // Excluir el producto actual
  limit?: number;
}

export async function searchProductsForRelations({
  query,
  excludeId,
  limit = 20,
}: SearchProductsParams) {
  try {
    if (!query || query.trim().length < 2) {
      return { ok: true, products: [] };
    }

    const searchTerm = query.trim().toLowerCase();

    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { slug: { contains: searchTerm, mode: 'insensitive' } },
              { tags: { has: searchTerm } },
            ],
          },
          { isActive: true },
          { deletedAt: null },
          ...(excludeId ? [{ id: { not: excludeId } }] : []),
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        salePrice: true,
        images: {
          where: { productId: { not: null }, variantId: null },
          orderBy: { order: 'asc' },
          take: 1,
          select: {
            url: true,
            alt: true,
          },
        },
      },
      take: limit,
      orderBy: {
        title: 'asc',
      },
    });

    return {
      ok: true,
      products,
    };
  } catch (error) {
    console.error('[searchProducts]', error);
    return {
      ok: false,
      products: [],
      error: 'Error al buscar productos',
    };
  }
}
