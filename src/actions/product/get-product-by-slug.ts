'use server';

import prisma from '@/lib/prisma';
import type { Product, ProductVariant } from '@/interfaces';

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findFirst({
      where: { slug },
      include: {
        images: true,
        variants: { include: { images: true } },
        category: { select: { name: true } },
      },
    });

    if (!product) return null;
    const { images: ProductImage, ...restProduct } = product;
    const images = Array.from(
      new Set([
        ...ProductImage.map((i) => i.url),
        ...product.variants.flatMap((v) => v.images.map((i) => i.url)),
      ])
    );

    const variants: ProductVariant[] = product.variants.map(
      ({ color = '', size = 'GENERIC', inStock = 0, price = 0, images = [] }) => ({
        color,
        size,
        stock: inStock,
        price,
        ProductImage: images,
        images: images.map((i) => i.url),
      })
    );

    return {
      ...restProduct,
      ProductImage,
      images, // sobrescribe el array de objetos con URLs
      variants, // sobrescribe los objetos anidados ya formateados
    };
  } catch (error) {
    console.error('[getProductBySlug]', error);
    throw new Error('Error al obtener producto por slug');
  }
}
