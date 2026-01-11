'use server';

import prisma from '@/lib/prisma';

interface RelatedProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: Array<{
    url: string;
    alt: string | null;
  }>;
}

export async function getRelatedProducts(productId: string) {
  try {
    const [upsells, crossSells] = await Promise.all([
      // Obtener upsells
      prisma.productRelation.findMany({
        where: {
          productId,
          type: 'upsell',
        },
        orderBy: {
          order: 'asc',
        },
        include: {
          relatedProduct: {
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
          },
        },
      }),

      // Obtener cross-sells
      prisma.productRelation.findMany({
        where: {
          productId,
          type: 'cross-sell',
        },
        orderBy: {
          order: 'asc',
        },
        include: {
          relatedProduct: {
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
          },
        },
      }),
    ]);

    const formatProducts = (relations: typeof upsells): RelatedProduct[] =>
      relations.map((r) => ({
        id: r.relatedProduct.id,
        title: r.relatedProduct.title,
        slug: r.relatedProduct.slug,
        price: r.relatedProduct.price,
        salePrice: r.relatedProduct.salePrice,
        images: r.relatedProduct.images,
      }));

    return {
      ok: true,
      upsells: formatProducts(upsells),
      crossSells: formatProducts(crossSells),
    };
  } catch (error) {
    console.error('[getRelatedProducts]', error);
    return {
      ok: false,
      upsells: [],
      crossSells: [],
      error: 'Error al obtener productos relacionados',
    };
  }
}
